export function getMedicineLabel(medicines, medId) {
  const med = medicines?.find((m) => m.id === medId);
  return med ? `${med.name} (${med.medicineCode})` : `Medicine #${medId}`;
}

export function getRiskLevel(score, predictionType = "") {
  const numScore = Number(score ?? 0);
  const type = (predictionType || "").toLowerCase();

  // High risk: score >= 0.7 or explicitly marked high risk or outright stock-out
  if (
    numScore >= 0.7 ||
    type.includes("high") ||
    (type.includes("stock-out") && !type.includes("low") && !type.includes("medium"))
  ) {
    return "high";
  }

  // Medium risk: 0.4 <= score < 0.7 or explicitly marked medium risk
  if (numScore >= 0.4 || type.includes("medium")) {
    return "medium";
  }

  // Low risk: score < 0.4
  return "low";
}

export function getBadgeClass(predictionType, score) {
  const level = getRiskLevel(score, predictionType);
  if (level === "high") return "badge-high-risk";
  if (level === "medium") return "badge-medium-risk";
  return "badge-low-risk";
}

export function getBadgeLabel(predictionType, score) {
  const level = getRiskLevel(score, predictionType);
  if (level === "high") return "High Stock-Out Risk";
  if (level === "medium") return "Medium Stock-Out Risk";
  return "Low Stock-Out Risk";
}

export function getScoreFillClass(score) {
  if (score >= 0.7) return "high";
  if (score >= 0.4) return "medium";
  return "low";
}
