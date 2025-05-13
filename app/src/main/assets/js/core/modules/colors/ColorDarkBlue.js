class ColorDarkBlue {
  constructor() {
    this.name = 'color_dark_blue';
    this.shouldStop = false;
    this.blueSquare = null;
    this.cleanup = null;
  }

  async execute(machine) {
    this.shouldStop = false;
    // Use the utility from the namespace
    const randomTopPosition = ChaosMachineUtils.getRandomPercentage(20, 50);
    const randomLeftPosition = ChaosMachineUtils.getRandomPercentage(30, 50);
    const randomFontSize = ChaosMachineUtils.getRandomPercentage(100, 250);

    try {
      // Create red square
      this.blueSquare = document.createElement('div');
      this.blueSquare.style.position = 'fixed';
      this.blueSquare.style.top = randomTopPosition;
      this.blueSquare.style.left = randomLeftPosition;
      this.blueSquare.style.transform = 'translate(-50%, -50%)';
      this.blueSquare.style.width = '6em';
      this.blueSquare.style.height = '5.5em';
      this.blueSquare.style.backgroundColor = 'darkblue';
      this.blueSquare.textContent = "dark blue";
      this.blueSquare.style.fontSize = randomFontSize;
      this.blueSquare.style.display = "flex";
      this.blueSquare.style.alignItems = "center";
      this.blueSquare.style.justifyContent = "center";
      this.blueSquare.style.fontWeight = "bold";

      // Add to output
      machine.output.appendChild(this.blueSquare);

      // Setup cleanup function
      this.cleanup = () => {
        if (this.blueSquare && this.blueSquare.parentNode) {
          this.blueSquare.parentNode.removeChild(this.blueSquare);
          this.blueSquare = null;
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
        console.error("Error in ColorDarkBlue:", e);
      }
    }
  }

  abort() {
    this.shouldStop = true;
    if (this.stopSignal) this.stopSignal();
  }
}

window.ModuleName = ColorDarkBlue;
