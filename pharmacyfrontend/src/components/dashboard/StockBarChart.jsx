import "../../styles/dashboard.css";

// Hardcoded stock ledger data for monthly activity
const hardcodedLedgerData = [
  { period: "May 2026", stockIn: 450, stockOut: 280, adjustments: 25, totalTransactions: 48 },
  { period: "Jun 2026", stockIn: 620, stockOut: 390, adjustments: 30, totalTransactions: 65 },
  { period: "Jul 2026", stockIn: 540, stockOut: 410, adjustments: 20, totalTransactions: 58 },
  { period: "Aug 2026", stockIn: 780, stockOut: 530, adjustments: 35, totalTransactions: 82 },
  { period: "Sep 2026", stockIn: 890, stockOut: 640, adjustments: 40, totalTransactions: 94 },
  { period: "Oct 2026", stockIn: 1020, stockOut: 710, adjustments: 45, totalTransactions: 112 }
];

export default function StockBarChart({ data = [] }) {
  // Use data from props if available and non-empty; otherwise use hardcoded data
  const displayData = Array.isArray(data) && data.length > 0 ? data : hardcodedLedgerData;

  // Calculate dynamic max value for proportional bar scaling
  const maxVal = Math.max(
    ...displayData.flatMap((d) => [
      d.stockIn || 0,
      d.stockOut || 0,
      d.adjustments || 0
    ]),
    10
  );

  const formatValue = (val) => {
    if (!val || val === 0) return "0";
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return val;
  };

  return (
    <div className="barchart-card">
      <div className="barchart-header">
        <div>
          <h3 className="barchart-title">Stock Ledger Activity</h3>
          <p className="barchart-subtitle">
            Monthly stock movements: Stock In (Received), Stock Out (Dispensed), and Adjustments
          </p>
        </div>
        <div className="yearly-legend">
          <span className="legend-chip">
            <span className="legend-box blue" /> Stock In
          </span>
          <span className="legend-chip">
            <span className="legend-box red" /> Stock Out
          </span>
          <span className="legend-chip">
            <span className="legend-box orange" /> Adjustments
          </span>
        </div>
      </div>

      <div className="yearly-chart-scroll-wrapper">
        <div className="yearly-chart-body">
          {displayData.map((d, index) => {
            const stockIn = d.stockIn || 0;
            const stockOut = d.stockOut || 0;
            const adjustments = d.adjustments || 0;
            const totalTx = d.totalTransactions || 0;

            const stockInPct = Math.round((stockIn / maxVal) * 100);
            const stockOutPct = Math.round((stockOut / maxVal) * 100);
            const adjPct = Math.round((adjustments / maxVal) * 100);

            return (
              <div
                key={d.period || index}
                className="yearly-group"
                title={`${d.period}: ${totalTx} total transactions logged in Stock Ledger`}
              >
                <div className="yearly-bars">
                  {/* Stock In Bar (Received) */}
                  <div
                    className="yearly-bar-col"
                    title={`${d.period} - Stock In: ${stockIn.toLocaleString()} units`}
                  >
                    <span className="yearly-bar-val">{formatValue(stockIn)}</span>
                    <div
                      className="yearly-bar blue"
                      style={{
                        height: `${Math.max(stockInPct, stockIn > 0 ? 6 : 2)}%`
                      }}
                    />
                  </div>

                  {/* Stock Out Bar (Dispensed) */}
                  <div
                    className="yearly-bar-col"
                    title={`${d.period} - Stock Out: ${stockOut.toLocaleString()} units`}
                  >
                    <span className="yearly-bar-val">{formatValue(stockOut)}</span>
                    <div
                      className="yearly-bar red"
                      style={{
                        height: `${Math.max(stockOutPct, stockOut > 0 ? 6 : 2)}%`
                      }}
                    />
                  </div>

                  {/* Adjustments Bar */}
                  <div
                    className="yearly-bar-col"
                    title={`${d.period} - Adjustments: ${adjustments.toLocaleString()} units`}
                  >
                    <span className="yearly-bar-val">{formatValue(adjustments)}</span>
                    <div
                      className="yearly-bar orange"
                      style={{
                        height: `${Math.max(adjPct, adjustments > 0 ? 6 : 2)}%`
                      }}
                    />
                  </div>
                </div>
                <span className="yearly-label">{d.period}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
