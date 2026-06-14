import React, { useMemo, useRef, useState } from 'react';
import { GestureResponderEvent, PanResponder, StyleSheet, Text, View } from 'react-native';

interface Point {
  x: number;
  y: number;
}

interface DrawingCanvasProps {
  width: number;
  height: number;
  letter?: string;
  onStrokeComplete?: () => void;
  completed?: boolean;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  width,
  height,
  letter = 'A',
  onStrokeComplete,
  completed = false,
}) => {
  const [lines, setLines] = useState<Point[][]>([]);
  const [currentLine, setCurrentLine] = useState<Point[]>([]);
  const [coverage, setCoverage] = useState(0);
  const currentLineRef = useRef<Point[]>([]);
  const touchedGuidesRef = useRef<Set<number>>(new Set());
  const completedRef = useRef(false);

  const guideDots = useMemo(() => createLetterGuides(letter, width, height), [height, letter, width]);

  const drawSegment = (point: Point, prevPoint: Point, key: string, isActive: boolean) => {
    const distance = Math.sqrt(
      Math.pow(point.x - prevPoint.x, 2) + Math.pow(point.y - prevPoint.y, 2)
    );
    const angle = Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x);

    return (
      <View
        key={key}
        style={{
          position: 'absolute',
          left: prevPoint.x,
          top: prevPoint.y,
          width: distance,
          height: isActive ? 16 : 14,
          backgroundColor: isActive ? '#22c55e' : '#38bdf8',
          borderRadius: 999,
          opacity: isActive ? 0.9 : 0.8,
          transform: [
            { translateX: -distance / 2 },
            { translateY: isActive ? -8 : -7 },
            { rotate: `${angle}rad` },
          ],
        }}
      />
    );
  };

  const updateGuideCoverage = (point: Point) => {
    guideDots.forEach((dot, index) => {
      if (touchedGuidesRef.current.has(index)) return;

      const distance = Math.sqrt(Math.pow(point.x - dot.x, 2) + Math.pow(point.y - dot.y, 2));
      if (distance <= 34) {
        touchedGuidesRef.current.add(index);
      }
    });

    const nextCoverage = touchedGuidesRef.current.size / guideDots.length;
    setCoverage(nextCoverage);

    if (!completedRef.current && nextCoverage >= 0.68) {
      completedRef.current = true;
      onStrokeComplete?.();
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        const nextLine = [{ x: locationX, y: locationY }];
        currentLineRef.current = nextLine;
        setCurrentLine(nextLine);
        updateGuideCoverage({ x: locationX, y: locationY });
      },
      onPanResponderMove: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        const nextPoint = { x: locationX, y: locationY };
        currentLineRef.current = [...currentLineRef.current, nextPoint];
        setCurrentLine(currentLineRef.current);
        updateGuideCoverage(nextPoint);
      },
      onPanResponderRelease: () => {
        if (currentLineRef.current.length > 5) {
          setLines((prev) => [...prev, currentLineRef.current]);
        } else {
          touchedGuidesRef.current.clear();
          setCoverage(0);
        }
        currentLineRef.current = [];
        setCurrentLine([]);
      },
    })
  ).current;

  return (
    <View
      style={[
        styles.canvas,
        {
          width,
          height,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.paperHighlight} />
      <Text
        style={[
          styles.targetLetter,
          {
            fontSize: Math.min(width * 0.72, height * 0.95),
            lineHeight: Math.min(width * 0.72, height * 0.95),
          },
        ]}
      >
        {letter}
      </Text>

      {guideDots.map((dot, index) => {
        const isTouched = touchedGuidesRef.current.has(index);

        return (
          <View
            key={`guide-${index}`}
            style={[
              styles.guideDot,
              {
                left: dot.x - 7,
                top: dot.y - 7,
                backgroundColor: isTouched ? '#22c55e' : '#f59e0b',
                opacity: isTouched ? 0.55 : 0.85,
              },
            ]}
          />
        );
      })}

      {lines.map((line, lineIdx) => (
        <View key={`line-${lineIdx}`}>
          {line.map((point, pointIdx) => {
            if (pointIdx === 0) return null;
            const prevPoint = line[pointIdx - 1];
            return drawSegment(point, prevPoint, `segment-${pointIdx}`, false);
          })}
        </View>
      ))}

      {currentLine.map((point, pointIdx) => {
        if (pointIdx === 0) return null;
        const prevPoint = currentLine[pointIdx - 1];
        return drawSegment(point, prevPoint, `current-segment-${pointIdx}`, true);
      })}

      <View style={styles.coveragePill}>
        <Text style={styles.coverageText}>
          {completed || coverage >= 0.68 ? 'Great tracing!' : `${Math.round(coverage * 100)}%`}
        </Text>
      </View>
    </View>
  );
};

const createLetterGuides = (letter: string, width: number, height: number) => {
  const upperLetter = letter.toUpperCase();

  if (upperLetter === 'A') {
    return [
      ...createLineDots({ x: width * 0.3, y: height * 0.84 }, { x: width * 0.5, y: height * 0.14 }, 14),
      ...createLineDots({ x: width * 0.5, y: height * 0.14 }, { x: width * 0.7, y: height * 0.84 }, 14),
      ...createLineDots({ x: width * 0.39, y: height * 0.52 }, { x: width * 0.61, y: height * 0.52 }, 8),
    ];
  }

  return [
    ...createLineDots({ x: width * 0.25, y: height * 0.22 }, { x: width * 0.75, y: height * 0.22 }, 10),
    ...createLineDots({ x: width * 0.25, y: height * 0.5 }, { x: width * 0.75, y: height * 0.5 }, 10),
    ...createLineDots({ x: width * 0.25, y: height * 0.78 }, { x: width * 0.75, y: height * 0.78 }, 10),
    ...createLineDots({ x: width * 0.28, y: height * 0.24 }, { x: width * 0.28, y: height * 0.76 }, 10),
    ...createLineDots({ x: width * 0.72, y: height * 0.24 }, { x: width * 0.72, y: height * 0.76 }, 10),
  ];
};

const createLineDots = (start: Point, end: Point, count: number) =>
  Array.from({ length: count }, (_, index) => {
    const ratio = count === 1 ? 0 : index / (count - 1);
    return {
      x: start.x + (end.x - start.x) * ratio,
      y: start.y + (end.y - start.y) * ratio,
    };
  });

const styles = StyleSheet.create({
  canvas: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    borderWidth: 5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 14px 28px rgba(69, 42, 124, 0.18)',
  },
  paperHighlight: {
    position: 'absolute',
    top: 14,
    left: 16,
    right: 16,
    height: 42,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
  },
  targetLetter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '7%',
    textAlign: 'center',
    color: 'rgba(148, 163, 184, 0.22)',
    fontWeight: '900',
    textShadowColor: 'rgba(251, 191, 36, 0.18)',
    textShadowOffset: { width: 0, height: 5 },
    textShadowRadius: 1,
  },
  guideDot: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  coveragePill: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(14, 165, 233, 0.13)',
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.24)',
  },
  coverageText: {
    color: '#0284c7',
    fontSize: 14,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
});
