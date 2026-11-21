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

  // smooth, slightly wobbly closed shape
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
  // random points inside a circle, keeping some distance from each other
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
    basil: { n: 6, R: 125, d: 52, draw(g, r) {
      S("path", { d: "M0,-20 C11,-13 12,7 0,20 C-12,7 -11,-13 0,-20Z", fill: "url(#g-basil)", filter: "url(#f-shadow)" }, g);
      S("path", { d: "M0,-17 L0,17 M0,-6 L6,-11 M0,2 L-6,-4 M0,9 L5,4", stroke: "#a8d98a", "stroke-width": 1, opacity: 0.45, fill: "none" }, g);
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
    chili: { n: 14, R: 140, d: 24, draw(g, r) {
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

  function makePizza(o = {}) {
    const r = rng(o.seed || 1);
    const svg = S("svg", { viewBox: "-215 -215 430 430", "aria-hidden": "true" });
    const L = { svg };
    S("ellipse", { cx: 0, cy: 12, rx: 198, ry: 198, fill: "#2a0c04", opacity: 0.28, filter: "url(#f-softer)" }, svg);
    const base = (L.base = S("g", {}, svg));
    const edge = blob(0, 0, 194, 194, r, 0.022, 22);
    L.raw = S("path", { d: edge, fill: "url(#g-dough)" }, base);
    L.crust = S("path", { d: edge, fill: "url(#g-crust)" }, base);

    // leopard spots + blisters on the rim
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

    // sauce
    L.sauce = S("g", {}, base);
    if (o.sauce !== "none") {
      S("path", { d: blob(0, 0, 160, 160, r, 0.04, 16), fill: o.sauce === "white" ? "url(#g-white)" : "url(#g-sauce)", filter: "url(#f-rough)" }, L.sauce);
      if (o.sauce !== "white") for (let i = 0; i < 40; i++) {
        const a = r() * TAU, d = Math.sqrt(r()) * 148;
        S("circle", { cx: f(cos(a) * d), cy: f(sin(a) * d), r: f(0.8 + r() * 1.4), fill: "#6e140b", opacity: 0.35 }, L.sauce);
      }
    }

    const taken = [];
    // mozzarella
    L.cheeseG = S("g", {}, base);
    L.cheese = [];
    L.brown = S("g", { filter: "url(#f-soft)" }, base);
    if (o.cheese !== false) {
      const pts = scatter(r, 125, o.sauce === "white" ? 16 : 13, 48);
      pts.forEach(([x, y]) => {
        const p = piece(L.cheeseG, x, y, r() * 360, 1);
        const rad = 20 + r() * 12;
        S("path", { d: blob(0, 0, rad, rad * (0.8 + r() * 0.3), r, 0.24, 8), fill: "url(#g-cheese)", filter: "url(#f-shadow)" }, p.inner);
        S("ellipse", { cx: -rad * 0.3, cy: -rad * 0.3, rx: rad * 0.3, ry: rad * 0.15, fill: "#fff", opacity: 0.5 }, p.inner);
        L.cheese.push(p);
        for (let k = 0; k < 2; k++) S("circle", { cx: f(x + (r() * 2 - 1) * rad * 0.5), cy: f(y + (r() * 2 - 1) * rad * 0.5), r: f(3 + r() * 5), fill: "#d39444", opacity: 0.5 }, L.brown);
      });
    }

    // toppings
    L.tops = {};
    (o.toppings || []).forEach((name) => {
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

    // olive oil sheen
    L.oil = S("g", { filter: "url(#f-soft)" }, base);
    for (let i = 0; i < 6; i++) {
      const a = r() * TAU, d = r() * 110;
      S("ellipse", { cx: f(cos(a) * d), cy: f(sin(a) * d), rx: f(10 + r() * 18), ry: f(3 + r() * 4), transform: `rotate(${f(r() * 180)})`, fill: "#fff6c8", opacity: 0.22 }, L.oil);
    }
    return L;
  }

  /* =========================================================
     SPAGHETTI PLATE ILLUSTRATION
     ========================================================= */
  const NOODLE = {
    red: ["#e0873f", "#d4612d", "#e99a4c"],
    oil: ["#f3d58a", "#ecc66c", "#f6df9f"],
    cream: ["#f5d97f", "#edc663", "#f8e39c"],
    ragu: ["#efc46f", "#e8b35e", "#f4d185"],
  };

  function makePasta(o = {}) {
    const r = rng(o.seed || 3);
    const svg = S("svg", { viewBox: "-215 -215 430 430", "aria-hidden": "true" });
    const L = { svg };
    const colors = NOODLE[o.sauce] || NOODLE.red;

    S("ellipse", { cx: 0, cy: 14, rx: 204, ry: 204, fill: "#2a0c04", opacity: 0.25, filter: "url(#f-softer)" }, svg);
    S("circle", { r: 204, fill: "url(#g-plate)" }, svg);
    S("circle", { r: 197, fill: "none", stroke: "#c8321f", "stroke-width": 3.5 }, svg);
    S("circle", { r: 190, fill: "none", stroke: "#c8321f", "stroke-width": 1, opacity: 0.6 }, svg);
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

    // sauce on top
    const top = (L.top = S("g", {}, food));
    if (o.sauce === "red") {
      S("path", { d: blob(0, 0, 58, 50, r, 0.25, 9), fill: "url(#g-sauce)", opacity: 0.92, filter: "url(#f-rough)" }, top);
    } else if (o.sauce === "ragu") {
      S("path", { d: blob(0, 0, 66, 58, r, 0.2, 10), fill: "#9b3a1c", filter: "url(#f-rough)" }, top);
      for (let i = 0; i < 70; i++) {
        const a = r() * TAU, d = Math.sqrt(r()) * 58;
        S("circle", { cx: f(cos(a) * d), cy: f(sin(a) * d), r: f(2 + r() * 4), fill: r() > 0.5 ? "#6b2a14" : "#8a3a1c" }, top);
      }
    } else if (o.sauce === "oil" || o.sauce === "cream") {
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
        S("ellipse", { cx: -8, cy: -10, rx: 5, ry: 2.5, fill: "#fff", opacity: 0.25 }, p.inner);
      });
    }
    if (ex.includes("bacon")) scatter(r, 100, 16, 18).forEach(([x, y]) => {
      const p = piece(top, x, y, r() * 180, 1);
      S("rect", { x: -6, y: -3.5, width: 12, height: 7, rx: 2, fill: r() > 0.5 ? "#a44a2c" : "#c46a3e", filter: "url(#f-shadow)" }, p.inner);
      S("rect", { x: -6, y: -0.6, width: 12, height: 1.6, fill: "#f2c7a5", opacity: 0.8 }, p.inner);
    });
    if (ex.includes("garlic")) scatter(r, 100, 12, 20).forEach(([x, y]) => {
      const p = piece(top, x, y, r() * 180, 0.8); TOPPING.garlic.draw(p.inner, r);
    });
    const specks = (name, n, R, fn) => { if (ex.includes(name)) for (let i = 0; i < n; i++) { const a = r() * TAU, d = Math.sqrt(r()) * R; fn(cos(a) * d, sin(a) * d); } };
    specks("chili", 40, 115, (x, y) => S("rect", { x: f(x), y: f(y), width: 3, height: 2, fill: "#c8200f", transform: `rotate(${f(r() * 180)} ${f(x)} ${f(y)})` }, top));
    specks("parsley", 70, 115, (x, y) => S("circle", { cx: f(x), cy: f(y), r: f(1 + r()), fill: "#3d7a2a" }, top));
    specks("pepper", 70, 115, (x, y) => S("circle", { cx: f(x), cy: f(y), r: f(0.8 + r() * 0.8), fill: "#1d1512" }, top));
    specks("parm", 80, 70, (x, y) => S("rect", { x: f(x), y: f(y), width: f(2 + r() * 3), height: 1.6, fill: "#fff6dc", transform: `rotate(${f(r() * 180)} ${f(x)} ${f(y)})` }, top));
    if (ex.includes("basil")) [[-14, -20, -30], [16, -8, 40], [-2, 16, 160]].forEach(([x, y, rt]) => {
      const p = piece(top, x, y, rt, 1.05); TOPPING.basil.draw(p.inner, r);
    });

    if (o.story) {
      // the twirl: a spiral nest + a fork
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
      for (let i = 0; i < 30; i++) { const a = r() * TAU, d = Math.sqrt(r()) * 40; S("rect", { x: f(cos(a) * d), y: f(sin(a) * d), width: f(2 + r() * 3), height: 1.6, fill: "#fff6dc" }, L.nestTop); }
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
  }

  /* =========================================================
     INTRO
     ========================================================= */
  function intro() {
    const box = $("[data-intro]");
    const neon = $(".neon--intro", box);
    let done = false;
    const open = () => {
      if (done) return; done = true;
      neon.classList.add("is-lit");
      box.classList.add("is-open");
      document.body.classList.remove("is-intro");
      setTimeout(() => document.body.classList.add("is-ready"), 350);
      setTimeout(() => box.classList.add("is-gone"), 1300);
    };
    if (reduced) { open(); return; }
    setTimeout(() => neon.classList.add("is-lit"), 350);
    setTimeout(open, 2300);
    box.addEventListener("click", open);
    addEventListener("keydown", open, { once: true });
  }

  /* =========================================================
     HERO
     ========================================================= */
  function hero() {
    const title = $("[data-split]");
    const txt = title.textContent;
    title.textContent = "";
    [...txt].forEach((c, i) => {
      const s = document.createElement("span");
      s.className = c === " " ? "ch sp" : "ch";
      s.textContent = c === " " ? " " : c;
      s.style.transitionDelay = `${i * 55}ms`;
      title.appendChild(s);
    });
    $("[data-hero-pizza]").appendChild(makePizza({ seed: 11, sauce: "red", cheese: true, toppings: ["basil"] }).svg);
  }

  /* =========================================================
     STORY — the pizza builds itself
     ========================================================= */
  const story = {};
  function setupStory() {
    story.el = $("[data-story]");
    story.L = makePizza({ seed: 5, sauce: "red", cheese: true, toppings: ["basil"] });
    $("[data-story-pizza]").appendChild(story.L.svg);
    story.pizza = $("[data-story-pizza]");
    story.steps = $$("[data-steps] li");
    story.dots = $$("[data-story-dots] i");
    story.oven = $(".oven");
    story.peel = $(".story__peel");
    story.temp = $("[data-temp]");
    story.time = $("[data-time]");
    // clip the sauce so it can "spread"
    const cp = S("clipPath", { id: "clip-sauce" }, S("defs", {}, story.L.svg));
    story.clip = S("circle", { r: 0 }, cp);
    story.L.sauce.setAttribute("clip-path", "url(#clip-sauce)");
    const flames = $("[data-flames]");
    for (let i = 0; i < 12; i++) { const fl = document.createElement("i"); fl.style.animationDelay = `${(i % 5) * -0.11}s`; flames.appendChild(fl); }
    story.active = -1;
  }
  function renderStory(p) {
    const s = p * 5;
    const L = story.L;
    // 1. dough stretches out
    const dough = easeOut(seg(s, 0, 0.9));
    const wob = sin(s * 9) * 0.02 * (1 - dough);
    L.base.setAttribute("transform", `scale(${(0.42 + dough * 0.58 + wob).toFixed(3)} ${(0.42 + dough * 0.58 - wob).toFixed(3)})`);
    // 2. sauce spreads in a spiral
    const sauce = easeOut(seg(s, 1, 1.85));
    story.clip.setAttribute("r", f(sauce * 175));
    L.sauce.setAttribute("transform", `rotate(${f((1 - sauce) * -120)})`);
    // 3. cheese drops in one by one
    const ck = seg(s, 2, 2.9);
    L.cheese.forEach((c, i) => {
      const k = easeBack(seg(ck, (i / L.cheese.length) * 0.7, (i / L.cheese.length) * 0.7 + 0.3));
      c.outer.setAttribute("transform", `translate(${f(c.x)} ${f(c.y - (1 - k) * 70)}) scale(${(0.4 + 0.6 * clamp(k, 0, 1.2)).toFixed(3)})`);
      c.outer.setAttribute("opacity", clamp(k * 2).toFixed(2));
    });
    // 4. the oven
    const bake = seg(s, 3.1, 3.9);
    L.crust.setAttribute("opacity", bake.toFixed(3));
    L.char.setAttribute("opacity", bake.toFixed(3));
    L.brown.setAttribute("opacity", (bake * 0.9).toFixed(3));
    const ovenIn = seg(s, 2.75, 3.1) * (1 - seg(s, 3.95, 4.25));
    story.oven.style.opacity = ovenIn.toFixed(3);
    story.peel.style.opacity = (1 - ovenIn * 0.85).toFixed(3);
    const puff = 1 + sin(bake * Math.PI) * 0.03;
    story.pizza.style.transform = `scale(${((1 - ovenIn * 0.1) * puff).toFixed(3)}) rotate(${f(p * 140)}deg)`;
    const temp = Math.round(20 + 430 * easeOut(seg(s, 2.6, 3.15)));
    story.temp.textContent = temp;
    const secs = Math.round(90 * seg(s, 3.1, 3.9));
    story.time.textContent = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
    // 5. basil & olive oil
    const fin = seg(s, 4.05, 4.8);
    (L.tops.basil || []).forEach((b, i, arr) => {
      const k = easeBack(seg(fin, (i / arr.length) * 0.6, (i / arr.length) * 0.6 + 0.4));
      b.outer.setAttribute("transform", `translate(${f(b.x)} ${f(b.y)}) scale(${clamp(k, 0, 1.3).toFixed(3)})`);
    });
    L.oil.setAttribute("opacity", fin.toFixed(3));

    const idx = min(4, Math.floor(s));
    if (idx !== story.active) {
      story.active = idx;
      story.steps.forEach((li, i) => li.classList.toggle("is-active", i === idx));
    }
    story.dots.forEach((d, i) => d.style.setProperty("--fill", clamp(s - i).toFixed(3)));
  }

  /* =========================================================
     PASTA — twirl as you scroll
     ========================================================= */
  const pasta = {};
  function setupPasta() {
    pasta.el = $("[data-pasta]");
    pasta.L = makePasta({ seed: 21, sauce: "red", extras: ["basil", "parm"], story: true });
    $("[data-pasta-plate]").appendChild(pasta.L.svg);
    pasta.hint = $(".pasta__hint");
  }
  function renderPasta(p) {
    const L = pasta.L;
    const tw = easeOut(seg(p, 0.05, 0.85));
    L.food.setAttribute("transform", `rotate(${f(tw * 300)}) scale(${(1 - tw * 0.62).toFixed(3)})`);
    L.food.setAttribute("opacity", (1 - seg(p, 0.6, 0.85)).toFixed(3));
    L.nestPaths.forEach((n) => n.setAttribute("stroke-dashoffset", (1 - tw).toFixed(4)));
    L.fork.setAttribute("transform", `rotate(${f(tw * 900)})`);
    L.nestTop.setAttribute("opacity", seg(p, 0.72, 0.88).toFixed(3));
    const lift = easeOut(seg(p, 0.82, 1));
    L.lift.setAttribute("transform", `translate(0 ${f(-lift * 30)}) scale(${(1 + lift * 0.25).toFixed(3)})`);
    pasta.hint.style.opacity = (1 - seg(p, 0.1, 0.4)).toFixed(2);
  }

  /* =========================================================
     MENU
     ========================================================= */
  let tab = "pizza";
  function renderMenu() {
    const ul = $("[data-dishes]");
    ul.innerHTML = "";
    SITE.menu[tab].forEach((d, i) => {
      const li = document.createElement("li");
      li.className = "dish";
      li.style.animationDelay = `${i * 60}ms`;
      const tags = (d.tags || []).map((tg) => `<span class="tag tag--${tg}">${t("tag." + tg)}</span>`).join("");
      li.innerHTML = `
        <button class="dish__btn" aria-expanded="false">
          <span class="dish__row"><span class="dish__name" lang="it">${d.name}</span><span class="dish__dots"></span><span class="dish__price">${SITE.currency}${d.price}</span></span>
          <span class="dish__desc" style="display:block">${d.desc[lang] || d.desc.en}</span>
          ${tags ? `<span class="dish__tags">${tags}</span>` : ""}
        </button>
        <div class="dish__panel"><div><div class="dish__art"></div></div></div>`;
      const btn = $(".dish__btn", li);
      btn.addEventListener("click", () => {
        const art = $(".dish__art", li);
        if (!art.firstChild) {
          const seed = 100 + i * 17 + (tab === "pasta" ? 500 : 0);
          art.appendChild(tab === "pizza" ? makePizza({ seed, ...d.draw }).svg : makePasta({ seed, ...d.draw }).svg);
        }
        const open = !li.classList.contains("is-open");
        $$(".dish.is-open", ul).forEach((o) => { o.classList.remove("is-open"); $(".dish__btn", o).setAttribute("aria-expanded", "false"); });
        li.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", String(open));
      });
      ul.appendChild(li);
    });
  }
  function setupMenu() {
    $$("[data-tab]").forEach((b) => b.addEventListener("click", () => {
      tab = b.dataset.tab;
      $$("[data-tab]").forEach((x) => x.setAttribute("aria-selected", String(x === b)));
      renderMenu();
    }));
  }

  /* =========================================================
     PHOTOS — polaroids you can drag around
     ========================================================= */
  const ROT = [-4, 3, -2, 5, -3, 2.5, -5, 4];
  const CAMERA = `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"><path d="M6 15h8l4-5h12l4 5h8v23H6z"/><circle cx="24" cy="26" r="7.5"/></svg>`;
  const VIDEO = `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"><rect x="5" y="12" width="28" height="24" rx="3"/><path d="M33 21l10-6v18l-10-6z"/></svg>`;
  function renderPhotos() {
    const wall = $("[data-wall]");
    const keep = {};
    $$(".polaroid", wall).forEach((p) => (keep[p.dataset.i] = [p.style.getPropertyValue("--x"), p.style.getPropertyValue("--y")]));
    wall.innerHTML = "";
    SITE.photos.forEach((ph, i) => {
      const fig = document.createElement("figure");
      fig.className = "polaroid";
      fig.dataset.i = i;
      fig.style.margin = "0";
      fig.style.setProperty("--r", `${ROT[i % ROT.length]}deg`);
      if (keep[i]) { fig.style.setProperty("--x", keep[i][0]); fig.style.setProperty("--y", keep[i][1]); }
      const cap = ph.caption[lang] || ph.caption.en;
      let media;
      if (!ph.src) media = `<div class="polaroid__soon">${ph.type === "video" ? VIDEO : CAMERA}<span>${t(ph.type === "video" ? "photos.soonVideo" : "photos.soon")}</span></div>`;
      else if (ph.type === "video") media = `<video src="${ph.src}" muted loop playsinline autoplay preload="metadata"></video>`;
      else media = `<img src="${ph.src}" alt="${cap}" loading="lazy" draggable="false" />`;
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
      fig.animate([{ transform: getComputedStyle(fig).transform }, { transform: `${getComputedStyle(fig).transform} rotate(4deg)` }, { transform: `${getComputedStyle(fig).transform} rotate(-4deg)` }, { transform: getComputedStyle(fig).transform }], { duration: 400 });
      return;
    }
    const box = $("[data-lightbox]");
    $("[data-lightbox-media]").innerHTML = ph.type === "video" ? `<video src="${ph.src}" controls autoplay playsinline></video>` : `<img src="${ph.src}" alt="${cap}" />`;
    $("[data-lightbox-cap]").textContent = cap;
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
    const ul = $("[data-hours]");
    ul.innerHTML = DAY_ORDER.map((d) => {
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
    const a = progress(story.el);
    if (a.visible) renderStory(a.p);
    const b = progress(pasta.el);
    if (b.visible) renderPasta(b.p);
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };

  /* =========================================================
     BOOT
     ========================================================= */
  hero();
  setupStory();
  setupPasta();
  setupMenu();
  setupLightbox();
  $$("[data-lang]").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));
  $("[data-year]").textContent = new Date().getFullYear();

  const nav = (navigator.language || "en").slice(0, 2);
  setLang(store.get("tavola-lang") || (TEXT[nav] ? nav : "en"));

  renderStory(0);
  renderPasta(0);
  frame();
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  setInterval(renderStatus, 60000);
  intro();
})();
