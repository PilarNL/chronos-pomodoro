export function formatSecToMin(seconds: number) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secodnsMod = String(Math.floor(seconds % 60)).padStart(2, '0');
  return `${minutes}:${secodnsMod}`;
}
