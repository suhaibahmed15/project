import "../../styles/dashboard.css";

// Hardcoded yearly stock, profit, and loss data ($ in thousands)
const yearlyData = [
  { year: "2022", stock: 75, profit: 48, loss: 12 },
  { year: "2023", stock: 90, profit: 62, loss: 15 },
  { year: "2024", stock: 115, profit: 80, loss: 18 },
  { year: "2025", stock: 130, profit: 98, loss: 14 },
  { year: "2026", stock: 145, profit: 112, loss: 9 }
];

const maxVal = 160;

export default function StockBarChart() {
  return (
    <div className="barchart-card">
      <div className="barchart-header">
        <div>
          <h3 className="barchart-title">Yearly Stock, Profit &amp; Loss</h3>
          <p className="barchart-subtitle">Annual performance comparison ($ in thousands)</p>
        </div>
        <div className="yearly-legend">
          <span className="legend-chip"><span className="legend-box blue" /> Stock</span>
          <span className="legend-chip"><span className="legend-box green" /> Profit</span>
          <span className="legend-chip"><span className="legend-box red" /> Loss</span>
        </div>
      </div>

      <div className="yearly-chart-scroll-wrapper">
        <div className="yearly-chart-body">
          {yearlyData.map((d) => (
            <div key={d.year} className="yearly-group">
              <div className="yearly-bars">
                <div className="yearly-bar-col" title={`Stock: $${d.stock}k`}>
                  <span className="yearly-bar-val">${d.stock}k</span>
                  <div className="yearly-bar blue" style={{ height: `${(d.stock / maxVal) * 100}%` }} />
                </div>
                <div className="yearly-bar-col" title={`Profit: $${d.profit}k`}>
                  <span className="yearly-bar-val">${d.profit}k</span>
                  <div className="yearly-bar green" style={{ height: `${(d.profit / maxVal) * 100}%` }} />
                </div>
                <div className="yearly-bar-col" title={`Loss: $${d.loss}k`}>
                  <span className="yearly-bar-val">${d.loss}k</span>
                  <div className="yearly-bar red" style={{ height: `${(d.loss / maxVal) * 100}%` }} />
                </div>
              </div>
              <span className="yearly-label">{d.year}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
