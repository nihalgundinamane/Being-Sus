import React, { useEffect, useRef, useState } from 'react';

export default function ScreenTransition({ screenKey, children }) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(true);
  const prevKey = useRef(screenKey);

  useEffect(() => {
    if (prevKey.current !== screenKey) {
      // fade out then in
      setVisible(false);
      const t = setTimeout(() => {
        prevKey.current = screenKey;
        setMounted(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setVisible(true));
        });
      }, 140);
      return () => clearTimeout(t);
    } else {
      // first mount
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    }
  }, [screenKey]);

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.18s ease, transform 0.18s ease',
        minHeight: 0,
      }}
    >
      {mounted && children}
    </div>
  );
}
