export function toGray(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  const image = context.getImageData(0, 0, width, height)
  const { data } = image

  for (let index = 0; index < data.length; index += 4) {
    const average = (data[index] + data[index + 1] + data[index + 2]) / 3
    data[index] = average
    data[index + 1] = average
    data[index + 2] = average
  }

  context.putImageData(image, 0, 0)
}

export function threshold(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  limit = 128,
): void {
  const image = context.getImageData(0, 0, width, height)
  const { data } = image

  for (let index = 0; index < data.length; index += 4) {
    const value = data[index] > limit ? 255 : 0
    data[index] = value
    data[index + 1] = value
    data[index + 2] = value
  }

  context.putImageData(image, 0, 0)
}
