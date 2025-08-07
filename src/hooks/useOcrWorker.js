import { useRef, useEffect } from 'react'
import { createWorker } from 'tesseract.js'

export default function useOcrWorker() {
  const workerRef = useRef(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const worker = await createWorker()
        await worker.loadLanguage('eng')
        await worker.initialize('eng')
        if (mounted) workerRef.current = worker
      } catch (e) {
        console.error('Failed to initialize OCR worker', e)
      }
    })()

    return () => {
      mounted = false
      workerRef.current?.terminate()
      workerRef.current = null
    }
  }, [])

  const recognize = async (blob) => {
    if (!workerRef.current) return ''
    try {
      const {
        data: { text },
      } = await workerRef.current.recognize(blob)
      return text.trim()
    } catch (e) {
      console.error('OCR error', e)
      return ''
    }
  }

  return recognize
}
