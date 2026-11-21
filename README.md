# La Tavola di Zoufa — website

A plain HTML/CSS/JS site with no build step. It works as-is on GitHub Pages.

## Editing the content

**Everything you'll change is in `data.js`:**

- Phone, WhatsApp number, Instagram and the Google Maps search
- Opening hours (Lebanon time, used for the live *Aperto / Chiuso* sign)
- The menu (pizzas and pastas, prices, descriptions in EN / FR / AR)
- Photos and videos for the polaroid wall
- All the text on the site in English, French and Arabic

All of the current details are **placeholders**.

## Adding the photos and videos

1. Put the files in the `images/` folder (for example `images/oven.jpg`, `images/dough.mp4`).
2. In `data.js`, under `photos`, fill in `src`, for example `src: "images/oven.jpg"`.
   For a video, also set `type: "video"`.
3. Keep images around 1200px wide (and under ~400 KB) so the site stays fast on phones.

## Preview locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder
and go to http://localhost:8000.

## Publish on GitHub Pages

Push this folder to its own repo, then in the repo go to **Settings → Pages**,
choose the `main` branch and the root folder, and save.
