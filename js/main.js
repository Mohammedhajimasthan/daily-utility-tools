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
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";   // e.g. "abc123XYZ"
const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";   // e.g. "service_xxxxxxx"
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";  // e.g. "template_xxxxxxx"

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

function sendFeedback(e){
 e.preventDefault();

 const form   = document.getElementById('feedbackForm');
 const btn    = document.getElementById('fbSubmit');
 const status = document.getElementById('fbStatus');
 const name   = document.getElementById('fbName').value.trim();
 const email  = document.getElementById('fbEmail').value.trim();
 const msg    = document.getElementById('fbMessage').value.trim();

 // Clear previous state
 _fbSetErr('fbName',    'nameError',    '');
 _fbSetErr('fbEmail',   'emailError',   '');
 _fbSetErr('fbMessage', 'messageError', '');
 status.className = 'fb-status';

 // Field-level validation
 let ok = true;
 if(!name || name.length < 2){
  _fbSetErr('fbName', 'nameError', 'Please enter your name (at least 2 characters).');
  ok = false;
 }
 if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
  _fbSetErr('fbEmail', 'emailError', 'Please enter a valid email address.');
  ok = false;
 }
 if(!msg || msg.length < 10){
  _fbSetErr('fbMessage', 'messageError', 'Please write at least 10 characters.');
  ok = false;
 }
 if(!ok) return false;

 // Simple session rate-limit (max 3 submissions)
 const sent = +(sessionStorage.getItem('_fb_n') || 0);
 if(sent >= 3){
  status.className = 'fb-status fb-error';
  status.innerText = 'Too many submissions this session. Please try again later.';
  return false;
 }

 // Loading state
 btn.classList.add('fb-loading');
 const btnText = btn.querySelector('.btn-text');
 if(btnText) btnText.innerText = 'Sending…';
 btn.disabled = true;

 emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
  user_name:  name,
  user_email: email || 'Not provided',
  message:    msg,
  page_url:   window.location.href
 })
 .then(function(){
  sessionStorage.setItem('_fb_n', sent + 1);
  status.className = 'fb-status fb-success';
  status.innerText = '✓ Thank you! Your feedback has been sent.';
  form.reset();
  // Reset character counter
  const cc = document.getElementById('charCount');
  if(cc){ cc.innerText = '0'; const el = cc.closest('.char-counter'); if(el) el.className = 'char-counter'; }
 })
 .catch(function(err){
  const m = (err && err.status === 429)
   ? 'Too many requests — please wait a moment and try again.'
   : 'Could not send. Check your connection and try again.';
  status.className = 'fb-status fb-error';
  status.innerText = '✕ ' + m;
  console.error('EmailJS error:', err);
 })
 .finally(function(){
  btn.classList.remove('fb-loading');
  if(btnText) btnText.innerText = 'Send Feedback';
  btn.disabled = false;
 });

 return false;
}
