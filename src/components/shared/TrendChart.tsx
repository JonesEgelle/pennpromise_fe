"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface TrendChartSeries {
  key: string;
  label: string;
  /** Any CSS colour string — pass a `var(--chart-*)` token for theme support. */
  color: string;
  dashed?: boolean;
}

interface TrendChartProps {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: TrendChartSeries[];
  height?: number;
  emptyMessage?: string;
}

/**
 * Line chart wrapper around Recharts. Axis/grid/tooltip pull from CSS tokens so
 * both themes render correctly; series colours are supplied by the caller.
 */
export function TrendChart({
  data,
  xKey,
  series,
  height = 280,
  emptyMessage = "No trend data yet.",
}: TrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        style={{ height }}
        className="grid place-items-center text-sm text-muted-foreground"
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid
            vertical={false}
            stroke="var(--border)"
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey={xKey}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            tickMargin={8}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ stroke: "var(--border)" }}
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--popover-foreground)",
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--muted-foreground)" }}
          />
          {series.map((entry) => (
            <Line
              key={entry.key}
              type="monotone"
              dataKey={entry.key}
              name={entry.label}
              stroke={entry.color}
              strokeWidth={2}
              strokeDasharray={entry.dashed ? "6 6" : undefined}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
