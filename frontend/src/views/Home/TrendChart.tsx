import {
  AreaClosed, AxisBottom, AxisLeft, curveMonotoneX, GridRows, Group, LinearGradient, ParentSize,
  scaleLinear, scaleTime,
} from '@visx/visx';
import { interpolatePath } from 'd3-interpolate-path';
import { ScaleLinear, ScaleTime } from 'd3-scale';
import { add, differenceInDays, format, startOfDay, sub } from 'date-fns';
import { max } from 'lodash';
import React, { useMemo, useRef } from 'react';
import { useQuery } from 'react-query';
import { animated, config, useSpring } from 'react-spring';
import styled from 'styled-components';
import { Typography } from '../../components/Typography';
import { getEventRateService } from '../../services/eventService';
import { IGetEventFilters } from '../../types/event';

const Container = styled.div`
  overflow: hidden;

  .title {
    margin-bottom: 1rem;
  }

  .chartWrapper {
    height: 30rem;
  }

  svg {
    .dateTick {
      font-size: 10px;
      fill: ${(p) => p.theme.text.colors.primary};
      stroke-width: 0;
    }
  }
`;

interface IChartProps<T> {
  data: T[];
  getTime: (data: T) => Date;
  getValue: (data: T) => number;
  getTimeLabel: (date: Date) => string;
  getValueLabel: (value: number) => string;
  getTooltipText: (data: T) => string;
  margin?: IMargin;
}

interface IAreaChartProps<T> extends IChartProps<T> {
  width: number;
  height: number;
  margin: IMargin;
}

interface IMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface ITransformedData<T> {
  date: Date;
  data: T;
}

const AnimatedPath = (
  props: {
    path: string;
  } & React.SVGAttributes<any>
) => {
  const { path, ...restProps } = props;
  const [animateProps] = useSpring(
    {
      from: { value: 0 },
      to: {
        value: 1,
      },
      reset: true,
      config: config.slow,
    },
    [path]
  );

  /**
   * refs to track path changes and ensure smooth transitions
   * it might be more idiomatic to use state and effects to manage this but most of this
   * updates need to happen before mount which is not possible with
   * effects as they run after paint
   */
  // tracks the current path being transitioned to
  const currentPath = useRef(path);
  // tracks the path being transition from
  const prevPath = useRef(path);
  // tracks the last path computed by the path interpolator
  const lastPath = useRef(path);

  // if path changes
  if (currentPath.current !== path) {
    // set the current prevPath to the lastPath computed by the interpolator as the new start point
    prevPath.current = lastPath.current;
    // update the current path to the new path
    currentPath.current = path;
  }

  const interpolator = (t: number) => {
    const newPath = interpolatePath(prevPath.current, path, (a, b) => {
      return a.x === b.x;
    })(t);

    lastPath.current = newPath;

    return newPath;
  };

  return (
    <animated.path d={animateProps.value.to(interpolator)} {...restProps} />
  );
};

function AreaOnly<T>(props: IAreaChartProps<T>) {
  const {
    width,
    height,
    margin,
    data,
    getTime,
    getValue,
    getTimeLabel,
    getValueLabel,
  } = props;
  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  // transform data and include padding
  const tData: ITransformedData<T>[] = useMemo(() => {
    if (data.length === 0) return [];

    const sorted = data.sort(
      (a, b) => getTime(a).valueOf() - getTime(b).valueOf()
    );
    const start = sorted[0];
    const end = sorted[data.length - 1];
    const startDate = getTime(start);
    const endDate = getTime(end);
    const interval = differenceInDays(endDate, startDate);
    const padding = interval === 0 ? 1 : Math.ceil(interval / data.length / 2);

    return [
      { data: sorted[0], date: sub(startDate, { days: padding }) },
      ...sorted.map((d) => ({ data: d, date: getTime(d) })),
      { data: sorted[data.length - 1], date: add(endDate, { days: padding }) },
    ];
  }, [data, getTime]);
  // scales
  const dateScale = useMemo(() => {
    return scaleTime({
      range: [0, xMax],
      domain: [tData[0]?.date, tData[tData.length - 1]?.date],
    });
  }, [xMax, tData]);
  const yScale = useMemo(() => {
    let maxValue = Math.max(max(data.map(getValue)) ?? 0, 4);

    return scaleLinear({
      range: [yMax + 2, maxValue === 0 ? yMax : 0],
      domain: [0, maxValue + 0.2 * maxValue],
      nice: true,
    });
  }, [yMax, data, getValue]);

  if (width < 10) return null;

  return (
    <svg role="figure" aria-label="trend chart" width={width} height={height}>
      <Group top={margin.top} left={margin.left}>
        <LinearGradient
          id="area-background-gradient"
          from="#3b6978"
          to="#204051"
        />
        <LinearGradient
          id="area-gradient"
          from={'rgba(239, 239, 239, .8)'}
          to={'rgba(255, 255, 255, 0)'}
        />
        <defs>
          <clipPath id="areaClip">
            <rect x={1} y={0} width={xMax - 2} height={yMax + 1} fill="blue" />
          </clipPath>
        </defs>
        <GridRows
          scale={yScale}
          width={xMax}
          numTicks={6}
          stroke="rgba(230, 230, 230, 1)"
          pointerEvents="none"
        />
        <AxisBottom
          top={yMax}
          scale={dateScale}
          tickFormat={(val) => {
            const date = typeof val === 'number' ? dateScale.invert(val) : val;

            return getTimeLabel(new Date(date.valueOf()));
          }}
          hideAxisLine
          hideTicks
          tickLabelProps={() => ({
            className: 'dateTick',
            textAnchor: 'end',
          })}
          numTicks={6}
          rangePadding={4}
        />
        <AxisLeft
          numTicks={6}
          scale={yScale}
          tickFormat={(val) => {
            return getValueLabel(val.valueOf());
          }}
          hideAxisLine
          hideTicks
          tickLabelProps={() => ({
            className: 'dateTick',
            textAnchor: 'end',
            dy: 4,
          })}
        />

        <AreaClosed
          data={tData}
          x={(d) => dateScale(d.date) ?? 0}
          y={(d) => yScale(getValue(d.data)) - 2}
          yScale={yScale}
          curve={curveMonotoneX}
        >
          {(areaProps) => {
            const path = areaProps.path(tData);

            if (!path) return null;

            return (
              <AnimatedPath
                transform="translate(0, 2)"
                clipPath="url(#areaClip)"
                path={path}
                stroke="rgba(190, 190, 190, 1)"
                strokeWidth={2}
                fill="url(#area-gradient)"
              />
            );
          }}
        </AreaClosed>
        <Tooltip {...props} timeScale={dateScale} valueScale={yScale} />
      </Group>
    </svg>
  );
}

interface ITooltipProps<T> extends IAreaChartProps<T> {
  timeScale: ScaleTime<number, number>;
  valueScale: ScaleLinear<number, number>;
}

function Tooltip<T>(props: ITooltipProps<T>) {
  const { timeScale, valueScale, getValue, getTime, data, getTooltipText } =
    props;
  const anchorEl = useRef<SVGCircleElement | null>(null);

  return (
    <>
      {data.map((d, index) => {
        const left = timeScale(getTime(d));
        const top = valueScale(getValue(d));

        return (
          <circle
            role="tooltip"
            aria-label="trend chart point"
            key={index}
            ref={anchorEl}
            cx={left - 1}
            cy={top + 1}
            r={4}
            fill="rgba(190, 190, 190)"
          >
            <title>{getTooltipText(d)}</title>
          </circle>
        );
      })}
    </>
  );
}

interface IProps {
  filters: IGetEventFilters;
}

const TrendChart = (props: IProps) => {
  const eventsQuery = useQuery(['events', 'trend', props.filters], () =>
    getEventRateService(props.filters)
  );

  return (
    <Container>
      <Typography
        as="h1"
        className="title"
        textStyle="sm18"
        display="block"
        textAlign="center"
      >
        Events Trend Chart
      </Typography>
      <div className="chartWrapper">
        <ParentSize>
          {({ width, height }) =>
            height > 1 && (
              <AreaOnly
                width={width}
                height={height - 4}
                margin={{ top: 10, left: 30, right: 0, bottom: 50 }}
                data={eventsQuery.data?.rates ?? []}
                getTime={(d) => startOfDay(new Date(d.timestamp))}
                getValue={(d) => d.total_events}
                getTooltipText={(d) =>
                  `${format(new Date(d.timestamp), 'dd MMM yyyy')} - ${
                    d.total_events
                  } events`
                }
                getTimeLabel={(d) => format(d, 'dd MMM')}
                getValueLabel={(val) => `${val}`}
              />
            )
          }
        </ParentSize>
      </div>
    </Container>
  );
};

export default TrendChart;
