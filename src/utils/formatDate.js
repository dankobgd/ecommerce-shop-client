export function formatDate(date) {
  if (!date) return '';

  const d = date instanceof Date ? date : new Date(date);

  const dtf = new Intl.DateTimeFormat('sr-RS', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  return dtf.format(d);
}
