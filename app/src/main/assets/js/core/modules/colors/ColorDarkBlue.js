class ColorDarkBlue {
  constructor() {
    this.name = 'color_dark_blue';
    this.shouldStop = false;
    this.blueSquare = null;
    this.abortController = new AbortController();
  }

  async execute(machine) {
    this.shouldStop = false;
    this.abortController = new AbortController();  // reset abortController
    const signal = this.abortController.signal;

    try {
      // Use the utility from the namespace for random positioning
      const randomTopPosition = ChaosMachineUtils.getRandomNumber(20, 50);
      const randomLeftPosition = ChaosMachineUtils.getRandomNumber(30, 50);
      const randomFontSize = ChaosMachineUtils.getRandomNumber(100, 250);

      // Create blue square - this is the visual element we want to display
      this.blueSquare = document.createElement('div');
      this.blueSquare.style.position = 'absolute';
      this.blueSquare.style.top = `${randomTopPosition}%`;
      this.blueSquare.style.left = `${randomLeftPosition}%`;
      this.blueSquare.style.transform = 'translate(-50%, -50%)';
      this.blueSquare.style.width = '6em';
      this.blueSquare.style.height = '5.5em';
      this.blueSquare.style.color = 'white';
      this.blueSquare.style.backgroundColor = 'darkblue';
      //this.blueSquare.textContent = "dark blue";
      this.blueSquare.style.fontSize = `${randomFontSize}%`;
      this.blueSquare.style.display = "flex";
      this.blueSquare.style.textAlign = 'center';
      this.blueSquare.style.alignItems = "center";
      this.blueSquare.style.justifyContent = "center";
      this.blueSquare.style.fontWeight = "bold";
      this.blueSquare.style.zIndex = "10";

      // Add blueSquare to output
      machine.output.appendChild(this.blueSquare)
      await this.chunkedDelay(2000, 100, signal);

      // Add text to blueSquare
      this.blueSquare.textContent = "dark blue";
      machine.output.appendChild(this.blueSquare)
      await this.chunkedDelay(2500, 100, signal);


      // Cleanup at the end of normal execution
      if (this.blueSquare && this.blueSquare.parentNode) {
        this.blueSquare.parentNode.removeChild(this.blueSquare);
        this.blueSquare = null;
      }

    } catch (e) {
      // Cleanup on error or abort
      if (this.blueSquare && this.blueSquare.parentNode) {
        this.blueSquare.parentNode.removeChild(this.blueSquare);
        this.blueSquare = null;
      }

      if (e.name !== 'AbortError') {
        console.error("Error in ColorDarkBlue:", e);
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

window.ModuleName = ColorDarkBlue;
