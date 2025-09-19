import { useCallback, useEffect, useRef } from 'react'
import { createWorker, type Worker } from 'tesseract.js'

export default function useOcrWorker() {
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    let mounted = true

    void (async () => {
      try {
        const worker = await createWorker()
        await worker.loadLanguage('eng+kor')
        await worker.initialize('eng+kor')
        if (mounted) {
          workerRef.current = worker
        } else {
          await worker.terminate()
        }
      } catch (error) {
        console.error('Failed to initialize OCR worker', error)
      }
    })()

    return () => {
      mounted = false
      void workerRef.current?.terminate()
      workerRef.current = null
    }
  }, [])

  return useCallback(async (blob: Blob) => {
    if (!workerRef.current) return ''

    try {
      const {
        data: { text },
      } = await workerRef.current.recognize(blob)
      return text.trim()
    } catch (error) {
      console.error('OCR error', error)
      return ''
    }
  }, [])
}
