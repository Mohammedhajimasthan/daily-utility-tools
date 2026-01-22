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
