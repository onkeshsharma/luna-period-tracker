import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { calculateAverageCycleLength, calculateAverageDuration } from '../utils';
import { format, parseISO } from 'date-fns';

export function StatsChart({ cycles }) {
  if (!cycles || cycles.length < 2) return null;

  const avgLength = calculateAverageCycleLength(cycles);
  const avgDuration = calculateAverageDuration(cycles);
  
  const sorted = [...cycles].sort((a, b) => a.date.localeCompare(b.date));
  
  const chartData = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i];
    const next = sorted[i+1];
    const d1 = new Date(current.date);
    const d2 = new Date(next.date);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    chartData.push({
      month: format(parseISO(current.date), 'MMM'),
      length: diffDays,
      isAvg: diffDays === avgLength,
      isHigh: diffDays > avgLength + 5,
      isLow: diffDays < avgLength - 5,
    });
  }

  const data = chartData.slice(-6);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-2 border border-slate-700/50 rounded-lg shadow-xl text-slate-200 text-xs">
          <p className="font-bold text-rose-400 mb-1">{`Cycle: ${payload[0].payload.month}`}</p>
          <p>{`Length: ${payload[0].value} days`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mx-4 mt-8 p-5 glass rounded-2xl border border-slate-700/50 shadow-lg anim-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-2">
          Cycle Trends
        </p>
        <div className="flex items-center gap-2">
           <div className="text-[10px] bg-slate-800/80 px-2 py-1 rounded text-slate-300 border border-slate-700/50">
             Avg Length: <span className="font-bold text-white text-xs">{avgLength}d</span>
           </div>
           <div className="text-[10px] bg-slate-800/80 px-2 py-1 rounded text-slate-300 border border-slate-700/50">
             Avg Period: <span className="font-bold text-rose-400 text-xs">{avgDuration}d</span>
           </div>
        </div>
      </div>
      
      <div className="h-44 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
            <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} domain={[0, 'dataMax + 5']} dx={-5} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
            <Bar dataKey="length" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isHigh ? '#f59e0b' : entry.isLow ? '#3b82f6' : '#f43f5e'} 
                  className="transition-all hover:opacity-80 cursor-pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
