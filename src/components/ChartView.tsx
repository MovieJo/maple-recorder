import dayjs from 'dayjs'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { OcrResult } from '@/types/capture'

interface ChartViewProps {
  data: OcrResult[]
}

interface ChartDataPoint {
  time: number
  timeLabel: string
  numericValue: number
}

const tooltipFormatter = (value: number | string) =>
  typeof value === 'number' ? value.toLocaleString() : value

export default function ChartView({ data }: ChartViewProps) {
  const chartData: ChartDataPoint[] = data
    .map((entry) => {
      const numericValue = Number(entry.value.replace(/[^0-9.-]/g, ''))
      if (!Number.isFinite(numericValue)) return null
      return {
        time: entry.time,
        timeLabel: dayjs(entry.time).format('HH:mm:ss'),
        numericValue,
      }
    })
    .filter((point): point is ChartDataPoint => point !== null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>수치 변화 차트</CardTitle>
        <CardDescription>숫자로 인식된 값만 추려서 시계열로 표시합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--muted-foreground) / 0.2)" />
                <XAxis dataKey="timeLabel" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 12 }} width={60} />
                <Tooltip formatter={tooltipFormatter} labelFormatter={(value) => `시각: ${value}`} />
                <Line
                  type="monotone"
                  dataKey="numericValue"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            숫자로 인식된 결과가 없어서 차트를 표시할 수 없습니다.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
