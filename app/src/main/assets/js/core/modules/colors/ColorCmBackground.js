class ColorChaosMachineBackground {
  constructor() {
    this.name = 'color_background';
    this.shouldStop = false;
    this.coloredSquare = null;
    this.abortController = new AbortController();

    // Hardcoded color palette
    this.colors = [
      'darkblue',
      'darkgreen',
      'darkorange',
      'darkred',
      '#006D5B',  // Default Chaos Machine background
      '#1E3A3A',  // Output element background color
      '#4682B4',  // steelblue
      '#2E8B57'   // seagreen
    ];
  }

  async execute(machine) {
    this.shouldStop = false;
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    try {
      // Get random positions and color
      const randomTopPosition = ChaosMachineUtils.getRandomNumber(20, 80);
      const randomLeftPosition = ChaosMachineUtils.getRandomNumber(30, 70);
      const randomFontSize = ChaosMachineUtils.getRandomNumber(50, 150);
      const randomBorderRadius = ChaosMachineUtils.getRandomNumber(30,50);
      const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];

      // Create and style the square
      this.coloredSquare = document.createElement('div');
      Object.assign(this.coloredSquare.style, {
        position: 'absolute',
        top: `${randomTopPosition}%`,
        left: `${randomLeftPosition}%`,
        transform: 'translate(-50%, -50%)',
        border: '0.2em solid grey',
        borderRadius: `${randomBorderRadius}%`,
        width: '6em',
        height: '5.5em',
        color: 'white',
        backgroundColor: randomColor,
        fontSize: `${randomFontSize}%`,
        display: 'flex',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        zIndex: '10',
        cursor: 'pointer'
      });

      // Click handler changes body background
      this.coloredSquare.addEventListener('click', () => {
        document.body.style.backgroundColor = randomColor;
        console.log(`Changed background to ${randomColor}`);
      });

      // Add to DOM and animate
      machine.output.appendChild(this.coloredSquare);
      await this.chunkedDelay(1000, 100, signal);

      this.coloredSquare.textContent = 'Click me';
      await this.chunkedDelay(3500, 100, signal);

      // Cleanup
      if (this.coloredSquare?.parentNode) {
        this.coloredSquare.parentNode.removeChild(this.coloredSquare);
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.error("Error in RandomColor:", e);
      }
      if (this.coloredSquare?.parentNode) {
        this.coloredSquare.parentNode.removeChild(this.coloredSquare);
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
    this.abortController?.abort();
  }
}

window.ModuleName = ColorChaosMachineBackground;
