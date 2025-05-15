class ColorDarkRed {
  constructor() {
    this.name = 'color_dark_red';
    this.shouldStop = false;
    this.redSquare = null;
    this.abortController = new AbortController();
  }

  async execute(machine) {
    this.shouldStop = false;
    this.abortController = new AbortController();  // reset abortController
    const signal = this.abortController.signal;

    try {
      // Use the utility from the namespace
      const randomTopPosition = ChaosMachineUtils.getRandomNumber(50, 80);
      const randomLeftPosition = ChaosMachineUtils.getRandomNumber(50, 70);
      const randomFontSize = ChaosMachineUtils.getRandomNumber(100, 250);

      // Create red square
      this.redSquare = document.createElement('div');
      this.redSquare.style.position = 'fixed';
      this.redSquare.style.top = `${randomTopPosition}%`;
      this.redSquare.style.left = `${randomLeftPosition}%`;
      this.redSquare.style.transform = 'translate(-50%, -50%)';
      this.redSquare.style.width = '6em';
      this.redSquare.style.height = '5.5em';
      this.redSquare.style.color = var(--text-primary);
      this.redSquare.style.backgroundColor = 'darkred';
      this.redSquare.textContent = "dark red";
      this.redSquare.style.fontSize = `${randomFontSize}%`;
      this.redSquare.style.display = "flex";
      this.redSquare.style.alignItems = "center";
      this.redSquare.style.justifyContent = "center";
      this.redSquare.style.fontWeight = "bold";

      // Add to output
      machine.output.appendChild(this.redSquare);


      // Wait for 3 seconds or until aborted using chunked delay
      await this.chunkedDelay(3000, 100, signal);

      // Cleanup at the end of normal execution
      if (this.redSquare && this.redSquare.parentNode) {
        this.redSquare.parentNode.removeChild(this.redSquare);
        this.redSquare = null;
      }

    } catch (e) {
      // Cleanup on error or abort
      if (this.redSquare && this.redSquare.parentNode) {
        this.redSquare.parentNode.removeChild(this.redSquare);
        this.redSquare = null;
      }

      if (e.name !== 'AbortError') {
        console.error("Error in ColorDarkRed:", e);
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

window.ModuleName = ColorDarkRed;
