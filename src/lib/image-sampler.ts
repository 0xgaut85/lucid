export async function sampleImagePoints(
  imageUrl: string,
  numPoints: number,
  canvasSize = 512,
  brightnessThreshold = 50
): Promise<Array<[number, number]>> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = canvasSize
      canvas.height = canvasSize
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject('No canvas context')

      // Calculate aspect ratio to draw image centered
      const aspect = img.width / img.height
      let drawW = canvasSize
      let drawH = canvasSize
      let offsetX = 0
      let offsetY = 0

      // Make the drawing area a bit larger to capture the full spread
      if (aspect > 1) {
        drawH = canvasSize / aspect
        offsetY = (canvasSize - drawH) / 2
      } else {
        drawW = canvasSize * aspect
        offsetX = (canvasSize - drawW) / 2
      }

      // Draw black background just in case the image has transparent background
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, canvasSize, canvasSize)

      // Draw the image
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH)

      const imgData = ctx.getImageData(0, 0, canvasSize, canvasSize).data
      const validPixels: [number, number][] = []

      // Collect all pixels that are bright enough
      for (let y = 0; y < canvasSize; y++) {
        for (let x = 0; x < canvasSize; x++) {
          const i = (y * canvasSize + x) * 4
          const r = imgData[i]
          const g = imgData[i + 1]
          const b = imgData[i + 2]
          // Simple brightness calculation
          const brightness = (r + g + b) / 3

          if (brightness > brightnessThreshold) {
            // Map to -1 to 1 space
            // Flip Y so it renders right side up in 3D space
            // Also shift center point to match visual weight of the person
            const nx = (x / canvasSize) * 2 - 1
            const ny = -((y / canvasSize) * 2 - 1)
            
            // Weight probability by brightness - add brighter pixels multiple times
            // This ensures dense glowing areas get more particles
            const weight = Math.ceil(Math.pow(brightness / 255, 2) * 10)
            for (let w = 0; w < weight; w++) {
              validPixels.push([nx, ny])
            }
          }
        }
      }

      if (validPixels.length === 0) {
        return reject('No bright pixels found in image')
      }

      // Sample randomly from the valid pixels
      const points: Array<[number, number]> = []
      for (let i = 0; i < numPoints; i++) {
        const p = validPixels[Math.floor(Math.random() * validPixels.length)]
        // Add tiny sub-pixel noise to prevent perfectly grid-aligned points
        const noiseX = (Math.random() - 0.5) * (2 / canvasSize)
        const noiseY = (Math.random() - 0.5) * (2 / canvasSize)
        points.push([p[0] + noiseX, p[1] + noiseY])
      }

      resolve(points)
    }
    img.onerror = reject
    img.src = imageUrl
  })
}
