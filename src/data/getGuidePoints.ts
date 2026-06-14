interface Point {
  x: number;
  y: number;
}

const createLinePoints = (start: Point, end: Point, count = 10): Point[] => {
  return Array.from({ length: count }, (_, index) => {
    const t = index / (count - 1);
    return {
      x: start.x + (end.x - start.x) * t,
      y: start.y + (end.y - start.y) * t,
    };
  });
};

const createCubicCurvePoints = (p0: Point, p1: Point, p2: Point, p3: Point, count = 14): Point[] => {
  return Array.from({ length: count }, (_, index) => {
    const t = index / (count - 1);
    const mt = 1 - t;
    return {
      x: mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x,
      y: mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y,
    };
  });
};

export const getGuidePoints = (letter: string, width: number, height: number): Point[] => {
  const L = width * 0.3;
  const R = width * 0.7;
  const C = width * 0.5;
  const T = height * 0.18;
  const M = height * 0.5;
  const B = height * 0.82;

  switch (letter.toUpperCase()) {
    case 'A':
      return [
        ...createLinePoints({ x: L, y: B }, { x: C, y: T }, 12),
        ...createLinePoints({ x: C, y: T }, { x: R, y: B }, 12),
        ...createLinePoints({ x: width * 0.38, y: M + 5 }, { x: width * 0.62, y: M + 5 }, 5),
      ];

    case 'B':
      return [
        ...createLinePoints({ x: L, y: T }, { x: L, y: B }, 14),
        ...createCubicCurvePoints({ x: L, y: T }, { x: R + 10, y: T }, { x: R + 10, y: M }, { x: L, y: M }, 12),
        ...createCubicCurvePoints({ x: L, y: M }, { x: R + 20, y: M }, { x: R + 20, y: B }, { x: L, y: B }, 12),
      ];

    case 'C':
      return [
        ...createCubicCurvePoints({ x: R - 10, y: T + 10 }, { x: L - 15, y: T - 10 }, { x: L - 15, y: B + 10 }, { x: R - 10, y: B - 10 }, 18),
      ];

    case 'D':
      return [
        ...createLinePoints({ x: L, y: T }, { x: L, y: B }, 14),
        ...createCubicCurvePoints({ x: L, y: T }, { x: R + 30, y: T }, { x: R + 30, y: B }, { x: L, y: B }, 16),
      ];

    case 'E':
      return [
        ...createLinePoints({ x: L, y: T }, { x: L, y: B }, 14),
        ...createLinePoints({ x: L, y: T }, { x: R, y: T }, 8),
        ...createLinePoints({ x: L, y: M }, { x: width * 0.6, y: M }, 6),
        ...createLinePoints({ x: L, y: B }, { x: R, y: B }, 8),
      ];

    case 'F':
      return [
        ...createLinePoints({ x: L, y: T }, { x: L, y: B }, 14),
        ...createLinePoints({ x: L, y: T }, { x: R, y: T }, 8),
        ...createLinePoints({ x: L, y: M }, { x: width * 0.6, y: M }, 6),
      ];

    case 'G':
      return [
        ...createCubicCurvePoints({ x: R - 5, y: T + 15 }, { x: L - 15, y: T - 10 }, { x: L - 15, y: B + 10 }, { x: R - 5, y: B - 5 }, 18),
        ...createLinePoints({ x: R - 5, y: B - 5 }, { x: R - 5, y: M + 10 }, 5),
        ...createLinePoints({ x: R - 5, y: M + 10 }, { x: C + 10, y: M + 10 }, 4),
      ];

    case 'H':
      return [
        ...createLinePoints({ x: L, y: T }, { x: L, y: B }, 14),
        ...createLinePoints({ x: R, y: T }, { x: R, y: B }, 14),
        ...createLinePoints({ x: L, y: M }, { x: R, y: M }, 8),
      ];

    case 'I':
      return [
        ...createLinePoints({ x: C, y: T }, { x: C, y: B }, 14),
        ...createLinePoints({ x: L + 15, y: T }, { x: R - 15, y: T }, 6),
        ...createLinePoints({ x: L + 15, y: B }, { x: R - 15, y: B }, 6),
      ];

    case 'J':
      return [
        ...createLinePoints({ x: R - 15, y: T }, { x: R - 15, y: height * 0.68 }, 12),
        ...createCubicCurvePoints({ x: R - 15, y: height * 0.68 }, { x: R - 15, y: B + 20 }, { x: L, y: B + 20 }, { x: L, y: height * 0.68 }, 10),
      ];

    case 'K':
      return [
        ...createLinePoints({ x: L, y: T }, { x: L, y: B }, 14),
        ...createLinePoints({ x: R - 5, y: T }, { x: L, y: M }, 10),
        ...createLinePoints({ x: L, y: M }, { x: R - 5, y: B }, 10),
      ];

    case 'L':
      return [
        ...createLinePoints({ x: L, y: T }, { x: L, y: B }, 14),
        ...createLinePoints({ x: L, y: B }, { x: R, y: B }, 9),
      ];

    case 'M':
      return [
        ...createLinePoints({ x: L, y: B }, { x: L, y: T }, 12),
        ...createLinePoints({ x: L, y: T }, { x: C, y: M + 20 }, 10),
        ...createLinePoints({ x: C, y: M + 20 }, { x: R, y: T }, 10),
        ...createLinePoints({ x: R, y: T }, { x: R, y: B }, 12),
      ];

    case 'N':
      return [
        ...createLinePoints({ x: L, y: B }, { x: L, y: T }, 14),
        ...createLinePoints({ x: L, y: T }, { x: R, y: B }, 14),
        ...createLinePoints({ x: R, y: B }, { x: R, y: T }, 14),
      ];

    case 'O':
      return [
        ...createCubicCurvePoints({ x: C, y: T }, { x: L - 25, y: T }, { x: L - 25, y: B }, { x: C, y: B }, 14),
        ...createCubicCurvePoints({ x: C, y: B }, { x: R + 25, y: B }, { x: R + 25, y: T }, { x: C, y: T }, 14),
      ];

    case 'P':
      return [
        ...createLinePoints({ x: L, y: T }, { x: L, y: B }, 14),
        ...createCubicCurvePoints({ x: L, y: T }, { x: R + 15, y: T }, { x: R + 15, y: M }, { x: L, y: M }, 12),
      ];

    case 'Q':
      return [
        ...createCubicCurvePoints({ x: C, y: T }, { x: L - 25, y: T }, { x: L - 25, y: B }, { x: C, y: B }, 14),
        ...createCubicCurvePoints({ x: C, y: B }, { x: R + 25, y: B }, { x: R + 25, y: T }, { x: C, y: T }, 14),
        ...createLinePoints({ x: C + 10, y: M + 15 }, { x: R, y: B }, 6),
      ];

    case 'R':
      return [
        ...createLinePoints({ x: L, y: T }, { x: L, y: B }, 14),
        ...createCubicCurvePoints({ x: L, y: T }, { x: R + 15, y: T }, { x: R + 15, y: M }, { x: L, y: M }, 12),
        ...createLinePoints({ x: L + 10, y: M }, { x: R, y: B }, 10),
      ];

    case 'S':
      return [
        ...createCubicCurvePoints({ x: R - 10, y: T + 15 }, { x: L - 5, y: T - 15 }, { x: L - 5, y: M }, { x: C, y: M }, 12),
        ...createCubicCurvePoints({ x: C, y: M }, { x: R + 5, y: M }, { x: R + 5, y: B + 15 }, { x: L + 10, y: B - 15 }, 12),
      ];

    case 'T':
      return [
        ...createLinePoints({ x: L, y: T }, { x: R, y: T }, 10),
        ...createLinePoints({ x: C, y: T }, { x: C, y: B }, 14),
      ];

    case 'U':
      return [
        ...createLinePoints({ x: L, y: T }, { x: L, y: height * 0.65 }, 10),
        ...createCubicCurvePoints({ x: L, y: height * 0.65 }, { x: L, y: B + 15 }, { x: R, y: B + 15 }, { x: R, y: height * 0.65 }, 12),
        ...createLinePoints({ x: R, y: height * 0.65 }, { x: R, y: T }, 10),
      ];

    case 'V':
      return [
        ...createLinePoints({ x: L, y: T }, { x: C, y: B }, 14),
        ...createLinePoints({ x: C, y: B }, { x: R, y: T }, 14),
      ];

    case 'W':
      return [
        ...createLinePoints({ x: L, y: T }, { x: width * 0.42, y: B }, 12),
        ...createLinePoints({ x: width * 0.42, y: B }, { x: C, y: M + 10 }, 8),
        ...createLinePoints({ x: C, y: M + 10 }, { x: width * 0.58, y: B }, 8),
        ...createLinePoints({ x: width * 0.58, y: B }, { x: R, y: T }, 12),
      ];

    case 'X':
      return [
        ...createLinePoints({ x: L, y: T }, { x: R, y: B }, 15),
        ...createLinePoints({ x: R, y: T }, { x: L, y: B }, 15),
      ];

    case 'Y':
      return [
        ...createLinePoints({ x: L, y: T }, { x: C, y: M }, 10),
        ...createLinePoints({ x: R, y: T }, { x: C, y: M }, 10),
        ...createLinePoints({ x: C, y: M }, { x: C, y: B }, 10),
      ];

    case 'Z':
      return [
        ...createLinePoints({ x: L, y: T }, { x: R, y: T }, 10),
        ...createLinePoints({ x: R, y: T }, { x: L, y: B }, 14),
        ...createLinePoints({ x: L, y: B }, { x: R, y: B }, 10),
      ];

    default:
      return [];
  }
};