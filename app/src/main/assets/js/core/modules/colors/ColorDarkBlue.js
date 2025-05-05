// Begin: Template CodeBlock 1
class ColorDarkBlue {
    constructor() {
      this.name = 'color_dark_blue';
      this.shouldStop = false;
      this.abortController = null;
    }

    async execute(machine) {
      this.shouldStop = false;
      this.abortController = new AbortController();
      const signal = this.abortController.signal;
// End: Template CodeBlock 1

// Begin Module code

      try {
        let testVar = document.getElementById("output");
        testVar.style.backgroundColor = "darkblue";
        // testVar.outerHTML="<div style='background-color: brown'>Blue blue</div>"

        await machine.display("\n\n\n\n\n\n\n\n\n\n\n\n\n");
        await this.chunkedDelay(1500, 500, signal);

        testVar.style.fontSize = "3em";
        await machine.display("\n\n\n\n\n\tDarkBlue\n\n\n\n\n\n\n\n");
        await this.chunkedDelay(2500, 500, signal);

        testVar.style.fontSize = "var(--font-base";
        testVar.style.backgroundColor = "var(--output-bg)";

      } catch (e) {
        if (e.name !== 'AbortError') {
          console.error("Error:", e);
        }
      }
// End Module code

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
window.ModuleName = ColorDarkBlue;
// End: Template CodeBlock 2
