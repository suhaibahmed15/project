import "../../styles/dashboard.css";

// Fallback stock ledger data for daily activity in October
const fallbackLedgerData = [
  { period: "October 07", stockIn: 20, stockOut: 10, adjustments: 0, totalTransactions: 2 },
  { period: "October 08", stockIn: 360, stockOut: 300, adjustments: 0, totalTransactions: 23 },
  { period: "October 13", stockIn: 21, stockOut: 0, adjustments: 0, totalTransactions: 1 },
  { period: "October 19", stockIn: 40, stockOut: 25, adjustments: 5, totalTransactions: 4 },
  { period: "October 20", stockIn: 65, stockOut: 40, adjustments: 8, totalTransactions: 6 },
  { period: "October 22", stockIn: 94, stockOut: 0, adjustments: 0, totalTransactions: 2 },
  { period: "October 23", stockIn: 110, stockOut: 0, adjustments: 0, totalTransactions: 2 }
];

function parsePeriodLabel(periodStr) {
  if (!periodStr) return { month: "October", day: "" };
  const parts = periodStr.trim().split(" ");
  if (parts.length >= 2) {
    const month = parts[0];
    const rawDay = parts[1];
    // If it's a numeric day (e.g. "07", "7", "23")
    const dayNum = parseInt(rawDay, 10);
    const dayLabel = !isNaN(dayNum)
      ? `Day ${String(dayNum).padStart(2, "0")}`
      : rawDay;
    return { month, day: dayLabel };
  }
  return { month: "October", day: periodStr };
}

export default function StockBarChart({ data = [] }) {
  // Use data from props if available and non-empty; otherwise use fallback data
  const displayData = Array.isArray(data) && data.length > 0 ? data : fallbackLedgerData;

  // Derive current month name from first item or default
  const activeMonthName = displayData[0]?.period?.split(" ")[0] || "October";

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
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
            <h3 className="barchart-title">Stock Ledger Activity</h3>
            <span className="chart-month-badge">Month: {activeMonthName} 2026</span>
          </div>
          <p className="barchart-subtitle">
            Daily stock movements for {activeMonthName}: Stock In (Received), Stock Out (Dispensed), and Adjustments
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

            const { month, day } = parsePeriodLabel(d.period);

            return (
              <div
                key={d.period || index}
                className="yearly-group"
                title={`${month} ${day}: ${totalTx} total transactions logged in Stock Ledger`}
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

                {/* Month on top, day under it */}
                <div className="yearly-label-wrapper">
                  <span className="yearly-label-month">{month}</span>
                  <span className="yearly-label-day">{day}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
