import dayjs from 'dayjs'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { OcrResult } from '@/types/capture'

interface TimelineProps {
  results: OcrResult[]
}

export default function Timeline({ results }: TimelineProps) {
  const hasResults = results.length > 0

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>인식 결과 타임라인</CardTitle>
      </CardHeader>
      <CardContent>
        {hasResults ? (
          <div className="max-h-64 space-y-3 overflow-y-auto pr-2">
            {[...results]
              .reverse()
              .map((result, index) => (
                <div key={`${result.time}-${index}`} className="space-y-2 rounded-lg border border-border/60 p-3">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>{dayjs(result.time).format('HH:mm:ss')}</span>
                    <span className="text-xs text-muted-foreground">#{results.length - index}</span>
                  </div>
                  <p className="text-sm leading-5 text-foreground">
                    {result.value || '인식된 텍스트가 없습니다.'}
                  </p>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">아직 인식된 결과가 없습니다.</p>
        )}
      </CardContent>
    </Card>
  )
}
