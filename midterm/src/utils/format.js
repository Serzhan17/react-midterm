export const POSITIONS = [
  { value: 'GK', label: 'Goalkeeper' },
  { value: 'DF', label: 'Defender' },
  { value: 'MF', label: 'Midfielder' },
  { value: 'FW', label: 'Forward' },
];

export const SORT_OPTIONS = [
  { value: 'rating:desc', label: 'Rating: high to low' },
  { value: 'rating:asc', label: 'Rating: low to high' },
  { value: 'marketValue:desc', label: 'Value: high to low' },
  { value: 'goals:desc', label: 'Goals: most first' },
  { value: 'age:asc', label: 'Age: youngest first' },
  { value: 'age:desc', label: 'Age: oldest first' },
  { value: 'name:asc', label: 'Name: A to Z' },
  { value: 'id:desc', label: 'Recently added' },
];

export function formatValue(thousands) {
  if (thousands >= 1000) return `€${(thousands / 1000).toFixed(1)}M`;
  return `€${thousands}K`;
}

export function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export function positionLabel(value) {
  return POSITIONS.find((p) => p.value === value)?.label ?? value;
}
