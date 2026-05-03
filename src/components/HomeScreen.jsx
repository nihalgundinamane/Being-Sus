import React, { useState } from 'react';
import { CATEGORY_EMOJIS, ALL_CATEGORY_NAMES } from '../data/categories';
import { AVATARS } from '../hooks/useGame';
import styles from './HomeScreen.module.css';

function Stepper({ value, min, max, onChange }) {
  return (
    <div className={styles.stepper}>
      <button className={styles.stepBtn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}>−</button>
      <span className={styles.stepVal}>{value}</span>
      <button className={styles.stepBtn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}>+</button>
    </div>
  );
}

function SegmentedControl({ options, value, onChange }) {
  return (
    <div className={styles.segmented}>
      {options.map(o => (
        <button key={o.key}
          className={`${styles.segBtn} ${value === o.key ? styles.segActive : ''}`}
          style={value === o.key && o.color ? { color: o.color, borderColor: o.color + '55', background: o.color + '18' } : {}}
          onClick={() => onChange(o.key)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function RadioGroup({ options, value, onChange }) {
  return (
    <div className={styles.radioGroup}>
      {options.map(o => (
        <button key={o.key}
          className={`${styles.radioItem} ${value === o.key ? styles.radioActive : ''}`}
          onClick={() => onChange(o.key)}>
          <div className={`${styles.radioDot} ${value === o.key ? styles.radioDotActive : ''}`} />
          <div className={styles.radioText}>
            <span className={styles.radioLabel}>{o.icon} {o.label}</span>
            <span className={styles.radioDesc}>{o.desc}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

export default function HomeScreen({ settings, updateSettings, startGame, stats, onShowStats }) {
  const [catOpen, setCatOpen] = useState(false);
  const [avatarPickerFor, setAvatarPickerFor] = useState(null);

  const {
    players, imposters, difficulty, categories,
    playerNames, playerAvatars, hintMode, imposterFakeWord,
  } = settings;

  const toggleCategory = (cat) => {
    const current = new Set(categories);
    if (current.has(cat)) { if (current.size <= 1) return; current.delete(cat); }
    else current.add(cat);
    updateSettings({ categories: [...current] });
  };

  const setPlayerName = (i, val) => {
    const names = [...(playerNames || [])];
    names[i] = val;
    updateSettings({ playerNames: names });
  };

  const setPlayerAvatar = (i, avatar) => {
    const avs = [...(playerAvatars || [])];
    avs[i] = avatar;
    updateSettings({ playerAvatars: avs });
    setAvatarPickerFor(null);
  };

  const totalRounds = stats?.roundHistory?.length || 0;

  return (
    <div className={styles.page}>
      {/* Ambient glow orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />

      {/* Main wrapper */}
      <div className={styles.wrapper}>

        {/* ── HEADER ── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.badge}>🕵️ PASS &amp; PLAY</span>
            <h1 className={styles.title}>
              <span className={styles.t1}>WHO'S</span>
              <span className={styles.t2}>THE SUS?</span>
            </h1>
            <p className={styles.sub}>Give clues · Catch the fake · Win</p>
          </div>
          {totalRounds > 0 && (
            <button className={styles.statsBtn} onClick={onShowStats}>
              📊 <span>{totalRounds}</span>
            </button>
          )}
        </div>

        {/* ── SETTINGS SCROLL ── */}
        <div className={styles.scroll}>
          <div className={styles.glassCard}>

            {/* Players */}
            <div className={styles.section}>
              <div className={styles.sectionRow}>
                <div className={styles.sectionInfo}>
                  <span className={styles.sectionIcon}>👥</span>
                  <div>
                    <p className={styles.sectionTitle}>Players</p>
                    <p className={styles.sectionSub}>3 – 12</p>
                  </div>
                </div>
                <Stepper value={players} min={3} max={12}
                  onChange={v => updateSettings({ players: v, imposters: Math.min(imposters, v - 1) })} />
              </div>
              <div className={styles.sectionRow} style={{ marginTop: 12 }}>
                <div className={styles.sectionInfo}>
                  <span className={styles.sectionIcon}>🕵️</span>
                  <div>
                    <p className={styles.sectionTitle}>Imposters</p>
                    <p className={styles.sectionSub}>Per round</p>
                  </div>
                </div>
                <Stepper value={imposters} min={1} max={players - 1}
                  onChange={v => updateSettings({ imposters: v })} />
              </div>
            </div>

            <div className={styles.divider} />

            {/* Player names & avatars */}
            <div className={styles.section}>
              <p className={styles.sectionLabel}>Player Names &amp; Avatars</p>

              {avatarPickerFor !== null && (
                <div className={styles.avatarPicker}>
                  <div className={styles.avatarPickerHead}>
                    <span>Pick avatar for {playerNames?.[avatarPickerFor] || `Player ${avatarPickerFor + 1}`}</span>
                    <button onClick={() => setAvatarPickerFor(null)}>✕</button>
                  </div>
                  <div className={styles.avatarGrid}>
                    {AVATARS.map(a => (
                      <button key={a}
                        className={`${styles.avatarOpt} ${(playerAvatars?.[avatarPickerFor] || AVATARS[avatarPickerFor % AVATARS.length]) === a ? styles.avatarOptActive : ''}`}
                        onClick={() => setPlayerAvatar(avatarPickerFor, a)}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.playerList}>
                {Array.from({ length: players }, (_, i) => (
                  <div key={i} className={styles.playerRow}>
                    <button className={styles.emojiBtn}
                      onClick={() => setAvatarPickerFor(avatarPickerFor === i ? null : i)}>
                      {playerAvatars?.[i] || AVATARS[i % AVATARS.length]}
                    </button>
                    <input
                      className={styles.nameInput}
                      type="text"
                      placeholder={`Player ${i + 1}`}
                      value={playerNames?.[i] || ''}
                      onChange={e => setPlayerName(i, e.target.value)}
                      maxLength={14}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.divider} />

            {/* Difficulty */}
            <div className={styles.section}>
              <div className={styles.inlineRow}>
                <div className={styles.sectionInfo}>
                  <span className={styles.sectionIcon}>🎯</span>
                  <p className={styles.sectionTitle}>Difficulty</p>
                </div>
                <SegmentedControl
                  value={difficulty}
                  onChange={v => updateSettings({ difficulty: v })}
                  options={[
                    { key: 'easy', label: 'Easy', color: '#00e5b4' },
                    { key: 'medium', label: 'Medium', color: '#ffe033' },
                    { key: 'hard', label: 'Hard', color: '#ff3c6e' },
                  ]}
                />
              </div>
            </div>

            <div className={styles.divider} />

            {/* Imposter sees */}
            <div className={styles.section}>
              <div className={styles.sectionInfo} style={{ marginBottom: 10 }}>
                <span className={styles.sectionIcon}>🎭</span>
                <p className={styles.sectionTitle}>Imposter sees…</p>
              </div>
              <RadioGroup
                value={imposterFakeWord || 'none'}
                onChange={v => updateSettings({ imposterFakeWord: v })}
                options={[
                  { key: 'none',     icon: '❓', label: 'Nothing',       desc: 'Hardest to bluff' },
                  { key: 'fake',     icon: '🎭', label: 'A fake word',   desc: 'Different word, same category' },
                  { key: 'category', icon: '📂', label: 'Category only', desc: 'Category name, not the word' },
                ]}
              />
            </div>

            <div className={styles.divider} />

            {/* Hint mode */}
            <div className={styles.section}>
              <div className={styles.inlineRow}>
                <div className={styles.sectionInfo}>
                  <span className={styles.sectionIcon}>💡</span>
                  <div>
                    <p className={styles.sectionTitle}>Hint Mode</p>
                    <p className={styles.sectionSub}>
                      {hintMode === 'category' ? 'Category shown to everyone' : 'No hints shown'}
                    </p>
                  </div>
                </div>
                <SegmentedControl
                  value={hintMode || 'off'}
                  onChange={v => updateSettings({ hintMode: v })}
                  options={[
                    { key: 'off',      label: 'Off' },
                    { key: 'category', label: 'Category', color: '#00e5b4' },
                  ]}
                />
              </div>
            </div>

            <div className={styles.divider} />

            {/* Categories — tap to open popup */}
            <div className={styles.section}>
              <div className={styles.inlineRow}>
                <div className={styles.sectionInfo}>
                  <span className={styles.sectionIcon}>🗂️</span>
                  <div>
                    <p className={styles.sectionTitle}>Categories</p>
                    <p className={styles.sectionSub}>{categories.length} of {ALL_CATEGORY_NAMES.length} selected</p>
                  </div>
                </div>
                <button className={styles.catOpenBtn} onClick={() => setCatOpen(true)}>
                  Choose ›
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ── START BUTTON ── */}
        <div className={styles.startWrap}>
          <button className={styles.startBtn} onClick={startGame}>
            ▶ &nbsp;START GAME
          </button>
        </div>

      </div>

      {/* ── CATEGORY POPUP (bottom sheet) ── */}
      {catOpen && (
        <div className={styles.backdrop} onClick={e => { if (e.target === e.currentTarget) setCatOpen(false); }}>
          <div className={styles.sheet}>

            {/* Sheet header */}
            <div className={styles.sheetHeader}>
              <div className={styles.sheetHandle} />
              <div className={styles.sheetTitleRow}>
                <div>
                  <p className={styles.sheetTitle}>Categories</p>
                  <p className={styles.sheetSub}>{categories.length} of {ALL_CATEGORY_NAMES.length} selected</p>
                </div>
                <div className={styles.sheetActions}>
                  <button className={styles.sheetActionBtn}
                    onClick={() => updateSettings({ categories: [...ALL_CATEGORY_NAMES] })}>
                    All
                  </button>
                  <button className={styles.sheetActionBtn}
                    onClick={() => updateSettings({ categories: [ALL_CATEGORY_NAMES[0]] })}>
                    Reset
                  </button>
                  <button className={styles.sheetClose} onClick={() => setCatOpen(false)}>✕</button>
                </div>
              </div>
            </div>

            {/* Scrollable grid */}
            <div className={styles.sheetScroll}>
              <div className={styles.catGrid}>
                {ALL_CATEGORY_NAMES.map(cat => {
                  const on = categories.includes(cat);
                  return (
                    <button key={cat}
                      className={`${styles.catChip} ${on ? styles.catOn : ''}`}
                      onClick={() => toggleCategory(cat)}>
                      <span className={styles.catEmoji}>{CATEGORY_EMOJIS[cat] || '🎲'}</span>
                      <span className={styles.catName}>{cat}</span>
                      {on && <span className={styles.catTick}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Done button */}
            <div className={styles.sheetFooter}>
              <button className={styles.sheetDoneBtn} onClick={() => setCatOpen(false)}>
                Done — {categories.length} selected
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
