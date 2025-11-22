import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';

interface PieChartData {
  type: string;
  typeInfo: {
    label: string;
    icon: string;
    color: string;
  };
  count: number;
  percentage: number;
}

interface PieChartProps {
  data: PieChartData[];
  size: number;
}

export const PieChart: React.FC<PieChartProps> = ({ data, size }) => {
  const radius = size / 2;
  const circleCircumference = 2 * Math.PI * radius;

  // Calculate angles for each segment
  let currentAngle = -90; // Start from top

  const segments = data.map((item) => {
    const sweepAngle = (item.percentage / 100) * 360;
    const segment = {
      ...item,
      startAngle: currentAngle,
      sweepAngle,
    };
    currentAngle += sweepAngle;
    return segment;
  });

  // Helper function to convert polar to cartesian coordinates
  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Create SVG path for pie slice
  const createPieSlice = (
    startAngle: number,
    sweepAngle: number,
    radius: number,
    centerX: number,
    centerY: number
  ) => {
    const start = polarToCartesian(centerX, centerY, radius, startAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle + sweepAngle);
    const largeArcFlag = sweepAngle > 180 ? 1 : 0;

    return [
      `M ${centerX} ${centerY}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      'Z',
    ].join(' ');
  };

  const centerX = size / 2;
  const centerY = size / 2;
  const chartRadius = size * 0.35; // 70% of size for chart, leave space for labels

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G>
          {segments.map((segment, index) => (
            <G key={index}>
              {/* Pie slice */}
              <SvgPath
                d={createPieSlice(
                  segment.startAngle,
                  segment.sweepAngle,
                  chartRadius,
                  centerX,
                  centerY
                )}
                fill={segment.typeInfo.color}
                opacity={0.9}
              />
              {/* Percentage label */}
              {segment.percentage >= 5 && (
                <SvgText
                  x={
                    centerX +
                    chartRadius *
                      0.65 *
                      Math.cos(((segment.startAngle + segment.sweepAngle / 2 - 90) * Math.PI) / 180)
                  }
                  y={
                    centerY +
                    chartRadius *
                      0.65 *
                      Math.sin(((segment.startAngle + segment.sweepAngle / 2 - 90) * Math.PI) / 180)
                  }
                  fill="#fff"
                  fontSize="14"
                  fontWeight="700"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {segment.percentage.toFixed(0)}%
                </SvgText>
              )}
            </G>
          ))}
        </G>
      </Svg>
      {/* Legend */}
      <View style={styles.legend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.typeInfo.color }]} />
            <Text style={styles.legendLabel}>
              {item.typeInfo.icon} {item.typeInfo.label}
            </Text>
            <Text style={styles.legendValue}>{item.percentage.toFixed(1)}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// Importing Path from react-native-svg
import { Path as SvgPath } from 'react-native-svg';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
  },
  legend: {
    width: '100%',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    flex: 1,
    fontSize: 14,
    color: '#37474F',
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#263238',
  },
});
