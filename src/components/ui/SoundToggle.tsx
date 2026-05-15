import { useState, useCallback } from 'react'
import { useSounds } from '../../hooks/useSounds'

export function SoundToggle() {
  const { toggleMute } = useSounds()
  const [muted, setMuted] = useState(false)

  const handleClick = useCallback(() => {
    const newMuted = toggleMute()
    setMuted(newMuted)
  }, [toggleMute])

  return (
    <button
      onClick={handleClick}
      className="fixed top-4 right-4 z-[9996] flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300"
      style={{
        borderColor: muted ? 'var(--color-text-3)' : 'var(--color-accent)',
        background: 'rgba(10, 10, 10, 0.6)',
        backdropFilter: 'blur(8px)',
        color: muted ? 'var(--color-text-3)' : 'var(--color-accent)',
      }}
      aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {muted ? (
          <>
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </>
        ) : (
          <>
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </>
        )}
      </svg>
    </button>
  )
}
