import { useCallback, useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'

import type { Roi } from '@/types/capture'

const DEFAULT_ROI: Roi = { x: 0, y: 0, w: 100, h: 100 }

export default function useRoiSelection(initial: Roi = DEFAULT_ROI) {
  const [roi, setRoi] = useState<Roi>(initial)
  const overlayRef = useRef<HTMLCanvasElement | null>(null)

  const draw = useCallback(() => {
    const canvas = overlayRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.strokeStyle = '#ef4444'
    context.lineWidth = 2
    context.strokeRect(roi.x, roi.y, roi.w, roi.h)
  }, [roi])

  useEffect(() => {
    draw()
  }, [draw])

  const onMouseDown = useCallback((event: ReactMouseEvent<HTMLCanvasElement>) => {
    const canvas = overlayRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const startX = event.clientX - rect.left
    const startY = event.clientY - rect.top
    let current: Roi = { x: startX, y: startY, w: 0, h: 0 }

    const handleMove = (moveEvent: MouseEvent) => {
      const x = moveEvent.clientX - rect.left
      const y = moveEvent.clientY - rect.top
      current = {
        x: Math.min(x, startX),
        y: Math.min(y, startY),
        w: Math.abs(x - startX),
        h: Math.abs(y - startY),
      }
      setRoi({ ...current })
    }

    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp, { once: true })
  }, [])

  const scaleRect = useCallback((video: HTMLVideoElement, rect: Roi): Roi => {
    const scaleX = video.videoWidth / video.clientWidth
    const scaleY = video.videoHeight / video.clientHeight
    return {
      x: rect.x * scaleX,
      y: rect.y * scaleY,
      w: rect.w * scaleX,
      h: rect.h * scaleY,
    }
  }, [])

  return { roi, setRoi, overlayRef, onMouseDown, scaleRect }
}
