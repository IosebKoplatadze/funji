import { GeneticAlgorithm } from './GeneticAlgorithm';

const start = () => {
  const imgURL = prompt('Enter the URL of the reference image:');
  if (!imgURL) throw new Error('No image URL provided');

  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = imgURL;

  img.onload = async () => {
    // Convert the image into a pixel array
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const pixels = imageData.data;

    const geneticAlgorithm = new GeneticAlgorithm(
      img,
      pixels,
      50,
      0.1,
      100,
      0.05
    );

    geneticAlgorithm.onBestChange = (
      bestIndividual,
      bestFitness,
      generation
    ) => {
      const canvasEl = document.getElementById(
        'canvas'
      ) as HTMLCanvasElement | null;
      const fitnessEl = document.getElementById('fitness');
      const generationEl = document.getElementById('generation');

      if (canvasEl) {
        canvasEl.width = img.width;
        canvasEl.height = img.height;
        bestIndividual.redraw(canvasEl);
      }
      if (fitnessEl) {
        fitnessEl.innerHTML = `Fitness: ${bestFitness}`;
      }
      if (generationEl) {
        generationEl.innerHTML = `Generation: ${generation}`;
      }
    };

    geneticAlgorithm.run();
  };
};

start();
