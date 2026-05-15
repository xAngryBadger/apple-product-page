import { useRef, useCallback } from 'react'

const audioCtx = typeof window !== 'undefined' ? new AudioContext() : null

function playTone(freq: number, duration: number, gain: number, type: OscillatorType = 'sine') {
  if (!audioCtx) return
  const osc = audioCtx.createOscillator()
  const g = audioCtx.createGain()
  osc.type = type
  osc.frequency.value = freq
  g.gain.value = gain
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration)
  osc.connect(g)
  g.connect(audioCtx.destination)
  osc.start()
  osc.stop(audioCtx.currentTime + duration)
}

function playNoise(duration: number, gain: number) {
  if (!audioCtx) return
  const bufferSize = audioCtx.sampleRate * duration
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.5
  }
  const source = audioCtx.createBufferSource()
  source.buffer = buffer
  const g = audioCtx.createGain()
  g.gain.value = gain
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration)
  const filter = audioCtx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 2000
  filter.Q.value = 0.5
  source.connect(filter)
  filter.connect(g)
  g.connect(audioCtx.destination)
  source.start()
  source.stop(audioCtx.currentTime + duration)
}

export function useSounds() {
  const mutedRef = useRef(false)

  const sectionEnter = useCallback(() => {
    if (mutedRef.current || !audioCtx) return
    if (audioCtx.state === 'suspended') audioCtx.resume()
    playTone(220, 0.2, 0.03, 'sine')
  }, [])

  const cardHover = useCallback(() => {
    if (mutedRef.current || !audioCtx) return
    if (audioCtx.state === 'suspended') audioCtx.resume()
    playNoise(0.05, 0.02)
  }, [])

  const shootingStar = useCallback(() => {
    if (mutedRef.current || !audioCtx) return
    if (audioCtx.state === 'suspended') audioCtx.resume()
    playNoise(0.3, 0.04)
  }, [])

  const ctaClick = useCallback(() => {
    if (mutedRef.current || !audioCtx) return
    if (audioCtx.state === 'suspended') audioCtx.resume()
    playTone(440, 0.15, 0.04, 'triangle')
    setTimeout(() => playTone(660, 0.15, 0.03, 'triangle'), 80)
  }, [])

  const toggleMute = useCallback(() => {
    mutedRef.current = !mutedRef.current
    return mutedRef.current
  }, [])

  const isMuted = useCallback(() => mutedRef.current, [])

  return { sectionEnter, cardHover, shootingStar, ctaClick, toggleMute, isMuted }
}
