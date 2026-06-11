import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const AreaChart = ({ data, labels, label = 'Value', color = '#3b82f6', height = 280 }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();
    const ctx = canvasRef.current.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, `${color}33`);
    gradient.addColorStop(1, `${color}05`);

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: [{ label, data, borderColor: color, backgroundColor: gradient, borderWidth: 2.5, fill: true, tension: 0.4, pointRadius: 0, pointHoverRadius: 6, pointHoverBackgroundColor: color, pointHoverBorderColor: '#fff', pointHoverBorderWidth: 2 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#94a3b8', padding: 12, cornerRadius: 8 } }, scales: { x: { grid: { display: false }, border: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } } }, y: { grid: { color: 'rgba(148,163,184,0.08)' }, border: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } }, beginAtZero: true } }, interaction: { intersect: false, mode: 'index' } }
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [data, labels, label, color, height]);

  return <div style={{ position: 'relative', height }}><canvas ref={canvasRef} /></div>;
};

export default AreaChart;
