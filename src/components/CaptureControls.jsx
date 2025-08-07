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
    <div className="controls">
      {capturing ? (
        <button onClick={onStop}>화면 공유 중지</button>
      ) : (
        <button onClick={onStart}>화면 공유 시작</button>
      )}
      <div className="slider">
        <label>
          OCR 주기(ms): {interval}
          <input
            type="range"
            min="500"
            max="3000"
            step="500"
            value={interval}
            onChange={(e) => setIntervalMs(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="roi-sliders">
        {['x', 'y', 'w', 'h'].map((k) => (
          <label key={k}>
            {k.toUpperCase()}: {roi[k]}
            <input type="range" min="0" max="800" value={roi[k]} onChange={handleRoi(k)} />
          </label>
        ))}
      </div>
    </div>
  )
}
