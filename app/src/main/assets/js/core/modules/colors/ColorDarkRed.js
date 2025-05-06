class ColorDarkRed {
    constructor() {
        this.name = 'color_dark_red';
        this.shouldStop = false;
        this.redSquare = null;
        this.cleanup = null;
    }

    async execute(machine) {
        this.shouldStop = false;
        const leftPosition = getRandomPercentage(50, 70); // No import needed

        try {
            // Create red square
            this.redSquare = document.createElement('div');
            this.redSquare.style.position = 'fixed';
            this.redSquare.style.top = '80%';
            this.redSquare.style.left = leftPosition;
            this.redSquare.style.transform = 'translate(-50%, -50%)';
            this.redSquare.style.width = '200px';
            this.redSquare.style.height = '200px';
            this.redSquare.style.backgroundColor = 'darkred';

            this.redSquare.textContent = "dark red";
            // this.redSquare.style.color = "white";  // Make text visible
            this.redSquare.style.fontSize = "200%";
            this.redSquare.style.display = "flex";
            this.redSquare.style.alignItems = "center";
            this.redSquare.style.justifyContent = "center";
            this.redSquare.style.fontWeight = "bold";

            // Add to output
            machine.output.appendChild(this.redSquare);

            // Setup cleanup function
            this.cleanup = () => {
                if (this.redSquare && this.redSquare.parentNode) {
                    this.redSquare.parentNode.removeChild(this.redSquare);
                    this.redSquare = null;
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
                console.error("Error in ColorDarkRed:", e);
            }
        }
    }

    abort() {
        this.shouldStop = true;
        if (this.stopSignal) this.stopSignal();
    }
}
window.ModuleName = ColorDarkRed;
