function calc(){
 try{res.innerText=eval(exp.value)}
 catch{res.innerText="Invalid expression"}
}

function genPwd(){
 const c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
 let p="";
 for(let i=0;i<12;i++)p+=c[Math.floor(Math.random()*c.length)];
 pwd.innerText=p;
}

let sw=0,si;
function swStart(){
 if(si)return;
 si=setInterval(()=>{swOut.innerText=++sw},1000);
}
function swStop(){clearInterval(si);si=null}
function swReset(){swStop();sw=0;swOut.innerText=0}

let ti;
function startTimer(){
 let s=+timerSec.value;
 clearInterval(ti);
 ti=setInterval(()=>{
   timerOut.innerText=s;
   if(--s<0) clearInterval(ti);
 },1000);
}

function rand(){
 const min=+rMin.value,max=+rMax.value;
 rOut.innerText=min<=max
 ?Math.floor(Math.random()*(max-min+1))+min
 :"Invalid range";
}

function bmi(){
 const w=+bmiW.value,h=+bmiH.value;
 bmiOut.innerText=w>0&&h>0?(w/(h*h)).toFixed(2):"Invalid";
}

function convert(){
 const v=+unitVal.value;
 const m={m:1,km:1000,cm:.01,mm:.001};
 unitOut.innerText=(v*m[from.value]/m[to.value]).toFixed(4);
}

function age(){
 const d=new Date(dob.value);
 const diff=Date.now()-d;
 ageOut.innerText=
 Math.floor(diff/31557600000)+" yrs | "+diff+" ms";
}

function countWords(){
 const t=txt.value;
 wcOut.innerText=
 "Words: "+(t.trim()?t.trim().split(/\s+/).length:0)+
 " | Characters: "+t.length;
}

// ========== EmailJS Feedback Form ==========
// SETUP STEPS (one-time, ~5 minutes):
// 1. Sign up free at https://www.emailjs.com  (200 emails/month on free tier)
// 2. Dashboard > Email Services > Add Service (Gmail, Outlook, etc.)  → copy Service ID
// 3. Dashboard > Email Templates > Create Template
//    Use these variables in the template body:
//      {{user_name}}  {{user_email}}  {{message}}  {{page_url}}
//    → copy Template ID
// 4. Dashboard > Account > API Keys → copy your Public Key
// 5. Paste the three values below and you're done — no backend needed.
const EMAILJS_PUBLIC_KEY  = "VKhg8lCRhL5MBC62v";
const EMAILJS_SERVICE_ID  = "service_p1eirhe";
const EMAILJS_TEMPLATE_ID = "template_u8fog6t";

(function(){
 if(typeof emailjs !== 'undefined') emailjs.init(EMAILJS_PUBLIC_KEY);
})();

// Character counter
(function(){
 const ta = document.getElementById('fbMessage');
 const cc = document.getElementById('charCount');
 if(!ta || !cc) return;
 ta.addEventListener('input', function(){
  const n = ta.value.length;
  cc.innerText = n;
  const el = cc.closest('.char-counter');
  if(el) el.className = 'char-counter' + (n >= 1000 ? ' full' : n >= 800 ? ' near' : '');
 });
})();

function _fbSetErr(inputId, errId, msg){
 const inp = document.getElementById(inputId);
 const err = document.getElementById(errId);
 const grp = inp && inp.closest('.field-group');
 if(grp) grp.classList.toggle('has-error', !!msg);
 if(err) err.innerText = msg || '';
}

// Cooldown between successful sends, shared across the page form and the floating widget
const FB_COOLDOWN_MS = 20000;
function _fbCooldownRemaining(){
 const last = +(sessionStorage.getItem('_fb_last') || 0);
 const remain = FB_COOLDOWN_MS - (Date.now() - last);
 return remain > 0 ? Math.ceil(remain / 1000) : 0;
}
function _fbStartCooldown(btn){
 const btnText = btn.querySelector('.btn-text');
 btn.classList.add('fb-cooldown');
 btn.disabled = true;
 (function tick(){
  const remain = _fbCooldownRemaining();
  if(remain <= 0){
   btn.disabled = false;
   btn.classList.remove('fb-cooldown');
   if(btnText) btnText.innerText = 'Send Feedback';
   return;
  }
  if(btnText) btnText.innerText = 'Wait ' + remain + 's…';
  setTimeout(tick, 1000);
 })();
}

// Shared submit handler used by the full feedback page form and the site-wide floating panel form
function _fbSubmitCore(ids){
 const form   = document.getElementById(ids.form);
 const btn    = document.getElementById(ids.btn);
 const status = ids.status ? document.getElementById(ids.status) : null;
 const name   = document.getElementById(ids.name).value.trim();
 const email  = document.getElementById(ids.email).value.trim();
 const msg    = document.getElementById(ids.msg).value.trim();
 const hp     = ids.hp ? document.getElementById(ids.hp) : null;

 _fbSetErr(ids.name, ids.nameErr, '');
 _fbSetErr(ids.email, ids.emailErr, '');
 _fbSetErr(ids.msg, ids.msgErr, '');
 if(status) status.className = 'fb-status';

 function report(className, text, toastType){
  if(status){ status.className = 'fb-status ' + className; status.innerText = text; }
  else showToast(text.replace(/^[✓✕]\s*/, ''), toastType);
 }

 // Honeypot: bots that fill hidden fields get a silent no-op "success"
 if(hp && hp.value){
  report('fb-success', '✓ Thank you! Your feedback has been sent.', 'success');
  form.reset();
  if(!status) closeFeedbackPanel();
  return false;
 }

 let ok = true;
 if(!name || name.length < 2){
  _fbSetErr(ids.name, ids.nameErr, 'Please enter your name (at least 2 characters).');
  ok = false;
 }
 if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
  _fbSetErr(ids.email, ids.emailErr, 'Please enter a valid email address.');
  ok = false;
 }
 if(!msg || msg.length < 10){
  _fbSetErr(ids.msg, ids.msgErr, 'Please write at least 10 characters.');
  ok = false;
 }
 if(!ok) return false;

 const cooldown = _fbCooldownRemaining();
 if(cooldown > 0){
  report('fb-error', '✕ Please wait ' + cooldown + 's before sending again.', 'error');
  return false;
 }

 // Session rate-limit (max 3 submissions), shared across page form + widget
 const sent = +(sessionStorage.getItem('_fb_n') || 0);
 if(sent >= 3){
  report('fb-error', '✕ Too many submissions this session. Please try again later.', 'error');
  return false;
 }

 if(typeof emailjs === 'undefined'){
  report('fb-error', '✕ Feedback service is still loading — try again in a moment.', 'error');
  return false;
 }

 btn.classList.add('fb-loading');
 const btnText = btn.querySelector('.btn-text');
 if(btnText) btnText.innerText = 'Sending…';
 btn.disabled = true;

 emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
  user_name:  name,
  user_email: email || 'Not provided',
  message:    msg,
  page_url:   window.location.href,
  time:       new Date().toLocaleString()
 })
 .then(function(){
  sessionStorage.setItem('_fb_n', sent + 1);
  sessionStorage.setItem('_fb_last', Date.now());
  report('fb-success', '✓ Thank you! Your feedback has been sent.', 'success');
  form.reset();
  const cc = document.getElementById('charCount');
  if(cc){ cc.innerText = '0'; const el = cc.closest('.char-counter'); if(el) el.className = 'char-counter'; }
  if(!status) setTimeout(closeFeedbackPanel, 900);
 })
 .catch(function(err){
  const m = (err && err.status === 429)
   ? 'Too many requests — please wait a moment and try again.'
   : 'Could not send. Check your connection and try again.';
  report('fb-error', '✕ ' + m, 'error');
  console.error('EmailJS error:', err);
 })
 .finally(function(){
  btn.classList.remove('fb-loading');
  const cooldownNow = _fbCooldownRemaining();
  if(cooldownNow > 0){
   _fbStartCooldown(btn);
  } else {
   if(btnText) btnText.innerText = 'Send Feedback';
   btn.disabled = false;
  }
 });

 return false;
}

function sendFeedback(e){
 e.preventDefault();
 return _fbSubmitCore({
  form:'feedbackForm', btn:'fbSubmit', status:'fbStatus',
  name:'fbName', nameErr:'nameError',
  email:'fbEmail', emailErr:'emailError',
  msg:'fbMessage', msgErr:'messageError',
  hp:'fbHp'
 });
}

function sendFeedbackWidget(e){
 e.preventDefault();
 return _fbSubmitCore({
  form:'feedbackFormW', btn:'fbSubmitW', status:null,
  name:'fbNameW', nameErr:'nameErrorW',
  email:'fbEmailW', emailErr:'emailErrorW',
  msg:'fbMessageW', msgErr:'messageErrorW',
  hp:'fbHpW'
 });
}

// ========== Toast notifications ==========
function showToast(msg, type){
 let host = document.getElementById('toastHost');
 if(!host){
  host = document.createElement('div');
  host.id = 'toastHost';
  host.className = 'toast-host';
  host.setAttribute('aria-live', 'polite');
  document.body.appendChild(host);
 }
 const t = document.createElement('div');
 t.className = 'toast' + (type ? ' toast-' + type : '');
 t.textContent = msg;
 host.appendChild(t);
 requestAnimationFrame(function(){ t.classList.add('show'); });
 setTimeout(function(){
  t.classList.remove('show');
  setTimeout(function(){ t.remove(); }, 300);
 }, 4500);
}

// ========== Theme system: dark/light, manual toggle + localStorage, system default ==========
(function(){
 const KEY = '_theme';

 function isLightActive(){
  const manual = document.documentElement.getAttribute('data-theme');
  if(manual) return manual === 'light';
  return window.matchMedia('(prefers-color-scheme: light)').matches;
 }

 function updateToggleIcon(){
  const btn = document.getElementById('themeToggleBtn');
  if(!btn) return;
  const light = isLightActive();
  btn.innerHTML = light ? '&#127769;' : '&#9728;&#65039;';
  btn.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
 }

 window._setTheme = function(theme){
  if(theme === 'light' || theme === 'dark'){
   localStorage.setItem(KEY, theme);
   document.documentElement.setAttribute('data-theme', theme);
  } else {
   localStorage.removeItem(KEY);
   document.documentElement.removeAttribute('data-theme');
  }
  updateToggleIcon();
 };

 window._toggleTheme = function(){
  window._setTheme(isLightActive() ? 'dark' : 'light');
 };

 const saved = localStorage.getItem(KEY);
 if(saved === 'light' || saved === 'dark'){
  document.documentElement.setAttribute('data-theme', saved);
 }

 document.addEventListener('DOMContentLoaded', function(){
  const bar = document.querySelector('.topbar');
  if(bar && !document.getElementById('themeToggleBtn')){
   const btn = document.createElement('button');
   btn.id = 'themeToggleBtn';
   btn.type = 'button';
   btn.className = 'theme-toggle';
   btn.onclick = window._toggleTheme;
   bar.appendChild(btn);
   updateToggleIcon();
  }
 });
})();

// ========== Site-wide floating feedback button + slide-up panel ==========
function _fbLoadSdk(){
 if(typeof emailjs !== 'undefined' || document.getElementById('emailjsSdk')) return;
 const s = document.createElement('script');
 s.id = 'emailjsSdk';
 s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
 s.onload = function(){ if(typeof emailjs !== 'undefined') emailjs.init(EMAILJS_PUBLIC_KEY); };
 document.head.appendChild(s);
}

function openFeedbackPanel(){
 const overlay = document.getElementById('fbPanelOverlay');
 const panel = document.getElementById('fbPanel');
 if(!overlay || !panel) return;
 overlay.classList.add('open');
 panel.classList.add('open');
 document.body.classList.add('fb-panel-locked');
 const first = document.getElementById('fbNameW');
 if(first) setTimeout(function(){ first.focus(); }, 260);
}

function closeFeedbackPanel(){
 const overlay = document.getElementById('fbPanelOverlay');
 const panel = document.getElementById('fbPanel');
 if(!overlay || !panel) return;
 overlay.classList.remove('open');
 panel.classList.remove('open');
 document.body.classList.remove('fb-panel-locked');
}

function _injectFeedbackWidget(){
 if(document.getElementById('fbFabBtn')) return;

 const fab = document.createElement('button');
 fab.id = 'fbFabBtn';
 fab.className = 'fb-fab';
 fab.type = 'button';
 fab.setAttribute('aria-label', 'Send feedback');
 fab.innerHTML = '&#128172;';
 fab.onclick = openFeedbackPanel;

 const overlay = document.createElement('div');
 overlay.id = 'fbPanelOverlay';
 overlay.className = 'fb-panel-overlay';
 overlay.onclick = closeFeedbackPanel;

 const panel = document.createElement('div');
 panel.id = 'fbPanel';
 panel.className = 'fb-panel';
 panel.setAttribute('role', 'dialog');
 panel.setAttribute('aria-modal', 'true');
 panel.setAttribute('aria-label', 'Send feedback');
 panel.innerHTML =
  '<button type="button" class="fb-panel-close" id="fbPanelClose" aria-label="Close">&times;</button>' +
  '<div class="fb-header">' +
   '<h2 class="fb-title fb-title-sm">Share Your Feedback</h2>' +
   '<p class="form-intro">Quick thoughts help us improve.</p>' +
  '</div>' +
  '<form id="feedbackFormW" onsubmit="return sendFeedbackWidget(event)" novalidate>' +
   '<div class="field-group">' +
    '<label for="fbNameW">Name <span class="req" aria-hidden="true">*</span></label>' +
    '<input type="text" id="fbNameW" placeholder="Your name" autocomplete="name" aria-required="true" aria-describedby="nameErrorW">' +
    '<span class="field-err" id="nameErrorW" role="alert"></span>' +
   '</div>' +
   '<div class="field-group">' +
    '<label for="fbEmailW">Email <span class="opt">(optional)</span></label>' +
    '<input type="email" id="fbEmailW" placeholder="you@example.com" autocomplete="email" aria-describedby="emailErrorW">' +
    '<span class="field-err" id="emailErrorW" role="alert"></span>' +
   '</div>' +
   '<div class="field-group">' +
    '<label for="fbMessageW">Message <span class="req" aria-hidden="true">*</span></label>' +
    '<textarea id="fbMessageW" placeholder="Share thoughts, suggestions, or report an issue&#8230;" rows="4" maxlength="1000" aria-required="true" aria-describedby="messageErrorW"></textarea>' +
    '<span class="field-err" id="messageErrorW" role="alert"></span>' +
   '</div>' +
   '<div class="fb-hp" aria-hidden="true">' +
    '<label for="fbHpW">Leave this field blank</label>' +
    '<input type="text" id="fbHpW" tabindex="-1" autocomplete="off">' +
   '</div>' +
   '<button type="submit" id="fbSubmitW" class="fb-submit-btn">' +
    '<span class="btn-text">Send Feedback</span>' +
    '<svg class="btn-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" stroke-dasharray="40 20" stroke-linecap="round"/></svg>' +
   '</button>' +
  '</form>';

 document.body.appendChild(fab);
 document.body.appendChild(overlay);
 document.body.appendChild(panel);
 document.getElementById('fbPanelClose').onclick = closeFeedbackPanel;
 _fbLoadSdk();
}

document.addEventListener('DOMContentLoaded', function(){
 if(document.getElementById('feedbackForm')) return; // dedicated feedback page already has the full form
 _injectFeedbackWidget();
});

document.addEventListener('keydown', function(e){
 if(e.key === 'Escape'){
  const panel = document.getElementById('fbPanel');
  if(panel && panel.classList.contains('open')) closeFeedbackPanel();
 }
});
