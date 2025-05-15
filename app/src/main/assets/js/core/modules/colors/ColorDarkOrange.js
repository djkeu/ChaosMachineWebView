class ColorDarkOrange {
  constructor() {
    this.name = 'color_dark_orange';
    this.shouldStop = false;
    this.orangeSquare = null;
    this.orangeSquare = null;
    this.abortController = new AbortController();
  }

  async execute(machine) {
    this.shouldStop = false;
    this.abortController = new AbortController();  // reset abortController
    const signal = this.abortController.signal;

    try {
      // Use the utility from the namespace
      const randomTopPosition = ChaosMachineUtils.getRandomNumber(20, 50);
      const randomLeftPosition = ChaosMachineUtils.getRandomNumber(50, 70);
      const randomFontSize = ChaosMachineUtils.getRandomNumber(100, 250);

      // Create red square
      this.orangeSquare = document.createElement('div');
      this.orangeSquare.style.position = 'fixed';
      this.orangeSquare.style.top = `${randomTopPosition}%`;
      this.orangeSquare.style.left = `${randomLeftPosition}%`;
      this.orangeSquare.style.transform = 'translate(-50%, -50%)';
      this.orangeSquare.style.width = '6em';
      this.orangeSquare.style.height = '5.5em';
      this.orangeSquare.style.backgroundColor = 'darkorange';
      this.orangeSquare.textContent = "dark orange";
      this.orangeSquare.style.fontSize = `${randomFontSize}%`;
      this.orangeSquare.style.display = "flex";
      this.orangeSquare.style.alignItems = "center";
      this.orangeSquare.style.justifyContent = "center";
      this.orangeSquare.style.fontWeight = "bold";

      // Add to output
      machine.output.appendChild(this.orangeSquare);

      // Wait for 3 seconds or until aborted using chunked delay
      await this.chunkedDelay(3000, 100, signal);

      // Cleanup at the end of normal execution
      if (this.orangeSquare && this.orangeSquare.parentNode) {
        this.orangeSquare.parentNode.removeChild(this.orangeSquare);
        this.orangeSquare = null;
      }

    } catch (e) {
      // Cleanup on error or abort
      if (this.orangeSquare && this.orangeSquare.parentNode) {
        this.orangeSquare.parentNode.removeChild(this.orangeSquare);
        this.orangeSquare = null;
      }

      if (e.name !== 'AbortError') {
        console.error("Error in ColorDarkOrange:", e);
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

window.ModuleName = ColorDarkOrange;
