import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const BarChart = ({ data, labels, label = 'Value', colors = [], height = 280 }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const defaultColors = ['rgba(59,130,246,0.8)', 'rgba(16,185,129,0.8)', 'rgba(245,158,11,0.8)', 'rgba(139,92,246,0.8)', 'rgba(239,68,68,0.8)', 'rgba(236,72,153,0.8)'];

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current.getContext('2d'), {
      type: 'bar',
      data: { labels, datasets: [{ label, data, backgroundColor: colors.length > 0 ? colors : defaultColors.slice(0, data.length), borderRadius: 8, borderSkipped: false }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, border: { display: false } }, y: { grid: { color: 'rgba(148,163,184,0.08)' }, border: { display: false }, beginAtZero: true } } }
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [data, labels, label, colors]);

  return <div style={{ position: 'relative', height }}><canvas ref={canvasRef} /></div>;
};

export default BarChart;
