/* Shared navigation + small UX helpers, injected on every page. */
(function () {
  // favicon (applies to every page without editing 17 <head>s)
  if (!document.querySelector('link[rel="icon"]')) {
    const fav = document.createElement("link");
    fav.rel = "icon"; fav.type = "image/svg+xml"; fav.href = "logo.svg";
    document.head.appendChild(fav);
  }

  const PAGES = [
    { group: "Start here", items: [
      { href: "index.html",          num: "00", title: "Introduction" },
      { href: "device.html",         num: "01", title: "The device" },
      { href: "history.html",        num: "02", title: "How it was cracked" },
    ]},
    { group: "Talk to the hardware", items: [
      { href: "bootloader.html",     num: "03", title: "Bootloader & flashing" },
      { href: "protocol.html",       num: "04", title: "The wire protocol" },
    ]},
    { group: "Build firmware", items: [
      { href: "build.html",          num: "05", title: "Zephyr build environment" },
      { href: "bsp.html",            num: "06", title: "The sp1-midi BSP" },
      { href: "audio.html",          num: "07", title: "Audio engine & format" },
    ]},
    { group: "Deep dives", items: [
      { href: "codecs.html",         num: "08", title: "Codecs & I²S: make sound" },
      { href: "power.html",          num: "09", title: "Power & lifecycle" },
      { href: "recovery.html",       num: "10", title: "Debug & recovery" },
      { href: "internals.html",      num: "11", title: "Player internals" },
    ]},
    { group: "Put it together", items: [
      { href: "lab.html",            num: "12", title: "Your first firmware" },
      { href: "looper.html",         num: "13", title: "Case study: tape looper" },
    ]},
    { group: "Reference", items: [
      { href: "state.html",          num: "14", title: "Who has built what" },
      { href: "accuracy.html",       num: "15", title: "Don't hallucinate" },
      { href: "reference.html",      num: "16", title: "Sources & cheat-sheet" },
      { href: "wiki.html",           num: "17", title: "TimK's dev wiki" },
      { href: "glossary.html",       num: "18", title: "Glossary" },
    ]},
  ];

  const here = location.pathname.split("/").pop() || "index.html";

  let nav = `<div class="brand">
      <img class="logo logo-dark" src="logo.svg" alt="SP-1 stem player" width="28" height="38">
      <img class="logo logo-light" src="logo-light.svg" alt="SP-1 stem player" width="30" height="38">
      <div>
        <div class="t1">SP&#8209;1 FIRMWARE</div>
        <div class="t2">dev field guide</div>
      </div>
      <div class="brand-actions">
        <a id="print-link" class="brand-btn" href="print.html" aria-label="Print-friendly version" title="Print-friendly"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="7" rx="1"/></svg></a>
        <button id="theme-toggle" class="brand-btn" type="button" aria-label="Toggle light/dark theme"></button>
      </div>
    </div>`;

  for (const g of PAGES) {
    nav += `<div class="group"><div class="group-label">${g.group}</div>`;
    for (const it of g.items) {
      const active = it.href === here ? " active" : "";
      nav += `<a class="${active.trim()}" href="${it.href}"><span class="num">${it.num}</span><span>${it.title}</span></a>`;
    }
    nav += `</div>`;
  }
  nav += `<div class="nav-foot">
      Built from the <code>sp-1</code> reference skill, synthesis date <strong>2026&#8209;05&#8209;18</strong>.
      Every claim is cited. The Discord moves fast — verify "current state" questions live.
    </div>`;

  const navEl = document.getElementById("nav");
  if (navEl) navEl.innerHTML = nav;

  // mobile toggle
  const btn = document.getElementById("menu-btn");
  if (btn) btn.addEventListener("click", () => navEl.classList.toggle("open"));
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 900 && navEl && navEl.classList.contains("open")) {
      if (!navEl.contains(e.target) && e.target !== btn) navEl.classList.remove("open");
    }
  });

  /* ---------------- Theme toggle (light / dark) ----------------
     The chosen theme is applied before paint by a tiny inline <head>
     script on every page; this just wires the button + persistence. */
  (function () {
    const root = document.documentElement;
    const SUN = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.4"/><path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6"/></svg>';
    const MOON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 13.2A8.5 8.5 0 1 1 10.8 3.5a6.6 6.6 0 0 0 9.7 9.7z"/></svg>';
    const cur = () => (root.getAttribute("data-theme") === "light" ? "light" : "dark");
    const tbtn = document.getElementById("theme-toggle");
    if (!tbtn) return;
    const paint = () => {
      tbtn.innerHTML = cur() === "light" ? MOON : SUN;
      tbtn.title = cur() === "light" ? "Switch to dark" : "Switch to light";
    };
    paint();
    tbtn.addEventListener("click", () => {
      const next = cur() === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      paint();
    });
  })();

  // copy buttons on code blocks
  document.querySelectorAll("pre").forEach((pre) => {
    const b = document.createElement("button");
    b.className = "copy-btn"; b.textContent = "copy";
    b.addEventListener("click", () => {
      const code = pre.querySelector("code");
      navigator.clipboard.writeText(code ? code.innerText : pre.innerText).then(() => {
        b.textContent = "copied"; setTimeout(() => (b.textContent = "copy"), 1400);
      });
    });
    pre.appendChild(b);
  });

  /* ---------------- Glossary tooltips ----------------
     Auto-wrap the FIRST occurrence of each term on a page in an <abbr.gl>
     with a hover/focus definition. Skips code, headings, links, tables, SVG. */
  const GLOSSARY = {
    "nrf52840": "Nordic Cortex-M4F system-on-chip at the heart of the SP-1 — 1 MB flash, 256 KB RAM, runs your firmware.",
    "soc": "System-on-chip: the processor plus its peripherals on a single die.",
    "cortex-m4f": "The ARM CPU core in the nRF52840, with a hardware floating-point unit.",
    "approtect": "Nordic's flash read-protection bit. Blocks SWD from reading firmware until bypassed by a voltage glitch.",
    "emmc": "Embedded MMC — the SP-1's separate 4 GB flash chip that holds the audio, distinct from the nRF's own flash.",
    "i²s": "Inter-IC Sound: the serial bus that streams digital audio samples to the codecs.",
    "i²c": "A two-wire serial bus used to configure the codecs and read the charger.",
    "swd": "Serial Wire Debug — ARM's 2-wire debug port. The SP-1 has no factory header; you solder your own pads.",
    "cobs": "Consistent Overhead Byte Stuffing — frames packets so a 0x00 byte can safely mark the end.",
    "crc-8": "An 8-bit cyclic redundancy check: a small checksum that detects corrupted bytes.",
    "crc": "Cyclic redundancy check — a checksum used to detect corrupted data.",
    "cdc acm": "USB serial-port class. How the bootloader and the debug console appear to your computer.",
    "cdc": "USB Communications Device Class — presents the device as a serial port to the host.",
    "uac2": "USB Audio Class 2 — lets the device act as a USB sound card (the tape looper records audio this way).",
    "bsp": "Board Support Package — the board definition plus drivers that make Zephyr target the SP-1.",
    "dts": "Device tree source — declares the board's pins and peripherals to Zephyr.",
    "device tree": "A declarative description of the board's pins and peripherals that Zephyr builds against.",
    "kconfig": "Zephyr's build-time configuration system — the options you set in prj.conf.",
    "smf": "Zephyr's State Machine Framework, used to structure the app's states.",
    "zephyr": "The real-time operating system the SP-1 custom firmware is built on.",
    "ppqn": "Pulses Per Quarter Note — MIDI clock resolution. The SP-1 uses 24 PPQN.",
    "midi": "Musical Instrument Digital Interface — note and clock messaging for music gear.",
    "varispeed": "Tape-style speed change that shifts pitch together with tempo.",
    "biquad": "A second-order IIR filter building block, used for EQ and the filter effect.",
    "lfo": "Low-Frequency Oscillator — a slow modulation source, e.g. sweeping a filter cutoff.",
    "butterworth": "A filter design with a maximally flat passband.",
    "decimation": "Lowering the sample rate by keeping 1 of every N samples — halves flash bandwidth here.",
    "decimated": "Reduced in sample rate by keeping 1 of every N samples.",
    "spsc": "Single-producer / single-consumer — a lock-free ring buffer with one writer and one reader.",
    "ring buffer": "A fixed-size circular buffer. The streamer keeps it filled ahead of the audio reader.",
    "watchdog": "A timer that reboots the device if firmware stops feeding it — the anti-hang backstop.",
    "gpregret": "An nRF retention register preserved across resets; the bootloader can check it.",
    "fpc": "Flexible printed cable — the fragile ribbon linking the button/LED face to the main board.",
    "zif": "Zero-insertion-force connector — the latch that clamps the FPC ribbon.",
    "bq24232": "TI single-cell LiPo charger IC, controlled purely by GPIO (no I²C).",
    "cs42l42": "Cirrus headphone codec (I²C 0x48). It also masters the audio frame clock.",
    "tas2505": "TI mono speaker amplifier with built-in DSP (I²C 0x18).",
    "cybt-353027-02": "Cypress UART-attached Bluetooth module. The nRF's own radio is unused.",
    "pll": "Phase-locked loop — generates a stable clock. The CS42L42's PLL must lock before audio plays.",
    "bclk": "I²S bit clock.",
    "lrclk": "I²S left/right (frame) clock — generated by the CS42L42 on the SP-1.",
    "mclk": "A codec's master clock; disabled on the nRF here (external-clock mode).",
    "sdout": "I²S serial data out — the sample stream from the nRF to the codecs.",
    "asp": "Audio Serial Port — the CS42L42's I²S interface registers.",
    "gpio": "General-purpose I/O pin.",
    "pwm": "Pulse-width modulation — used here to dim the LEDs.",
    "saadc": "The nRF's successive-approximation ADC — reads the faders, button ladders, and battery.",
    "adc": "Analog-to-digital converter — turns a voltage (fader, battery) into a number.",
    "bootloader": "The 128 KB program in the first flash region that flashes your firmware (Track 1 + 4 trigger).",
    "mass-erase": "Wiping all flash via SWD. Allowed even with APPROTECT set, but it erases the original firmware.",
    "app slot": "The 892 KB application region at 0x20000 where your firmware lives.",
    "slot 0": "The application flash region at 0x20000 — where custom firmware is written.",
    "fire-and-forget": "Sending packets without waiting for an acknowledgement (the album-upload path does this).",
    "stem": "One isolated track of a song (vocals, drums, …). The SP-1 mixes four.",
    "stems": "The isolated tracks of a song (vocals, drums, …) that the SP-1 mixes.",
    "ghidra": "An open-source reverse-engineering disassembler used to analyse the dumped firmware.",

    /* ---- expanded, lenient set: assume the reader may not know these ---- */
    "mcu": "Microcontroller unit — the processor chip (here the nRF52840) that runs the firmware.",
    "arm": "The CPU architecture family; the nRF52840 uses an ARM Cortex-M4 core.",
    "cortex-m4": "The 32-bit ARM CPU core inside the nRF52840.",
    "ram": "Volatile working memory — the nRF52840 has 256 KB; contents are lost on power off.",
    "flash": "Non-volatile memory that keeps data without power. The nRF has 1 MB internal; the SP-1 also has a separate 4 GB eMMC for audio.",
    "firmware": "The software that runs directly on the device's microcontroller.",
    "crystal": "A quartz timing element giving the MCU a precise high-frequency clock.",
    "oscillator": "A circuit that produces a clock signal; the SP-1's 3.072 MHz oscillator masters the audio bus.",
    "hfclk": "The nRF52840's high-frequency clock, sourced from an external crystal.",
    "lfclk": "The nRF52840's low-frequency clock, synthesized on-chip.",
    "thgbmng5d1lbail": "The Toshiba/Kioxia 4 GB eMMC 5.0 flash chip that stores the SP-1's audio.",
    "kioxia": "The flash-memory maker (formerly Toshiba Memory) of the SP-1's eMMC chip.",
    "codec": "Coder-decoder — a chip that converts between digital audio and analog (the CS42L42 here).",
    "dac": "Digital-to-analog converter — turns digital samples into the analog signal a speaker or headphone plays.",
    "amplifier": "A chip that boosts an audio signal to drive a speaker or headphones.",
    "amp": "Amplifier — boosts an audio signal to drive a speaker or headphones.",
    "li-ion": "Lithium-ion — the rechargeable battery chemistry, charged here by the BQ24232.",
    "lipo": "Lithium-polymer — a lithium rechargeable battery type.",

    "i2s": "Inter-IC Sound: the serial bus that streams digital audio samples to the codecs.",
    "i2c": "A two-wire serial bus used to configure the codecs and read the charger.",
    "twi": "Two-Wire Interface — Nordic's name for I²C.",
    "uart": "A simple two-wire (TX/RX) serial link; used here to configure the Bluetooth module.",
    "usb": "Universal Serial Bus — the USB-C port carries power and, on the SP-1, data for flashing and serial.",
    "usb-c": "The reversible USB connector on the SP-1, used for charging and data.",
    "spi": "Serial Peripheral Interface — a fast 4-wire serial bus; the looper drives the eMMC through the nRF's SPI engine.",
    "spim": "The nRF52840's hardware SPI-master peripheral.",
    "dma": "Direct Memory Access — hardware that moves data (e.g. audio buffers) without tying up the CPU.",
    "scl": "The clock line of the I²C bus.",
    "sda": "The data line of the I²C bus.",
    "sclk": "Serial clock — the I²S bit clock (also the eMMC/SPI clock).",
    "dout": "Data out — the I²S serial audio line from the nRF to the codecs.",
    "cmd": "The eMMC command line, carrying commands and a CRC7 to the flash chip.",
    "dat0": "The single data line used for the SP-1's 1-bit eMMC transfers.",
    "cts": "Clear To Send — a UART hardware flow-control line.",
    "rts": "Request To Send — a UART hardware flow-control line.",
    "asrc": "Asynchronous Sample-Rate Converter — a codec block that retimes audio between clock domains.",
    "acm": "Abstract Control Model — the USB-CDC flavour that makes the device look like a serial port.",

    "pcm": "Pulse-Code Modulation — plain, uncompressed digital audio samples.",
    "sample rate": "How many audio samples are captured per second (48 kHz on the SP-1).",
    "bit depth": "How many bits encode each audio sample (24-bit here) — sets the dynamic range.",
    "nyquist": "The rule that a sample rate can reproduce frequencies up to half its value (24 kHz at 48 kHz).",
    "stereo": "Two audio channels, left and right.",
    "mono": "A single audio channel.",
    "interleaved": "Storing several channels' bytes woven together rather than in separate runs.",
    "interleave": "To weave multiple channels' data together in memory or on disk.",
    "endian": "Byte order — which end of a multi-byte number is stored first.",
    "little-endian": "A byte order that stores the least-significant byte first.",
    "msb": "Most-significant byte or bit — the highest-value part of a number.",
    "lsb": "Least-significant byte or bit — the lowest-value part of a number.",
    "frame": "One sample across all channels at an instant; the SP-1's audio frame is 24 bytes (4 stereo stems).",
    "sector": "The SP-1's 8192-byte storage unit (16 eMMC blocks), holding 340 audio frames.",
    "block": "A subdivision of a sector — 2048 bytes / 85 frames on the SP-1 (or a native 512-byte eMMC block).",
    "trailer": "The reserved bytes at the end of each sector holding timing, tempo and LED data.",
    "prefetch": "Reading data off flash ahead of when it's needed, to hide access latency.",
    "read-ahead": "Filling a buffer ahead of the playhead so playback never waits on the flash.",
    "limiter": "A DSP stage that caps peak level so a stacked mix doesn't clip.",
    "clipping": "Distortion that happens when a signal exceeds the maximum level.",
    "quantization": "Rounding a continuous signal to discrete digital steps.",
    "dynamic range": "The span between the quietest and loudest a system can represent.",
    "headroom": "Spare level above the normal signal before it clips.",
    "transport": "The play / stop / fast-forward / rewind controls that move through the audio.",
    "overdub": "Recording a new layer on top of existing loop material.",
    "mixdown": "Combining multiple tracks into one — which the looper deliberately never stores.",
    "dsp": "Digital Signal Processing — math on audio samples (filters, distortion, and so on).",

    "rtos": "Real-Time Operating System — schedules tasks with timing guarantees (Zephyr here).",
    "mpu": "Memory Protection Unit — hardware that traps bad memory access to catch bugs.",
    "wdt": "Watchdog timer — resets the device if the firmware stops feeding it.",
    "isr": "Interrupt Service Routine — code that runs when a hardware interrupt fires.",
    "irq": "Interrupt request — a hardware signal that pre-empts the CPU to handle an event.",
    "stack": "The region of RAM holding a thread's function calls and locals; overflowing it crashes the device.",
    "linker": "The build step that places code and data at fixed addresses (e.g. the app at 0x20000).",
    "elf": "The compiler's output format, converted to a raw .bin for the bootloader.",
    "west": "Zephyr's command-line build and flash tool.",
    "cmake": "The build-system generator that Zephyr projects use.",
    "ninja": "The fast build tool Zephyr invokes under CMake.",
    "overlay": "A devicetree fragment that tweaks the board definition (e.g. the USB descriptors).",
    "pinctrl": "Zephyr's pin-configuration and multiplexing subsystem.",
    "hsm": "Hierarchical State Machine — nested states that structure the app logic.",
    "system_off": "The nRF's deepest sleep; on the SP-1 it hands control back to the bootloader.",
    "resetreas": "An nRF register recording why the last reset happened; cleared before returning to the bootloader.",
    "sys_poweroff": "The Zephyr call that puts the nRF into SYSTEM_OFF.",
    "sof": "USB Start-Of-Frame — a 1 ms host tick the looper uses to regulate its audio feedback.",
    "descriptor": "USB metadata telling the host what a device is (class, VID/PID, endpoints).",
    "enumerate": "The USB handshake where the host detects and identifies a newly-plugged device.",
    "composite device": "A single USB device that presents several interfaces at once (e.g. audio + serial).",
    "vid": "USB Vendor ID — the number identifying the maker of a USB device.",
    "pid": "USB Product ID — the number identifying a specific USB product.",
    "endpoint": "A USB data channel within an interface.",
    "baud": "The bits-per-second rate of a serial link (the album path runs at 115200).",
    "opcode": "A single-byte command code in the bootloader / wire protocol.",
    "payload": "The data carried inside a packet.",
    "packet": "A framed unit of data sent over the wire.",
    "ack": "Acknowledgement — a reply confirming a packet arrived (the album path sends none: fire-and-forget).",
    "crc7": "A 7-bit checksum protecting each eMMC command.",

    "resistor ladder": "A resistor chain that turns several buttons into distinct voltages one ADC pin can read.",
    "fader": "A sliding potentiometer; the SP-1's four faders are read by the ADC.",
    "open-drain": "An output that can only pull low (needs a pull-up); it reads high when idle.",
    "active-low": "A signal that means 'on' when driven low rather than high.",
    "pull-up": "A resistor that holds a line high until something pulls it low.",
    "voltage divider": "Two resistors that scale a voltage down so the ADC can read it (e.g. battery level).",
    "power-path": "Charger circuitry that runs the system from USB or battery and switches between them seamlessly.",
    "pnp": "A transistor type; a BC807 PNP inverts the MIDI line on the sync jack.",
    "bc807": "The PNP transistor driving the SP-1's sync-jack MIDI output — it inverts the signal.",
    "trs": "Tip-Ring-Sleeve — the 3-conductor 3.5 mm jack used for the sync/MIDI output.",
    "test point": "An exposed pad on the PCB you can probe or solder to (e.g. for SWD or the eMMC).",
    "pcb": "Printed Circuit Board — the board all the SP-1's chips are mounted on.",

    "ble": "Bluetooth Low Energy — a low-power Bluetooth mode; on the SP-1 handled by the CYBT module, not the nRF radio.",
    "bluetooth": "The wireless audio/data standard; provided on the SP-1 by the CYBT-353027-02 module.",
    "mmc": "MIDI Machine Control — transport commands (play / stop / record) sent over MIDI.",
    "cc": "MIDI Continuous Controller — a knob/fader message (the sp1-midi BSP emits CCs).",
    "pocket operator": "Teenage Engineering's pocket synths; their sync pulse can drive or follow the SP-1's second jack.",
    "po sync": "The 2-pulse-per-step clock format used to sync Pocket Operators over the jack.",

    "glitch": "A deliberate power or clock disturbance used to skip a security check (here, APPROTECT).",
    "voltage glitch": "Briefly dropping the supply at the right instant to fault a chip past its protection.",
    "fault injection": "Provoking hardware errors on purpose to bypass security.",
    "pru": "The BeagleBone's real-time co-processor, used to time the SP-1 glitch attack.",
    "beaglebone": "A single-board Linux computer used to run the APPROTECT glitch rig.",
    "disassembly": "Turning compiled machine code back into readable assembly to study it.",
    "reverse engineering": "Working out how a closed system behaves without its source or documentation.",
  };

  const root = document.querySelector("main .content");
  if (root && window.NodeFilter) {
    const keys = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    let RE;
    try {
      RE = new RegExp("(?<![A-Za-z0-9-])(?:" + keys.map(esc).join("|") + ")(?![A-Za-z0-9-])", "gi");
    } catch (e) { RE = null; }   // bail if lookbehind unsupported
    const SKIP_TAGS = new Set(["A","CODE","PRE","H1","H2","H3","H4","BUTTON","ABBR","SVG","SCRIPT","STYLE","TH","FIGCAPTION"]);
    const SKIP_CLASS = ["src","eyebrow","box-h","pill","copy-btn"];

    const okNode = (n) => {
      if (!n.nodeValue || !n.nodeValue.trim()) return false;
      for (let p = n.parentNode; p && p !== root.parentNode; p = p.parentNode) {
        if (p.nodeType !== 1) continue;
        if (SKIP_TAGS.has(p.tagName.toUpperCase())) return false;
        if (p.classList && SKIP_CLASS.some((c) => p.classList.contains(c))) return false;
      }
      return true;
    };

    // Wrap EVERY occurrence (not just the first) so repeat mentions are annotated too.
    const firstMatch = (text) => {
      RE.lastIndex = 0; const m = RE.exec(text);
      return m ? { index: m.index, term: m[0], key: m[0].toLowerCase() } : null;
    };

    if (RE) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: (n) => (okNode(n) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
      });
      const nodes = []; let t;
      while ((t = walker.nextNode())) nodes.push(t);

      nodes.forEach((node) => {
        let guard = 0;
        while (node && node.nodeValue && guard++ < 500) {
          const hit = firstMatch(node.nodeValue);
          if (!hit) break;
          const mid = node.splitText(hit.index);
          const rest = mid.splitText(hit.term.length);
          const ab = document.createElement("abbr");
          ab.className = "gl"; ab.tabIndex = 0;
          ab.setAttribute("data-tip", GLOSSARY[hit.key]);
          ab.textContent = mid.nodeValue;
          mid.parentNode.replaceChild(ab, mid);
          node = rest;   // keep scanning the remainder for other terms
        }
      });

      // ---- one shared floating tooltip (fixed-position, never clipped) ----
      const tip = document.createElement("div");
      tip.id = "gl-tip"; tip.setAttribute("role", "tooltip");
      document.body.appendChild(tip);
      let cur = null;

      const show = (el) => {
        cur = el;
        tip.innerHTML = "";
        const term = document.createElement("span");
        term.className = "gl-term"; term.textContent = el.textContent;
        tip.appendChild(term);
        tip.appendChild(document.createTextNode(el.getAttribute("data-tip")));
        tip.style.display = "block"; tip.style.opacity = "0";
        const r = el.getBoundingClientRect();
        const tr = tip.getBoundingClientRect();
        let left = r.left + r.width / 2 - tr.width / 2;
        left = Math.max(8, Math.min(left, window.innerWidth - tr.width - 8));
        let top = r.top - tr.height - 10;
        if (top < 8) top = r.bottom + 10;   // flip below if no room above
        tip.style.left = Math.round(left) + "px";
        tip.style.top = Math.round(top) + "px";
        requestAnimationFrame(() => { if (cur === el) tip.style.opacity = "1"; });
      };
      const hide = () => { cur = null; tip.style.opacity = "0"; tip.style.display = "none"; };

      document.addEventListener("mouseover", (e) => {
        const el = e.target.closest && e.target.closest("abbr.gl");
        if (el) show(el);
      });
      document.addEventListener("mouseout", (e) => {
        const el = e.target.closest && e.target.closest("abbr.gl");
        if (el && (!e.relatedTarget || !el.contains(e.relatedTarget))) hide();
      });
      document.addEventListener("focusin", (e) => {
        const el = e.target.closest && e.target.closest("abbr.gl");
        if (el) show(el);
      });
      document.addEventListener("focusout", (e) => {
        const el = e.target.closest && e.target.closest("abbr.gl");
        if (el) hide();
      });
      window.addEventListener("scroll", () => { if (cur) hide(); }, true);
      window.addEventListener("resize", () => { if (cur) hide(); });
    }
  }

  // ---- full A–Z glossary (same source as the tooltips) ----
  function buildGlossaryDl() {
    const dl = document.createElement("dl");
    dl.className = "gloss-dl";
    Object.keys(GLOSSARY).sort().forEach((k) => {
      const dt = document.createElement("dt"); dt.textContent = k;
      const dd = document.createElement("dd"); dd.textContent = GLOSSARY[k];
      dl.appendChild(dt); dl.appendChild(dd);
    });
    return dl;
  }
  const gAll = document.getElementById("glossary-all");
  if (gAll && !gAll.children.length) gAll.appendChild(buildGlossaryDl());

  // Exposed for the single-page print view (print.html): the ordered chapter
  // list and the glossary builder, so it can stack every chapter + the glossary.
  window.SP1_PAGES = PAGES.reduce((a, g) => a.concat(g.items.map((it) => it.href)), []);
  window.SP1_buildGlossaryDl = buildGlossaryDl;
})();
