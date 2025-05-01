class HaikuMat {
  constructor() {
    this.name = 'haiku_mat';
    this.shouldStop = false;
    this.abortController = null;
  }

  async execute(machine) {
    this.shouldStop = false;
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    const lines = [
      "\n\n\tmat in drie zetten",
      "\n\n\tverslagen in drie zinnen",
      "\n\n\tzinnen en zetten\n\n"
    ];

    for (const line of lines) {
      if (!machine.isRunning || this.shouldStop || signal.aborted) break;

      // Atomic display
      await machine.display(line);

      // Chunked delay with abort check
      try {
        await this.chunkedDelay(2500, 500, signal);
      } catch (e) {
        if (e.name === 'AbortError') break;
        throw e; // Re-throw unexpected errors
      }
    }
  }

  async chunkedDelay(totalMs, chunkMs, signal) {
    const chunks = Math.ceil(totalMs / chunkMs);
    for (let i = 0; i < chunks; i++) {
      if (this.shouldStop || signal.aborted) throw new Error('AbortError');
      await new Promise(r => setTimeout(r, Math.min(chunkMs, totalMs - i * chunkMs)));
    }
  }

  abort() {
    this.shouldStop = true;
    if (this.abortController) this.abortController.abort();
  }
}
window.HaikuMat = HaikuMat;
