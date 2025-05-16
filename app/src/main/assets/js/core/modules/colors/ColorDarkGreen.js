class ColorDarkGreen {
  constructor() {
    this.name = 'color_dark_green';
    this.shouldStop = false;
    this.greenSquare = null;
    this.abortController = new AbortController();
  }

  async execute(machine) {
    this.shouldStop = false;
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    try {
      // Get random numbers from ../shared/GetRandomNumbers.js
      const randomTopPosition = ChaosMachineUtils.getRandomNumber(50, 80);
      const randomLeftPosition = ChaosMachineUtils.getRandomNumber(30, 50);
      const randomFontSize = ChaosMachineUtils.getRandomNumber(100, 250);

      // Create green square
      this.greenSquare = document.createElement('div');
      this.greenSquare.style.position = 'absolute';
      this.greenSquare.style.top = `${randomTopPosition}%`;
      this.greenSquare.style.left = `${randomLeftPosition}%`;
      this.greenSquare.style.transform = 'translate(-50%, -50%)';
      this.greenSquare.style.width = '6em';
      this.greenSquare.style.height = '5.5em';
      this.greenSquare.style.color = 'white';
      this.greenSquare.style.backgroundColor = 'darkgreen';
      // this.greenSquare.textContent = "dark green";
      this.greenSquare.style.fontSize = `${randomFontSize}%`;
      this.greenSquare.style.display = "flex";
      this.greenSquare.style.textAlign = 'center';
      this.greenSquare.style.alignItems = "center";
      this.greenSquare.style.justifyContent = "center";
      this.greenSquare.style.fontWeight = "bold";
      this.greenSquare.style.zIndex = "10";

      // Add greenSquare to output
      machine.output.appendChild(this.greenSquare);
      await this.chunkedDelay(2000, 100, signal);

      // Add text to greenSquare
      this.greenSquare.textContent = "dark green";
      machine.output.appendChild(this.greenSquare);
      await this.chunkedDelay(2500, 100, signal);

      // Cleanup at the end of normal execution
      if (this.greenSquare && this.greenSquare.parentNode) {
        this.greenSquare.parentNode.removeChild(this.greenSquare);
        this.greenSquare = null;
      }

    } catch (e) {
      // Cleanup on error or abort
      if (this.greenSquare && this.greenSquare.parentNode) {
        this.greenSquare.parentNode.removeChild(this.greenSquare);
        this.greenSquare = null;
      }

      if (e.name !== 'AbortError') {
        console.error("Error in ColorDarkGreen:", e);
      }
    }
  }

  async chunkedDelay(totalMs, chunkMs, signal) {
    const chunks = Math.ceil(totalMs / chunkMs);
    for (let i = 0; i < chunks; i++) {
      if (this.shouldStop || signal.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }
      await new Promise(r => setTimeout(r, Math.min(chunkMs, totalMs - i * chunkMs)));
    }
  }

  abort() {
    this.shouldStop = true;
    if (this.abortController) {
      try {
        this.abortController.abort();
      } catch (e) {
        console.error(`Error aborting ${this.name}:`, e);
      }
    }
  }
}

window.ModuleName = ColorDarkGreen;
