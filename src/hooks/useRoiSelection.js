import { useRef, useState, useEffect, useCallback } from 'react'

export default function useRoiSelection(initial = { x: 0, y: 0, w: 100, h: 100 }) {
  const [roi, setRoi] = useState(initial)
  const overlayRef = useRef(null)

  const draw = useCallback(() => {
    const canvas = overlayRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = 'red'
    ctx.lineWidth = 2
    ctx.strokeRect(roi.x, roi.y, roi.w, roi.h)
  }, [roi])

  useEffect(() => {
    draw()
  }, [draw])

  const onMouseDown = useCallback((e) => {
    const canvas = overlayRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const startX = e.clientX - rect.left
    const startY = e.clientY - rect.top
    let current = { x: startX, y: startY, w: 0, h: 0 }

    const move = (evt) => {
      const x = evt.clientX - rect.left
      const y = evt.clientY - rect.top
      current = {
        x: Math.min(x, startX),
        y: Math.min(y, startY),
        w: Math.abs(x - startX),
        h: Math.abs(y - startY),
      }
      setRoi(current)
    }

    const up = () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }, [])

  const scaleRect = useCallback((video, rect) => {
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
