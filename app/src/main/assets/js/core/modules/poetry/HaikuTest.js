// Begin: Template CodeBlock 1
// ToDo: replace ModuleName
// ToDo: replace this.name
class ModuleName {
    constructor() {
      this.name = 'show_progress';
      this.shouldStop = false;
      this.abortController = null;
    }

    async execute(machine) {
      this.shouldStop = false;
      this.abortController = new AbortController();
      const signal = this.abortController.signal;
// End: Template CodeBlock 1

// ToDo: Begin Module code
      try {
        await machine.display("\n\tThis is a module template\n");

      } catch (e) {
        if (e.name !== 'AbortError') {
          console.error("Error:", e);
        }
      }
// ToDo: End Module code

// Begin: Template CodeBlock 2
    }  // end execute(machine)

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
// ToDo: replace ModuleName
window.ModuleName = ModuleName;
// End: Template CodeBlock 2
