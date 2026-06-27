# SP-1 Firmware Dev Field Guide

A guided, citation-first website for developing your own custom firmware for the
**Teenage Engineering SP-1** stem player (nRF52840 + 4 GB eMMC, Zephyr RTOS).

It walks from "I have a sealed device on my desk" to "I'm compiling and flashing
firmware I wrote" — covering the hardware, the bootloader and wire protocol, the
Zephyr toolchain and `sp1-midi` BSP, the audio format and codec/I²S bring-up,
power/lifecycle and recovery, the player internals (eMMC streaming + DSP), and a
worked case study of a real public audio firmware (`chattock/sp1-tape-looper`).

## Read it

→ **https://marcabisamra.github.io/sp1-firmware-guide/**

## Run it locally

It's a dependency-free static site — just open `index.html` in a browser, or:

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Structure

- `index.html` + topic pages (`device.html`, `bootloader.html`, `protocol.html`,
  `build.html`, `bsp.html`, `audio.html`, `codecs.html`, `power.html`,
  `recovery.html`, `internals.html`, `lab.html`, `looper.html`, `state.html`,
  `accuracy.html`, `reference.html`)
- `styles.css` — shared stylesheet
- `nav.js` — injects the sidebar, favicon, and copy buttons on every page
- `logo.svg` — the stem-player mark

## A note on accuracy

The SP-1 community has publicly corrected AI hallucinations about this device, so
every technical claim on the site carries a source citation and the known traps
are flagged on a dedicated page. This guide is a synthesized snapshot; for
"current state" questions, treat the live community Discord as the source of truth.

It does **not** redistribute Teenage Engineering's firmware binary or any album
stems — only original explanatory text with citations.

## Licence / disclaimer

Unofficial, community-oriented educational material. Not affiliated with or
endorsed by Teenage Engineering. Flashing custom firmware is at your own risk.
