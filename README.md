# Maison Solène — salon & spa website concept

A portfolio design demo by Jeremiah Anyabuwa. Maison Solène is a fictional brand; all names, prices, hours, contacts and imagery are sample content.

Plain static site (no build step): `index.html`, `styles.css`, `script.js`, and self-hosted fonts in `fonts/`.

## Run locally
Open `index.html`, or serve the folder with any static server, e.g. `npx serve`.

## WhatsApp enquiry
The form builds a `https://wa.me/<number>?text=...` link. The number is set at the top of `script.js` (`WA_NUMBER`, international format without `+`). It is an appointment request only; nothing is booked or confirmed by the site.

## Deploy
Netlify: publish directory is the project root (see `netlify.toml`).
