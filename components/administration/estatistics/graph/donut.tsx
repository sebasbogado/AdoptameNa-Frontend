"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Label, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";

interface DonutChartData {
  name: string;
  value: number;
  color: string;
}

interface Props {
  title: string;
  description?: string;
  data: DonutChartData[];
  centerLabel?: string;
  colors: string[];
}

export default function DonutChartWithText({ title, description, data, centerLabel, colors }: Props) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
if (data.length === 0) {
  return (
    <div className="text-center text-gray-500 text-sm">
      No hay datos disponibles para mostrar.
    </div>
  );
}
  return (
    <div className=" p-4 w-full max-w-md">
      <div className="text-center mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={5}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <Label
                content={({ viewBox }) => {
                  // Cast viewBox to any to access cx and cy
                  const vb: any = viewBox;
                  if (
                    vb &&
                    typeof vb.cx === "number" &&
                    typeof vb.cy === "number"
                  ) {
                    const cx = vb.cx;
                    const cy = vb.cy;
                    return (
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={cx}
                          y={cy}
                          className="fill-gray-900 text-2xl font-bold"
                        >
                          {total}
                        </tspan>
                        {centerLabel && (
                          <tspan
                            x={cx}
                            y={cy + 20}
                            className="fill-gray-500 text-sm"
                          >
                            {centerLabel}
                          </tspan>
                        )}
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

       <div className="mt-4 flex flex-wrap gap-3 justify-center text-sm">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[idx % colors.length] }}
            />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
