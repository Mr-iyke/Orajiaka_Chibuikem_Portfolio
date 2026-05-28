// ── PRELOADER
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  // Small delay so the fill animation completes visually
  setTimeout(() => {
    preloader.classList.add('hidden');
    // Remove from DOM after transition ends
    preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
  }, 2000);
});

// ── CURSOR
const cur = document.getElementById('cursor');
const dot = document.getElementById('cursor-dot');
let mx=0,my=0,cx=0,cy=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';});
(function animCursor(){cx+=(mx-cx)*0.12;cy+=(my-cy)*0.12;cur.style.left=cx+'px';cur.style.top=cy+'px';requestAnimationFrame(animCursor);})();
document.querySelectorAll('a,button,.exp-card,.port-card,.service-card,.skill-card,.social-link,.tilt').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
});

// ── THEME TOGGLE
const html=document.documentElement;
const themeBtn=document.getElementById('themeToggle');
// Restore saved theme
if(localStorage.getItem('theme')==='light') html.setAttribute('data-theme','light');
themeBtn.addEventListener('click',()=>{
  const next = html.getAttribute('data-theme')==='dark'?'light':'dark';
  html.setAttribute('data-theme',next);
  localStorage.setItem('theme',next);
});

// ── NAV HAMBURGER
const navbar = document.getElementById('navbar');
document.getElementById('hamburger').addEventListener('click', e => {
  e.stopPropagation();
  navbar.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
  navbar.classList.remove('open');
}));
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) navbar.classList.remove('open');
});

// ── SCROLL REVEAL + SKILL BARS
const revealObs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      e.target.querySelectorAll('.skill-fill').forEach(b=>{b.style.width=b.dataset.width;});
    }
  });
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>revealObs.observe(el));

// Also fire skill bars when the section enters view (for the grid wrapper)
const skillObs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting) e.target.querySelectorAll('.skill-fill').forEach(b=>{b.style.width=b.dataset.width;});
  });
},{threshold:0.1});
document.querySelectorAll('.skills-grid').forEach(el=>skillObs.observe(el));

// ── COUNTER ANIMATION
function animateCounter(el,target,duration=1800){
  let start=null;
  function step(ts){
    if(!start)start=ts;
    const progress=Math.min((ts-start)/duration,1);
    const ease=1-Math.pow(1-progress,4);
    el.textContent=Math.round(ease*target);
    if(progress<1)requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const counterObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      document.querySelectorAll('.counter').forEach(c=>{
        animateCounter(c,parseInt(c.dataset.target));
      });
      counterObs.disconnect();
    }
  });
},{threshold:0.3});
document.querySelectorAll('.hero-stats').forEach(el=>counterObs.observe(el));

// ── TILT EFFECT
document.querySelectorAll('.tilt').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=((e.clientX-r.left)/r.width-0.5)*14;
    const y=((e.clientY-r.top)/r.height-0.5)*-14;
    card.style.transform=`perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateZ(4px)`;
  });
  card.addEventListener('mouseleave',()=>{card.style.transform='';});
});

// ── PORTFOLIO FILTER
function filterPF(cat,btn){
  document.querySelectorAll('.pf-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.port-card').forEach((card,i)=>{
    const show=cat==='all'||card.dataset.cat===cat;
    card.style.transition=`opacity 0.3s ${i*0.04}s, transform 0.3s ${i*0.04}s`;
    if(show){card.style.display='block';setTimeout(()=>{card.style.opacity='1';card.style.transform='';},10);}
    else{card.style.opacity='0';card.style.transform='scale(0.94)';setTimeout(()=>{card.style.display='none';},300);}
  });
}

// ── FORM
function submitForm(btn){
  btn.textContent='Sending…';btn.disabled=true;
  setTimeout(()=>{
    btn.textContent='Message Sent ✓';
    btn.style.background='var(--accent2)';
    setTimeout(()=>{btn.textContent='Send Message →';btn.disabled=false;btn.style.background='';},3500);
  },1000);
}

// ── MAGNETIC BUTTONS
document.querySelectorAll('.btn-primary,.btn-outline,.nav-cta').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{
    const r=btn.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*0.25;
    const y=(e.clientY-r.top-r.height/2)*0.25;
    btn.style.transform=`translate(${x}px,${y}px) translateY(-3px)`;
  });
  btn.addEventListener('mouseleave',()=>{btn.style.transform='';});
});
// ── FAQ
function toggleFaq(btn) {
  const item = btn.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ── LIGHTBOX
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
const lbCaption = document.getElementById('lightbox-caption');

function openLightbox(e, src, caption) {
  e.preventDefault();
  lbImg.src = src;
  lbCaption.textContent = caption;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lb.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lbImg.src = ''; }, 300);
}
document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
lb.addEventListener('click', e => { if(e.target === lb) closeLightbox(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeLightbox(); });
