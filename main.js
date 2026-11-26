/* =========================================================
   La Tavola di Zoufa — interactions
   Content lives in data.js; you shouldn't need to edit this.
   ========================================================= */
(() => {
  "use strict";

  const SITE = window.SITE;
  const TEXT = window.TEXT;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;

  const TAU = Math.PI * 2;
  const { sin, cos, hypot, atan2, min, max } = Math;
  const clamp = (v, a = 0, b = 1) => min(b, max(a, v));
  const seg = (v, a, b) => clamp((v - a) / (b - a));
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const easeBack = (t) => { const c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };

  /* ---------------- tiny helpers ---------------- */
  const NS = "http://www.w3.org/2000/svg";
  function S(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const f = (n) => n.toFixed(1);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function blob(cx, cy, rx, ry, r, wob = 0.15, n = 9) {
    const pts = [];
    const ph = r() * TAU;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + ph;
      const k = 1 + (r() * 2 - 1) * wob;
      pts.push([cx + cos(a) * rx * k, cy + sin(a) * ry * k]);
    }
    let d = "";
    for (let i = 0; i < n; i++) {
      const p = pts[i], q = pts[(i + 1) % n];
      if (i === 0) { const pr = pts[n - 1]; d += `M${f((pr[0] + p[0]) / 2)},${f((pr[1] + p[1]) / 2)}`; }
      d += `Q${f(p[0])},${f(p[1])} ${f((p[0] + q[0]) / 2)},${f((p[1] + q[1]) / 2)}`;
    }
    return d + "Z";
  }
  function smoothOpen(pts) {
    let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const p = pts[i], q = pts[i + 1];
      d += `Q${f(p[0])},${f(p[1])} ${f((p[0] + q[0]) / 2)},${f((p[1] + q[1]) / 2)}`;
    }
    const l = pts[pts.length - 1];
    return d + `L${f(l[0])},${f(l[1])}`;
  }
  function scatter(r, R, count, minD, taken = []) {
    const out = [];
    let tries = 0;
    while (out.length < count && tries < count * 60) {
      tries++;
      const a = r() * TAU, d = Math.sqrt(r()) * R;
      const x = cos(a) * d, y = sin(a) * d;
      const md = tries > count * 30 ? minD * 0.6 : minD;
      if ([...taken, ...out].every((p) => hypot(p[0] - x, p[1] - y) > md)) out.push([x, y]);
    }
    taken.push(...out);
    return out;
  }
  const piece = (parent, x, y, rot = 0, sc = 1) => {
    const outer = S("g", { transform: `translate(${f(x)} ${f(y)})` }, parent);
    const inner = S("g", { transform: `rotate(${f(rot)}) scale(${sc.toFixed(2)})` }, outer);
    return { outer, inner, x, y };
  };

  /* =========================================================
     PIZZA ILLUSTRATION (drawn in code: every pizza is unique)
     ========================================================= */
  const TOPPING = {
    basil: { n: 6, R: 125, d: 52, draw(g) {
      S("path", { d: "M0,-20 C11,-13 12,7 0,20 C-12,7 -11,-13 0,-20Z", fill: "url(#g-basil)", filter: "url(#f-shadow)" }, g);
      S("path", { d: "M0,-17 L0,17 M0,-6 L6,-11 M0,2 L-6,-4 M0,9 L5,4", stroke: "#a8d98a", "stroke-width": 1, opacity: 0.45, fill: "none" }, g);
    }},
    tomato: { n: 8, R: 135, d: 40, draw(g, r) {
      S("circle", { r: 11, fill: "url(#g-tomato)", filter: "url(#f-shadow)" }, g);
      S("circle", { r: 7.5, fill: "#ff8a6a", opacity: 0.55 }, g);
      for (let i = 0; i < 3; i++) { const a = (i / 3) * TAU + r(); S("ellipse", { cx: f(cos(a) * 4), cy: f(sin(a) * 4), rx: 1.6, ry: 1, fill: "#ffe2a8", opacity: 0.9 }, g); }
      S("ellipse", { cx: -4, cy: -5, rx: 3, ry: 1.5, fill: "#fff", opacity: 0.35 }, g);
    }},
    salami: { n: 9, R: 135, d: 46, draw(g, r) {
      S("circle", { r: 18, fill: "url(#g-salami)", filter: "url(#f-shadow)" }, g);
      S("circle", { r: 17, fill: "none", stroke: "#4c0f07", "stroke-width": 1.6, opacity: 0.55 }, g);
      for (let i = 0; i < 6; i++) S("circle", { cx: f((r() * 2 - 1) * 10), cy: f((r() * 2 - 1) * 10), r: f(1 + r() * 1.6), fill: "#f0a07c", opacity: 0.55 }, g);
      S("ellipse", { cx: -6, cy: -7, rx: 6, ry: 3, fill: "#fff", opacity: 0.14 }, g);
    }},
    sujuk: { n: 12, R: 135, d: 40, draw(g, r) {
      S("ellipse", { rx: 14, ry: 10, fill: "url(#g-sujuk)", filter: "url(#f-shadow)" }, g);
      for (let i = 0; i < 5; i++) S("circle", { cx: f((r() * 2 - 1) * 8), cy: f((r() * 2 - 1) * 5), r: f(0.8 + r() * 1.3), fill: "#e8b08a", opacity: 0.6 }, g);
    }},
    chili: { n: 14, R: 140, d: 24, draw(g) {
      S("circle", { r: 6, fill: "none", stroke: "#d41f12", "stroke-width": 2.6 }, g);
      S("circle", { r: 2, cx: 1, fill: "#f5d68a", opacity: 0.9 }, g);
    }},
    mushroom: { n: 10, R: 135, d: 42, draw(g) {
      S("path", { d: "M-15,2 Q-15,-13 0,-13 Q15,-13 15,2 L6,2 L5,12 Q0,15 -5,12 L-6,2Z", fill: "url(#g-mush)", stroke: "#8a6a45", "stroke-width": 0.8, filter: "url(#f-shadow)" }, g);
      S("path", { d: "M-10,0 L-5,-8 M-3,0 L0,-9 M4,0 L5,-8", stroke: "#a68560", "stroke-width": 0.8, opacity: 0.6 }, g);
    }},
    olive: { n: 12, R: 140, d: 30, draw(g) {
      S("circle", { r: 7.5, fill: "url(#g-olive)", filter: "url(#f-shadow)" }, g);
      S("circle", { r: 2.6, fill: "#9e2a1a" }, g);
      S("ellipse", { cx: -3, cy: -3.5, rx: 2.5, ry: 1.2, fill: "#fff", opacity: 0.35 }, g);
    }},
    prosciutto: { n: 6, R: 120, d: 64, draw(g, r) {
      S("path", { d: blob(0, 0, 30, 15, r, 0.28, 7), fill: "url(#g-pros)", filter: "url(#f-shadow)" }, g);
      S("path", { d: `M-20,${f(r() * 4)} Q0,-8 22,${f(r() * 4)}`, stroke: "#f8dcd6", "stroke-width": 2.4, fill: "none", opacity: 0.85 }, g);
    }},
    bresaola: { n: 7, R: 120, d: 58, draw(g, r) {
      S("path", { d: blob(0, 0, 26, 18, r, 0.22, 8), fill: "url(#g-bresaola)", filter: "url(#f-shadow)" }, g);
      S("path", { d: blob(-3, -2, 15, 9, r, 0.3, 7), fill: "#c4545c", opacity: 0.35 }, g);
    }},
    truffle: { n: 12, R: 130, d: 32, draw(g, r) {
      S("path", { d: blob(0, 0, 11, 9, r, 0.25, 8), fill: "url(#g-truffle)", filter: "url(#f-shadow)" }, g);
      S("path", { d: "M-7,-2 Q-2,3 3,-3 T8,1 M-5,4 Q0,6 5,3", stroke: "#c9b39a", "stroke-width": 0.8, fill: "none", opacity: 0.7 }, g);
    }},
    rucola: { n: 18, R: 95, d: 22, draw(g) {
      S("path", { d: "M0,-20 L5,-14 L3,-10 L8,-5 L4,-2 L8,4 L3,6 L5,12 L0,20 L-5,12 L-3,6 L-8,4 L-4,-2 L-8,-5 L-3,-10 L-5,-14Z", fill: "url(#g-rucola)", filter: "url(#f-shadow)" }, g);
    }},
    parm: { n: 14, R: 130, d: 22, draw(g, r) {
      S("path", { d: `M-9,-4 L${f(6 + r() * 4)},-6 L9,3 L-6,6Z`, fill: "#f7eed4", stroke: "#d9c99c", "stroke-width": 0.8, filter: "url(#f-shadow)" }, g);
    }},
    gorgonzola: { n: 9, R: 125, d: 40, draw(g, r) {
      S("path", { d: blob(0, 0, 12, 12, r, 0.3, 7), fill: "url(#g-gorgo)", filter: "url(#f-shadow)" }, g);
      for (let i = 0; i < 4; i++) S("circle", { cx: f((r() * 2 - 1) * 6), cy: f((r() * 2 - 1) * 6), r: f(0.8 + r()), fill: "#5f7f7a", opacity: 0.75 }, g);
    }},
    garlic: { n: 14, R: 140, d: 24, draw(g) {
      S("ellipse", { rx: 7, ry: 4.5, fill: "#f7eed6", stroke: "#e1cf9f", "stroke-width": 1, filter: "url(#f-shadow)" }, g);
    }},
    oregano: { n: 80, R: 150, d: 4, draw(g, r) {
      S("circle", { r: f(1 + r() * 0.9), fill: r() > 0.5 ? "#55682b" : "#3c4d1e" }, g);
    }},
  };
  const SAUCE_FILL = { red: "url(#g-sauce)", white: "url(#g-white)", pesto: "url(#g-pesto)" };

  function makePizza(o = {}) {
    const r = rng(o.seed || 1);
    const svg = S("svg", { viewBox: "-215 -215 430 430", "aria-hidden": "true" });
    const L = { svg };
    S("ellipse", { cx: 0, cy: 12, rx: 198, ry: 198, fill: "#000", opacity: 0.45, filter: "url(#f-softer)" }, svg);
    const base = (L.base = S("g", {}, svg));
    const edge = blob(0, 0, 194, 194, r, 0.022, 22);
    L.raw = S("path", { d: edge, fill: "url(#g-dough)" }, base);
    L.crust = S("path", { d: edge, fill: "url(#g-crust)" }, base);

    L.char = S("g", {}, base);
    const charG = S("g", { filter: "url(#f-soft)" }, L.char);
    for (let i = 0; i < 34; i++) {
      const a = r() * TAU, rr = 174 + r() * 17, x = cos(a) * rr, y = sin(a) * rr;
      S("ellipse", { cx: f(x), cy: f(y), rx: f(3 + r() * 7), ry: f(2 + r() * 4), transform: `rotate(${f((a * 180) / Math.PI)} ${f(x)} ${f(y)})`, fill: "#2b1406", opacity: (0.3 + r() * 0.5).toFixed(2) }, charG);
    }
    for (let i = 0; i < 16; i++) {
      const a = r() * TAU, rr = 178 + r() * 10;
      S("circle", { cx: f(cos(a) * rr), cy: f(sin(a) * rr), r: f(2 + r() * 4), fill: "#fbe2b0", opacity: 0.55 }, L.char);
    }

    L.sauce = S("g", {}, base);
    if (o.sauce !== "none") {
      S("path", { d: blob(0, 0, 160, 160, r, 0.04, 16), fill: SAUCE_FILL[o.sauce] || SAUCE_FILL.red, filter: "url(#f-rough)" }, L.sauce);
      if (o.sauce !== "white") for (let i = 0; i < 40; i++) {
        const a = r() * TAU, d = Math.sqrt(r()) * 148;
        S("circle", { cx: f(cos(a) * d), cy: f(sin(a) * d), r: f(0.8 + r() * 1.4), fill: o.sauce === "pesto" ? "#2c4410" : "#6e140b", opacity: 0.35 }, L.sauce);
      }
    }

    const taken = [];
    const tops = o.toppings || [];
    L.cheeseG = S("g", {}, base);
    L.cheese = [];
    L.brown = S("g", { filter: "url(#f-soft)" }, base);
    if (tops.includes("burrata")) {
      // big creamy burrata in the middle, everything else around it
      taken.push([0, 0], [34, 0], [-34, 0], [0, 34], [0, -34], [24, 24], [-24, 24], [24, -24], [-24, -24]);
      const p = piece(L.cheeseG, 0, 0, 0, 1);
      S("path", { d: blob(0, 0, 52, 48, r, 0.12, 10), fill: "url(#g-burrata)", filter: "url(#f-shadow)" }, p.inner);
      S("path", { d: blob(4, 6, 26, 20, r, 0.25, 8), fill: "#fffef8", opacity: 0.9 }, p.inner);
      S("path", { d: "M-30,-8 Q-6,-26 24,-14", stroke: "#e9d39b", "stroke-width": 3, fill: "none", opacity: 0.8, "stroke-linecap": "round" }, p.inner);
      L.cheese.push(p);
    }
    if (o.cheese !== false) {
      const pts = scatter(r, 125, o.sauce === "white" ? 16 : 13, 48, taken);
      pts.forEach(([x, y]) => {
        const p = piece(L.cheeseG, x, y, r() * 360, 1);
        const rad = 20 + r() * 12;
        S("path", { d: blob(0, 0, rad, rad * (0.8 + r() * 0.3), r, 0.24, 8), fill: "url(#g-cheese)", filter: "url(#f-shadow)" }, p.inner);
        S("ellipse", { cx: -rad * 0.3, cy: -rad * 0.3, rx: rad * 0.3, ry: rad * 0.15, fill: "#fff", opacity: 0.5 }, p.inner);
        L.cheese.push(p);
        for (let k = 0; k < 2; k++) S("circle", { cx: f(x + (r() * 2 - 1) * rad * 0.5), cy: f(y + (r() * 2 - 1) * rad * 0.5), r: f(3 + r() * 5), fill: "#d39444", opacity: 0.5 }, L.brown);
      });
      taken.length = 0; // toppings may sit on top of cheese
      if (tops.includes("burrata")) taken.push([0, 0], [34, 0], [-34, 0], [0, 34], [0, -34]);
    }

    L.tops = {};
    tops.forEach((name) => {
      if (name === "burrata") return;
      const t = TOPPING[name];
      const g = S("g", { class: "top-" + name }, base);
      L.tops[name] = [];
      if (name === "honey") {
        for (let k = 0; k < 3; k++) {
          const y0 = -90 + k * 75 + r() * 20;
          const pts = [];
          for (let x = -150; x <= 150; x += 25) pts.push([x, y0 + sin(x / 22 + k) * 16 + (r() - 0.5) * 10]);
          const d = smoothOpen(pts.filter((p) => hypot(p[0], p[1]) < 150));
          S("path", { d, stroke: "#d98e1f", "stroke-width": 4, fill: "none", "stroke-linecap": "round", opacity: 0.85 }, g);
          S("path", { d, stroke: "#ffd27a", "stroke-width": 1.4, fill: "none", "stroke-linecap": "round", opacity: 0.9 }, g);
        }
        return;
      }
      if (!t) return;
      const pts = name === "oregano" ? scatter(r, t.R, t.n, t.d) : scatter(r, t.R, t.n, t.d, taken);
      pts.forEach(([x, y]) => {
        const p = piece(g, x, y, r() * 360, 0.85 + r() * 0.3);
        t.draw(p.inner, r);
        L.tops[name].push(p);
      });
    });

    L.oil = S("g", { filter: "url(#f-soft)" }, base);
    for (let i = 0; i < 6; i++) {
      const a = r() * TAU, d = r() * 110;
      S("ellipse", { cx: f(cos(a) * d), cy: f(sin(a) * d), rx: f(10 + r() * 18), ry: f(3 + r() * 4), transform: `rotate(${f(r() * 180)})`, fill: "#fff6c8", opacity: 0.22 }, L.oil);
    }
    return L;
  }

  /* =========================================================
     PASTA PLATE ILLUSTRATION
     ========================================================= */
  const NOODLE = {
    red: ["#e0873f", "#d4612d", "#e99a4c"],
    pink: ["#f0a07a", "#e88a6a", "#f5b48e"],
    oil: ["#f3d58a", "#ecc66c", "#f6df9f"],
    cream: ["#f5d97f", "#edc663", "#f8e39c"],
    ragu: ["#efc46f", "#e8b35e", "#f4d185"],
  };

  function makePasta(o = {}) {
    const r = rng(o.seed || 3);
    const svg = S("svg", { viewBox: "-215 -215 430 430", "aria-hidden": "true" });
    const L = { svg };
    const colors = NOODLE[o.sauce] || NOODLE.red;

    S("ellipse", { cx: 0, cy: 14, rx: 204, ry: 204, fill: "#000", opacity: 0.45, filter: "url(#f-softer)" }, svg);
    S("circle", { r: 204, fill: "url(#g-plate)" }, svg);
    S("circle", { r: 197, fill: "none", stroke: "#c9a043", "stroke-width": 3 }, svg);
    S("circle", { r: 190, fill: "none", stroke: "#c9a043", "stroke-width": 1, opacity: 0.6 }, svg);
    S("circle", { r: 148, fill: "none", stroke: "#000", "stroke-width": 12, opacity: 0.05, filter: "url(#f-soft)" }, svg);

    const food = (L.food = S("g", {}, svg));
    const noodles = (L.noodles = S("g", {}, food));
    const shadowG = S("g", { opacity: 0.22, transform: "translate(1.5 2.5)" }, noodles);
    const mainG = S("g", {}, noodles);
    const count = o.story ? 46 : 38;
    for (let i = 0; i < count; i++) {
      let x = (r() * 2 - 1) * 70, y = (r() * 2 - 1) * 70, a = r() * TAU;
      const pts = [[x, y]];
      for (let k = 0; k < 10; k++) {
        a += (r() * 2 - 1) * 1.25;
        const st = 20 + r() * 18;
        x += cos(a) * st; y += sin(a) * st;
        const d = hypot(x, y);
        if (d > 122) { a = atan2(-y, -x) + (r() - 0.5); x *= 122 / d; y *= 122 / d; }
        pts.push([x, y]);
      }
      const d = smoothOpen(pts);
      S("path", { d, stroke: "#5a2008", "stroke-width": 6.5, fill: "none", "stroke-linecap": "round" }, shadowG);
      S("path", { d, stroke: colors[i % colors.length], "stroke-width": 5.2, fill: "none", "stroke-linecap": "round" }, mainG);
      if (i % 2 === 0) S("path", { d, stroke: "#fff", "stroke-width": 1.2, fill: "none", "stroke-linecap": "round", opacity: 0.28, transform: "translate(-1 -1)" }, mainG);
    }

    const top = (L.top = S("g", {}, food));
    if (o.sauce === "red") {
      S("path", { d: blob(0, 0, 58, 50, r, 0.25, 9), fill: "url(#g-sauce)", opacity: 0.92, filter: "url(#f-rough)" }, top);
    } else if (o.sauce === "pink") {
      S("path", { d: blob(0, 0, 60, 52, r, 0.25, 9), fill: "#e4775c", opacity: 0.75, filter: "url(#f-rough)" }, top);
    } else if (o.sauce === "ragu") {
      S("path", { d: blob(0, 0, 66, 58, r, 0.2, 10), fill: "#9b3a1c", filter: "url(#f-rough)" }, top);
      for (let i = 0; i < 70; i++) {
        const a = r() * TAU, d = Math.sqrt(r()) * 58;
        S("circle", { cx: f(cos(a) * d), cy: f(sin(a) * d), r: f(2 + r() * 4), fill: r() > 0.5 ? "#6b2a14" : "#8a3a1c" }, top);
      }
    }
    if (o.sauce === "oil" || o.sauce === "cream" || o.sauce === "pink") {
      for (let i = 0; i < 8; i++) {
        const a = r() * TAU, d = r() * 90;
        S("ellipse", { cx: f(cos(a) * d), cy: f(sin(a) * d), rx: f(8 + r() * 14), ry: f(3 + r() * 3), fill: "#fff8d0", opacity: 0.3, filter: "url(#f-soft)", transform: `rotate(${f(r() * 180)})` }, top);
      }
    }

    const ex = o.extras || [];
    if (ex.includes("meatballs")) {
      scatter(r, 55, 4, 44).forEach(([x, y]) => {
        const p = piece(top, x, y, 0, 1);
        S("circle", { r: 22, fill: "url(#g-meat)", filter: "url(#f-shadow)" }, p.inner);
        S("path", { d: blob(-2, -4, 14, 10, r, 0.3, 7), fill: "url(#g-sauce)", opacity: 0.9 }, p.inner);
      });
    }
    if (ex.includes("bacon")) scatter(r, 100, 16, 18).forEach(([x, y]) => {
      const p = piece(top, x, y, r() * 180, 1);
      S("rect", { x: -6, y: -3.5, width: 12, height: 7, rx: 2, fill: r() > 0.5 ? "#a44a2c" : "#c46a3e", filter: "url(#f-shadow)" }, p.inner);
    });
    if (ex.includes("garlic")) scatter(r, 100, 12, 20).forEach(([x, y]) => TOPPING.garlic.draw(piece(top, x, y, r() * 180, 0.8).inner, r));
    if (ex.includes("truffle")) scatter(r, 95, 10, 30).forEach(([x, y]) => TOPPING.truffle.draw(piece(top, x, y, r() * 180, 0.9).inner, r));
    const specks = (name, n, R, fn) => { if (ex.includes(name)) for (let i = 0; i < n; i++) { const a = r() * TAU, d = Math.sqrt(r()) * R; fn(cos(a) * d, sin(a) * d); } };
    specks("chili", 40, 115, (x, y) => S("rect", { x: f(x), y: f(y), width: 3, height: 2, fill: "#c8200f", transform: `rotate(${f(r() * 180)} ${f(x)} ${f(y)})` }, top));
    specks("parsley", 70, 115, (x, y) => S("circle", { cx: f(x), cy: f(y), r: f(1 + r()), fill: "#3d7a2a" }, top));
    specks("pepper", 70, 115, (x, y) => S("circle", { cx: f(x), cy: f(y), r: f(0.8 + r() * 0.8), fill: "#1d1512" }, top));
    specks("parm", 80, 70, (x, y) => S("rect", { x: f(x), y: f(y), width: f(2 + r() * 3), height: 1.6, fill: "#fff6dc", transform: `rotate(${f(r() * 180)} ${f(x)} ${f(y)})` }, top));
    if (ex.includes("basil")) [[-14, -20, -30], [16, -8, 40], [-2, 16, 160]].forEach(([x, y, rt]) => TOPPING.basil.draw(piece(top, x, y, rt, 1.05).inner, r));

    if (o.story) {
      const spiral = [];
      for (let i = 0; i <= 260; i++) { const t = i / 260; const a = t * TAU * 6; const rr = 6 + t * 56; spiral.push([cos(a) * rr, sin(a) * rr]); }
      let d = `M${f(spiral[0][0])},${f(spiral[0][1])}`;
      for (let i = 1; i < spiral.length; i++) d += `L${f(spiral[i][0])},${f(spiral[i][1])}`;
      L.lift = S("g", {}, svg);
      L.nest = S("g", {}, L.lift);
      S("path", { d, stroke: "#5a2008", "stroke-width": 8, fill: "none", opacity: 0.25, transform: "translate(1.5 2.5)", pathLength: 1, "stroke-dasharray": "1 1", class: "nest" }, L.nest);
      S("path", { d, stroke: colors[0], "stroke-width": 6.5, fill: "none", "stroke-linecap": "round", pathLength: 1, "stroke-dasharray": "1 1", class: "nest" }, L.nest);
      S("path", { d, stroke: "#fff", "stroke-width": 1.4, fill: "none", opacity: 0.3, pathLength: 1, "stroke-dasharray": "1 1", class: "nest" }, L.nest);
      L.nestPaths = $$(".nest", L.nest);
      L.nestTop = S("g", { opacity: 0 }, L.nest);
      S("path", { d: blob(4, -6, 26, 20, r, 0.25, 8), fill: "url(#g-sauce)", filter: "url(#f-rough)" }, L.nestTop);
      for (let i = 0; i < 30; i++) { const a = r() * TAU, dd = Math.sqrt(r()) * 40; S("rect", { x: f(cos(a) * dd), y: f(sin(a) * dd), width: f(2 + r() * 3), height: 1.6, fill: "#fff6dc" }, L.nestTop); }
      TOPPING.basil.draw(piece(L.nestTop, 26, 28, 35, 1.1).inner, r);
      L.fork = S("g", {}, L.lift);
      const fk = S("g", { filter: "url(#f-shadow)" }, L.fork);
      S("path", { d: "M-9,-30 C-10,-60 -6,-80 -5,-110 L-8,-330 L8,-330 L5,-110 C6,-80 10,-60 9,-30Z", fill: "url(#g-steel)", stroke: "#5f666b", "stroke-width": 0.8 }, fk);
      S("path", { d: "M-15,-36 C-15,-10 -14,8 -13,26 L-9,26 L-8,6 L-4,6 L-3,26 L3,26 L4,6 L8,6 L9,26 L13,26 C14,8 15,-10 15,-36 C8,-44 -8,-44 -15,-36Z", fill: "url(#g-steel)", stroke: "#5f666b", "stroke-width": 0.8 }, fk);
    }
    return L;
  }

  /* =========================================================
     LANGUAGE
     ========================================================= */
  let lang = "en";
  const t = (k) => (TEXT[lang] && TEXT[lang][k]) ?? TEXT.en[k] ?? "";
  const tr = (v) => (v && typeof v === "object" ? v[lang] || v.en : v);
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };

  function setLang(l) {
    lang = TEXT[l] ? l : "en";
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    $$("[data-i18n]").forEach((el) => { const v = t(el.dataset.i18n); if (v) el.textContent = v; });
    $$("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    $(".photos__hint").textContent = finePointer ? t("photos.hint") : t("photos.hintTouch");
    store.set("tavola-lang", lang);
    renderMenu();
    renderPhotos();
    renderHours();
    renderContact();
    updateSoundLabel();
    splitTitles();
  }

  /* =========================================================
     INTRO
     ========================================================= */
  function intro() {
    // waiting page: stays black until fonts, the opening video and the first frame of every video are ready
    const box = $("[data-loader]");
    const bar = $("[data-loader-bar]");
    let done = false;
    const open = () => {
      if (done) return; done = true;
      if (bar) bar.style.transform = "scaleX(1)";
      setTimeout(() => {
        box.classList.add("is-done");
        document.body.classList.remove("is-intro");
        document.body.classList.add("is-ready");
        window.__siteOpen = true;
        window.dispatchEvent(new Event("site-open"));
      }, 250);
    };
    const tasks = [];
    const add = (pr) => tasks.push(pr.catch(() => {}));
    const media = (el, ev) => new Promise((res) => {
      if (!el) return res();
      const ok = ev === "canplaythrough" ? 4 : 2;
      if (el.readyState >= ok) return res();
      el.addEventListener(ev, res, { once: true });
      el.addEventListener("error", res, { once: true });
    });
    if (document.fonts && document.fonts.ready) add(document.fonts.ready);
    add(media($(".opening__video"), "canplaythrough"));
    $$("[data-reel] video").forEach((v) => add(media(v, "loadeddata")));
    ["images/opening-pizza.png"].forEach((src) => add(new Promise((res) => { const im = new Image(); im.onload = im.onerror = res; im.src = src; })));
    let n = 0;
    tasks.forEach((t) => t.then(() => { n++; if (bar) bar.style.transform = `scaleX(${(n / tasks.length).toFixed(3)})`; }));
    const minWait = new Promise((r) => setTimeout(r, 700));
    Promise.all([Promise.all(tasks), minWait]).then(open);
    setTimeout(open, 15000); // never wait forever on a slow connection
  }

  /* =========================================================
     HERO
     ========================================================= */
  function hero() {
    let i = 0;
    $$("[data-split]").forEach((el) => {
      const txt = el.textContent.trim();
      el.textContent = "";
      [...txt].forEach((c) => {
        const s = document.createElement("span");
        s.className = c === " " ? "ch sp" : "ch";
        s.textContent = c === " " ? " " : c;
        s.style.transitionDelay = `${i++ * 45}ms`;
        el.appendChild(s);
      });
    });
    const hp = $("[data-hero-pizza]");
    if (hp) hp.appendChild(makePizza({ seed: 11, sauce: "red", cheese: true, toppings: ["basil", "tomato"] }).svg);
  }

  /* embers rising from the fire */
  function embers() {
    const cv = $("[data-embers]");
    if (!cv || reduced) return;
    const ctx = cv.getContext("2d");
    let W, H, dpr, parts = [], visible = true;
    const resize = () => {
      dpr = min(2, devicePixelRatio || 1);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const spawn = (anywhere) => ({
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : H + 10,
      r: 0.6 + Math.random() * 1.8,
      vy: 0.35 + Math.random() * 0.9,
      vx: (Math.random() - 0.5) * 0.3,
      ph: Math.random() * TAU,
      life: 0.4 + Math.random() * 0.6,
    });
    resize();
    const N = W < 700 ? 40 : 80;
    for (let i = 0; i < N; i++) parts.push(spawn(true));
    addEventListener("resize", resize);
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(cv);
    const tick = (time) => {
      requestAnimationFrame(tick);
      if (!visible) return;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      for (const p of parts) {
        p.y -= p.vy; p.x += p.vx + sin(time / 900 + p.ph) * 0.35;
        const k = clamp(p.y / H);
        const a = k * p.life;
        if (p.y < -10 || a < 0.02) Object.assign(p, spawn(false));
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(255, 210, 120, ${a})`);
        g.addColorStop(0.4, `rgba(255, 120, 30, ${a * 0.6})`);
        g.addColorStop(1, "rgba(255, 80, 0, 0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, TAU); ctx.fill();
      }
    };
    requestAnimationFrame(tick);
  }

  /* =========================================================
     SCROLL VIDEOS — pizza, pasta, baguette play as you scroll
     ========================================================= */
  const ROMAN = ["I", "II", "III", "IV", "V", "VI"];
  const reels = [];
  function setupReels() {
    const cfgs = { story: SITE.storyVideo, pv: SITE.pastaVideo, bv: SITE.baguetteVideo };
    const big = matchMedia("(min-width: 861px)").matches;
    $$("[data-reel]").forEach((el) => {
      const cfg = cfgs[el.dataset.reel] || {};
      const v = $("video", el);
      const R = { el, v, pin: $(".story__pin", el), steps: $$("[data-steps] li", el), dots: $$("[data-story-dots] button", el), hint: $("[data-story-hint]", el), times: cfg.steps || [0], active: -1, cur: 0, ghost: null };
      v.muted = true; v.preload = "auto"; v.playsInline = true;
      if (cfg.poster) v.poster = cfg.poster;
      const src = big && cfg.srcHD ? cfg.srcHD : cfg.src;
      if (src) v.src = src;
      // some phones only allow seeking after the video has "played" once
      v.addEventListener("loadeddata", () => { v.play().then(() => v.pause()).catch(() => {}); }, { once: true });
      // tapping a step bar scrolls to that moment
      R.dots.forEach((d, i) => d.addEventListener("click", () => {
        const dur = v.duration || 10;
        const range = el.offsetHeight - innerHeight;
        const y = el.offsetTop + range * clamp(((R.times[i] || 0) / dur) * 0.86 + 0.005);
        scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
      }));
      reels.push(R);
    });
    const loop = () => { reels.forEach(scrubReel); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }
  function updateSoundLabel() {}
  function scrubReel(R) {
    const { v, el } = R;
    const r = el.getBoundingClientRect();
    if (r.bottom < -50 || r.top > innerHeight + 50) return;
    const range = el.offsetHeight - innerHeight;
    const p = clamp(-r.top / range);
    const dur = v.duration || 0;
    // last stretch: the frame softens and darkens, then the steam takes over
    const exit = seg(p, 0.84, 1);
    if (R.pin) R.pin.style.setProperty("--exit", (exit * 0.6).toFixed(3));
    if (!reduced) v.style.setProperty("--vexit", exit.toFixed(3));
    if (R.hint) R.hint.style.opacity = (1 - seg(p, 0.02, 0.12)).toFixed(2);
    if (!dur) { syncSteps(R, 0, 10); return; }
    const target = clamp(p / 0.86) * (dur - 0.05);
    // ease towards the target so the video glides instead of jumping
    R.cur += (target - R.cur) * 0.22;
    if (Math.abs(target - R.cur) < 0.005) R.cur = target;
    if (!v.seeking && Math.abs(v.currentTime - R.cur) > 0.015) {
      if (typeof v.fastSeek === "function" && Math.abs(v.currentTime - R.cur) > 1) v.fastSeek(R.cur);
      else v.currentTime = R.cur;
    }
    syncSteps(R, R.cur, dur);
  }
  function syncSteps(R, now, dur) {
    const T = R.times;
    let idx = 0;
    for (let i = 0; i < T.length; i++) if (now >= T[i] - 0.001) idx = i;
    if (idx !== R.active) {
      R.active = idx;
      R.steps.forEach((li, i) => li.classList.toggle("is-active", i === idx));
      if (R.ghost) {
        R.ghost.textContent = ROMAN[idx] || "";
        if (!reduced) R.ghost.animate(
          [{ opacity: 0, transform: "translateY(-50%) scale(1.25) rotate(-4deg)" }, { opacity: 1, transform: "translateY(-50%) scale(1) rotate(0deg)" }],
          { duration: 900, easing: "cubic-bezier(.23, 1, .32, 1)" });
      }
    }
    R.dots.forEach((d, i) => {
      const end = i + 1 < T.length ? T[i + 1] : dur;
      d.style.setProperty("--fill", clamp((now - T[i]) / (end - T[i])).toFixed(3));
    });
  }

  /* =========================================================
     MENU BOARD
     ========================================================= */
  let menuObserver;
  // a real photo when the dish has one, otherwise the drawing
  function dishArt(sec, it, seed) {
    if (it.photo) {
      const img = document.createElement("img");
      img.className = "mi__photo"; img.src = it.photo; img.alt = tr(it.name); img.loading = "lazy"; img.draggable = false;
      return img;
    }
    return (sec.art === "pizza" ? makePizza({ seed, ...it.draw }) : makePasta({ seed, ...it.draw })).svg;
  }
  function renderMenu() {
    const grid = $("[data-menu]");
    grid.innerHTML = "";
    const secs = SITE.menu;
    // first two sections side by side (like Pizza | Pasta), the rest in rows of three
    const rows = [secs.slice(0, 2)];
    for (let i = 2; i < secs.length; i += 3) rows.push(secs.slice(i, i + 3));
    let seed = 100;
    rows.forEach((row) => {
      const rowEl = document.createElement("div");
      rowEl.className = `menu__row menu__row--${row.length >= 3 ? 3 : row.length}`;
      row.forEach((sec, si) => {
        const el = document.createElement("section");
        el.className = "msec";
        el.style.transitionDelay = `${si * 120}ms`;
        el.innerHTML = `<div class="msec__head"><h3 class="banner">${esc(tr(sec.title))}</h3></div><ul class="msec__list"></ul>`;
        const ul = $(".msec__list", el);
        sec.items.forEach((it, ii) => {
          const s0 = seed++;
          const li = document.createElement("li");
          li.className = "mi" + (it.featured ? " mi--featured" : "");
          li.style.setProperty("--i", ii);
          const canDraw = it.photo || (it.draw && (sec.art === "pizza" || sec.art === "pasta"));
          const inner = `
            <span class="mi__row"><span class="mi__name" lang="${typeof it.name === "string" ? "it" : lang}">${esc(tr(it.name))}</span><span class="mi__dots"></span><span class="mi__price">${it.price} ${SITE.currency}</span></span>
            ${it.desc ? `<span class="mi__desc">(${esc(tr(it.desc))})</span>` : ""}`;
          if (canDraw) {
            li.innerHTML = `<button class="mi__btn" aria-expanded="false">${inner}</button><div class="mi__panel"><div><div class="mi__art"></div></div></div>`;
            const btn = $(".mi__btn", li);
            btn._draw = () => dishArt(sec, it, s0);
            btn.addEventListener("click", () => {
              const art = $(".mi__art", li);
              if (!art.firstChild) art.appendChild(dishArt(sec, it, s0));
              const open = !li.classList.contains("is-open");
              $$(".mi.is-open", ul).forEach((o) => { o.classList.remove("is-open"); $(".mi__btn", o).setAttribute("aria-expanded", "false"); });
              li.classList.toggle("is-open", open);
              btn.setAttribute("aria-expanded", String(open));
            });
          } else {
            li.innerHTML = `<div class="mi__static">${inner}</div>`;
          }
          ul.appendChild(li);
        });
        rowEl.appendChild(el);
      });
      grid.appendChild(rowEl);
    });
    // fade sections in as they scroll into view
    if (menuObserver) menuObserver.disconnect();
    if (!("IntersectionObserver" in window) || reduced) { $$(".msec", grid).forEach((s) => s.classList.add("is-in")); return; }
    menuObserver = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); menuObserver.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" });
    $$(".msec", grid).forEach((s) => menuObserver.observe(s));
  }

  /* =========================================================
     PHOTOS
     ========================================================= */
  const ROT = [-3, 2, -1.5, 3, -2, 1.5, -3.5, 2.5];
  const CAMERA = `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 15h8l4-5h12l4 5h8v23H6z"/><circle cx="24" cy="26" r="7.5"/></svg>`;
  const VIDEO = `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="5" y="12" width="28" height="24" rx="3"/><path d="M33 21l10-6v18l-10-6z"/></svg>`;
  function renderPhotos() {
    const wall = $("[data-wall]");
    const keep = {};
    $$(".polaroid", wall).forEach((p) => (keep[p.dataset.i] = [p.style.getPropertyValue("--x"), p.style.getPropertyValue("--y")]));
    wall.innerHTML = "";
    SITE.photos.forEach((ph, i) => {
      const fig = document.createElement("figure");
      fig.className = "polaroid";
      fig.dataset.i = i;
      fig.style.setProperty("--r", `${ROT[i % ROT.length]}deg`);
      fig.style.setProperty("--i", i);
      fig.style.setProperty("--fx", `${((i % 3) - 1) * 22}vw`);
      if (keep[i]) { fig.style.setProperty("--x", keep[i][0]); fig.style.setProperty("--y", keep[i][1]); }
      const cap = esc(tr(ph.caption));
      let media;
      if (!ph.src) media = `<div class="polaroid__soon">${ph.type === "video" ? VIDEO : CAMERA}<span>${t(ph.type === "video" ? "photos.soonVideo" : "photos.soon")}</span></div>`;
      else if (ph.type === "video") media = `<video src="${esc(ph.src)}" muted loop playsinline autoplay preload="metadata"></video>`;
      else media = `<img src="${esc(ph.src)}" alt="${cap}" loading="lazy" draggable="false" />`;
      fig.innerHTML = `<div class="polaroid__media">${media}</div><figcaption class="polaroid__cap">${cap}</figcaption>`;
      enableDrag(fig, () => openPhoto(ph, cap, fig));
      wall.appendChild(fig);
    });
  }
  let zTop = 5;
  function enableDrag(el, onTap) {
    let sx, sy, ox, oy, moved, id = null;
    el.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "touch") return; // on phones, let the page scroll
      id = e.pointerId; moved = false;
      sx = e.clientX; sy = e.clientY;
      ox = parseFloat(el.style.getPropertyValue("--x")) || 0;
      oy = parseFloat(el.style.getPropertyValue("--y")) || 0;
      el.setPointerCapture(id);
      el.style.zIndex = ++zTop;
    });
    el.addEventListener("pointermove", (e) => {
      if (e.pointerId !== id) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved && hypot(dx, dy) > 6) { moved = true; el.classList.add("is-dragging"); }
      if (moved) { el.style.setProperty("--x", `${ox + dx}px`); el.style.setProperty("--y", `${oy + dy}px`); }
    });
    const end = (e) => {
      if (e.pointerId !== id) return;
      id = null; el.classList.remove("is-dragging");
      if (!moved) onTap();
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    el.addEventListener("click", (e) => { if (e.pointerType === "touch" || e.detail === 0) onTap(); });
    el.tabIndex = 0;
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onTap(); } });
  }
  function openPhoto(ph, cap, fig) {
    if (!ph.src) {
      const tf = getComputedStyle(fig).transform;
      fig.animate([{ transform: tf }, { transform: `${tf} rotate(3deg)` }, { transform: `${tf} rotate(-3deg)` }, { transform: tf }], { duration: 400 });
      return;
    }
    const box = $("[data-lightbox]");
    $("[data-lightbox-media]").innerHTML = ph.type === "video" ? `<video src="${esc(ph.src)}" controls autoplay playsinline></video>` : `<img src="${esc(ph.src)}" alt="${cap}" />`;
    $("[data-lightbox-cap]").innerHTML = cap;
    box.showModal();
  }
  function setupLightbox() {
    const box = $("[data-lightbox]");
    box.addEventListener("click", (e) => { if (e.target === box || e.target.closest("[data-close]")) box.close(); });
    box.addEventListener("close", () => ($("[data-lightbox-media]").innerHTML = ""));
  }

  /* =========================================================
     HOURS, OPEN/CLOSED SIGN, CONTACT
     ========================================================= */
  const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
  const locale = () => ({ en: "en-GB", fr: "fr-FR", ar: "ar-LB" }[lang]);
  const dayName = (d) => new Intl.DateTimeFormat(locale(), { weekday: "long" }).format(new Date(Date.UTC(2024, 0, 7 + d, 12)));
  const hhmm = (h) => `${String(Math.floor(h) % 24).padStart(2, "0")}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;
  function beirutNow() {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Beirut", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(new Date());
    const get = (k) => parts.find((p) => p.type === k).value;
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    return { day, hour: +get("hour") + +get("minute") / 60 };
  }
  function renderHours() {
    const { day } = beirutNow();
    $("[data-hours]").innerHTML = DAY_ORDER.map((d) => {
      const h = SITE.hours[d];
      return `<li class="${d === day ? "is-today" : ""} ${h ? "" : "is-off"}"><span>${dayName(d)}</span><span>${h ? `${hhmm(h[0])} – ${hhmm(h[1])}` : t("visit.closed")}</span></li>`;
    }).join("");
    renderStatus();
  }
  function renderStatus() {
    const { day, hour } = beirutNow();
    const today = SITE.hours[day];
    const isOpen = !!today && hour >= today[0] && hour < today[1];
    const sign = $("[data-opensign]");
    sign.classList.toggle("is-open", isOpen);
    sign.classList.toggle("is-closed", !isOpen);
    let msg;
    if (isOpen) msg = t("status.open").replace("{t}", hhmm(today[1]));
    else {
      let k = 0, d = day;
      if (!(today && hour < today[0])) { do { k++; d = (day + k) % 7; } while (!SITE.hours[d] && k < 7); }
      const when = k === 0 ? t("status.today") : k === 1 ? t("status.tomorrow") : dayName(d);
      msg = SITE.hours[d] ? t("status.closed").replace("{d}", when).replace("{t}", hhmm(SITE.hours[d][0])) : "";
    }
    $("[data-status-text]").textContent = msg;
  }
  function renderContact() {
    const tel = "tel:" + SITE.phone.replace(/[^\d+]/g, "");
    const wa = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(t("wa.msg"))}`;
    const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`;
    $$("[data-call]").forEach((a) => (a.href = tel));
    $$("[data-phone]").forEach((s) => (s.textContent = SITE.phone));
    $$("[data-whatsapp]").forEach((a) => { a.href = wa; a.target = "_blank"; a.rel = "noopener"; });
    $$("[data-maps]").forEach((a) => (a.href = maps));
    const ig = $("[data-instagram]");
    if (!ig) return;
    if (SITE.instagram) { ig.href = `https://instagram.com/${SITE.instagram}`; $("[data-insta-handle]").textContent = "@" + SITE.instagram; }
    else ig.remove();
  }

  /* =========================================================
     SCROLL LOOP
     ========================================================= */
  function progress(el) {
    const r = el.getBoundingClientRect();
    const total = el.offsetHeight - innerHeight;
    return { p: clamp(-r.top / total), visible: r.bottom > 0 && r.top < innerHeight };
  }
  let ticking = false;
  function frame() {
    ticking = false;
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };


  /* =========================================================
     MOTION — reveals, parallax, tilt (all off with reduced motion)
     ========================================================= */
  function splitTitles() {
    $$(".title").forEach((el) => {
      const txt = el.textContent.trim();
      el.innerHTML = txt.split(/\s+/).map((w, i) => `<span class="w"><span style="--i:${i}">${esc(w)}</span></span>`).join(" ");
    });
  }
  let revealObs;
  function setupMotion() {
    // stagger the children of these groups as they scroll in
    [".ribbon__track", ".pasta__copy", ".section-head", ".visit__sign", ".visit__grid", ".footer", ".menu__head"].forEach((g) =>
      $$(g).forEach((box) => [...box.children].forEach((c, i) => {
        if (c.classList.contains("title")) return;
        c.setAttribute("data-reveal", "");
        c.style.setProperty("--d", `${i * 90}ms`);
      })));
    // the Aperto / Chiuso letters light up one by one
    $$(".opensign__word").forEach((w) => {
      w.innerHTML = [...w.textContent].map((c, i) => `<span class="c" style="--i:${i}">${esc(c)}</span>`).join("");
    });
    // giant numeral behind the video steps
    reels.forEach((R) => {
      if (!R.pin) return;
      R.ghost = document.createElement("span"); R.ghost.className = "story__ghost"; R.ghost.setAttribute("aria-hidden", "true");
      R.ghost.textContent = ROMAN[Math.max(0, R.active)] || "I";
      R.pin.prepend(R.ghost);
    });

    const targets = [...$$("[data-reveal]"), ...$$(".title"), $("[data-wall]"), $(".pasta"), $("[data-opensign]")].filter(Boolean);
    if (reduced || !("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("is-in", "is-settled"));
      return;
    }
    revealObs = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      if (e.target.matches("[data-wall]")) setTimeout(() => e.target.classList.add("is-settled"), 2200);
      revealObs.unobserve(e.target);
    }), { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    targets.forEach((t) => revealObs.observe(t));
  }

  function heroMotion() {
    if (!$(".hero__board")) return;
    if (reduced) return;
    const hero = $(".hero"), content = $(".hero__content"), stage = $(".hero__stage"), board = $(".hero__board");
    let mx = 0, my = 0, tx = 0, ty = 0;
    if (finePointer) {
      hero.addEventListener("pointermove", (e) => {
        const r = hero.getBoundingClientRect();
        mx = (e.clientX - r.left) / r.width - 0.5;
        my = (e.clientY - r.top) / r.height - 0.5;
      });
      hero.addEventListener("pointerleave", () => { mx = 0; my = 0; });
    }
    const tick = () => {
      requestAnimationFrame(tick);
      const y = scrollY, h = innerHeight;
      if (y > h * 1.3) return;
      tx += (mx - tx) * 0.06; ty += (my - ty) * 0.06;
      content.style.transform = `translate3d(0, ${(y * 0.35).toFixed(1)}px, 0)`;
      content.style.opacity = (1 - clamp(y / (h * 0.75))).toFixed(3);
      stage.style.transform = `translate3d(${(tx * 34).toFixed(1)}px, ${(-y * 0.12).toFixed(1)}px, 0)`;
      board.style.setProperty("--tz", `${(tx * 10).toFixed(2)}deg`);
      board.style.setProperty("--tx", `${(ty * -10).toFixed(2)}deg`);
      const svg = $("[data-hero-pizza] svg");
      if (svg) svg.style.transform = `rotate(${(y * 0.3).toFixed(1)}deg) scale(${(1 + (y / h) * 0.18).toFixed(3)})`;
    };
    requestAnimationFrame(tick);
  }


  /* =========================================================
     EXTRA — cursor, magnetic buttons, floating ingredients,
     menu follower, topping bursts, scroll-driven bits
     ========================================================= */
  function miniTopping(name, seed, size) {
    const svg = S("svg", { viewBox: "-30 -30 60 60", width: size, height: size, "aria-hidden": "true" });
    TOPPING[name].draw(S("g", {}, svg), rng(seed));
    return svg;
  }

  function crazy() {
    if (reduced) return;
    const fine = finePointer && matchMedia("(hover: hover)").matches;
    const phone = innerWidth < 860;
    const R = rng(77);

    // tricolor scroll progress under the nav
    const bar = document.createElement("span");
    bar.className = "progress";
    $(".nav").appendChild(bar);

    // floating ingredients down the edges of the page
    const layer = document.createElement("div");
    layer.className = "floaters";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);
    const kinds = ["basil", "tomato", "olive", "basil", "mushroom", "chili", "salami", "parm", "basil", "tomato", "olive", "basil"];
    const floaters = kinds.slice(0, phone ? 7 : 12).map((k, i) => {
      const depth = 0.25 + R() * 1.1;
      const size = Math.round((22 + depth * 34) * (phone ? 0.75 : 1));
      const el = document.createElement("div");
      el.className = "floater";
      el.appendChild(miniTopping(k, 900 + i, size));
      if (depth < 0.5) el.style.filter = "blur(1.5px)";
      el.style.opacity = (0.55 + Math.min(depth, 1) * 0.4).toFixed(2);
      const left = i % 2 === 0;
      el.style.left = (left ? (phone ? -3 + R() * 7 : 1 + R() * 7) : (phone ? 89 + R() * 8 : 90 + R() * 7)).toFixed(1) + "vw";
      layer.appendChild(el);
      return { el, depth, y0: R(), rot: R() * 360, spin: (R() - 0.5) * 0.7 };
    });

    // ribbon slides with scroll speed (no autoplay)
    const track = $(".ribbon__track");
    [...track.children].forEach((c) => { const k = c.cloneNode(true); k.removeAttribute("data-reveal"); k.classList.remove("is-in"); track.appendChild(k); });
    track.classList.add("is-live");
    let off = 0;

    const wall = $("[data-wall]");
    const pinned = $$("[data-reel]");
    let lastY = scrollY, vel = 0, skew = 0;
    const tick = () => {
      requestAnimationFrame(tick);
      const y = scrollY, H = innerHeight;
      const dy = y - lastY; lastY = y;
      vel += (dy - vel) * 0.15;
      const max = document.documentElement.scrollHeight - H;
      bar.style.transform = `scaleX(${max > 0 ? (y / max).toFixed(4) : 0})`;

      // hide the floaters over the video and pasta sections (text sits at the edges there)
      const op = $("[data-opening]");
      const busy = document.body.classList.contains("is-intro") || (op && !op.classList.contains("is-text") && op.getBoundingClientRect().bottom > H * 0.5) || pinned.some((el) => { const r = el.getBoundingClientRect(); return r.top < H * 0.55 && r.bottom > H * 0.45; });
      layer.style.opacity = busy ? "0" : "1";
      const span = H + 200;
      for (const f of floaters) {
        let py = (f.y0 * span - y * f.depth * 0.6) % span;
        if (py < 0) py += span;
        f.el.style.transform = `translate3d(0, ${(py - 100).toFixed(1)}px, 0) rotate(${(f.rot + y * f.spin * f.depth).toFixed(1)}deg)`;
      }

      off -= vel * 0.8;
      const half = track.scrollWidth / 2;
      if (half > 0) { off %= half; if (off > 0) off -= half; track.style.transform = `translate3d(${off.toFixed(1)}px, 0, 0)`; }

      skew += (clamp(vel * 0.25, -7, 7) - skew) * 0.1;
      if (wall.classList.contains("is-settled")) wall.style.transform = Math.abs(skew) > 0.02 ? `skewY(${skew.toFixed(2)}deg)` : "";
    };
    requestAnimationFrame(tick);

    // toppings burst out of any button you click
    const burstKinds = ["basil", "tomato", "olive", "chili", "parm", "basil", "salami"];
    const burst = (x, y) => {
      const flash = document.createElement("div");
      flash.className = "burst-ring"; flash.style.left = x + "px"; flash.style.top = y + "px";
      document.body.appendChild(flash);
      flash.animate([{ transform: "translate(-50%, -50%) scale(.2)", opacity: 1 }, { transform: "translate(-50%, -50%) scale(2.6)", opacity: 0 }], { duration: 650, easing: "cubic-bezier(.23, 1, .32, 1)" }).onfinish = () => flash.remove();
      for (let i = 0; i < 22; i++) {
        const el = document.createElement("div");
        el.className = "burst";
        el.appendChild(miniTopping(burstKinds[i % burstKinds.length], (Math.random() * 1e6) | 0, Math.round(34 + Math.random() * 24)));
        el.style.left = x + "px"; el.style.top = y + "px";
        document.body.appendChild(el);
        const a = Math.random() * TAU, sp = 140 + Math.random() * 230;
        const dx = cos(a) * sp, dy = sin(a) * sp - 70, rot = (Math.random() - 0.5) * 720;
        el.animate([
          { transform: "translate(-50%, -50%) scale(.3) rotate(0deg)", opacity: 1 },
          { transform: `translate(calc(-50% + ${dx.toFixed(0)}px), calc(-50% + ${dy.toFixed(0)}px)) scale(1) rotate(${(rot / 2).toFixed(0)}deg)`, opacity: 1, offset: 0.5 },
          { transform: `translate(calc(-50% + ${(dx * 1.25).toFixed(0)}px), calc(-50% + ${(dy + 240).toFixed(0)}px)) scale(.8) rotate(${rot.toFixed(0)}deg)`, opacity: 0 },
        ], { duration: 1100 + Math.random() * 400, easing: "cubic-bezier(.2, .6, .4, 1)" }).onfinish = () => el.remove();
      }
    };
    document.addEventListener("click", (e) => { const b = e.target.closest(".btn, .fab"); if (b) burst(e.clientX || innerWidth / 2, e.clientY || innerHeight / 2); });

    if (!fine) return;

    // gold cursor: dot + trailing ring that swells over clickable things
    const dot = document.createElement("div"); dot.className = "cursor-dot";
    const ring = document.createElement("div"); ring.className = "cursor-ring"; ring.innerHTML = "<i></i>";
    document.body.append(dot, ring);
    let cx = -100, cy = -100, rx = -100, ry = -100;
    addEventListener("pointermove", (e) => {
      cx = e.clientX; cy = e.clientY;
      const t = e.target.closest && e.target.closest("a, button, .polaroid, .mi__btn");
      ring.classList.toggle("is-big", !!t);
      dot.classList.add("is-on"); ring.classList.add("is-on");
    });
    document.documentElement.addEventListener("pointerleave", () => { dot.classList.remove("is-on"); ring.classList.remove("is-on"); });

    // magnetic buttons
    $$(".btn, .fab, .lang").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.translate = `${((e.clientX - r.left - r.width / 2) * 0.3).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * 0.4).toFixed(1)}px`;
      });
      el.addEventListener("pointerleave", () => { el.style.translate = "0px 0px"; });
    });

    // hero letters scatter away from the mouse
    const hero = $(".opening__pin") || $(".hero");
    const chars = $$(".brand--hero .ch");
    setTimeout(() => chars.forEach((c) => (c.style.transitionDelay = "0ms")), 4600);
    hero.addEventListener("pointermove", (e) => {
      if (!document.body.classList.contains("is-ready")) return;
      chars.forEach((c) => {
        const r = c.getBoundingClientRect();
        const dx = r.left + r.width / 2 - e.clientX, dy = r.top + r.height / 2 - e.clientY;
        const d = hypot(dx, dy) || 1, k = clamp(1 - d / 230);
        c.style.translate = `${((dx / d) * k * 28).toFixed(1)}px ${((dy / d) * k * 28).toFixed(1)}px`;
        c.style.rotate = `${((dx / d) * k * 16).toFixed(1)}deg`;
        c.style.color = k > 0.35 ? "var(--gold)" : "";
      });
    });
    hero.addEventListener("pointerleave", () => chars.forEach((c) => { c.style.translate = ""; c.style.rotate = ""; c.style.color = ""; }));

    // menu: a spinning drawing of the dish follows the cursor
    const grid = $("[data-menu]");
    const fl = document.createElement("div"); fl.className = "menu-float"; fl.innerHTML = '<div class="menu-float__in"></div>';
    document.body.appendChild(fl);
    const flIn = fl.firstChild;
    let cur = null, fx = innerWidth / 2, fy = innerHeight / 2;
    grid.addEventListener("pointerover", (e) => {
      const b = e.target.closest(".mi__btn");
      if (!b || b === cur || !b._draw) return;
      cur = b;
      b._svg = b._svg || b._draw();
      flIn.replaceChildren(b._svg);
      fl.classList.add("is-on");
    });
    grid.addEventListener("pointerout", (e) => {
      const b = e.target.closest(".mi__btn");
      if (b && !b.contains(e.relatedTarget)) { cur = null; fl.classList.remove("is-on"); }
    });

    const follow = () => {
      requestAnimationFrame(follow);
      rx += (cx - rx) * 0.18; ry += (cy - ry) * 0.18;
      dot.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`;
      const vx = cx - fx;
      fx += vx * 0.14; fy += (cy - fy) * 0.14;
      fl.style.transform = `translate3d(${(fx + 40).toFixed(1)}px, ${(fy - 110).toFixed(1)}px, 0) rotate(${clamp(vx * 0.08, -18, 18).toFixed(1)}deg)`;
    };
    requestAnimationFrame(follow);
  }


  /* =========================================================
     STEAM — warm steam rising over each join between the videos
     ========================================================= */
  function steamBridge() {
    if (reduced) return;
    const phone = innerWidth < 860;
    const tints = ["255,226,186", "255,210,160", "255,240,220", "255,196,140"];
    // soft, irregular puff sprites (several overlapping blobs, blurred), pre-tinted
    const sprites = [0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
      const tint = tints[k % tints.length];
      const c = document.createElement("canvas"); c.width = c.height = 128;
      const g = c.getContext("2d");
      const r = rng(31 + k * 7);
      try { g.filter = "blur(6px)"; } catch {}
      for (let i = 0; i < 7; i++) {
        const x = 64 + (r() - 0.5) * 50, y = 64 + (r() - 0.5) * 40, rad = 14 + r() * 22;
        const gr = g.createRadialGradient(x, y, 0, x, y, rad);
        gr.addColorStop(0, `rgba(${tint},.6)`); gr.addColorStop(1, `rgba(${tint},0)`);
        g.fillStyle = gr; g.beginPath(); g.arc(x, y, rad, 0, TAU); g.fill();
      }
      return c;
    });

    const bridges = $$("[data-steam]").map((cv) => {
      // the video right after this join comes into focus through the steam
      let next = cv.parentElement.nextElementSibling;
      while (next && !next.matches("[data-reel]")) next = next.nextElementSibling;
      const B = { cv, ctx: cv.getContext("2d"), next: next ? $("video", next) : null, W: 0, H: 0, parts: [] };
      const resize = () => {
        const dpr = Math.min(1.5, devicePixelRatio || 1);
        B.W = cv.clientWidth; B.H = cv.clientHeight;
        cv.width = Math.round(B.W * dpr); cv.height = Math.round(B.H * dpr);
        B.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resize(); addEventListener("resize", resize);
      const N = phone ? 38 : 70;
      B.spawn = (fresh) => ({
        x: Math.random() * B.W,
        y: fresh ? B.H * (0.45 + Math.random() * 0.55) : B.H * (0.85 + Math.random() * 0.2),
        vy: 0.35 + Math.random() * 0.75, ph: Math.random() * TAU, amp: 0.3 + Math.random() * 0.8,
        s0: 60 + Math.random() * 90, grow: 0.6 + Math.random() * 1.2,
        life: fresh ? Math.random() : 0, speed: 0.0022 + Math.random() * 0.003,
        spr: (Math.random() * sprites.length) | 0, rot: Math.random() * TAU,
      });
      B.parts = Array.from({ length: N }, () => B.spawn(true));
      return B;
    });

    let lastY = scrollY;
    const tick = (t) => {
      requestAnimationFrame(tick);
      const vh = innerHeight;
      const dy = scrollY - lastY; lastY = scrollY;
      for (const B of bridges) {
        if (B.next) {
          const nr = B.next.parentElement.parentElement.getBoundingClientRect(); // the pinned frame
          const k = clamp((nr.top - vh * 0.15) / (vh * 0.7));
          B.next.style.setProperty("--venter", k.toFixed(3));
        }
        const r = B.cv.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        const mid = r.top + r.height / 2;
        const strength = clamp(1 - Math.abs(mid - vh * 0.55) / (vh * 0.9));
        const ctx = B.ctx;
        ctx.clearRect(0, 0, B.W, B.H);
        if (strength < 0.01) continue;
        ctx.globalCompositeOperation = "screen";
        for (const q of B.parts) {
          q.life += q.speed;
          q.y -= q.vy + dy * 0.25;
          q.x += Math.sin(t / 1400 + q.ph) * q.amp;
          q.rot += 0.002;
          if (q.life >= 1 || q.y < -200) Object.assign(q, B.spawn(false));
          const size = q.s0 * (1 + q.life * q.grow);
          const a = Math.sin(q.life * Math.PI) * 0.22 * strength;
          if (a < 0.003) continue;
          ctx.save();
          ctx.globalAlpha = a;
          ctx.translate(q.x, q.y); ctx.rotate(q.rot);
          ctx.drawImage(sprites[q.spr], -size / 2, -size / 2, size, size);
          ctx.restore();
        }
      }
    };
    requestAnimationFrame(tick);
  }


  /* =========================================================
     OPENING — the commercial plays by itself; when it ends its pizza
     starts spinning, slides down, and the name drops in from the top
     ========================================================= */
  function opening() {
    const el = $("[data-opening]");
    if (!el) return;
    const cfg = SITE.openingVideo || {};
    const pin = $(".opening__pin", el), v = $(".opening__video", el), bg = $(".opening__bg", el);
    const disc = $(".opening__disc", el), shade = $(".opening__shade", el);
    const P = cfg.pizza || { cx: 244, cy: 458, r: 236 };
    [v, bg].forEach((x) => {
      x.muted = true; x.playsInline = true; x.preload = "auto"; x.loop = false;
      if (cfg.src) x.src = cfg.src;
    });
    if (cfg.poster) v.poster = cfg.poster;
    // bottom piece lands first, the name last, so nothing falls through what already landed
    const pieces = $$(".hero__content > *", el);
    pieces.forEach((c, i) => c.style.setProperty("--k", pieces.length - 1 - i));

    let phase = "video", moveK = 0, t0 = 0;
    const layout = () => {
      const W = pin.clientWidth, H = pin.clientHeight;
      const vw = v.videoWidth || 496, vh = v.videoHeight || 864;
      const wide = W / H > 0.75;
      el.classList.toggle("is-wide", wide);
      const sc = wide ? Math.min(W / vw, H / vh) : Math.max(W / vw, H / vh);
      const x0 = (W - vw * sc) / 2, y0 = (H - vh * sc) / 2;
      const size = 2 * P.r * sc, left = x0 + (P.cx - P.r) * sc, top = y0 + (P.cy - P.r) * sc;
      const endScale = wide ? 1.05 : 0.95;
      const endTop = H - size * endScale * 0.48;
      disc.style.width = disc.style.height = size.toFixed(1) + "px";
      disc.style.left = left.toFixed(1) + "px";
      disc.style.top = top.toFixed(1) + "px";
      disc.style.transform = `translate3d(0, ${(moveK * (endTop - top)).toFixed(1)}px, 0) scale(${(1 + moveK * (endScale - 1)).toFixed(3)})`;
      const fade = clamp(moveK * 3.5); // the frame behind fades out quickly so there is only one pizza
      shade.style.opacity = (fade * 0.85).toFixed(3);
      v.style.opacity = (1 - fade * 0.95).toFixed(3);
      bg.style.opacity = (1 - fade * 0.5).toFixed(3);
    };
    const finish = () => {
      if (phase !== "video") return;
      phase = "spin";
      el.classList.add("is-spin");                        // the last-frame pizza starts spinning
      setTimeout(() => { phase = "settle"; t0 = performance.now(); }, reduced ? 0 : 900);   // then slides down
      setTimeout(() => el.classList.add("is-text"), reduced ? 0 : 1200);                   // and the name drops in
    };
    v.addEventListener("ended", finish);
    const toEnd = () => { try { v.currentTime = Math.max(0, (v.duration || 10) - 0.05); } catch {} };
    const start = () => {
      if (reduced) { toEnd(); finish(); return; }
      v.playbackRate = bg.playbackRate = cfg.speed || 1;
      const pr = v.play();
      if (pr && pr.catch) pr.catch(() => { toEnd(); finish(); });
      bg.play().catch(() => {});
      // if the phone refuses to play videos (e.g. battery saver), skip straight to the ending
      setTimeout(() => { if (phase === "video" && v.paused && v.currentTime < 0.1) { toEnd(); finish(); } }, 1800);
    };
    if (window.__siteOpen) start(); else window.addEventListener("site-open", start, { once: true });

    const tick = (now) => {
      requestAnimationFrame(tick);
      if (phase === "settle") moveK = reduced ? 1 : easeOut(clamp((now - t0) / 1400));
      const r = el.getBoundingClientRect();
      if (r.bottom < 0) return;
      layout();
    };
    requestAnimationFrame(tick);
  }

  /* =========================================================
     BOOT
     ========================================================= */
  hero();
  setupReels();
  setupLightbox();
  $$("[data-lang]").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));
  $("[data-year]").textContent = new Date().getFullYear();

  const nav = (navigator.language || "en").slice(0, 2);
  setLang(store.get("tavola-lang") || (TEXT[nav] ? nav : "en"));

  frame();
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  setInterval(renderStatus, 60000);
  intro();
  embers();
  setupMotion();
  heroMotion();
  crazy();
  steamBridge();
  opening();
})();
