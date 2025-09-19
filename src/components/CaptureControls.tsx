import type { ChangeEvent, Dispatch, SetStateAction } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Roi } from '@/types/capture'

interface CaptureControlsProps {
  capturing: boolean
  onStart: () => Promise<void>
  onStop: () => void
  interval: number
  setIntervalMs: Dispatch<SetStateAction<number>>
  roi: Roi
  setRoi: Dispatch<SetStateAction<Roi>>
}

const ROI_KEYS: Array<keyof Roi> = ['x', 'y', 'w', 'h']
const ROI_RANGES: Record<keyof Roi, { min: number; max: number }> = {
  x: { min: 0, max: 800 },
  y: { min: 0, max: 800 },
  w: { min: 10, max: 1000 },
  h: { min: 10, max: 1000 },
}

export default function CaptureControls({
  capturing,
  onStart,
  onStop,
  interval,
  setIntervalMs,
  roi,
  setRoi,
}: CaptureControlsProps) {
  const handleRoiChange = (key: keyof Roi) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value)
    if (Number.isNaN(value)) return
    setRoi((current) => ({ ...current, [key]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>화면 캡처 제어</CardTitle>
        <CardDescription>화면 공유와 OCR 주기를 관리하세요.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">공유 상태</p>
          <Button
            onClick={capturing ? onStop : () => void onStart()}
            variant={capturing ? 'destructive' : 'default'}
            className="w-full justify-center"
          >
            {capturing ? '화면 공유 중지' : '화면 공유 시작'}
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>OCR 주기 (ms)</span>
            <span className="text-muted-foreground">{interval}</span>
          </div>
          <input
            type="range"
            min={500}
            max={3000}
            step={100}
            value={interval}
            onChange={(event) => setIntervalMs(Number(event.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>관심 영역 (ROI)</span>
            <span className="text-xs text-muted-foreground">드래그 또는 슬라이더로 조정하세요.</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {ROI_KEYS.map((key) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-medium uppercase text-muted-foreground">
                  <span>{key}</span>
                  <span>{roi[key]}</span>
                </div>
                <input
                  type="range"
                  min={ROI_RANGES[key].min}
                  max={ROI_RANGES[key].max}
                  step={1}
                  value={roi[key]}
                  onChange={handleRoiChange(key)}
                  className="w-full accent-primary"
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
