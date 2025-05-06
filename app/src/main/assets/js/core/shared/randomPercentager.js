function getRandomPercentage(min, max) {
  return `${min + Math.random() * (max - min)}%`;
}
// Expose to global scope
window.getRandomPercentage = getRandomPercentage;