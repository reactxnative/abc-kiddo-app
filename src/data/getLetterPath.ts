import { Skia } from '@shopify/react-native-skia';

export const getLetterPath = (letter: string, width: number, height: number) => {
  const path = Skia.Path.Make();
  
  // Responsive layout grids
  const L = width * 0.3;     // Left boundary
  const R = width * 0.7;     // Right boundary
  const C = width * 0.5;     // Center X
  const T = height * 0.18;   // Top baseline
  const M = height * 0.5;    // Mid-line
  const B = height * 0.82;   // Bottom baseline

  switch (letter.toUpperCase()) {
    case 'A':
      path.moveTo(L, B); path.lineTo(C, T); path.lineTo(R, B);
      path.moveTo(width * 0.38, M + 5); path.lineTo(width * 0.62, M + 5);
      break;

    case 'B':
      path.moveTo(L, T); path.lineTo(L, B);
      path.moveTo(L, T);
      path.cubicTo(R + 10, T, R + 10, M, L, M);
      path.cubicTo(R + 20, M, R + 20, B, L, B);
      break;

    case 'C':
      path.moveTo(R - 10, T + 10);
      path.cubicTo(L - 15, T - 10, L - 15, B + 10, R - 10, B - 10);
      break;

    case 'D':
      path.moveTo(L, T); path.lineTo(L, B);
      path.moveTo(L, T);
      path.cubicTo(R + 30, T, R + 30, B, L, B);
      break;

    case 'E':
      path.moveTo(L, T); path.lineTo(L, B);
      path.moveTo(L, T); path.lineTo(R, T);
      path.moveTo(L, M); path.lineTo(width * 0.6, M);
      path.moveTo(L, B); path.lineTo(R, B);
      break;

    case 'F':
      path.moveTo(L, T); path.lineTo(L, B);
      path.moveTo(L, T); path.lineTo(R, T);
      path.moveTo(L, M); path.lineTo(width * 0.6, M);
      break;

    case 'G':
      path.moveTo(R - 5, T + 15);
      path.cubicTo(L - 15, T - 10, L - 15, B + 10, R - 5, B - 5);
      path.lineTo(R - 5, M + 10);
      path.lineTo(C + 10, M + 10);
      break;

    case 'H':
      path.moveTo(L, T); path.lineTo(L, B);
      path.moveTo(R, T); path.lineTo(R, B);
      path.moveTo(L, M); path.lineTo(R, M);
      break;

    case 'I':
      path.moveTo(C, T); path.lineTo(C, B);
      path.moveTo(L + 15, T); path.lineTo(R - 15, T);
      path.moveTo(L + 15, B); path.lineTo(R - 15, B);
      break;

    case 'J':
      path.moveTo(R - 15, T); path.lineTo(R - 15, height * 0.68);
      path.cubicTo(R - 15, B + 20, L, B + 20, L, height * 0.68);
      break;

    case 'K':
      path.moveTo(L, T); path.lineTo(L, B);
      path.moveTo(R - 5, T); path.lineTo(L, M); path.lineTo(R - 5, B);
      break;

    case 'L':
      path.moveTo(L, T); path.lineTo(L, B); path.lineTo(R, B);
      break;

    case 'M':
      path.moveTo(L, B); path.lineTo(L, T); path.lineTo(C, M + 20); path.lineTo(R, T); path.lineTo(R, B);
      break;

    case 'N':
      path.moveTo(L, B); path.lineTo(L, T); path.lineTo(R, B); path.lineTo(R, T);
      break;

    case 'O':
      path.moveTo(C, T);
      path.cubicTo(L - 25, T, L - 25, B, C, B);
      path.cubicTo(R + 25, B, R + 25, T, C, T);
      break;

    case 'P':
      path.moveTo(L, T); path.lineTo(L, B);
      path.moveTo(L, T);
      path.cubicTo(R + 15, T, R + 15, M, L, M);
      break;

    case 'Q':
      path.moveTo(C, T);
      path.cubicTo(L - 25, T, L - 25, B, C, B);
      path.cubicTo(R + 25, B, R + 25, T, C, T);
      path.moveTo(C + 10, M + 15); path.lineTo(R, B);
      break;

    case 'R':
      path.moveTo(L, T); path.lineTo(L, B);
      path.moveTo(L, T);
      path.cubicTo(R + 15, T, R + 15, M, L, M);
      path.moveTo(L + 10, M); path.lineTo(R, B);
      break;

    case 'S':
      path.moveTo(R - 10, T + 15);
      path.cubicTo(L - 5, T - 15, L - 5, M, C, M);
      path.cubicTo(R + 5, M, R + 5, B + 15, L + 10, B - 15);
      break;

    case 'T':
      path.moveTo(L, T); path.lineTo(R, T);
      path.moveTo(C, T); path.lineTo(C, B);
      break;

    case 'U':
      path.moveTo(L, T); path.lineTo(L, height * 0.65);
      path.cubicTo(L, B + 15, R, B + 15, R, height * 0.65);
      path.lineTo(R, T);
      break;

    case 'V':
      path.moveTo(L, T); path.lineTo(C, B); path.lineTo(R, T);
      break;

    case 'W':
      path.moveTo(L, T); path.lineTo(width * 0.42, B); path.lineTo(C, M + 10); path.lineTo(width * 0.58, B); path.lineTo(R, T);
      break;

    case 'X':
      path.moveTo(L, T); path.lineTo(R, B);
      path.moveTo(R, T); path.lineTo(L, B);
      break;

    case 'Y':
      path.moveTo(L, T); path.lineTo(C, M); path.lineTo(R, T);
      path.moveTo(C, M); path.lineTo(C, B);
      break;

    case 'Z':
      path.moveTo(L, T); path.lineTo(R, T); path.lineTo(L, B); path.lineTo(R, B);
      break;
  }

  return path;
};