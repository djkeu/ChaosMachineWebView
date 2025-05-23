class RandomColor {
  constructor() {
    this.name = 'random_colored_square';
    this.shouldStop = false;
    this.coloredSquare = null;
    this.abortController = new AbortController();
    this.colors = [];
  }

  async loadColors() {
    try {
      const response = await fetch('colors.txt');
      if (!response.ok) throw new Error('Failed to load colors');
      const text = await response.text();
      this.colors = text.split('\n')
                        .map(color => color.trim())
                        .filter(color => {
                          // Keep the line if it's either:
                          // 1. A valid CSS color name (we'll check this when used)
                          // 2. A valid hex color (starts with # and has 3, 4, 6, or 8 hex digits)
                          return color.length > 0 && 
                                (/^#[0-9A-Fa-f]{3,8}$/.test(color) || 
                                 /^[a-zA-Z]+$/.test(color));
                        });
      
      if (this.colors.length === 0) {
        this.colors = ['darkblue', 'darkgreen', 'darkorange', 'darkred', '#006D5B'
];
      }
    } catch (error) {
      console.error('Error loading colors, using defaults:', error);
      this.colors = ['darkblue', 'darkgreen', 'darkorange', 'darkred', '#006D5B'
];
    }
  }

  async execute(machine) {
    this.shouldStop = false;
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    await this.loadColors();

    try {
      const randomTopPosition = ChaosMachineUtils.getRandomNumber(20, 50);
      const randomLeftPosition = ChaosMachineUtils.getRandomNumber(30, 50);
      const randomFontSize = ChaosMachineUtils.getRandomNumber(100, 250);
      const randomColorIndex = Math.floor(ChaosMachineUtils.getRandomNumber(0, this.colors.length));
      const randomColor = this.colors[randomColorIndex];

      // Create colored square
      this.coloredSquare = document.createElement('div');
      this.coloredSquare.style.position = 'absolute';
      this.coloredSquare.style.top = `${randomTopPosition}%`;
      this.coloredSquare.style.left = `${randomLeftPosition}%`;
      this.coloredSquare.style.transform = 'translate(-50%, -50%)';
      this.coloredSquare.style.width = '6em';
      this.coloredSquare.style.height = '5.5em';
      this.coloredSquare.style.color = 'white';
      this.coloredSquare.style.backgroundColor = randomColor;
      this.coloredSquare.style.fontSize = `${randomFontSize}%`;
      this.coloredSquare.style.display = "flex";
      this.coloredSquare.style.textAlign = 'center';
      this.coloredSquare.style.alignItems = "center";
      this.coloredSquare.style.justifyContent = "center";
      this.coloredSquare.style.fontWeight = "bold";
      this.coloredSquare.style.zIndex = "10";

      // Make square clickable
      this.coloredSquare.style.cursor = "pointer";
      this.coloredSquare.addEventListener('click', () => {
        document.documentElement.style.setProperty('--background', randomColor);        console.log(`Changed body color to ${randomColor}`);
      });

      machine.output.appendChild(this.coloredSquare);
      await this.chunkedDelay(2000, 100, signal);

      this.coloredSquare.textContent = 'Click me';
      await this.chunkedDelay(2500, 100, signal);

      // Cleanup at the end of normal execution
      if (this.coloredSquare && this.coloredSquare.parentNode) {
        this.coloredSquare.parentNode.removeChild(this.coloredSquare);
        this.coloredSquare = null;
      }

    } catch (e) {
      if (this.coloredSquare && this.coloredSquare.parentNode) {
        this.coloredSquare.parentNode.removeChild(this.coloredSquare);
        this.coloredSquare = null;
      }

      if (e.name !== 'AbortError') {
        console.error("Error in RandomColor:", e);
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

window.ModuleName = RandomColor;
