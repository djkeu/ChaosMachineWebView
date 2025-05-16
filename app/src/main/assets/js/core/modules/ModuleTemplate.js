// Begin: Module Container CodeBlock 1
// ToDo: rename: class ModuleName
// ToDo: rename: this.name = 'module_name';
class ModuleName {
    constructor() {
      this.name = 'module_name';
      this.shouldStop = false;
      this.abortController = new AbortController();
    }

    async execute(machine) {
      this.shouldStop = false;
      this.abortController = new AbortController();  // reset abortController
      const signal = this.abortController.signal;
// End: Module Container CodeBlock 1

// Begin: Module Example
      try {
        await machine.display("\n\tThis is a module example\n");

      } catch (e) {
        if (e.name !== 'AbortError') {
          console.error("Error:", e);
        }
      }
// End: Module Example

// Begin: Module Container CodeBlock 2
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
      if (this.abortController) {
        try {
          this.abortController.abort();
        } catch (e) {
          console.error(`Error aborting ${this.name}:`, e);
        }
      }
    }
  }

// ToDo: rename ModuleName
window.ModuleName = ModuleName;
// End: Module Container CodeBlock 2
