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

export function calculatePercentage(original, discountPrice) {
  if (original === 0) {
    throw new Error("Original price can't be 0");
  }

  if (discountPrice === 0) {
    return 100;
  }

  const percentDif = ((original - discountPrice) / original) * 100;
  return Math.trunc(Math.ceil(percentDif), 2);
}
