// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo } from "react";
import { Card } from "antd";

import { useSelector, shallowEqual } from "react-redux";
import { RootState } from "@store";

import { Bucket, ReviewForecast } from "@api";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, ChartData, LinearScale, TimeScale, BarElement, PointElement, LineElement } from "chart.js";
import "chartjs-adapter-date-fns";

import { ColorPalette } from "@global/theme";

import dayjs from "dayjs";
import { useIntegerSetting, usePalette } from "@utils";

ChartJS.register(LinearScale, TimeScale, BarElement, PointElement, LineElement);

const CHART_HEIGHT = 196;

const CHART_DATASET_OPTIONS = {
  yAxisID: "y",
  borderWidth: 0
} as const;

const CHART_CUM_DATASET_OPTIONS = {
  label: "Cumulative",
  yAxisID: "cum",
  type: "line",
  order: -1,
  tension: 0.8,
  pointRadius: 0,
  cubicInterpolationMode: "monotone",
  borderColor: "#095cb5"
} as const;

const CHART_X_AXIS_OPTIONS = {
  type: "time",
  stacked: true,
  ticks: {
    maxTicksLimit: 9,
    padding: 0,
    minRotation: 0,
    maxRotation: 0,
    callback(_: any, i: number, values: { value: Date }[]) {
      const d = dayjs(values[i].value);
      return d.isToday() ? d.format("HH:mm") : d.format("ddd HH:mm");
    }
  }
} as const;

const CHART_Y_AXIS_SRS_OPTIONS = {
  stacked: true,
  ticks: {
    padding: 0
  }
} as const;

const CHART_Y_AXIS_CUM_OPTIONS = {
  type: "linear",
  position: "right",
  ticks: {
    padding: 0
  }
} as const;

const CHART_OPTIONS = {
  maintainAspectRatio: false,

  animation: false,

  plugins: {
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 12,
        boxHeight: 12
      }
    }
  }
};

interface ChartPoint { x: string; y: number }

function convertBucket(
  bucket: Bucket,
  allDates: string[],
  maxDate: string
): ChartPoint[] {
  const out: ChartPoint[] = [];
  for (const date of allDates) {
    if (date > maxDate) break;
    out.push({ x: date, y: bucket[date] || 0 });
  }
  return out;
}

function generateChart(
  forecast: ReviewForecast | undefined,
  maxDate: string,
  theme: ColorPalette
): ChartData | undefined {
  if (!forecast) return;
  const { apprentice, guru, master, enlightened } = forecast;

  // Shallow copy the cum bucket and the sortedDates, to amend the data if
  // necessary (e.g. adding the end date to the cum bucket)
  const cumBucket = Object.assign({}, forecast.cum);
  const sortedDates = forecast.sortedDates.slice(0);

  // Add the max date to the cum bucket if it is not already present
  if (!cumBucket[maxDate]) {
    // Get the highest cum up to that date
    let cum = 0;
    for (const date of sortedDates) {
      if (date > maxDate) break;
      cum = cumBucket[date];
    }

    // Add the new max to the cum bucket and sortedDates
    cumBucket[maxDate] = cum;
    sortedDates.push(maxDate);
    sortedDates.sort();
  }

  // Add the buckets to the output data
  return {
    labels: [],
    datasets: [{
      ...CHART_DATASET_OPTIONS,
      label: "Apprentice",
      data: convertBucket(apprentice, sortedDates, maxDate) as any,
      backgroundColor: theme.srsApprentice
    }, {
      ...CHART_DATASET_OPTIONS,
      label: "Guru",
      data: convertBucket(guru, sortedDates, maxDate) as any,
      backgroundColor: theme.srsGuru
    }, {
      ...CHART_DATASET_OPTIONS,
      label: "Master",
      data: convertBucket(master, sortedDates, maxDate) as any,
      backgroundColor: theme.srsMaster
    }, {
      ...CHART_DATASET_OPTIONS,
      label: "Enlightened",
      yAxisID: "y",
      data: convertBucket(enlightened, sortedDates, maxDate) as any,
      backgroundColor: theme.srsEnlightened
    }, { // Cumulative line
      ...CHART_CUM_DATASET_OPTIONS as any,
      data: convertBucket(cumBucket, sortedDates, maxDate) as any
    }]
  };
}

export function SummaryChartCard(): JSX.Element {
  const maxDays = useIntegerSetting("dashboardReviewChartDays");
  const theme = usePalette();

  const now = dayjs().startOf("hour").valueOf();
  const nowMax = dayjs().startOf("hour").add(maxDays, "day");
  const nowMaxStr = nowMax.toISOString();
  const nowMaxValue = nowMax.valueOf();

  const forecast = useSelector((s: RootState) => s.sync.reviewForecast, shallowEqual);
  const data = useMemo(() => generateChart(forecast, nowMaxStr, theme),
    [forecast, nowMaxStr, theme]);

  return <Card
    className="summary-chart-card"
    title="Upcoming reviews"
    loading={!data}
    extra={<SummaryChartExtra />}
  >
    {data && <Bar
      type="bar"
      height={CHART_HEIGHT}

      data={data}

      options={{
        ...CHART_OPTIONS,
        scales: {
          x: {
            ...CHART_X_AXIS_OPTIONS,
            min: now,
            max: nowMaxValue
          },
          y: CHART_Y_AXIS_SRS_OPTIONS,
          cum: CHART_Y_AXIS_CUM_OPTIONS,
        },
      }}
    />}
  </Card>;
}

function SummaryChartExtra(): JSX.Element | null {
  const nextReviewsWeek = useSelector((s: RootState) =>
    s.sync.nextReviewsAvailable.nextReviewsWeek);

  if (!nextReviewsWeek) return null;

  return <span className="upcoming-reviews">
    <b>{nextReviewsWeek}</b> upcoming in 7 days
  </span>;
}
