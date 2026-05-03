import { useState, useCallback, useRef } from 'react';
import { CATEGORIES, DEFAULT_CATEGORIES } from '../data/categories';
import { shuffle, pickRandom, pickImposterIndices } from '../utils/helpers';

export const SCREENS = {
  HOME: 'home',
  COVER: 'cover',
  ROLE: 'role',
  VOTE: 'vote',
  RESULT: 'result',
};

export const AVATARS = [
  '🐶','🐱','🐼','🦊','🐸','🐧','🦁','🐯','🦋','🐙',
  '🦄','👽','🤖','👻','🎃','🧙','🦸','🧟','🧛','🕵️',
  '🥷','🫡','🦅','🐬','🦜','🦩','🦝','🐻','🐺','🦒',
];

const defaultSettings = {
  players: 4,
  imposters: 1,
  difficulty: 'easy',
  categories: DEFAULT_CATEGORIES,
  hintMode: 'off',
  imposterFakeWord: 'none',
  playerNames: [],
  playerAvatars: [],
};

export function haptic(style = 'light') {
  try {
    if (!navigator.vibrate) return;
    if (style === 'light')   navigator.vibrate(10);
    if (style === 'medium')  navigator.vibrate(30);
    if (style === 'heavy')   navigator.vibrate([40, 20, 40]);
    if (style === 'success') navigator.vibrate([20, 50, 20, 50, 60]);
  } catch {}
}

export function useGame() {
  const [screen, setScreen] = useState(SCREENS.HOME);
  const [settings, setSettings] = useState(defaultSettings);
  const [game, setGame] = useState(null);
  const [votes, setVotes] = useState({});
  const [stats, setStats] = useState({ scores: {}, roundHistory: [] });
  const [showStats, setShowStats] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Track last round imposters and last words for no-repeat logic
  const lastImposterIndices = useRef([]);
  const lastWords = useRef([]);
  const roundNum = useRef(0);

  const updateSettings = useCallback((updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const resetStats = useCallback(() => {
    setStats({ scores: {}, roundHistory: [] });
    lastImposterIndices.current = [];
    lastWords.current = [];
    roundNum.current = 0;
  }, []);

  const startGame = useCallback(() => {
    const { players, imposters, difficulty, categories, imposterFakeWord } = settings;

    // Build word pool
    const wordPool = categories.flatMap(c => CATEGORIES[c]?.[difficulty] || []);
    if (!wordPool.length) return;

    haptic('medium');

    // Pick word — avoid repeating recent words (triple-random pick)
    const freshPool = wordPool.filter(w => !lastWords.current.includes(w));
    const pool = freshPool.length > 0 ? freshPool : wordPool;
    // Pick 3 random candidates then pick randomly among them = max chaos
    const candidates = [pickRandom(pool), pickRandom(pool), pickRandom(pool)];
    const word = candidates[Math.floor(Math.random() * candidates.length)];

    // Track last 5 words
    lastWords.current = [...lastWords.current.slice(-4), word];

    // Find category
    const category = categories.find(c =>
      CATEGORIES[c]?.[difficulty]?.includes(word)
    ) || categories[0];

    // Pick fake word for imposter
    let fakeWord = null;
    if (imposterFakeWord === 'fake') {
      const samePool = (CATEGORIES[category]?.[difficulty] || []).filter(w => w !== word);
      const anyPool = wordPool.filter(w => w !== word);
      const fp = samePool.length > 0 ? samePool : anyPool;
      fakeWord = fp.length > 0 ? pickRandom(fp) : '???';
    }

    // Pick imposters using triple-shuffle no-repeat logic
    const imposterIndicesArr = pickImposterIndices(players, imposters, lastImposterIndices.current);
    const imposterSet = new Set(imposterIndicesArr);
    lastImposterIndices.current = imposterIndicesArr;

    // Build player data
    const playerNames = Array.from({ length: players }, (_, i) =>
      settings.playerNames[i]?.trim() || `Player ${i + 1}`
    );
    const playerAvatars = Array.from({ length: players }, (_, i) =>
      settings.playerAvatars[i] || AVATARS[i % AVATARS.length]
    );

    roundNum.current += 1;

    setGame({
      word, fakeWord, category,
      players, imposters,
      imposterSet,
      playerNames, playerAvatars,
      currentPlayerIndex: 0,
      imposterFakeWord,
      roundNum: roundNum.current,
    });
    setVotes({});
    setScreen(SCREENS.COVER);
  }, [settings]);

  const showRole = useCallback(() => {
    haptic('light');
    setScreen(SCREENS.ROLE);
  }, []);

  const nextPlayer = useCallback((goVote = false) => {
    haptic('light');
    if (goVote) {
      setVotes({});
      setScreen(SCREENS.VOTE);
      return;
    }
    setGame(prev => ({ ...prev, currentPlayerIndex: prev.currentPlayerIndex + 1 }));
    setScreen(SCREENS.COVER);
  }, []);

  const castVote = useCallback((playerIndex) => {
    haptic('light');
    setVotes(prev => ({ ...prev, [playerIndex]: (prev[playerIndex] || 0) + 1 }));
  }, []);

  const removeVote = useCallback((playerIndex) => {
    haptic('light');
    setVotes(prev => ({
      ...prev,
      [playerIndex]: Math.max(0, (prev[playerIndex] || 0) - 1),
    }));
  }, []);

  const revealResult = useCallback(() => {
    if (!game) return;

    const voteArr = game.playerNames.map((_, i) => ({ index: i, count: votes[i] || 0 }));
    const sorted = [...voteArr].sort((a, b) => b.count - a.count);
    const topVotedIndex = sorted[0]?.count > 0 ? sorted[0].index : null;
    const imposterIndices = [...game.imposterSet];

    const caught =
      topVotedIndex !== null &&
      game.imposterSet.has(topVotedIndex) &&
      (sorted.length < 2 || sorted[0].count > sorted[1].count);

    haptic(caught ? 'success' : 'heavy');

    setStats(prev => {
      const newScores = { ...prev.scores };
      if (caught) {
        // Civilians +3 each
        for (let i = 0; i < game.players; i++) {
          if (!game.imposterSet.has(i)) {
            newScores[i] = (newScores[i] || 0) + 3;
          }
        }
      } else {
        // Each imposter +4
        for (const idx of game.imposterSet) {
          newScores[idx] = (newScores[idx] || 0) + 4;
        }
      }
      return {
        scores: newScores,
        roundHistory: [
          ...prev.roundHistory,
          { word: game.word, category: game.category, caught, imposterIndices, topVotedIndex, roundNum: game.roundNum },
        ],
      };
    });

    if (caught) {
      setTimeout(() => setShowConfetti(true), 200);
      setTimeout(() => setShowConfetti(false), 3800);
    }

    setScreen(SCREENS.RESULT);
  }, [game, votes]);

  const playAgain = useCallback(() => {
    haptic('medium');
    startGame();
  }, [startGame]);

  const goHome = useCallback(() => {
    haptic('light');
    setScreen(SCREENS.HOME);
    setGame(null);
    setVotes({});
  }, []);

  const currentPlayer = game ? {
    index: game.currentPlayerIndex,
    name: game.playerNames[game.currentPlayerIndex] || `Player ${game.currentPlayerIndex + 1}`,
    avatar: game.playerAvatars[game.currentPlayerIndex] || '🎭',
    isImposter: game.imposterSet.has(game.currentPlayerIndex),
    number: game.currentPlayerIndex + 1,
    isLast: game.currentPlayerIndex >= game.players - 1,
  } : null;

  const imposterNames = game
    ? [...game.imposterSet].map(i => game.playerNames[i] || `Player ${i + 1}`)
    : [];

  const voteSummary = game
    ? game.playerNames.map((name, i) => ({
        name,
        avatar: game.playerAvatars[i] || AVATARS[i % AVATARS.length],
        votes: votes[i] || 0,
        index: i,
      }))
    : [];

  const topVoted = [...voteSummary]
    .sort((a, b) => b.votes - a.votes)
    .filter(p => p.votes > 0);

  const imposterCaught =
    topVoted.length > 0 &&
    game &&
    game.imposterSet.has(topVoted[0].index) &&
    (topVoted.length < 2 || topVoted[0].votes > topVoted[1].votes);

  const sessionPlayers = Array.from({ length: settings.players }, (_, i) => ({
    name: settings.playerNames[i]?.trim() || `Player ${i + 1}`,
    avatar: settings.playerAvatars[i] || AVATARS[i % AVATARS.length],
  }));

  return {
    screen, SCREENS,
    settings, updateSettings,
    game, currentPlayer, imposterNames,
    votes, voteSummary, topVoted, imposterCaught,
    stats, sessionPlayers, showStats, setShowStats,
    showConfetti,
    startGame, showRole, nextPlayer,
    castVote, removeVote, revealResult,
    playAgain, goHome, resetStats,
  };
}
