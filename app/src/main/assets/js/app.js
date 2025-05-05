class ChaosApp {
    constructor() {
        this.machine = null;
        this.init();
    }

    init() {
        try {
            this.machine = new ChaosMachine(document.getElementById('output'));

            // Register modules
            [
            new HaikuElastiek(),
            new HaikuMat(),
            new ShowProgress(),
            new ColorDarkRed(),
            new ColorDarkBlue()
            ]
                .forEach(m => this.machine.registerModule(m));

            // Get buttons
            this.startBtn = document.getElementById('startBtn');
            this.stopBtn = document.getElementById('stopBtn');

            // Setup controls
            this.startBtn.addEventListener('click', () => this.startChaos());
            this.stopBtn.addEventListener('click', () => this.stopChaos());

            // Initial state
            this.stopBtn.disabled = true;

            // Auto-start
            this.startChaos();

        } catch (error) {
            console.error("Initialization failed:", error);
        }
    }

    async startChaos() {
        this.startBtn.disabled = true;
        this.stopBtn.disabled = false;
        await this.machine.start();
    }

    async stopChaos() {
        this.stopBtn.disabled = true;
        this.startBtn.disabled = false;
        await this.machine.stop();
    }
}

document.addEventListener('DOMContentLoaded', () => new ChaosApp());
