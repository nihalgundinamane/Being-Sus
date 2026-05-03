import React from 'react';
import { useGame } from './hooks/useGame';
import HomeScreen from './components/HomeScreen';
import { CoverScreen, RoleScreen, VotingScreen, ResultScreen } from './components/GameScreens';
import StatsScreen from './components/StatsScreen';
import Confetti from './components/Confetti';
import ScreenTransition from './components/ScreenTransition';

export default function App() {
  const {
    screen, SCREENS,
    settings, updateSettings,
    game, currentPlayer, imposterNames,
    votes, voteSummary, topVoted, imposterCaught,
    stats, sessionPlayers, showStats, setShowStats,
    showConfetti,
    startGame, showRole, nextPlayer,
    castVote, removeVote, revealResult,
    playAgain, goHome, resetStats,
  } = useGame();

  return (
    <>
      <Confetti active={showConfetti} />

      {showStats && (
        <StatsScreen
          stats={stats}
          players={sessionPlayers}
          onClose={() => setShowStats(false)}
          onReset={resetStats}
        />
      )}

      <ScreenTransition screenKey={screen}>
        {screen === SCREENS.HOME && (
          <HomeScreen
            settings={settings}
            updateSettings={updateSettings}
            startGame={startGame}
            stats={stats}
            onShowStats={() => setShowStats(true)}
          />
        )}

        {screen === SCREENS.COVER && game && currentPlayer && (
          <CoverScreen
            playerName={currentPlayer.name}
            playerAvatar={currentPlayer.avatar}
            playerNumber={currentPlayer.number}
            totalPlayers={game.players}
            onReveal={showRole}
          />
        )}

        {screen === SCREENS.ROLE && game && currentPlayer && (
          <RoleScreen
            player={currentPlayer}
            game={game}
            settings={settings}
            onDone={() => nextPlayer(currentPlayer.isLast)}
          />
        )}

        {screen === SCREENS.VOTE && game && (
          <VotingScreen
            game={game}
            votes={votes}
            voteSummary={voteSummary}
            onCastVote={castVote}
            onRemoveVote={removeVote}
            onReveal={revealResult}
          />
        )}

        {screen === SCREENS.RESULT && game && (
          <ResultScreen
            game={game}
            imposterCaught={imposterCaught}
            imposterNames={imposterNames}
            topVoted={topVoted}
            stats={stats}
            sessionPlayers={sessionPlayers}
            onPlayAgain={playAgain}
            onHome={goHome}
            onShowStats={() => setShowStats(true)}
          />
        )}
      </ScreenTransition>
    </>
  );
}
