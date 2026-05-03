import React from 'react';
import styles from './GameScreens.module.css';

/* ─── COVER ────────────────────────────────────────────── */
export function CoverScreen({ playerName, playerAvatar, playerNumber, totalPlayers, onReveal }) {
  return (
    <div className={styles.fullPage}>
      <div className={styles.coverCenter}>
        <div className={styles.coverCardGlass}>
          <div className={styles.coverAvatarRing}>
            <span className={styles.coverAvatarEmoji}>{playerAvatar}</span>
          </div>
          <h2 className={styles.coverName}>{playerName}</h2>
          <p className={styles.coverSub}>{playerNumber} of {totalPlayers}</p>
          <div className={styles.coverDivider} />
          <p className={styles.coverInstruct}>Pass the phone face-down, then tap when ready.</p>
        </div>
      </div>
      <div className={styles.bottomAction}>
        <button className={styles.bigBtn} onClick={onReveal}>
          👆 &nbsp;Tap to see my role
        </button>
        <p className={styles.bottomHint}>Don't show anyone else!</p>
      </div>
    </div>
  );
}

/* ─── ROLE ─────────────────────────────────────────────── */
export function RoleScreen({ player, game, settings, onDone }) {
  const isCivilian = !player.isImposter;
  const showCategory = settings.hintMode === 'category';
  const imposterMode = game.imposterFakeWord || 'none';

  return (
    <div className={styles.fullPage}>
      <div className={styles.roleCenter}>
        <div className={`${styles.roleCard} ${isCivilian ? styles.cardCivilian : styles.cardImposter}`}>
          <div className={styles.roleAvatarRing} style={{ borderColor: isCivilian ? 'var(--accent2)' : 'var(--accent)' }}>
            <span className={styles.roleAvatarEmoji}>{player.avatar}</span>
          </div>

          <p className={styles.roleSmallLabel}>YOUR ROLE</p>
          <h2 className={`${styles.roleName} ${isCivilian ? styles.roleNameTeal : styles.roleNamePink}`}>
            {isCivilian ? 'CIVILIAN' : 'IMPOSTER'}
          </h2>

          <div className={styles.roleSep} />

          {isCivilian ? (
            <>
              {showCategory && <span className={styles.categoryPill}>📂 {game.category}</span>}
              <p className={styles.wordEyebrow}>Secret word</p>
              <p className={styles.wordBig}>{game.word}</p>
              <p className={styles.roleFootnote}>Give exactly one clue. Don't be too obvious!</p>
            </>
          ) : (
            <>
              {imposterMode === 'none' && (
                <>
                  <div className={styles.unknownBubble}>?</div>
                  <p className={styles.wordEyebrow}>You don't know the word</p>
                  <p className={styles.roleFootnote}>Blend in. Give vague clues. Don't get caught!</p>
                </>
              )}
              {imposterMode === 'fake' && (
                <>
                  {showCategory && <span className={styles.categoryPill}>📂 {game.category}</span>}
                  <p className={styles.wordEyebrow}>Your fake word</p>
                  <p className={styles.wordBig} style={{ color: 'var(--accent)' }}>{game.fakeWord}</p>
                  <div className={styles.fakeWordWarning}>
                    ⚠️ This is <strong>NOT</strong> the real word — act like it is!
                  </div>
                </>
              )}
              {imposterMode === 'category' && (
                <>
                  <span className={styles.categoryPill} style={{ borderColor: 'var(--accent)', color: 'var(--accent)', background: 'rgba(255,60,110,0.08)' }}>
                    📂 {game.category}
                  </span>
                  <p className={styles.wordEyebrow}>You only know the category</p>
                  <div className={styles.unknownBubble}>???</div>
                  <p className={styles.roleFootnote}>Use the category to bluff your clue!</p>
                </>
              )}
            </>
          )}

          <div className={styles.roundBadge}>Round {game.roundNum}</div>
        </div>
      </div>

      <div className={styles.bottomAction}>
        <button
          className={`${styles.bigBtn} ${isCivilian ? styles.bigBtnTeal : styles.bigBtnPink}`}
          onClick={onDone}>
          {player.isLast ? '🗳️  Go to Voting' : 'Done — pass the phone'}
        </button>
      </div>
    </div>
  );
}

/* ─── VOTE ─────────────────────────────────────────────── */
export function VotingScreen({ game, votes, voteSummary, onCastVote, onRemoveVote, onReveal }) {
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
  return (
    <div className={styles.fullPage}>
      <div className={styles.voteHeader}>
        <h2 className={styles.voteTitle}>Vote the Imposter</h2>
        <p className={styles.voteSub}>Discuss, then cast your votes below.</p>
        <span className={styles.voteTotal}>{totalVotes} vote{totalVotes !== 1 ? 's' : ''} · Round {game.roundNum}</span>
      </div>

      <div className={styles.voteScroll}>
        <div className={styles.voteList}>
          {voteSummary.map(({ name, avatar, votes: v, index }) => (
            <div key={index} className={`${styles.voteRow} ${v > 0 ? styles.voteRowHot : ''}`}>
              <div className={styles.voteAvatarWrap}>
                <span className={styles.voteAvatarEmoji}>{avatar}</span>
              </div>
              <span className={styles.voteName}>{name}</span>
              <div className={styles.voteCtrl}>
                <button className={styles.voteBtn} onClick={() => onRemoveVote(index)} disabled={v === 0}>−</button>
                <span className={`${styles.voteNum} ${v > 0 ? styles.voteNumHot : ''}`}>{v}</span>
                <button className={`${styles.voteBtn} ${styles.voteBtnAdd}`} onClick={() => onCastVote(index)}>+</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.bottomAction}>
        <button className={styles.bigBtn} onClick={onReveal}>🔍 &nbsp;Reveal Result</button>
      </div>
    </div>
  );
}

/* ─── RESULT ────────────────────────────────────────────── */
export function ResultScreen({ game, imposterCaught, imposterNames, topVoted, stats, sessionPlayers, onPlayAgain, onHome, onShowStats }) {
  const roundScores = sessionPlayers.map((p, i) => ({
    ...p,
    total: stats.scores[i] || 0,
    index: i,
  })).sort((a, b) => b.total - a.total);

  return (
    <div className={styles.fullPage}>
      <div className={styles.resultScroll}>

        {/* Banner */}
        <div className={`${styles.resultBanner} ${imposterCaught ? styles.bannerWin : styles.bannerLose}`}>
          <span className={styles.resultEmoji}>{imposterCaught ? '🎉' : '😈'}</span>
          <h2 className={`${styles.resultTitle} ${imposterCaught ? styles.resultTitleWin : styles.resultTitleLose}`}>
            {imposterCaught ? 'BUSTED!' : 'ESCAPED!'}
          </h2>
          <p className={styles.resultSub}>
            {imposterCaught ? 'Civilians caught the imposter!' : 'The imposter got away!'}
          </p>
        </div>

        {/* Word reveal */}
        <div className={styles.resultCard}>
          <p className={styles.resultMeta}>THE SECRET WORD</p>
          <p className={styles.resultWord}>{game.word}</p>
          <p className={styles.resultCat}>Category: {game.category}</p>

          {game.fakeWord && (
            <div className={styles.fakeWordReveal}>
              <p className={styles.resultMeta}>IMPOSTER'S FAKE WORD WAS</p>
              <p className={styles.resultWord} style={{ color: 'var(--accent)', fontSize: '26px' }}>{game.fakeWord}</p>
            </div>
          )}

          <div className={styles.resultDivider} />

          <p className={styles.resultMeta}>THE IMPOSTER{imposterNames.length > 1 ? 'S' : ''}</p>
          <div className={styles.imposterTags}>
            {[...game.imposterSet].map(idx => (
              <span key={idx} className={styles.imposterTag}>
                {game.playerAvatars[idx]} {game.playerNames[idx]}
              </span>
            ))}
          </div>
        </div>

        {/* Score board */}
        <div className={styles.resultCard}>
          <p className={styles.resultMeta}>🏆 SCORES THIS SESSION</p>
          <div className={styles.scoreboard}>
            {roundScores.map((p, rank) => (
              <div key={p.index} className={`${styles.scoreRow} ${rank === 0 && p.total > 0 ? styles.scoreRowFirst : ''}`}>
                <span className={styles.scoreRank}>{rank === 0 && p.total > 0 ? '🥇' : rank === 1 && p.total > 0 ? '🥈' : rank === 2 && p.total > 0 ? '🥉' : `#${rank + 1}`}</span>
                <span className={styles.scoreAvatar}>{p.avatar}</span>
                <span className={styles.scoreName}>{p.name}</span>
                <span className={styles.scorePoints}>{p.total} pts</span>
              </div>
            ))}
          </div>
          <p className={styles.scoreInfo}>Civilians +3 for catching · Imposters +4 for escaping</p>
        </div>

      </div>

      <div className={styles.bottomAction} style={{ gap: 8 }}>
        <button className={`${styles.bigBtn} ${styles.bigBtnTeal}`} onClick={onPlayAgain}>
          ▶ &nbsp;Play Again
        </button>
        <div className={styles.resultBtnRow}>
          <button className={styles.ghostBtn} onClick={onShowStats}>📊 Stats</button>
          <button className={styles.ghostBtn} onClick={onHome}>⚙️ Settings</button>
        </div>
      </div>
    </div>
  );
}
