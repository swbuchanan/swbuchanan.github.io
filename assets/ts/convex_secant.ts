class ConvexSecantDemo {
  private static readonly SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  private static readonly VIEW_WIDTH = 800;
  private static readonly PLOT = {
    left: 62,
    top: 32,
    width: 714,
    height: 374
  };
  private static readonly X_MIN = -3;
  private static readonly X_MAX = 3;
  private static readonly POINT_MIN = -2.75;
  private static readonly POINT_MAX = 2.75;
  private static readonly Y_MIN = -0.6;
  private static readonly Y_MAX = 9.4;
  private static readonly MINIMUM_SEPARATION = 0.4;
  private static readonly STEP = 0.05;

  private readonly root: HTMLElement;
  private readonly svg: SVGSVGElement;
  private readonly axes: SVGGElement;
  private readonly curve: SVGPathElement;
  private readonly segmentGroup: SVGGElement;
  private readonly points: SVGGElement[];
  private readonly segments: SVGLineElement[] = [];
  private readonly announcement: HTMLElement;
  private readonly barycenter: SVGGElement | null;
  private readonly barycenterGuide: SVGLineElement | null;
  private readonly meanPoint: SVGCircleElement | null;
  private readonly meanLabel: SVGTextElement | null;
  private values: number[];
  private activePointIndex: number | null = null;
  private activePointerId: number | null = null;

  constructor(root: HTMLElement) {
    const svg = root.querySelector<SVGSVGElement>(".convex-secant__plot");
    const axes = root.querySelector<SVGGElement>(".convex-secant__axes");
    const curve = root.querySelector<SVGPathElement>(".convex-secant__curve");
    const segmentGroup = root.querySelector<SVGGElement>(".convex-secant__segments");
    const points = Array.from(root.querySelectorAll<SVGGElement>(".convex-secant__point"));
    const announcement = root.querySelector<HTMLElement>("[data-convex-secant-announcement]");
    const barycenter = root.querySelector<SVGGElement>(".convex-secant__barycenter");
    const barycenterGuide = root.querySelector<SVGLineElement>(".convex-secant__barycenter-guide");
    const meanPoint = root.querySelector<SVGCircleElement>(".convex-secant__mean-point");
    const meanLabel = root.querySelector<SVGTextElement>(".convex-secant__mean-label");
    const configuredCount = Number.parseInt(root.dataset.pointCount ?? "", 10);
    const barycenterElementsAreValid = configuredCount === 4
      ? Boolean(barycenter && barycenterGuide && meanPoint && meanLabel)
      : !barycenter && !barycenterGuide && !meanPoint && !meanLabel;

    if (
      !svg || !axes || !curve || !segmentGroup || !announcement ||
      points.length !== configuredCount || (configuredCount !== 2 && configuredCount !== 4) ||
      !barycenterElementsAreValid
    ) {
      throw new Error("The convex secant demo is missing required elements.");
    }

    this.root = root;
    this.svg = svg;
    this.axes = axes;
    this.curve = curve;
    this.segmentGroup = segmentGroup;
    this.points = points;
    this.announcement = announcement;
    this.barycenter = barycenter;
    this.barycenterGuide = barycenterGuide;
    this.meanPoint = meanPoint;
    this.meanLabel = meanLabel;
    this.values = configuredCount === 4
      ? [-1.9, -0.35, 1.15, 2.5]
      : [-1.5, 1.25];

    this.drawAxes();
    this.drawCurve();
    this.createSegments();
    this.bindEvents();
    this.update();
  }

  private createSvgElement<K extends keyof SVGElementTagNameMap>(
    name: K
  ): SVGElementTagNameMap[K] {
    return document.createElementNS(ConvexSecantDemo.SVG_NAMESPACE, name);
  }

  private functionValue(x: number): number {
    return x * x;
  }

  private toSvgX(x: number): number {
    const { left, width } = ConvexSecantDemo.PLOT;
    return left + (
      (x - ConvexSecantDemo.X_MIN) /
      (ConvexSecantDemo.X_MAX - ConvexSecantDemo.X_MIN)
    ) * width;
  }

  private toSvgY(y: number): number {
    const { top, height } = ConvexSecantDemo.PLOT;
    return top + (
      (ConvexSecantDemo.Y_MAX - y) /
      (ConvexSecantDemo.Y_MAX - ConvexSecantDemo.Y_MIN)
    ) * height;
  }

  private fromSvgX(svgX: number): number {
    const { left, width } = ConvexSecantDemo.PLOT;
    return ConvexSecantDemo.X_MIN + (
      (svgX - left) / width
    ) * (ConvexSecantDemo.X_MAX - ConvexSecantDemo.X_MIN);
  }

  private drawAxes(): void {
    const xAxis = this.createSvgElement("line");
    xAxis.setAttribute("x1", String(ConvexSecantDemo.PLOT.left));
    xAxis.setAttribute("x2", String(ConvexSecantDemo.PLOT.left + ConvexSecantDemo.PLOT.width));
    xAxis.setAttribute("y1", String(this.toSvgY(0)));
    xAxis.setAttribute("y2", String(this.toSvgY(0)));
    this.axes.append(xAxis);

    const yAxis = this.createSvgElement("line");
    yAxis.setAttribute("x1", String(this.toSvgX(0)));
    yAxis.setAttribute("x2", String(this.toSvgX(0)));
    yAxis.setAttribute("y1", String(ConvexSecantDemo.PLOT.top));
    yAxis.setAttribute("y2", String(ConvexSecantDemo.PLOT.top + ConvexSecantDemo.PLOT.height));
    this.axes.append(yAxis);

    const xLabel = this.createSvgElement("text");
    xLabel.setAttribute("x", String(ConvexSecantDemo.PLOT.left + ConvexSecantDemo.PLOT.width - 5));
    xLabel.setAttribute("y", String(this.toSvgY(0) - 10));
    xLabel.setAttribute("text-anchor", "end");
    xLabel.textContent = "x";
    this.axes.append(xLabel);

    const yLabel = this.createSvgElement("text");
    yLabel.setAttribute("x", String(this.toSvgX(0) + 12));
    yLabel.setAttribute("y", String(ConvexSecantDemo.PLOT.top + 17));
    yLabel.textContent = "y";
    this.axes.append(yLabel);
  }

  private drawCurve(): void {
    const samples = 180;
    const path: string[] = [];

    for (let index = 0; index <= samples; index += 1) {
      const x = ConvexSecantDemo.X_MIN + (
        index / samples
      ) * (ConvexSecantDemo.X_MAX - ConvexSecantDemo.X_MIN);
      path.push(
        `${index === 0 ? "M" : "L"}${this.toSvgX(x).toFixed(2)},${this.toSvgY(this.functionValue(x)).toFixed(2)}`
      );
    }

    this.curve.setAttribute("d", path.join(" "));
  }

  private createSegments(): void {
    for (let index = 0; index < this.points.length - 1; index += 1) {
      const segment = this.createSvgElement("line");
      segment.classList.add("convex-secant__segment");
      this.segmentGroup.append(segment);
      this.segments.push(segment);
    }
  }

  private bindEvents(): void {
    this.points.forEach((point, index) => {
      point.addEventListener("pointerdown", (event) => {
        this.startDragging(index, event);
      });
      point.addEventListener("keydown", (event) => {
        this.handlePointKey(index, event);
      });
    });

    this.svg.addEventListener("pointermove", (event) => {
      if (
        this.activePointIndex === null ||
        event.pointerId !== this.activePointerId
      ) {
        return;
      }

      event.preventDefault();
      this.setPointFromPointer(this.activePointIndex, event);
    });

    this.svg.addEventListener("pointerup", (event) => {
      this.finishDragging(event, true);
    });
    this.svg.addEventListener("pointercancel", (event) => {
      this.finishDragging(event, false);
    });
    this.svg.addEventListener("lostpointercapture", () => {
      this.activePointIndex = null;
      this.activePointerId = null;
      this.root.classList.remove("convex-secant--dragging");
    });
  }

  private startDragging(index: number, event: PointerEvent): void {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    event.preventDefault();
    this.activePointIndex = index;
    this.activePointerId = event.pointerId;
    this.root.classList.add("convex-secant--dragging");
    this.points[index].focus();
    this.svg.setPointerCapture(event.pointerId);
    this.setPointFromPointer(index, event);
  }

  private finishDragging(event: PointerEvent, announce: boolean): void {
    if (event.pointerId !== this.activePointerId) {
      return;
    }

    if (this.svg.hasPointerCapture(event.pointerId)) {
      this.svg.releasePointerCapture(event.pointerId);
    }
    this.activePointIndex = null;
    this.activePointerId = null;
    this.root.classList.remove("convex-secant--dragging");

    if (announce) {
      this.announcePositions();
    }
  }

  private setPointFromPointer(index: number, event: PointerEvent): void {
    const bounds = this.svg.getBoundingClientRect();
    const svgX = (
      (event.clientX - bounds.left) / bounds.width
    ) * ConvexSecantDemo.VIEW_WIDTH;
    this.setPoint(index, this.fromSvgX(svgX));
  }

  private handlePointKey(index: number, event: KeyboardEvent): void {
    let nextValue = this.values[index];
    const step = event.shiftKey ? 0.25 : ConvexSecantDemo.STEP;

    switch (event.key) {
      case "ArrowLeft":
      case "ArrowDown":
        nextValue -= step;
        break;
      case "ArrowRight":
      case "ArrowUp":
        nextValue += step;
        break;
      case "PageDown":
        nextValue -= 0.25;
        break;
      case "PageUp":
        nextValue += 0.25;
        break;
      case "Home":
        nextValue = ConvexSecantDemo.POINT_MIN;
        break;
      case "End":
        nextValue = ConvexSecantDemo.POINT_MAX;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.setPoint(index, nextValue);
    this.announcePositions();
  }

  private setPoint(index: number, value: number): void {
    const lowerBound = index === 0
      ? ConvexSecantDemo.POINT_MIN
      : this.values[index - 1] + ConvexSecantDemo.MINIMUM_SEPARATION;
    const upperBound = index === this.values.length - 1
      ? ConvexSecantDemo.POINT_MAX
      : this.values[index + 1] - ConvexSecantDemo.MINIMUM_SEPARATION;
    const snapped = Math.round(value / ConvexSecantDemo.STEP) * ConvexSecantDemo.STEP;

    this.values[index] = Number(
      Math.max(lowerBound, Math.min(snapped, upperBound)).toFixed(2)
    );
    this.update();
  }

  private update(): void {
    this.points.forEach((point, index) => {
      const value = this.values[index];
      point.setAttribute(
        "transform",
        `translate(${this.toSvgX(value)} ${this.toSvgY(this.functionValue(value))})`
      );

      const minimum = index === 0
        ? ConvexSecantDemo.POINT_MIN
        : this.values[index - 1] + ConvexSecantDemo.MINIMUM_SEPARATION;
      const maximum = index === this.values.length - 1
        ? ConvexSecantDemo.POINT_MAX
        : this.values[index + 1] - ConvexSecantDemo.MINIMUM_SEPARATION;
      const name = point.dataset.pointName ?? `point ${index + 1}`;
      point.setAttribute("aria-valuemin", minimum.toFixed(2));
      point.setAttribute("aria-valuemax", maximum.toFixed(2));
      point.setAttribute("aria-valuenow", value.toFixed(2));
      point.setAttribute("aria-valuetext", `${name} equals ${value.toFixed(2)}`);
    });

    this.segments.forEach((segment, index) => {
      const leftValue = this.values[index];
      const rightValue = this.values[index + 1];
      segment.setAttribute("x1", String(this.toSvgX(leftValue)));
      segment.setAttribute("y1", String(this.toSvgY(this.functionValue(leftValue))));
      segment.setAttribute("x2", String(this.toSvgX(rightValue)));
      segment.setAttribute("y2", String(this.toSvgY(this.functionValue(rightValue))));
    });

    this.updateBarycenter();
  }

  private updateBarycenter(): void {
    if (
      !this.barycenter || !this.barycenterGuide ||
      !this.meanPoint || !this.meanLabel
    ) {
      return;
    }

    const meanX = this.values.reduce((sum, value) => sum + value, 0) / this.values.length;
    const meanY = this.values.reduce(
      (sum, value) => sum + this.functionValue(value),
      0
    ) / this.values.length;
    const curveY = this.functionValue(meanX);
    const svgX = this.toSvgX(meanX);
    const barycenterY = this.toSvgY(meanY);
    const curvePointY = this.toSvgY(curveY);

    this.barycenter.setAttribute("transform", `translate(${svgX} ${barycenterY})`);
    this.barycenterGuide.setAttribute("x1", String(svgX));
    this.barycenterGuide.setAttribute("x2", String(svgX));
    this.barycenterGuide.setAttribute("y1", String(barycenterY));
    this.barycenterGuide.setAttribute("y2", String(curvePointY));
    this.meanPoint.setAttribute("cx", String(svgX));
    this.meanPoint.setAttribute("cy", String(curvePointY));
    this.meanLabel.setAttribute("x", String(svgX + 12));
    this.meanLabel.setAttribute("y", String(curvePointY - 9));
  }

  private announcePositions(): void {
    const pointSummary = this.points.map((point, index) => {
      const name = point.dataset.pointName ?? `point ${index + 1}`;
      return `${name} equals ${this.values[index].toFixed(2)}`;
    }).join(", ");

    if (!this.barycenter) {
      this.announcement.textContent = pointSummary;
      return;
    }

    const meanX = this.values.reduce((sum, value) => sum + value, 0) / this.values.length;
    const meanY = this.values.reduce(
      (sum, value) => sum + this.functionValue(value),
      0
    ) / this.values.length;
    this.announcement.textContent = `${pointSummary}. Equal-weight barycenter at ${meanX.toFixed(2)}, ${meanY.toFixed(2)}.`;
  }
}

function initializeConvexSecantDemos(): void {
  document.querySelectorAll<HTMLElement>("[data-convex-secant]").forEach((root) => {
    if (root.dataset.convexSecantInitialized === "true") {
      return;
    }

    root.dataset.convexSecantInitialized = "true";
    new ConvexSecantDemo(root);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeConvexSecantDemos);
} else {
  initializeConvexSecantDemos();
}
