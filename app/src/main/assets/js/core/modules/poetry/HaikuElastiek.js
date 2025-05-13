// HaikuElastiek.js
class HaikuElastiek {
  constructor() {
    this.name = 'haiku_elastiek';
    this.shouldStop = false;
    this.abortController = new AbortController();
  }

  async execute(machine) {
    this.shouldStop = false;
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    const lines = [
      "\n\n\truim zittende broek",
      "\n\n\tsokken zonder elastiek",
      "\n\n\thet goede leven"
    ];

    for (const line of lines) {
      // Check if we should stop before displaying or delaying
      if (!machine.isRunning || this.shouldStop || signal.aborted) break;

      // Atomic display through the machine
      await machine.display(line);

      // Check again before the delay
      if (!machine.isRunning || this.shouldStop || signal.aborted) break;

      // Chunked delay with abort check
      try {
        await this.chunkedDelay(2500, 500, signal);
      } catch (e) {
        // Break out of the loop on abort, but don't throw further
        if (e.name === 'AbortError') break;
        throw e; // Re-throw unexpected errors
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
        console.error("Error aborting HaikuElastiek:", e);
      }
    }
  }
}
window.HaikuElastiek = HaikuElastiek;
