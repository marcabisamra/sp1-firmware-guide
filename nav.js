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
    ]},
  ];

  const here = location.pathname.split("/").pop() || "index.html";

  let nav = `<div class="brand">
      <img class="logo" src="logo.svg" alt="SP-1 stem player" width="28" height="38">
      <div>
        <div class="t1">SP&#8209;1 FIRMWARE</div>
        <div class="t2">dev field guide</div>
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
})();
