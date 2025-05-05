class ChaosMachine {
  constructor(outputElement) {
    this.output = outputElement;
    this.isRunning = false;
    this.modules = [];
    this.activeExecution = null;
    this.outputBuffer = [];
    this.isWriting = false;
    this.bufferFlushPromise = Promise.resolve(); // Track buffer flushing
  }

  registerModule(module) {
    this.modules.push(module);
  }

  async clearOutput() {
    // Wait for any pending writes to complete
    await this.bufferFlushPromise;
    this.outputBuffer = []; // Clear pending buffer
    this.output.textContent = ''; // Clear immediately
  }

  async display(text) {
    this.outputBuffer.push(text);
    if (!this.isWriting) {
      this.bufferFlushPromise = this.flushBuffer();
    }
  }

  async flushBuffer() {
    this.isWriting = true;
    while (this.outputBuffer.length > 0 && this.isRunning) {
      const text = this.outputBuffer.shift();
      this.output.textContent += text;
      this.output.scrollTop = this.output.scrollHeight;
      await this.delay(10);
    }
    this.isWriting = false;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async start() {
    if (this.isRunning) return;
    this.isRunning = true;
    await this.clearOutput();
    await this.display("\n=== CHAOS MACHINE STARTED ===\n");
    this.runModules();
  }

  async runModules() {
    while (this.isRunning && this.modules.length > 0) {
      const module = this.modules[Math.floor(Math.random() * this.modules.length)];
      this.activeExecution = module;
      try {
        // Clear and show module header
        await this.clearOutput();
        await this.delay(1000);
        await this.display(`--- Running ${module.name} ---`);

        // Wait 1 second with header visible
        await this.delay(2000);

        // Clear again before module execution
        await this.clearOutput();
        await this.delay(1000);

        // Execute module with clean slate
        await module.execute(this);

      } catch (e) {
        if (e.name !== 'AbortError') {
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

    // Wait for any pending operations
    await this.bufferFlushPromise;
    await this.clearOutput();
    await this.display("\n=== CHAOS MACHINE STOPPED ===\n");
  }
}