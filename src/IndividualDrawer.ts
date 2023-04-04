export interface CircleProps {
  x: number;
  y: number;
  radius: number;
  color: string;
}

export class IndividualDrawer {
  private ctx: CanvasRenderingContext2D;
  private props: CircleProps[] = [];

  constructor(public canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
  }

  drawRandomCircle(maxRadius = 50): CircleProps {
    const x = Math.random() * this.canvas.width;
    const y = Math.random() * this.canvas.height;
    const radius = Math.random() * maxRadius;
    const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
      Math.random() * 255
    })`;
    const props = { x, y, radius, color };
    this.drawCircle(props);
    return props;
  }

  drawCircle({ x, y, radius, color }: CircleProps) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.props.push({ x, y, radius, color });
  }

  getImgData() {
    return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
      .data;
  }

  getProps() {
    return this.props;
  }

  redraw(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    this.props.forEach((props) => this.drawCircle(props));
  }
}
