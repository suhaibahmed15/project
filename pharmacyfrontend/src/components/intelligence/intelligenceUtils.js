export function getMedicineLabel(medicines, medId) {
  const med = medicines?.find((m) => m.id === medId);
  return med ? `${med.name} (${med.medicineCode})` : `Medicine #${medId}`;
}

export function getBadgeClass(predictionType, score) {
  const type = (predictionType || "").toLowerCase();
  if (type.includes("stock-out") && !type.includes("low")) return "badge-stock-out";
  if (type.includes("high") || score >= 0.75) return "badge-high-risk";
  if (type.includes("medium") || (score >= 0.5 && score < 0.75)) return "badge-medium-risk";
  if (type.includes("low")) return "badge-low-risk";
  return "badge-insufficient";
}

export function getScoreFillClass(score) {
  if (score >= 0.7) return "high";
  if (score >= 0.4) return "medium";
  return "low";
}
