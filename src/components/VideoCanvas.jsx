import { forwardRef, useRef, useEffect, useImperativeHandle } from 'react'

const VideoCanvas = forwardRef(({ stream, roi, overlayRef, onMouseDown }, ref) => {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (video && stream) {
      video.srcObject = stream
      video.play()
    }
  }, [stream])

  useEffect(() => {
    const resize = () => {
      if (!overlayRef.current || !videoRef.current) return
      overlayRef.current.width = videoRef.current.clientWidth
      overlayRef.current.height = videoRef.current.clientHeight
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [overlayRef])

  useImperativeHandle(ref, () => ({
    async grabFrame() {
      const v = videoRef.current
      if (!v) return null
      const scaleX = v.videoWidth / v.clientWidth
      const scaleY = v.videoHeight / v.clientHeight
      const c = document.createElement('canvas')
      c.width = roi.w * scaleX
      c.height = roi.h * scaleY
      c.getContext('2d').drawImage(
        v,
        roi.x * scaleX,
        roi.y * scaleY,
        roi.w * scaleX,
        roi.h * scaleY,
        0,
        0,
        c.width,
        c.height,
      )
      return new Promise((res) => c.toBlob(res, 'image/png'))
    },
  }))

  return (
    <div className="video-container">
      <video ref={videoRef} className="video" autoPlay playsInline />
      <canvas ref={overlayRef} className="overlay" onMouseDown={onMouseDown} />
    </div>
  )
})

export default VideoCanvas
