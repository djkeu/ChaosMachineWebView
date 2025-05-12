// File: js/core/shared/randomPercentager.js

// 1. Namespace protection (ADD THIS FIRST)
if (window.ChaosMachineUtils && window.ChaosMachineUtils.getRandomPercentage) {
    throw new Error("ChaosMachineUtils conflict detected");
}

// 2. Namespace initialization
window.ChaosMachineUtils = window.ChaosMachineUtils || {};

// 3. Function definition
ChaosMachineUtils.getRandomPercentage = function(min, max) {
    return `${min + Math.random() * (max - min)}%`;
};
