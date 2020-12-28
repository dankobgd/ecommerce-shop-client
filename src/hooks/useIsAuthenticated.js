export function useIsAuthenticated() {
  try {
    const value = JSON.parse(localStorage.getItem('ecommerce/authenticated'));
    if (!value) {
      return false;
    }

    return value;
  } catch (error) {
    return false;
  }
}
