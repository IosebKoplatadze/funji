import { IndividualDrawer } from './IndividualDrawer';

export class GeneticAlgorithm {
  onBestChange?: (
    bestIndividual: IndividualDrawer,
    bestFitness: number,
    generation: number
  ) => void;
  private population: IndividualDrawer[];
  private fitness: number[];
  private bestIndividual: IndividualDrawer;
  private bestFitness: number;
  private generation: number;

  constructor(
    private img: HTMLImageElement,
    private pixels: Uint8ClampedArray,
    private populationSize: number,
    private targetFitness: number,
    private maxGenerations: number,
    private mutationRate: number
  ) {
    this.population = [];
    this.fitness = [];
    this.bestFitness = Infinity;
    this.generation = 0;
  }

  run() {
    this.population = this.initializePopulation(this.populationSize);
    this.fitness = this.evaluateFitness(this.population);

    // Loop until the target fitness is reached or the max number of generations is reached
    while (
      this.bestFitness > this.targetFitness &&
      this.generation < this.maxGenerations
    ) {
      requestAnimationFrame(() => {
        // Select the parents
        const parents = this.selection(this.population, this.fitness);

        // Crossover the parents to create the children
        let children = this.crossover(parents);

        // Mutate the children
        children = this.mutate(children, this.mutationRate);

        // Evaluate the fitness of the children
        const childrenFitness = this.evaluateFitness(children);

        // Replace the population with the children
        this.population = children;
        this.fitness = childrenFitness;

        // Find the best individual
        const bestIndividualIndex = this.fitness.indexOf(
          Math.min(...this.fitness)
        );
        const bestIndividualFitness = this.fitness[bestIndividualIndex];
        if (bestIndividualFitness < this.bestFitness) {
          this.bestIndividual = this.population[bestIndividualIndex];
          this.bestFitness = bestIndividualFitness;
          if (this.onBestChange) {
            this.onBestChange(
              this.bestIndividual,
              this.bestFitness,
              this.generation
            );
          }
        }
      });

      // Increment the generation
      this.generation++;
    }
  }

  // Initialize the population
  private initializePopulation(populationSize: number) {
    const population: IndividualDrawer[] = [];
    for (let i = 0; i < populationSize; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = this.img.width;
      canvas.height = this.img.height;
      const individualDrawer = new IndividualDrawer(canvas);

      const numberOfCircles = Math.floor(Math.random() * 100);
      for (let j = 0; j < numberOfCircles; j++) {
        individualDrawer.drawRandomCircle();
      }

      population.push(individualDrawer);
    }
    return population;
  }

  // Evaluate the fitness of the population
  private evaluateFitness(population: IndividualDrawer[]) {
    return population.map((individual) => {
      const imgData = individual.getImgData();
      let fitness = imgData.reduce((acc, pixel, i) => {
        return acc + Math.abs(pixel - this.pixels[i]);
      }, 0);
      return fitness;
    });
  }

  // Select the parents
  private selection(population: IndividualDrawer[], fitness: number[]) {
    const _fitness = [...fitness];
    const _population = [...population];
    let parents: Array<[IndividualDrawer, IndividualDrawer]> = [];
    for (let i = 0; i < population.length; i++) {
      const parent1 = this.selectParent(_population, _fitness);
      const parent2 = this.selectParent(_population, _fitness);
      if (parent1 && parent2) {
        parents.push([parent1, parent2]);
      }
    }
    return parents;
  }

  private selectParent(population: IndividualDrawer[], fitness: number[]) {
    let parent: IndividualDrawer = population[0];
    let parentIndex: number = 0;
    let randomFitness = Math.random() * Math.max(...fitness);
    for (let i = 0; i < population.length; i++) {
      if (fitness[i] > randomFitness) {
        parent = population[i];
        parentIndex = i;
        break;
      }
    }
    population.splice(parentIndex, 1);
    fitness.splice(parentIndex, 1);
    return parent;
  }

  private crossover(parents: Array<[IndividualDrawer, IndividualDrawer]>) {
    return parents.map(([parent1, parent2]) => {
      const parent1Props = parent1.getProps();
      const parent2Props = parent2.getProps();
      const maxProps = Math.max(parent1Props.length, parent2Props.length);

      const childProps = new Array(maxProps).fill(null).map((_, i) => {
        return i % 2 === 0
          ? parent1Props[i] ?? parent2Props[i]
          : parent2Props[i] ?? parent1Props[i];
      });
      const canvas = document.createElement('canvas');
      canvas.width = this.img.width;
      canvas.height = this.img.height;
      const child = new IndividualDrawer(canvas);
      childProps.forEach((props) => child.drawCircle(props));
      return child;
    });
  }

  private mutate(children: IndividualDrawer[], mutationRate: number) {
    return children.map((child) => {
      const canvas = document.createElement('canvas');
      canvas.width = this.img.width;
      canvas.height = this.img.height;
      const newChild = new IndividualDrawer(canvas);
      const childProps = child.getProps();
      childProps.forEach((props) => {
        if (Math.random() < mutationRate) {
          newChild.drawRandomCircle();
        } else {
          newChild.drawCircle(props);
        }
      });
      return newChild;
    });
  }
}
