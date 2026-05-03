import React from 'react';
import styles from './StatsScreen.module.css';

export default function StatsScreen({ stats, players, onClose }) {
  const totalRounds = stats.roundHistory.length;
  const civilianWins = stats.roundHistory.filter(r => r.caught).length;
  const imposterWins = totalRounds - civilianWins;

  // Build per-player stats
  const playerStats = players.map((p, i) => {
    const rounds = stats.roundHistory;
    const timesImposter = rounds.filter(r => r.imposterIndices.includes(i)).length;
    const timesCaught = rounds.filter(r => r.imposterIndices.includes(i) && r.caught).length;
    const timesVotedCorrectly = rounds.filter(r =>
      !r.imposterIndices.includes(i) && r.topVotedIndex !== null && r.imposterIndices.includes(r.topVotedIndex)
    ).length;
    return {
      name: p.name,
      avatar: p.avatar,
      score: stats.scores[i] || 0,
      timesImposter,
      timesCaught,
      escapedCount: timesImposter - timesCaught,
      timesVotedCorrectly,
    };
  }).sort((a, b) => b.score - a.score);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
        <h2 className={styles.title}>Session Stats</h2>
        <span className={styles.roundsBadge}>{totalRounds} round{totalRounds !== 1 ? 's' : ''}</span>
      </div>

      {totalRounds === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📊</span>
          <p>No rounds played yet.</p>
          <p className={styles.emptyHint}>Play a game and come back!</p>
        </div>
      ) : (
        <div className={styles.scroll}>
          {/* Win bar */}
          <div className={styles.winBar}>
            <div className={styles.winSide} style={{ flex: civilianWins || 0.01 }}>
              <span className={styles.winLabel}>😇 Civilians</span>
              <span className={styles.winCount}>{civilianWins}</span>
            </div>
            <div className={styles.winSep} />
            <div className={styles.loseSide} style={{ flex: imposterWins || 0.01 }}>
              <span className={styles.winCount}>{imposterWins}</span>
              <span className={styles.winLabel}>Imposters 🕵️</span>
            </div>
          </div>

          {/* Leaderboard */}
          <div className={styles.section}>
            <p className={styles.sectionLabel}>🏆 Leaderboard</p>
            <div className={styles.leaderboard}>
              {playerStats.map((p, rank) => (
                <div key={rank} className={`${styles.lbRow} ${rank === 0 ? styles.lbFirst : ''}`}>
                  <span className={styles.lbRank}>
                    {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `#${rank + 1}`}
                  </span>
                  <span className={styles.lbAvatar}>{p.avatar}</span>
                  <span className={styles.lbName}>{p.name}</span>
                  <span className={styles.lbScore}>{p.score} pts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Per-player breakdown */}
          <div className={styles.section}>
            <p className={styles.sectionLabel}>📋 Player Breakdown</p>
            <div className={styles.breakdown}>
              {playerStats.map((p, i) => (
                <div key={i} className={styles.bpCard}>
                  <div className={styles.bpHeader}>
                    <span className={styles.bpAvatar}>{p.avatar}</span>
                    <span className={styles.bpName}>{p.name}</span>
                    <span className={styles.bpScore}>{p.score} pts</span>
                  </div>
                  <div className={styles.bpStats}>
                    <div className={styles.bpStat}>
                      <span className={styles.bpStatVal}>{p.timesImposter}</span>
                      <span className={styles.bpStatLabel}>times imposter</span>
                    </div>
                    <div className={styles.bpStat}>
                      <span className={styles.bpStatVal} style={{ color: '#ff3c6e' }}>{p.timesCaught}</span>
                      <span className={styles.bpStatLabel}>got caught</span>
                    </div>
                    <div className={styles.bpStat}>
                      <span className={styles.bpStatVal} style={{ color: '#00e5b4' }}>{p.escapedCount}</span>
                      <span className={styles.bpStatLabel}>escaped</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Round history */}
          {stats.roundHistory.length > 0 && (
            <div className={styles.section}>
              <p className={styles.sectionLabel}>📜 Round History</p>
              <div className={styles.historyList}>
                {[...stats.roundHistory].reverse().map((r, i) => (
                  <div key={i} className={styles.histRow}>
                    <span className={styles.histRound}>R{stats.roundHistory.length - i}</span>
                    <span className={styles.histWord}>{r.word}</span>
                    <span className={`${styles.histResult} ${r.caught ? styles.histWin : styles.histLose}`}>
                      {r.caught ? '😇 Caught' : '🕵️ Escaped'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
