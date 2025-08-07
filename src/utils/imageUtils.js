// 간단한 전처리 유틸 - 필요시 사용
export function toGray(ctx, w, h) {
  const img = ctx.getImageData(0, 0, w, h)
  const data = img.data
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
    data[i] = data[i + 1] = data[i + 2] = avg
  }
  ctx.putImageData(img, 0, 0)
}

export function threshold(ctx, w, h, limit = 128) {
  const img = ctx.getImageData(0, 0, w, h)
  const data = img.data
  for (let i = 0; i < data.length; i += 4) {
    const v = data[i] > limit ? 255 : 0
    data[i] = data[i + 1] = data[i + 2] = v
  }
  ctx.putImageData(img, 0, 0)
}
