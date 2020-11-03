export function formatPriceForDisplay(price) {
  if (!price) {
    throw new Error('no price specified');
  }
  return price / 100;
}

export function priceToLowestCurrencyDenomination(price) {
  if (!price) throw new Error('no price specified');
  return Math.trunc(price * 100);
}

export function formatPriceUnitSum(price, quantity) {
  if (!price) throw new Error('no price specified');
  if (!quantity) return price;

  const sum = price * quantity;
  return Number.parseFloat(sum.toFixed(2)) / 100;
}
