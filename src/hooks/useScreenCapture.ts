import { useCallback, useEffect, useState } from 'react'

export default function useScreenCapture() {
  const [stream, setStream] = useState<MediaStream | null>(null)

  const startCapture = useCallback(async () => {
    try {
      const media = await navigator.mediaDevices.getDisplayMedia({ video: true })
      setStream(media)

      const [track] = media.getVideoTracks()
      if (track) {
        const handleEnded = () => setStream(null)
        track.addEventListener('ended', handleEnded, { once: true })
      }
    } catch (error) {
      console.error('Screen capture error', error)
    }
  }, [])

  const stopCapture = useCallback(() => {
    if (!stream) return
    stream.getTracks().forEach((track) => track.stop())
    setStream(null)
  }, [stream])

  useEffect(() => {
    return () => {
      stopCapture()
    }
  }, [stopCapture])

  return { stream, startCapture, stopCapture }
}
