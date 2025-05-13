class ColorDarkGreen {
  constructor() {
    this.name = 'color_dark_green';
    this.shouldStop = false;
    this.greenSquare = null;
    this.cleanup = null;
  }

  async execute(machine) {
    this.shouldStop = false;
    // Use the utility from the namespace
    const randomTopPosition = ChaosMachineUtils.getRandomPercentage(50, 80);
    const randomLeftPosition = ChaosMachineUtils.getRandomPercentage(30, 50);
    const randomFontSize = ChaosMachineUtils.getRandomPercentage(100, 250);

    try {
      // Create red square
      this.greenSquare = document.createElement('div');
      this.greenSquare.style.position = 'fixed';
      this.greenSquare.style.top = randomTopPosition;
      this.greenSquare.style.left = randomLeftPosition;
      this.greenSquare.style.transform = 'translate(-50%, -50%)';
      this.greenSquare.style.width = '6em';
      this.greenSquare.style.height = '5.5em';
      this.greenSquare.style.backgroundColor = 'darkgreen';
      this.greenSquare.textContent = "dark green";
      this.greenSquare.style.fontSize = randomFontSize;
      this.greenSquare.style.display = "flex";
      this.greenSquare.style.alignItems = "center";
      this.greenSquare.style.justifyContent = "center";
      this.greenSquare.style.fontWeight = "bold";

      // Add to output
      machine.output.appendChild(this.greenSquare);

      // Setup cleanup function
      this.cleanup = () => {
        if (this.greenSquare && this.greenSquare.parentNode) {
          this.greenSquare.parentNode.removeChild(this.greenSquare);
          this.greenSquare = null;
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
        console.error("Error in ColorDarkGreen:", e);
      }
    }
  }

  abort() {
    this.shouldStop = true;
    if (this.stopSignal) this.stopSignal();
  }
}

window.ModuleName = ColorDarkGreen;
