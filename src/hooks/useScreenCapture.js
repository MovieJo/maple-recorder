import { useState, useEffect, useCallback } from 'react'

export default function useScreenCapture() {
  const [stream, setStream] = useState(null)

  const startCapture = useCallback(async () => {
    try {
      const media = await navigator.mediaDevices.getDisplayMedia({ video: true })
      setStream(media)
      const track = media.getVideoTracks()[0]
      if (track) {
        track.addEventListener('ended', () => setStream(null))
      }
    } catch (err) {
      console.error('Screen capture error', err)
    }
  }, [])

  const stopCapture = useCallback(() => {
    if (!stream) return
    stream.getTracks().forEach((t) => t.stop())
    setStream(null)
  }, [stream])

  useEffect(() => () => stopCapture(), [stopCapture])

  return { stream, startCapture, stopCapture }
}
