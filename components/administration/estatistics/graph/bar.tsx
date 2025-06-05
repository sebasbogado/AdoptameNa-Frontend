"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface BarChartData {
  name: string;
  value: number;
}

interface Props {
  title: string;
  description?: string;
  data: BarChartData[];
  colors: string[];
}

export default function BarChartWithLegend({ title, description, data, colors }: Props) {
  if (data.length === 0) {
    return (
      <div className="text-center text-gray-500 text-sm">
        No hay datos disponibles para mostrar.
      </div>
    );
  }

  return (
    <div className=" w-[600px] ">
      <div className="text-center mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>

  <div className="h-[250px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} barCategoryGap={100}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="value">
          {data.map((_, index) => (
            <Cell key={`bar-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
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
