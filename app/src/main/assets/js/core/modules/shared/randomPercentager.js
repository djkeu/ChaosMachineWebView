// randomPercentager.js
export function getRandomPercentage(min, max) {
  return `${min + Math.random() * (max - min)}%`;
}
