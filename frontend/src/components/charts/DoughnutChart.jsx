import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const DoughnutChart = ({ data, labels, colors = [], height = 280, cutout = '65%' }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current.getContext('2d'), {
      type: 'doughnut',
      data: { labels, datasets: [{ data, backgroundColor: colors.length > 0 ? colors : defaultColors.slice(0, data.length), borderWidth: 0, hoverOffset: 8, spacing: 2 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, pointStyle: 'circle', padding: 20, color: '#94a3b8', font: { size: 12, weight: 500 } } } } }
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [data, labels, colors, cutout]);

  return <div style={{ position: 'relative', height }}><canvas ref={canvasRef} /></div>;
};

export default DoughnutChart;
