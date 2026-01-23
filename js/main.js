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
// SETUP: Replace these placeholders with your EmailJS credentials
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";      // Get from EmailJS dashboard > Account > API Keys
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";      // Get from EmailJS dashboard > Email Services
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";    // Get from EmailJS dashboard > Email Templates

// Initialize EmailJS (runs when script loads)
(function(){
 if(typeof emailjs !== 'undefined'){
  emailjs.init(EMAILJS_PUBLIC_KEY);
 }
})();

function sendFeedback(e){
 e.preventDefault();

 const form = document.getElementById('feedbackForm');
 const btn = document.getElementById('fbSubmit');
 const status = document.getElementById('fbStatus');
 const name = document.getElementById('fbName').value.trim();
 const email = document.getElementById('fbEmail').value.trim();
 const message = document.getElementById('fbMessage').value.trim();

 // Validation
 if(!name || name.length < 2){
  status.className = 'output fb-error';
  status.innerText = 'Please enter your name';
  return false;
 }

 if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
  status.className = 'output fb-error';
  status.innerText = 'Please enter a valid email';
  return false;
 }

 if(!message || message.length < 10){
  status.className = 'output fb-error';
  status.innerText = 'Please enter at least 10 characters';
  return false;
 }

 // Show loading state
 btn.classList.add('fb-loading');
 btn.innerText = 'Sending...';
 status.className = 'output';
 status.innerText = '';

 // Send via EmailJS
 emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
  user_name: name,
  user_email: email || 'Not provided',
  message: message,
  page_url: window.location.href
 })
 .then(function(){
  status.className = 'output fb-success';
  status.innerText = 'Thank you! Your feedback has been sent.';
  form.reset();
 })
 .catch(function(err){
  status.className = 'output fb-error';
  status.innerText = 'Failed to send. Please try again.';
  console.error('EmailJS error:', err);
 })
 .finally(function(){
  btn.classList.remove('fb-loading');
  btn.innerText = 'Send Feedback';
 });

 return false;
}
