async function fitnessValue(individual, width, height, refPixels) {
  const canvas = new OffscreenCanvas(100, 1);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  for (let j = 0; j < individual.length; j += 4) {
    const x = individual[j];
    const y = individual[j + 1];
    const radius = individual[j + 2];
    const color = individual[j + 3];

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = `#${color.toString(16)}`;
    ctx.fill();
  }

  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  let sum = 0;
  for (let j = 0; j < pixels.length; j += 4) {
    sum +=
      Math.abs(pixels[j] - refPixels[j]) +
      Math.abs(pixels[j + 1] - refPixels[j + 1]) +
      Math.abs(pixels[j + 2] - refPixels[j + 2]);
  }

  return 1 - sum / (width * height * 255 * 3);
}

onmessage = (e) => {
  const [i, individual, width, height, pixels] = e.data;
  const fitness = fitnessValue(individual, width, height, pixels);
  postMessage([i, fitness]);
};
