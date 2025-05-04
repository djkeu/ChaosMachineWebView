// Begin: Template CodeBlock 1
// ToDo: replace ModuleName
// ToDo: replace this.name
class RedAndBlue {
    constructor() {
      this.name = 'red_blue';
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
        let testVar = document.getElementById("output");
        testVar.style.backgroundColor = "red";
        testVar.style.fontSize = "xx-large";

        await machine.display("\n\n\n\n\n\n\n\n\n\tRed\n\n\n\n\n");
        await this.chunkedDelay(2500, 500, signal);

        testVar.style.backgroundColor = "blue";

        await machine.display("\n\tBlue\n\n\n\n\n\n\n\n");
        await this.chunkedDelay(2500, 500, signal);

        testVar.style.backgroundColor = "var(--output-bg)";
        testVar.style.fontSize = "var(--font-base";

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
window.ModuleName = RedAndBlue;
// End: Template CodeBlock 2
