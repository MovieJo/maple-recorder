import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type MutableRefObject,
} from 'react'

import { cn } from '@/lib/utils'
import type { Roi } from '@/types/capture'

export interface VideoCanvasHandle {
  grabFrame: () => Promise<Blob | null>
}

interface VideoCanvasProps {
  stream: MediaStream | null
  roi: Roi
  overlayRef: MutableRefObject<HTMLCanvasElement | null>
  onMouseDown: (event: ReactMouseEvent<HTMLCanvasElement>) => void
  className?: string
}

const VideoCanvas = forwardRef<VideoCanvasHandle, VideoCanvasProps>(
  ({ stream, roi, overlayRef, onMouseDown, className }, ref) => {
    const videoRef = useRef<HTMLVideoElement | null>(null)

    useEffect(() => {
      const video = videoRef.current
      if (!video) return

      if (stream) {
        video.srcObject = stream
        void video.play().catch((error) => {
          console.error('Failed to play video stream', error)
        })
      } else {
        video.pause()
        video.srcObject = null
      }
    }, [stream])

    useEffect(() => {
      const resizeOverlay = () => {
        const canvas = overlayRef.current
        const video = videoRef.current
        if (!canvas || !video) return

        canvas.width = video.clientWidth
        canvas.height = video.clientHeight
      }

      const video = videoRef.current
      video?.addEventListener('loadedmetadata', resizeOverlay)
      resizeOverlay()
      window.addEventListener('resize', resizeOverlay)

      return () => {
        video?.removeEventListener('loadedmetadata', resizeOverlay)
        window.removeEventListener('resize', resizeOverlay)
      }
    }, [overlayRef])

    useImperativeHandle(
      ref,
      () => ({
        async grabFrame() {
          const video = videoRef.current
          if (!video || roi.w <= 0 || roi.h <= 0) {
            return null
          }

          const scaleX = video.videoWidth / video.clientWidth
          const scaleY = video.videoHeight / video.clientHeight

          if (!Number.isFinite(scaleX) || !Number.isFinite(scaleY)) {
            return null
          }

          const canvas = document.createElement('canvas')
          canvas.width = roi.w * scaleX
          canvas.height = roi.h * scaleY
          const context = canvas.getContext('2d')
          if (!context) return null

          context.drawImage(
            video,
            roi.x * scaleX,
            roi.y * scaleY,
            roi.w * scaleX,
            roi.h * scaleY,
            0,
            0,
            canvas.width,
            canvas.height,
          )

          return new Promise<Blob | null>((resolve) => {
            canvas.toBlob((blob) => resolve(blob), 'image/png')
          })
        },
      }),
      [roi],
    )

    return (
      <div
        className={cn(
          'relative flex w-full items-center justify-center overflow-hidden rounded-lg bg-muted',
          className,
        )}
      >
        <video
          ref={videoRef}
          className="h-full w-full max-h-[480px] object-contain"
          autoPlay
          muted
          playsInline
        />
        <canvas
          ref={overlayRef}
          className="absolute inset-0 h-full w-full cursor-crosshair"
          onMouseDown={onMouseDown}
        />
      </div>
    )
  },
)

VideoCanvas.displayName = 'VideoCanvas'

export default VideoCanvas
