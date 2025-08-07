export default function CaptureControls({
  capturing,
  onStart,
  onStop,
  interval,
  setIntervalMs,
  roi,
  setRoi,
}) {
  const handleRoi = (key) => (e) => {
    const value = Number(e.target.value)
    setRoi({ ...roi, [key]: value })
  }

  return (
    <div className="flex flex-col space-y-4">
      {capturing ? (
        <button onClick={onStop} className="px-4 py-2 bg-red-500 text-white rounded">
          화면 공유 중지
        </button>
      ) : (
        <button onClick={onStart} className="px-4 py-2 bg-blue-500 text-white rounded">
          화면 공유 시작
        </button>
      )}
      <div className="flex flex-col space-y-2">
        <label className="flex flex-col">
          <span>OCR 주기(ms): {interval}</span>
          <input
            type="range"
            min="500"
            max="3000"
            step="500"
            value={interval}
            onChange={(e) => setIntervalMs(Number(e.target.value))}
            className="mt-1"
          />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {['x', 'y', 'w', 'h'].map((k) => (
          <label key={k} className="flex flex-col">
            <span>
              {k.toUpperCase()}: {roi[k]}
            </span>
            <input
              type="range"
              min="0"
              max="800"
              value={roi[k]}
              onChange={handleRoi(k)}
              className="mt-1"
            />
          </label>
        ))}
      </div>
    </div>
  )
}
