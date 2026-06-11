import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const LineChart = ({ datasets = [], labels, height = 280 }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const defaultColors = [
    { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.08)' },
    { border: '#10b981', bg: 'rgba(16, 185, 129, 0.08)' },
    { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)' },
    { border: '#ef4444', bg: 'rgba(239, 68, 68, 0.08)' }
  ];

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();
    
    const ctx = canvasRef.current.getContext('2d');

    const chartDatasets = datasets.map((ds, i) => ({
      label: ds.label,
      data: ds.data,
      borderColor: ds.color || defaultColors[i % defaultColors.length].border,
      backgroundColor: ds.bgColor || defaultColors[i % defaultColors.length].bg,
      borderWidth: 2.5,
      tension: 0.4,
      fill: ds.fill ?? false,
      pointRadius: 3,
      pointHoverRadius: 6,
      pointBackgroundColor: ds.color || defaultColors[i % defaultColors.length].border,
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointHoverBorderWidth: 2
    }));

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: chartDatasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 16,
              color: '#94a3b8',
              font: { size: 12, weight: 500 }
            }
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#f1f5f9',
            bodyColor: '#94a3b8',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            displayColors: true
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8', font: { size: 11 } },
            border: { display: false }
          },
          y: {
            grid: { color: 'rgba(148, 163, 184, 0.08)' },
            ticks: { color: '#94a3b8', font: { size: 11 } },
            border: { display: false },
            beginAtZero: true
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });

    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [datasets, labels, height]);

  return (
    <div style={{ position: 'relative', height }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default LineChart;
