const defaultPage = 1;
const defaultPerPage = 50;

export const paginationRanges = [10, 25, 50, 100];

const storageKey = 'ecommerce/pagination';

export function calculatePaginationStartEndPosition(page, perPage) {
  const start = page === 1 ? 0 : (page - 1) * perPage;
  const end = page * perPage;
  return { start, end };
}

export function persistPagination(name, meta) {
  const initial = JSON.parse(sessionStorage.getItem(storageKey));

  const updatedPagination = {
    ...initial,
    [name]: meta,
  };

  sessionStorage.setItem(storageKey, JSON.stringify(updatedPagination));
}

export function getPersistedPagination(name) {
  const pagination = JSON.parse(sessionStorage.getItem(storageKey));
  const meta = pagination?.[name] || { page: defaultPage, per_page: defaultPerPage };
  return meta;
}

// util to check if queryCache key matches the object with pagination data
// so query isnt just ['tags', 1] -> it needs to be like: ['tags', { page: 1, per_page: 50 }]
export function matches(key) {
  const elm = key?.queryKey?.[1];
  return (elm && typeof elm === 'object' && 'page' in elm) || !elm;
}
