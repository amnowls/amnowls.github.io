// Character-LCD renderer (HD44780 look), hand-coded 5×7 font. 16×2 by default; data-cols / data-rows resize it.
window.LCD = (() => {
  const F = {" ":"0000000000","!":"00005F0000",",":"0050300000","-":"0808080808",".":"0060600000","'":"0005030000","?":"0201510906",":":"0036360000","/":"2010080402","&":"3649552250",
    "0":"3E5149453E","1":"00427F4000","2":"4261514946","3":"2141454B31","4":"1814127F10","5":"2745454539","6":"3C4A494930","7":"0171090503","8":"3649494936","9":"064949291E",
    A:"7E1111117E",B:"7F49494936",C:"3E41414122",D:"7F4141221C",E:"7F49494941",F:"7F09090901",G:"3E4149497A",H:"7F0808087F",I:"00417F4100",J:"2040413F01",
    K:"7F08142241",L:"7F40404040",M:"7F020C027F",N:"7F0408107F",O:"3E4141413E",P:"7F09090906",Q:"3E4151215E",R:"7F09192946",S:"4649494931",T:"01017F0101",
    U:"3F4040403F",V:"1F2040201F",W:"3F4038403F",X:"6314081463",Y:"0708700807",Z:"6151494543"};
  const cache = {};
  function glyph(ch){
    if (cache[ch]) return cache[ch];
    const hex = F[ch.toUpperCase()] || F["?"], cols = [0,1,2,3,4].map(i=>parseInt(hex.substr(i*2,2),16)), g=[];
    for (let r=0;r<8;r++) for (let q=0;q<5;q++) g.push(r<7 && !!(cols[q]>>r & 1));
    return cache[ch]=g;
  }
  const BG="#2337e8", ON="#e2e8ff", OFF="#2d44f2";
  function draw(cv, lines, upto){
    const cols=+cv.dataset.cols || 13, rows=+cv.dataset.rows || 2, dot=+cv.dataset.dot || 2, gap=Math.max(1,Math.round(dot/2)), cw=5*(dot+gap)+dot, ch=8*(dot+gap)+dot*2;
    const W = cols*cw+dot*2, H = rows*ch+dot*2, dpr = devicePixelRatio||1;
    if (cv.width !== W*dpr){ cv.width=W*dpr; cv.height=H*dpr; cv.style.width=W+"px"; cv.style.height=H+"px"; }
    const x = cv.getContext("2d"); x.setTransform(dpr,0,0,dpr,0,0);
    x.fillStyle=BG; x.fillRect(0,0,W,H);
    let n=0;
    for (let r=0;r<rows;r++) for (let c=0;c<cols;c++){
      const t = (lines[r]||"")[c] || " ", show = n++ < upto, g = glyph(t);
      for (let i=0;i<40;i++){
        x.fillStyle = (show && t!==" " && g[i]) ? ON : OFF;
        x.fillRect(dot + c*cw + (i%5)*(dot+gap), dot + r*ch + ((i/5)|0)*(dot+gap), dot, dot);
      }
    }
  }
  const fit = (cv, text) => { const c = +cv.dataset.cols || 16; return text.split("\n").map(l=>l.padEnd(c).slice(0,c)); };
  const total = cv => (+cv.dataset.cols || 16) * (+cv.dataset.rows || 2);
  function type(cv, text, speed=38){
    const lines = fit(cv, text);
    if (cv._text === text && cv._done) return;
    cv._text = text; cv._done = false;
    clearInterval(cv._t); let i=0; draw(cv, lines, 0);
    cv._t = setInterval(()=>{ i++; draw(cv, lines, i); if(i>=total(cv)){ clearInterval(cv._t); cv._done = true; } }, speed);
  }
  function show(cv, text){ clearInterval(cv._t); cv._text=text; cv._done=true; draw(cv, fit(cv, text), total(cv)); }
  // a title: wraps words onto lines of at most `max` characters and sizes the display to fit
  function title(cv, text, max=16, speed=22){
    const lines = []; let cur = "";
    text.toUpperCase().split(" ").forEach(w=>{ if (cur && (cur+" "+w).length > max){ lines.push(cur); cur = w; } else cur = cur ? cur+" "+w : w; });
    if (cur) lines.push(cur);
    cv.dataset.cols = Math.max(...lines.map(l=>l.length)); cv.dataset.rows = lines.length; cv._text = null;
    type(cv, lines.join("\n"), speed);
  }
  return { draw, type, show, title };
})();
