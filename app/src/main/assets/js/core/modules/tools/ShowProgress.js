// ShowProgress.js
class ShowProgress {
  constructor() {
    this.name = 'show_progress';
    this.shouldStop = false;
    this.abortController = new AbortController();
  }

  async execute(machine) {
    this.shouldStop = false;
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    try {
      await machine.display("\n--- Running show_progress ---\n\tShow progress:\n");
      let percentage = 0;

      while (percentage < 100) {
        // Check stop conditions at the start of each iteration
        if (!machine.isRunning || this.shouldStop || signal.aborted) break;

        percentage = Math.min(100, percentage + Math.random() * 15 + 3);
        await machine.display(`\tProgress: ${Math.round(percentage)}%\n`);

        // Check again before delay
        if (!machine.isRunning || this.shouldStop || signal.aborted) break;

        try {
          await this.chunkedDelay(800 + Math.random() * 1200, 200, signal);
        } catch (e) {
          if (e.name === 'AbortError') break;
          throw e;
        }
      }

      // Final 100% message if not aborted and we reached 100%
      if (machine.isRunning && !this.shouldStop && !signal.aborted && percentage >= 100) {
        await machine.display("\nProgress: 100%\n\n");
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.error("Progress error:", e);
      }
    }
  }

  async chunkedDelay(totalMs, chunkMs, signal) {
    const chunks = Math.ceil(totalMs / chunkMs);
    for (let i = 0; i < chunks; i++) {
      // Check abort conditions on each small chunk
      if (!signal || signal.aborted || this.shouldStop) {
        throw new Error('AbortError');
      }

      // Wait for a small chunk of time
      await new Promise(r => setTimeout(r, Math.min(chunkMs, totalMs - i * chunkMs)));
    }
  }

  abort() {
    this.shouldStop = true;
    if (this.abortController) {
      try {
        this.abortController.abort();
      } catch (e) {
        console.error("Error aborting ShowProgress:", e);
      }
    }
  }
}
window.ShowProgress = ShowProgress;
