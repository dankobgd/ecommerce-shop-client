export function formatPriceForDisplay(price) {
  if (!price) {
    return 0;
  }
  return price / 100;
}

export function priceToLowestCurrencyDenomination(price) {
  if (!price) return 0;
  return Math.trunc(price * 100);
}

export function formatPriceUnitSum(price, quantity) {
  if (!price) return 0;
  if (!quantity) return price;

  const sum = price * quantity;
  return Number.parseFloat(sum.toFixed(2)) / 100;
}
