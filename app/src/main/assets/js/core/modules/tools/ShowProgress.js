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
    
    // 9 seconds for progress loop
    const totalRuntimeMs = 9000;
    let accumulatedTimeMs = 0;

    try {
      await machine.display("\n\tShow progress:\n\n");
      let percentage = 0;

      // Continue until 100% or max runtime
      while (percentage < 100 && accumulatedTimeMs < totalRuntimeMs) {
        if (!machine.isRunning || this.shouldStop || signal.aborted) break;

        // Random percentage increment
        const increment = 1 + Math.floor(Math.random() * 40);
        percentage = Math.min(99, percentage + increment);

        // Calculate wait time proportional to percentage increment
        const waitTimeMs = (increment / 100) * totalRuntimeMs;
        accumulatedTimeMs += waitTimeMs;

        // Wait before display of progress percentage
        try {
          await this.chunkedDelay(waitTimeMs, 200, signal);
        } catch (e) {
          if (e.name === 'AbortError') break;
          throw e;
        }

        // Display progress percentage
        if (!machine.isRunning || this.shouldStop || signal.aborted) break;

        await machine.display(`\tProgress: ${Math.round(percentage)}%\n`);
      }

      // Display 100% conclusion for 1 second
      if (machine.isRunning && !this.shouldStop && !signal.aborted) {
        await machine.display("\nProgress: 100%\n\n");

        try {
          await this.chunkedDelay(1000, 200, signal);
        } catch (e) {
          // Show 100% even if aborted
        }
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
      if (!signal || signal.aborted || this.shouldStop) {
        throw new Error('AbortError');
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
        console.error("Error aborting ShowProgress:", e);
      }
    }
  }
}
