export function calculatePaginationStartEndPosition(page, perPage) {
  const start = page === 1 ? 0 : (page - 1) * perPage;
  const end = page * perPage;

  return { start, end };
}
