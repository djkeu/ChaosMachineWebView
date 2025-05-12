class ColorDarkOrange {
    constructor() {
        this.name = 'color_dark_orange';
        this.shouldStop = false;
        this.orangeSquare = null;
        this.cleanup = null;
    }

    async execute(machine) {
        this.shouldStop = false;
        // Use the utility from the namespace
        const randomTopPosition = ChaosMachineUtils.getRandomPercentage(20, 50);
        const randomLeftPosition = ChaosMachineUtils.getRandomPercentage(50, 70);
        const randomFontSize = ChaosMachineUtils.getRandomPercentage(100, 250);

        try {
            // Create red square
            this.orangeSquare = document.createElement('div');
            this.orangeSquare.style.position = 'fixed';
            this.orangeSquare.style.top = randomTopPosition;
            this.orangeSquare.style.left = randomLeftPosition;
            this.orangeSquare.style.transform = 'translate(-50%, -50%)';
            this.orangeSquare.style.width = '6em';
            this.orangeSquare.style.height = '5.5em';
            this.orangeSquare.style.backgroundColor = 'darkorange';
            this.orangeSquare.textContent = "dark orange";
            this.orangeSquare.style.fontSize = randomFontSize;
            this.orangeSquare.style.display = "flex";
            this.orangeSquare.style.alignItems = "center";
            this.orangeSquare.style.justifyContent = "center";
            this.orangeSquare.style.fontWeight = "bold";

            // Add to output
            machine.output.appendChild(this.orangeSquare);

            // Setup cleanup function
            this.cleanup = () => {
                if (this.orangeSquare && this.orangeSquare.parentNode) {
                    this.orangeSquare.parentNode.removeChild(this.orangeSquare);
                    this.orangeSquare = null;
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
                console.error("Error in ColorDarkOrange:", e);
            }
        }
    }

    abort() {
        this.shouldStop = true;
        if (this.stopSignal) this.stopSignal();
    }
}

window.ModuleName = ColorDarkOrange;
