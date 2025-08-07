import { useRef, useState, useEffect } from 'react'
import useScreenCapture from './hooks/useScreenCapture.js'
import useRoiSelection from './hooks/useRoiSelection.js'
import useOcrWorker from './hooks/useOcrWorker.js'
import VideoCanvas from './components/VideoCanvas.jsx'
import CaptureControls from './components/CaptureControls.jsx'
import Timeline from './components/Timeline.jsx'
import ChartView from './components/ChartView.jsx'

export default function App() {
  const { stream, startCapture, stopCapture } = useScreenCapture()
  const { roi, setRoi, overlayRef, onMouseDown } = useRoiSelection()
  const recognize = useOcrWorker()
  const videoRef = useRef(null)
  const [intervalMs, setIntervalMs] = useState(1000)
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!stream) return
    let active = true

    const tick = async () => {
      if (!active) return
      const blob = await videoRef.current?.grabFrame()
      if (blob) {
        const text = await recognize(blob)
        if (text) {
          setResults((r) => [...r, { time: Date.now(), value: text }])
        }
      }
      setTimeout(tick, intervalMs)
    }
    tick()

    return () => {
      active = false
    }
  }, [stream, intervalMs, recognize])

  return (
    <div className="app">
      <CaptureControls
        capturing={!!stream}
        onStart={startCapture}
        onStop={stopCapture}
        interval={intervalMs}
        setIntervalMs={setIntervalMs}
        roi={roi}
        setRoi={setRoi}
      />
      <VideoCanvas
        ref={videoRef}
        stream={stream}
        roi={roi}
        overlayRef={overlayRef}
        onMouseDown={onMouseDown}
      />
      <Timeline results={results} />
      <ChartView data={results} />
    </div>
  )
}
