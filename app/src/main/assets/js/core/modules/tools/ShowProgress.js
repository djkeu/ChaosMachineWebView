class ShowProgress {
  constructor() {
    this.name = 'show_progress';
    this.shouldStop = false;
    this.abortController = null;
  }

  async execute(machine) {
    this.shouldStop = false;
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    try {
      await machine.display("\n\tShow progress:\n");
      let percentage = 0;

      while (percentage < 100 && !signal.aborted && !this.shouldStop) {
        percentage = Math.min(100, percentage + Math.random() * 15 + 3);
        if (percentage <= 99.5) {
          await machine.display(`\tProgress: ${Math.round(percentage)}%\n`);

          await this.chunkedDelay(800 + Math.random() * 100, 200, signal);
        }
      }

      if (!signal.aborted && !this.shouldStop) {
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
      if (this.shouldStop || signal.aborted) throw new Error('AbortError');
      await new Promise(r => setTimeout(r, Math.min(chunkMs, totalMs - i * chunkMs)));
    }
  }

  abort() {
    this.shouldStop = true;
    if (this.abortController) this.abortController.abort();
  }
}
window.ShowProgress = ShowProgress;
