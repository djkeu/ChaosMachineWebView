class ChaosMachine {
  constructor(outputElement) {
    this.output = outputElement;
    this.isRunning = false;
    this.modules = [];
    this.activeExecution = null;
    this.outputBuffer = [];
    this.isWriting = false;
  }

  registerModule(module) {
    this.modules.push(module);
  }

  async display(text) {
    this.outputBuffer.push(text);
    if (!this.isWriting) {
      this.flushBuffer();
    }
  }

  async flushBuffer() {
    this.isWriting = true;
    while (this.outputBuffer.length > 0) {
      const text = this.outputBuffer.shift();
      this.output.textContent += text;
      this.output.scrollTop = this.output.scrollHeight;
      await this.delay(10); // Small delay between writes
    }
    this.isWriting = false;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async start() {
    if (this.isRunning) return;
    this.isRunning = true;
    await this.display("\n=== CHAOS MACHINE STARTED ===\n");
    this.runModules();
  }

  async runModules() {
    while (this.isRunning && this.modules.length > 0) {
      const module = this.modules[Math.floor(Math.random() * this.modules.length)];
      this.activeExecution = module;
      try {
        await this.display(`\n--- Running ${module.name} ---\n`);
        await module.execute(this);
      } catch (e) {
        if (e.name !== 'AbortError') { // Don't log abort errors
          console.error(`Module ${module.name} failed:`, e);
        }
      }
      this.activeExecution = null;
      if (this.isRunning) {
        await this.delay(1000);
      }
    }
  }

  async stop() {
    if (!this.isRunning) return;
    this.isRunning = false;

    // Signal active module to stop immediately
    if (this.activeExecution) {
      if (typeof this.activeExecution.abort === 'function') {
        this.activeExecution.abort();
      }
      this.activeExecution.shouldStop = true;
    }

    // Signal all modules to stop
    this.modules.forEach(m => m.shouldStop = true);

    // Direct output for stop message
    await this.display("\n=== CHAOS MACHINE STOPPED ===\n");
  }
}
