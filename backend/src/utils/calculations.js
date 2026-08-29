/**
 * Feature Engineering & Analytical Calculations Utility
 */

function safeDivide(numerator, denominator, decimals = 4) {
  const num = parseFloat(numerator) || 0;
  const den = parseFloat(denominator) || 0;
  if (den === 0) return 0;
  return Number((num / den).toFixed(decimals));
}

function calculateCostRevisionRatio(revisedCost, originalCost) {
  const orig = parseFloat(originalCost) || 0;
  const rev = revisedCost !== null && revisedCost !== undefined ? parseFloat(revisedCost) : orig;
  if (orig === 0) return 0;
  return safeDivide(rev - orig, orig, 4);
}

function calculateExpenditureRatio(cumulativeExpenditure, totalCost) {
  const exp = parseFloat(cumulativeExpenditure) || 0;
  const cost = parseFloat(totalCost) || 0;
  if (cost === 0) return 0;
  return safeDivide(exp, cost, 4);
}

function calculatePhysicalFinancialGap(financialProgress, physicalProgress) {
  const fin = parseFloat(financialProgress) || 0;
  const phys = parseFloat(physicalProgress) || 0;
  return Number((fin - phys).toFixed(2));
}

function calculateProgressVelocity(currentProgress, previousProgress) {
  const curr = parseFloat(currentProgress) || 0;
  const prev = parseFloat(previousProgress) || 0;
  return Number((curr - prev).toFixed(2));
}

function calculateProgressSlowdown(currentVelocity, previousVelocity) {
  const currVel = parseFloat(currentVelocity) || 0;
  const prevVel = parseFloat(previousVelocity) || 0;
  return Number((currVel - prevVel).toFixed(2));
}

module.exports = {
  safeDivide,
  calculateCostRevisionRatio,
  calculateExpenditureRatio,
  calculatePhysicalFinancialGap,
  calculateProgressVelocity,
  calculateProgressSlowdown
};
