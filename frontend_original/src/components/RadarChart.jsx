import React, { useEffect, useRef } from 'react';

function RadarChart({ breakdown, size = 300, showLabels = true, showValues = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !breakdown) return;
    
    const ctx = canvas.getContext('2d');
    const width = size;
    const height = size;
    
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const labels = ['problem', 'solution', 'market', 'revenueModel', 'team'];
    const values = labels.map(k => breakdown[k] || 0);
    const maxValue = 10;
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 60;
    const angleStep = (Math.PI * 2) / labels.length;

    // Draw grid with numbers
    for (let level = 1; level <= maxValue; level++) {
      const r = (radius * level) / maxValue;
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
      ctx.stroke();
      
      // Add numbers on grid lines
      if (level % 2 === 0) {
        ctx.fillStyle = '#6b7280';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(level.toString(), centerX, centerY - r - 5);
      }
    }

    // Draw axes
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1;
    for (let i = 0; i < labels.length; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // Draw data polygon
    ctx.strokeStyle = '#667eea';
    ctx.fillStyle = 'rgba(102, 126, 234, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i < labels.length; i++) {
      const ratio = values[i] / maxValue;
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + radius * ratio * Math.cos(angle);
      const y = centerY + radius * ratio * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw data points with values
    for (let i = 0; i < labels.length; i++) {
      const ratio = values[i] / maxValue;
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + radius * ratio * Math.cos(angle);
      const y = centerY + radius * ratio * Math.sin(angle);
      
      ctx.fillStyle = '#667eea';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add value text on data points
      ctx.fillStyle = 'white';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(values[i].toString(), x, y);
    }

    // Draw labels
    if (showLabels) {
      const labelMap = {
        'problem': 'Problem',
        'solution': 'Solution', 
        'market': 'Market',
        'revenueModel': 'Revenue',
        'team': 'Team'
      };

      ctx.fillStyle = '#374151';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      for (let i = 0; i < labels.length; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const labelX = centerX + (radius + 30) * Math.cos(angle);
        const labelY = centerY + (radius + 30) * Math.sin(angle);
        ctx.fillText(labelMap[labels[i]], labelX, labelY);
      }
    }
  }, [breakdown, size, showLabels, showValues]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto' }} />
    </div>
  );
}

export default RadarChart;