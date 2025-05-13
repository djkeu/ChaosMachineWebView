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
    // If machine is not running and it's not the final stop message, don't add to buffer
    if (!this.isRunning && !text.includes("=== CHAOS MACHINE STOPPED ===")) {
      return;
    }

    this.outputBuffer.push(text);
    if (!this.isWriting) {
      // Store the promise so we can await it later if needed
      this.bufferFlushPromise = this.flushBuffer();
    }
  }

  async flushBuffer() {
    this.isWriting = true;
    // Always process the entire buffer, even when stopping
    // This ensures our final stop message is displayed
    while (this.outputBuffer.length > 0) {
      const text = this.outputBuffer.shift();
      this.output.textContent += text;
      this.output.scrollTop = this.output.scrollHeight;
      await this.delay(10); // Small delay between writes
    }
    this.isWriting = false;
  }

  delay(ms) {
    // Wrap setTimeout in a promise that can't be aborted to ensure
    // critical operations like buffer flushing complete
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async start() {
    if (this.isRunning) return;
    this.isRunning = true;

    try {
      await this.clearOutput();
      await this.display("\n=== CHAOS MACHINE STARTED ===\n");
      await this.delay(2000);
      this.runModules();
    } catch (e) {
      console.error("Error starting chaos machine:", e);
      this.isRunning = false;
    }
  }

  async runModules() {
    while (this.isRunning && this.modules.length > 0) {
      const module = this.modules[Math.floor(Math.random() * this.modules.length)];
      this.activeExecution = module;

      try {
        // Reset module stop flags
        module.shouldStop = false;
        if (module.abortController) {
          module.abortController = new AbortController();
        }

        // Clear and show module header
        if (!this.isRunning) break;
        await this.clearOutput();
        await this.delay(1000);

        if (!this.isRunning) break;
        await this.display(`--- Running ${module.name} ---`);
        await this.delay(2000);

        if (!this.isRunning) break;
        await this.clearOutput();
        await this.delay(2000);

        // Only execute if we're still running
        if (!this.isRunning) break;
        await module.execute(this);

      } catch (e) {
        if (e.name !== 'AbortError') {
          console.error(`Module ${module.name} failed:`, e);
        }
      } finally {
        // Always clean up
        this.activeExecution = null;
      }

      // Add delay between modules if still running
      if (this.isRunning) {
        await this.delay(1000);
      }
    }
  }

  async stop() {
    if (!this.isRunning) return;

    // Set flag first to prevent new operations from starting
    this.isRunning = false;

    // Signal active module to stop immediately
    if (this.activeExecution) {
      // First set flag
      this.activeExecution.shouldStop = true;

      // Then call abort method if available
      if (typeof this.activeExecution.abort === 'function') {
        try {
          this.activeExecution.abort();
        } catch (e) {
          console.error("Error aborting module:", e);
        }
      }
    }

    // Signal all modules to stop
    this.modules.forEach(m => {
      m.shouldStop = true;
      if (typeof m.abort === 'function') {
        try {
          m.abort();
        } catch (e) {
          // Ignore abort errors
        }
      }
    });

    try {
      // Wait for any pending buffer operations to complete
      await this.bufferFlushPromise;

      // Clear and show stop message
      await this.clearOutput();
      await this.display("\n=== CHAOS MACHINE STOPPED ===\n");

      // Final delay before completion
      await this.delay(2000);
    } catch (e) {
      console.error("Error during stop sequence:", e);
    }
  }
}
