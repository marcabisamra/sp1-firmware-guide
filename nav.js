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
      { href: "glossary.html",       num: "17", title: "Glossary" },
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
      <button id="theme-toggle" type="button" aria-label="Toggle light/dark theme"></button>
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
  };

  const root = document.querySelector("main .content");
  if (root && window.NodeFilter) {
    const used = new Set();
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

    const firstUnused = (text) => {
      RE.lastIndex = 0; let m;
      while ((m = RE.exec(text))) {
        const key = m[0].toLowerCase();
        if (GLOSSARY[key] !== undefined && !used.has(key)) return { index: m.index, term: m[0], key };
      }
      return null;
    };

    if (RE) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: (n) => (okNode(n) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
      });
      const nodes = []; let t;
      while ((t = walker.nextNode())) nodes.push(t);

      nodes.forEach((node) => {
        let guard = 0;
        while (node && node.nodeValue && guard++ < 40) {
          const hit = firstUnused(node.nodeValue);
          if (!hit) break;
          used.add(hit.key);
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

  // ---- full A–Z glossary on the reference page (same source as the tooltips) ----
  const gAll = document.getElementById("glossary-all");
  if (gAll && !gAll.children.length) {
    const dl = document.createElement("dl");
    dl.className = "gloss-dl";
    Object.keys(GLOSSARY).sort().forEach((k) => {
      const dt = document.createElement("dt"); dt.textContent = k;
      const dd = document.createElement("dd"); dd.textContent = GLOSSARY[k];
      dl.appendChild(dt); dl.appendChild(dd);
    });
    gAll.appendChild(dl);
  }
})();
