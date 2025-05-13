class ColorDarkRed {
  constructor() {
    this.name = 'color_dark_red';
    this.shouldStop = false;
    this.redSquare = null;
    this.cleanup = null;
  }

  async execute(machine) {
    this.shouldStop = false;
    // Use the utility from the namespace
    const randomTopPosition = ChaosMachineUtils.getRandomPercentage(50, 80);
    const randomLeftPosition = ChaosMachineUtils.getRandomPercentage(50, 70);
    const randomFontSize = ChaosMachineUtils.getRandomPercentage(100, 250);

    try {
      // Create red square
      this.redSquare = document.createElement('div');
      this.redSquare.style.position = 'fixed';
      this.redSquare.style.top = randomTopPosition;
      this.redSquare.style.left = randomLeftPosition;
      this.redSquare.style.transform = 'translate(-50%, -50%)';
      this.redSquare.style.width = '6em';
      this.redSquare.style.height = '5.5em';
      this.redSquare.style.backgroundColor = 'darkred';
      this.redSquare.textContent = "dark red";
      this.redSquare.style.fontSize = randomFontSize;
      this.redSquare.style.display = "flex";
      this.redSquare.style.alignItems = "center";
      this.redSquare.style.justifyContent = "center";
      this.redSquare.style.fontWeight = "bold";

      // Add to output
      machine.output.appendChild(this.redSquare);

      // Setup cleanup function
      this.cleanup = () => {
        if (this.redSquare && this.redSquare.parentNode) {
          this.redSquare.parentNode.removeChild(this.redSquare);
          this.redSquare = null;
        }
      };

      // Wait until stopped or 3 seconds pass
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          this.cleanup();
          resolve();
        }, 3000);
        this.stopSignal = () => {
          clearTimeout(timeout);
          this.cleanup();
          resolve();
        };
      });
    } catch (e) {
      if (this.cleanup) this.cleanup();
      if (e.name !== 'AbortError') {
        console.error("Error in ColorDarkRed:", e);
      }
    }
  }

  abort() {
    this.shouldStop = true;
    if (this.stopSignal) this.stopSignal();
  }
}

window.ModuleName = ColorDarkRed;
