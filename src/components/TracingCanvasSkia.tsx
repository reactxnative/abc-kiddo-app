
import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia';
import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { getGuidePoints } from '../data/getGuidePoints';
import { getLetterPath } from '../data/getLetterPath';

const DISTANCE_THRESHOLD = 35;

interface Props {
    width: number;
    height: number;
    letter: string;

    resetKey: number;

    onCompleted?: () => void;
}

export default function TracingCanvasSkia({
    width,
    height,
    letter = 'A',
    resetKey,
    onCompleted,
}: Props) {
    const [completedDots, setCompletedDots] =
        useState<number[]>([]);
    const pathRef = useRef(Skia.Path.Make());
    const pointCountRef = useRef(0);

    const [, forceRender] = useState(0);

    useEffect(() => {
        pathRef.current = Skia.Path.Make();

        pointCountRef.current = 0;

        setCompletedDots([]);

        forceRender((v) => v + 1);
    }, [resetKey, letter]);


    const letterPath = React.useMemo(
        () => getLetterPath(letter, width, height),
        [letter, width, height]
    );

    const guidePoints = React.useMemo(
        () =>
            getGuidePoints(
                letter,
                width,
                height
            ),
        [letter, width, height]
    );
    const progress =
        guidePoints.length === 0
            ? 0
            : completedDots.length /
            guidePoints.length;

    useEffect(() => {

        if (
            progress > 0.8
        ) {

            onCompleted?.();

        }

    }, [progress]);

    const startPoint = guidePoints[0] || { x: width * 0.3, y: height * 0.85 };

    const updateProgress = (
        x: number,
        y: number
    ) => {

        guidePoints.forEach(
            (point, index) => {

                const dx =
                    point.x - x;

                const dy =
                    point.y - y;

                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );

                if (distance < 25) {
                    setCompletedDots(
                        (prev) => {

                            if (
                                prev.includes(index)
                            ) {
                                return prev;
                            }

                            return [
                                ...prev,
                                index,
                            ];
                        }
                    );
                }
            }
        );
    };

    const isPointNearGuide = (
        x: number,
        y: number
    ) => {
        return guidePoints.some((point) => {
            const dx = point.x - x;
            const dy = point.y - y;

            return (
                Math.sqrt(
                    dx * dx +
                    dy * dy
                ) < DISTANCE_THRESHOLD
            );
        });
    };

    const canStartTracing = (
        x: number,
        y: number
    ) => {
        const dx = startPoint.x - x;
        const dy = startPoint.y - y;

        return Math.sqrt(
            dx * dx + dy * dy
        ) < 30;
    };

    const startPath = (
        x: number,
        y: number
    ) => {

        if (!canStartTracing(x, y)) {
            return;
        }

        pointCountRef.current = 0;

        pathRef.current = Skia.Path.Make();

        pathRef.current.moveTo(x, y);

        forceRender((v) => v + 1);
    };

    const isNearGuide = (
        x: number,
        y: number
    ) => {
        return guidePoints.some((point) => {
            const dx = point.x - x;
            const dy = point.y - y;

            return Math.sqrt(
                dx * dx + dy * dy
            ) < 30;
        });
    };

    const addPoint = (
        x: number,
        y: number
    ) => {

        if (!isPointNearGuide(x, y)) {
            return;
        }

        updateProgress(x, y);

        pathRef.current.lineTo(x, y);

        pointCountRef.current++;

        if (pointCountRef.current % 5 === 0) {
            forceRender((v) => v + 1);
        }
    };


    const gesture = Gesture.Pan()
        .onBegin((e) => {
            runOnJS(startPath)(e.x, e.y);
        })
        .onUpdate((e) => {
            runOnJS(addPoint)(e.x, e.y);
        });



    return (
        <GestureDetector gesture={gesture}>
            <View
                style={{
                    width,
                    height,
                    backgroundColor: '#fff',
                    borderRadius: 30,
                    overflow: 'hidden',
                }}
            >

                <Canvas style={{ width, height }}>
                    <Path
                        path={letterPath}
                        color="#D1D5DB"
                        style="stroke"
                        strokeWidth={30}
                    />

                    <Path
                        path={letterPath}
                        color="#9CA3AF"
                        style="stroke"
                        strokeWidth={8}
                    />

                    {guidePoints.map((point, index) => {

                        const completed =
                            completedDots.includes(
                                index
                            );

                        return (
                            <Circle
                                key={index}
                                cx={point.x}
                                cy={point.y}
                                r={5}
                                color={
                                    completed
                                        ? '#22C55E'
                                        : '#F59E0B'
                                }
                            />
                        );
                    })}

                    {/* Dynamic Red Dot positioning based on the current letter data */}
                    {startPoint && (
                        <Circle
                            cx={startPoint.x}
                            cy={startPoint.y}
                            r={14}
                            color="#EF4444"
                        />
                    )}

                    <Path
                        path={pathRef.current}
                        color="#22C55E"
                        style="stroke"
                        strokeWidth={10}
                    />
                </Canvas>

            </View>
        </GestureDetector>

    );
}
