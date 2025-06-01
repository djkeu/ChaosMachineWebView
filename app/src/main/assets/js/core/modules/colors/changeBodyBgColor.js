class ChangeBodyBgColor {
  constructor() {
    this.name = 'color_background';
    this.shouldStop = false;
    this.colorChangeBtn = null;
    this.abortController = new AbortController();
    this.colors = []; // Will be loaded from file
  }

  async loadColors() {
    try {
      // Android interface loading
      const colorsText = Android.loadAssetFile('js/core/modules/colors/colors.txt');

      this.colors = colorsText.split('\n')
        .map(color => color.trim())
        .filter(color => color.length > 0 && (color.startsWith('#') || /^[a-zA-Z]+$/.test(color)));

      if (this.colors.length === 0) throw new Error("No valid colors found");

      console.log("Loaded colors successfully:", this.colors.length, "colors");

    } catch (error) {
      console.warn("Using fallback colors due to:", error.message);
      this.colors = ['#FF0000', '#00FF00', '#0000FF']; // RGB fallback
    }
  }

  async execute(machine) {
    this.shouldStop = false;
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    // Load colors first
    await this.loadColors();

    try {
      // Check if ChaosMachineUtils exists, otherwise use fallback
      const utils = window.ChaosMachineUtils || window.ChaosMachine?.utils;

      let randomTopPosition, randomLeftPosition, randomFontSize, randomBorderRadius;

      randomTopPosition = utils.getRandomNumber(20, 80);
      randomLeftPosition = utils.getRandomNumber(30, 70);
      randomFontSize = utils.getRandomNumber(70, 140);
      randomBorderRadius = utils.getRandomNumber(0, 50);

      const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
      console.log(`Selected color: ${randomColor}`);

      // Create and style the square
      this.colorChangeBtn = document.createElement('div');
      Object.assign(this.colorChangeBtn.style, {
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
      this.colorChangeBtn.addEventListener('click', () => {
        document.body.style.backgroundColor = randomColor;
        console.log(`Changed background to ${randomColor}`);
      });

      // Add to DOM and animate (with your custom timing)
      machine.output.appendChild(this.colorChangeBtn);
      await this.chunkedDelay(1000, 100, signal);

      this.colorChangeBtn.textContent = 'Click me';
      await this.chunkedDelay(3500, 100, signal);

      // Cleanup
      if (this.colorChangeBtn?.parentNode) {
        this.colorChangeBtn.parentNode.removeChild(this.colorChangeBtn);
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.error("Error in ChangeBodyBgColor:", e);
      }
      if (this.colorChangeBtn?.parentNode) {
        this.colorChangeBtn.parentNode.removeChild(this.colorChangeBtn);
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

window.ModuleName = ChangeBodyBgColor;
