// Anna Nolden — portfolio. Builds the index from content/projects.js and opens projects in a pop-up.
// <body data-list="projects"> on index.html, <body data-list="extras"> on extras.html.
(() => {
const LIST  = document.body.dataset.list || "projects";
const ITEMS = LIST === "extras" ? EXTRAS : PROJECTS;
const byId  = id => ITEMS.find(p => p.id === id);
const calm  = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc   = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fmt   = s => isFinite(s) ? `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}` : "0:00";
const BASE_TITLE = document.title;

/* ---- sound: on by default, remembered per visitor ---- */
const store = { get(k,d){ try { const v = localStorage.getItem(k); return v === null ? d : v === "1"; } catch(e){ return d; } },
                set(k,v){ try { localStorage.setItem(k, v ? "1" : "0"); } catch(e){} } };
let soundOn = store.get("an:sound", true);
const sndBtn = document.getElementById("snd");
sndBtn.textContent = soundOn ? "on" : "off";
sndBtn.onclick = () => { soundOn = !soundOn; store.set("an:sound", soundOn); sndBtn.textContent = soundOn ? "on" : "off"; if (!soundOn && VIEW) VIEW.muteAll(); };

/* ---- header: the name on an LCD, plus links ---- */
const nameLCD = document.getElementById("name");
calm ? LCD.show(nameLCD, "ANNA NOLDEN\nSTOCKHOLM, SE") : LCD.type(nameLCD, "ANNA NOLDEN\nSTOCKHOLM, SE", 45);
const L = SITE.links || {}, links = [];
if (L.cv) links.push(`<a href="${esc(L.cv)}">cv</a>`);
if (L.github) links.push(`<a href="${esc(L.github)}" rel="me">github</a>`);
if (L.linkedin) links.push(`<a href="${esc(L.linkedin)}" rel="me">linkedin</a>`);
if (L.email) links.push(`<a href="mailto:${esc(L.email)}">email</a>`);
document.getElementById("links").innerHTML = links.join(" ");
const bio = document.getElementById("bio");
if (bio && LIST === "projects") bio.innerHTML = SITE.bio.map(p => `<p>${esc(p)}</p>`).join("");
document.getElementById("credits").textContent = `${SITE.credits} © ${new Date().getFullYear()} Anna Nolden.`;

/* ---- index table ---- */
const KEYS = SITE.cords || [];
const mark = t => KEYS.reduce((o,k) => o.replace(esc(k), `<span class="tok k" data-k="${esc(k)}">${esc(k)}</span>`), esc(t));
const tbody = document.querySelector("#tbl tbody");
ITEMS.forEach((p, i) => {
  const tr = document.createElement("tr"); tr.className = "row"; tr.dataset.id = p.id;
  tr.innerHTML = `
    <td class="n">${String(ITEMS.length - i).padStart(2, "0")}</td>
    <td class="t"><a href="#${esc(p.id)}">${esc(p.title)}</a><small>${esc(p.kind)}</small></td>
    <td class="m">${(p.tools || []).map(t => `<span class="tok">${mark(t)}</span>`).join(", ")}</td>
    <td class="w">${p.with ? (p.with.includes(",") ? `group of ${p.with.split(",").length + 1}` : mark(p.with)) : "—"}</td>
    <td class="y">${esc(p.year)}</td>`;
  tbody.appendChild(tr);
  tr.querySelector("td.t a").addEventListener("click", e => { e.preventDefault(); popup(p); });
});

/* ---- media helpers ---- */
const M = "media/";
const imgTag = (m, cls="") => `<img class="${cls}" src="${M}${m.img}-1600.jpg" srcset="${M}${m.img}-800.jpg 800w, ${M}${m.img}-1600.jpg 1600w" sizes="(max-width:760px) 100vw, 62vw" alt="${esc(m.alt)}">`;
const thumbSrc = m => `${M}${m.img || m.video || m.thumb}-thumb.jpg`;
const thumb = m => `<img src="${thumbSrc(m)}" alt="" loading="lazy">${m.play ? `<span class="lbl">▶ try it</span>` : m.video ? `<span class="lbl">▶</span>` : ""}`;

/* ---- pop-up ---- */
const pop = document.getElementById("pop");
let VIEW = null, returnFocus = null;

function popup(p) {
  const i = ITEMS.indexOf(p), prev = ITEMS[i-1], next = ITEMS[i+1], g = p.media || [];
  if (!pop.classList.contains("open")) returnFocus = document.activeElement;
  pop.innerHTML = `<div class="veil"></div>
  <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="pt" tabindex="-1">
    <div class="bar"><span>Anna Nolden${LIST === "extras" ? " / extras" : ""} / ${esc(p.title)}</span><button class="link close">close</button></div>
    <div class="pv">
      <div class="side">
        <canvas class="lcd ttl" data-dot="2" aria-hidden="true"></canvas><h2 class="vh" id="pt">${esc(p.title)}</h2>
        <p>${esc(p.line)}</p>
        ${p.note ? `<p>${esc(p.note)}</p>` : ""}
        <dl><dt>year</dt><dd>${esc(p.year)}</dd><dt>where</dt><dd>${esc(p.where)}</dd>${p.with ? `<dt>with</dt><dd>${esc(p.with)}</dd>` : ""}
            <dt>my part</dt><dd>${esc(p.mine)}</dd><dt>made with</dt><dd>${esc((p.tools || []).join(", "))}</dd>${p.music ? `<dt>music</dt><dd>${esc(p.music)}</dd>` : ""}</dl>
      </div>
      <div class="media">
        <div class="stage"></div>
        <div class="ctl"></div>
        ${g.length > 1 ? `<div class="rail" role="group" aria-label="images">${g.map((m,k) => `<button data-i="${k}" aria-label="${esc(m.alt)}">${thumb(m)}</button>`).join("")}</div>` : ""}
      </div>
    </div>
    <div class="nav">
      <span>${prev ? `<button class="link" data-go="${prev.id}">← ${esc(prev.title)}</button>` : ""}</span>
      <span class="keys">← → previous / next · space pauses video · esc closes</span>
      <span>${next ? `<button class="link" data-go="${next.id}">${esc(next.title)} →</button>` : ""}</span>
    </div>
  </div>`;
  const ttl = pop.querySelector("canvas.ttl");
  calm ? (LCD.title(ttl, p.title, 14, 0), LCD.show(ttl, ttl._text || "")) : LCD.title(ttl, p.title, 14);
  VIEW = stageFor(pop, g); VIEW.project = p;
  pop.querySelector(".close").onclick = closePop;
  pop.querySelector(".veil").onclick = closePop;
  pop.querySelectorAll("[data-go]").forEach(b => b.onclick = () => popup(byId(b.dataset.go)));
  pop.classList.add("open"); document.documentElement.classList.add("locked");
  pop.querySelector(".sheet").focus({preventScroll: true});
  document.title = `${p.title} · Anna Nolden`;
  history.replaceState(null, "", "#" + p.id);
}
function closePop() {
  pop.classList.remove("open"); pop.innerHTML = ""; VIEW = null;
  document.documentElement.classList.remove("locked");
  document.title = BASE_TITLE; history.replaceState(null, "", location.pathname + location.search);
  if (returnFocus && document.contains(returnFocus)) returnFocus.focus(); else {
    const a = location.hash && tbody.querySelector(`[data-id] a`); a && a.focus();
  }
}

/* ---- the stage: one item at a time, with controls that fit what it is ---- */
function stageFor(root, g) {
  const stage = root.querySelector(".stage"), ctl = root.querySelector(".ctl");
  let cur = 0, raf = 0;
  const enlarge = `<button class="link enl">enlarge</button>`;
  function show(i) {
    cur = i; cancelAnimationFrame(raf); const m = g[i];
    root.querySelectorAll(".rail button").forEach(b => b.setAttribute("aria-current", +b.dataset.i === i));
    if (m.play) {
      stage.innerHTML = `<iframe src="${esc(m.play)}" title="${esc(m.alt)}"></iframe>`;
      ctl.innerHTML = `<span class="grow"></span><a href="${esc(m.play)}" target="_blank" rel="noopener">open in a new tab</a>`;
      return;
    }
    if (m.video) {
      stage.innerHTML = `<video src="${M}${m.video}.mp4" poster="${M}${m.video}-poster.jpg" loop playsinline muted preload="metadata" aria-label="${esc(m.alt)}"></video>`;
      ctl.innerHTML = `<span class="vc">
          <button class="link pp">pause</button>
          <input class="scrub" type="range" min="0" max="1000" value="0" aria-label="position in video">
          <span class="t" aria-hidden="true">0:00 / 0:00</span>
          ${m.silent ? "" : `<button class="link snd">sound: off</button>`}
        </span>${enlarge}`;
      wireVideo(stage.querySelector("video"), !m.silent);
    } else {
      stage.innerHTML = imgTag(m);
      ctl.innerHTML = `<span class="grow"></span>${enlarge}`;
      stage.querySelector("img").onclick = () => lightbox(g, cur);
    }
    ctl.querySelector(".enl").onclick = () => { const v = stage.querySelector("video"); if (v){ v.pause(); } lightbox(g, cur); };
  }
  function wireVideo(v, withSound) {
    const pp = ctl.querySelector(".pp"), sc = ctl.querySelector(".scrub"), t = ctl.querySelector(".t"), snd = ctl.querySelector(".snd");
    let dragging = false;
    const syncPP = () => { pp.textContent = v.paused ? "play" : "pause"; };
    const label = () => { if (snd) { snd.textContent = v.muted ? "sound: off" : "sound: on"; snd.classList.toggle("on", !v.muted); } };
    // sound on by default. Opening a project is a click, so browsers allow it; if one refuses, play muted and say so.
    v.volume = .35; v.muted = !(withSound && soundOn);
    v.play().then(label).catch(() => { v.muted = true; label(); v.play().catch(() => {}); });
    v.addEventListener("play", syncPP); v.addEventListener("pause", syncPP);
    const toggle = () => { v.paused ? v.play() : v.pause(); };
    v.onclick = toggle; pp.onclick = toggle;
    (function tick() { if (!dragging && v.duration) { sc.value = v.currentTime / v.duration * 1000; t.textContent = `${fmt(v.currentTime)} / ${fmt(v.duration)}`; } raf = requestAnimationFrame(tick); })();
    sc.addEventListener("input", () => { dragging = true; if (v.duration) { v.currentTime = sc.value / 1000 * v.duration; t.textContent = `${fmt(v.currentTime)} / ${fmt(v.duration)}`; } });
    sc.addEventListener("change", () => { dragging = false; });
    if (snd) snd.onclick = () => {
      if (!soundOn) { snd.textContent = "sound is off (top right)"; return; }
      v.muted = !v.muted; if (!v.muted && v.paused) v.play(); label();
    };
  }
  root.querySelectorAll(".rail button").forEach(b => b.addEventListener("click", () => show(+b.dataset.i)));
  show(0);
  return {
    get i() { return cur; }, n: g.length, show,
    togglePlay() { const v = stage.querySelector("video"); if (v) { v.paused ? v.play() : v.pause(); return true; } return false; },
    muteAll() { const v = stage.querySelector("video"), s = ctl.querySelector(".snd"); if (v) v.muted = true; if (s) { s.textContent = "sound: off"; s.classList.remove("on"); } }
  };
}

/* ---- lightbox (enlarged view) ---- */
const lb = document.getElementById("lb"); let LBG = [], LBI = 0, lbReturn = null;
function lightbox(g, i) { LBG = g; LBI = i; lbReturn = document.activeElement; lb.classList.add("open"); drawLB(); lb.querySelector(".x").focus(); }
function drawLB() {
  const m = LBG[LBI];
  lb.querySelector(".slot").innerHTML = m.play ? `<iframe class="m" src="${esc(m.play)}" title="${esc(m.alt)}"></iframe>`
    : m.video ? `<video class="m" src="${M}${m.video}.mp4" poster="${M}${m.video}-poster.jpg" ${soundOn && !m.silent ? "" : "muted"} loop autoplay playsinline controls aria-label="${esc(m.alt)}"></video>`
    : imgTag(m, "m").replace('sizes="(max-width:760px) 100vw, 62vw"', 'sizes="100vw"');
  lb.querySelector(".n").textContent = `${LBI + 1} / ${LBG.length}`;
}
const lbStep = d => { LBI = (LBI + d + LBG.length) % LBG.length; drawLB(); if (VIEW) VIEW.show(LBI); };
const closeLB = () => { lb.classList.remove("open"); lb.querySelector(".slot").innerHTML = ""; lbReturn && lbReturn.focus && lbReturn.focus(); };
lb.querySelector(".prev").onclick = e => { e.stopPropagation(); lbStep(-1); };
lb.querySelector(".next").onclick = e => { e.stopPropagation(); lbStep(1); };
lb.querySelector(".x").onclick = closeLB;
lb.addEventListener("click", e => { if (e.target === lb) closeLB(); });

/* ---- keys: ← → switch projects (images, inside the enlarged view); space pauses; esc closes; tab stays inside ---- */
function trap(e, box) {
  const f = [...box.querySelectorAll("button, a[href], input, iframe, [tabindex]:not([tabindex='-1'])")].filter(x => x.offsetParent !== null);
  if (!f.length) return; const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && (document.activeElement === first || !box.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
addEventListener("keydown", e => {
  const typing = e.target.matches?.("input, textarea");
  if (lb.classList.contains("open")) {
    if (e.key === "Tab") return trap(e, lb);
    if (e.key === "ArrowRight") lbStep(1); if (e.key === "ArrowLeft") lbStep(-1); if (e.key === "Escape") closeLB(); return;
  }
  if (!VIEW) return;
  if (e.key === "Tab") return trap(e, pop.querySelector(".sheet"));
  if (e.key === "Escape") return closePop();
  if (typing) return;
  if (e.key === " " && !e.target.matches?.("button, a")) { if (VIEW.togglePlay()) e.preventDefault(); return; }
  const i = ITEMS.indexOf(VIEW.project);
  if (e.key === "ArrowRight" && ITEMS[i+1]) popup(ITEMS[i+1]);
  if (e.key === "ArrowLeft"  && ITEMS[i-1]) popup(ITEMS[i-1]);
});

/* ---- cords between recurring tools and collaborators ---- */
const svg = document.getElementById("cords"), wrap = document.getElementById("wrap"); let cords = [];
function layout() {
  const W = wrap.getBoundingClientRect(); cords = [];
  KEYS.forEach(k => {
    const els = [...wrap.querySelectorAll(`table .tok.k[data-k="${CSS.escape(k)}"]`)].filter(e => e.offsetParent);
    for (let i = 0; i < els.length - 1; i++) {
      const a = els[i].getBoundingClientRect(), b = els[i+1].getBoundingClientRect();
      cords.push({k, ax: a.left + a.width/2 - W.left, ay: a.bottom - W.top + 1, bx: b.left + b.width/2 - W.left, by: b.top - W.top - 1, ph: (i + k.length) % 6});
    }
  });
  svg.innerHTML = cords.map((c,i) => `<path data-k="${esc(c.k)}" id="c${i}"></path><circle cx="${c.ax}" cy="${c.ay}" r="2"/><circle cx="${c.bx}" cy="${c.by}" r="2"/>`).join("");
  draw(0);
}
function draw(t) {
  cords.forEach((c, i) => { const p = document.getElementById("c" + i); if (!p) return;
    const dy = c.by - c.ay, sag = Math.min(90, 26 + Math.abs(dy) * .08) * (i % 2 ? 1 : -1), sw = calm ? 0 : Math.sin(t/1400 + c.ph) * 6;
    p.setAttribute("d", `M${c.ax},${c.ay} C${c.ax+sag+sw},${c.ay+dy*.3} ${c.bx+sag-sw},${c.by-dy*.3} ${c.bx},${c.by}`); });
}
if (!calm) (function frame(t){ draw(t); requestAnimationFrame(frame); })(0);
addEventListener("resize", () => requestAnimationFrame(layout)); addEventListener("load", layout); layout();
wrap.addEventListener("pointerover", e => { const k = e.target.closest?.(".tok.k")?.dataset.k; if (!k) return;
  wrap.querySelectorAll(`.tok.k[data-k="${CSS.escape(k)}"]`).forEach(el => { el.classList.add("hi"); el.closest("tr").classList.add("hi"); });
  svg.querySelectorAll(`path[data-k="${CSS.escape(k)}"]`).forEach(p => p.classList.add("hi")); });
wrap.addEventListener("pointerout", e => { if (!e.target.closest?.(".tok.k")) return;
  wrap.querySelectorAll(".hi").forEach(el => el.classList.remove("hi")); svg.querySelectorAll(".hi").forEach(p => p.classList.remove("hi")); });

/* ---- shareable links: /#transmitter opens that project ---- */
function fromHash() { const p = byId(decodeURIComponent(location.hash.slice(1))); if (p) popup(p); }
addEventListener("hashchange", fromHash); fromHash();
})();
