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
    
    // Total runtime in milliseconds (9 seconds for progress + 1 second for final 100%)
    const totalRuntimeMs = 9000; // Leave 1 second for the final display
    // Track accumulated time for ensuring total runtime
    let accumulatedTimeMs = 0;

    try {
      await machine.display("\n\tShow progress:\n\n");
      let percentage = 0;

      // Continue until we reach 100% or max runtime
      while (percentage < 100 && accumulatedTimeMs < totalRuntimeMs) {
        if (!machine.isRunning || this.shouldStop || signal.aborted) break;

        // Generate a random percentage increment between 1% and 40%
        const increment = 1 + Math.floor(Math.random() * 40);
        percentage = Math.min(99, percentage + increment); // Cap at 99% within the loop

        // Calculate wait time proportional to the percentage increment
        // (e.g., 20% increment = 1.8 seconds of the total 9 seconds)
        const waitTimeMs = (increment / 100) * totalRuntimeMs;
        accumulatedTimeMs += waitTimeMs;

        // Wait BEFORE displaying the percentage
        try {
          await this.chunkedDelay(waitTimeMs, 200, signal);
        } catch (e) {
          if (e.name === 'AbortError') break;
          throw e;
        }

        // Now display the percentage after waiting
        if (!machine.isRunning || this.shouldStop || signal.aborted) break;

        await machine.display(`\tProgress: ${Math.round(percentage)}%\n`);
      }

      // Display the final 100% message outside the loop, with a 1-second duration
      if (machine.isRunning && !this.shouldStop && !signal.aborted) {
        await machine.display("\nProgress: 100%\n\n");

        // Wait for 1 second with 100% showing
        try {
          await this.chunkedDelay(1000, 200, signal);
        } catch (e) {
          // Even if aborted, we've shown 100%
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
