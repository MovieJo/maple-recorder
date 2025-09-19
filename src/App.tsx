import { useEffect, useRef, useState } from 'react'

import CaptureControls from '@/components/CaptureControls'
import ChartView from '@/components/ChartView'
import Timeline from '@/components/Timeline'
import VideoCanvas, { type VideoCanvasHandle } from '@/components/VideoCanvas'
import useOcrWorker from '@/hooks/useOcrWorker'
import useRoiSelection from '@/hooks/useRoiSelection'
import useScreenCapture from '@/hooks/useScreenCapture'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { OcrResult } from '@/types/capture'

export default function App() {
  const { stream, startCapture, stopCapture } = useScreenCapture()
  const { roi, setRoi, overlayRef, onMouseDown } = useRoiSelection()
  const recognize = useOcrWorker()
  const videoRef = useRef<VideoCanvasHandle | null>(null)
  const [intervalMs, setIntervalMs] = useState<number>(1000)
  const [results, setResults] = useState<OcrResult[]>([])

  const handleClearResults = () => {
    setResults([])
  }

  useEffect(() => {
    if (!stream) return

    let active = true
    let timeoutId: number | undefined

    const tick = async () => {
      if (!active) return

      const blob = await videoRef.current?.grabFrame()
      if (blob) {
        const text = await recognize(blob)
        if (text) {
          setResults((previous) => [...previous, { time: Date.now(), value: text }])
        }
      }

      if (active) {
        timeoutId = window.setTimeout(tick, intervalMs)
      }
    }

    tick()

    return () => {
      active = false
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [intervalMs, recognize, stream])

  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="border-b border-border/60">
        <div className="container mx-auto space-y-2 px-4 py-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Maple Recorder</h1>
          <p className="text-sm text-muted-foreground">
            화면 공유를 통해 특정 영역의 텍스트를 주기적으로 추출하고 결과를 타임라인과 차트로 확인하세요.
          </p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto min-h-0">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
            <div className="space-y-6">
              <CaptureControls
                capturing={Boolean(stream)}
                onStart={startCapture}
                onStop={stopCapture}
                interval={intervalMs}
                setIntervalMs={setIntervalMs}
                roi={roi}
                setRoi={setRoi}
              />
              <Timeline results={results} onClear={handleClearResults} />
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>실시간 화면 미리보기</CardTitle>
                  <CardDescription>선택한 영역이 붉은 사각형으로 표시됩니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  <VideoCanvas
                    ref={videoRef}
                    stream={stream}
                    roi={roi}
                    overlayRef={overlayRef}
                    onMouseDown={onMouseDown}
                  />
                </CardContent>
              </Card>
              <ChartView data={results} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
