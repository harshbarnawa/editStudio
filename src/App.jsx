import { useEffect } from "react";
import "./styles/global.css";

function App() {

  useEffect(() => {

    
/* LOADER */
setTimeout(() => {

  const loader =
  document.getElementById('loader');

  if(loader){
    loader.classList.add('hidden');
  }

},1500);

/* SCROLL REVEAL */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.06 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* MOBILE MENU */
window.toggleMenu = function toggleMenu() {
  document.getElementById('burger').classList.toggle('open');
  document.getElementById('mobile-menu').classList.toggle('open');
}
window.closeMenu = function closeMenu() {
  document.getElementById('burger').classList.remove('open');
  document.getElementById('mobile-menu').classList.remove('open');
}

/* MODALS */
window.openModal = function openModal(id) { document.getElementById(id).classList.add('open'); document.body.style.overflow='hidden'; }
window.closeModal = function closeModal(id) { document.getElementById(id).classList.remove('open'); document.body.style.overflow=''; }
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) window.closeModal(m.id); });
});

/* CONTACT FORM */
window.handleSubmit = function handleSubmit(e) {
  e.preventDefault();
  const name    = document.getElementById('cf-name').value;
  const email   = document.getElementById('cf-email').value;
  const service = document.getElementById('cf-service').value;
  const message = document.getElementById('cf-message').value;
  const text = `Hi Edito Studios! 👋\n\n*Name:* ${name}\n*Email:* ${email}\n*Service:* ${service}\n*Message:* ${message}`;
  window.open(`https://wa.me/919817355071?text=${encodeURIComponent(text)}`, '_blank');
  document.getElementById('contact-form').style.display = 'none';
  document.getElementById('form-success').style.display = 'block';
}

/* LAZY VIDEO LOAD — loads video src when card scrolls into view */
const videoLazyObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const card = entry.target;
    const vid = card.querySelector('video[data-src]');
    if (vid && !vid.getAttribute('src')) {
      vid.src = vid.dataset.src;
      vid.load();
      vid.play().then(() => card.classList.add('vid-ready')).catch(() => {});
      videoLazyObs.unobserve(card);
    }
  });
}, { rootMargin: '300px' });

document.querySelectorAll('.reel-card').forEach(c => videoLazyObs.observe(c));

/* HOVER: unmute hovered card video */
/* HOVER: ONLY UNMUTE — NEVER PAUSE VIDEO */
const reelStage = document.getElementById('reelStage');

if (reelStage && !('ontouchstart' in window)) {

  let lastVideo = null;

  reelStage.addEventListener('mouseover', e => {

    const card =
      e.target.closest('.reel-card');

    if (!card) return;

    const vid =
      card.querySelector('video');

    if (!vid || !vid.src) return;

    if (lastVideo && lastVideo !== vid) {
      lastVideo.muted = true;
    }

    vid.muted = false;

    lastVideo = vid;

  });

  reelStage.addEventListener('mouseout', e => {

    const card =
      e.target.closest('.reel-card');

    if (!card) return;

    const vid =
      card.querySelector('video');

    if (!vid || !vid.src) return;

    vid.muted = true;

  });

}

/* VIDEO LIGHTBOX */
(function() {
  const lb         = document.getElementById('reel-lightbox');
  const lbClose    = document.getElementById('lbClose');
  const lbVideo    = document.getElementById('lbVideo');
  const lbPlayBtn  = document.getElementById('lbPlayBtn');
  const lbMuteBtn  = document.getElementById('lbMuteBtn');
  const lbVolIcon  = document.getElementById('lbVolIcon');
  const lbScrubber = document.getElementById('lbScrubber');
  const lbCurrent  = document.getElementById('lbCurrent');
  const lbDuration = document.getElementById('lbDuration');
  const lbSpeedBtn = document.getElementById('lbSpeedBtn');
  const lbPrev     = document.getElementById('lbPrev');
  const lbNext     = document.getElementById('lbNext');

  const playIconSVG  = '<path d="M8 5v14l11-7z"/>';
  const pauseIconSVG = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
  const SPEEDS = [0.5, 1, 1.5, 2];
  let speedIdx = 1, currentIdx = 0;
  const CDN = 'https://pub-e0a8aa70a40f4319bc68be430138a334.r2.dev/';

  const PROJECTS = [
    { title:'Brand Reel Production',    category:'Short-Form',   desc:'Coming soon.', role:'Video Editor',    tools:'Premiere Pro · After Effects', client:'Client', src:CDN+'1.mp4' },
    { title:'YouTube Tutorial Series',  category:'Long-Form',    desc:'Coming soon.', role:'Video Editor',    tools:'Premiere Pro',                 client:'Client', src:CDN+'2.mp4' },
    { title:'Product Visualisation',    category:'3D Animation', desc:'Coming soon.', role:'Motion Designer', tools:'Blender · After Effects',      client:'Client', src:CDN+'3.mp4' },
    { title:'Dynamic Motion Graphics',  category:'Motion',       desc:'Coming soon.', role:'Motion Designer', tools:'After Effects',                client:'Client', src:CDN+'4.mp4' },
    { title:'Multi-Platform Campaign',  category:'Social',       desc:'Coming soon.', role:'Video Editor',    tools:'Premiere Pro · Photoshop',     client:'Client', src:CDN+'5.mp4' },
    { title:'Cinematic Brand Story',    category:'Brand Film',   desc:'Coming soon.', role:'Video Editor',    tools:'Premiere Pro · After Effects', client:'Client', src:CDN+'6.mp4' },
    { title:'School Admission Reel',    category:'Institution',  desc:'Coming soon.', role:'Video Editor',    tools:'Premiere Pro · After Effects', client:'Client', src:CDN+'7.mp4' },
  ];

  function fmtTime(s) {
    if (!s || isNaN(s)) return '0:00';
    return Math.floor(s/60) + ':' + String(Math.floor(s%60)).padStart(2,'0');
  }
  function updatePlayBtn(playing) {
    lbPlayBtn.querySelector('svg').innerHTML = playing ? pauseIconSVG : playIconSVG;
  }
  function loadProject(idx) {
    const p = PROJECTS[idx]; currentIdx = idx;
    document.getElementById('lbCounter').textContent  = String(idx+1).padStart(2,'0') + ' / ' + String(PROJECTS.length).padStart(2,'0');
    document.getElementById('lbCategory').textContent = p.category;
    document.getElementById('lbTitle').textContent    = p.title;
    document.getElementById('lbDesc').textContent     = p.desc;
    document.getElementById('lbRole').textContent     = p.role;
    document.getElementById('lbTools').textContent    = p.tools;
    document.getElementById('lbClient').textContent   = p.client;
    document.getElementById('lbLength').textContent   = '—';
    lbScrubber.value = 0; lbCurrent.textContent = '0:00'; lbDuration.textContent = '0:00';
    lbSpeedBtn.textContent = '1×'; speedIdx = 1;
    updatePlayBtn(false);
    lbVideo.src = p.src || ''; lbVideo.currentTime = 0; lbVideo.playbackRate = 1;
    if (p.src) lbVideo.play().then(() => updatePlayBtn(true)).catch(() => {});
  }
  function openLightbox(idx) { loadProject(idx); lb.classList.add('open'); document.body.style.overflow='hidden'; }
  function closeLightbox() { lb.classList.remove('open'); lbVideo.pause(); lbVideo.src=''; document.body.style.overflow=''; updatePlayBtn(false); }

  document.getElementById('reelTrack').addEventListener('click', e => {
    const card = e.target.closest('.reel-card');
    if (!card) return;
    const idx = parseInt(card.dataset.idx, 10);
    if (!isNaN(idx)) openLightbox(idx);
  });

  lbClose.addEventListener('click', closeLightbox);
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });

  function togglePlay() {
    if (lbVideo.paused) lbVideo.play().then(() => updatePlayBtn(true)).catch(() => {});
    else { lbVideo.pause(); updatePlayBtn(false); }
  }
  lbPlayBtn.addEventListener('click', togglePlay);

  lbMuteBtn.addEventListener('click', () => {
    lbVideo.muted = !lbVideo.muted;
    lbVolIcon.innerHTML = lbVideo.muted
      ? '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>'
      : '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
  });

  lbSpeedBtn.addEventListener('click', () => {
    speedIdx = (speedIdx + 1) % SPEEDS.length;
    lbVideo.playbackRate = SPEEDS[speedIdx];
    lbSpeedBtn.textContent = SPEEDS[speedIdx] + '×';
  });

  lbVideo.addEventListener('timeupdate', () => {
    if (!lbVideo.duration) return;
    lbScrubber.value = (lbVideo.currentTime / lbVideo.duration) * 100;
    lbCurrent.textContent = fmtTime(lbVideo.currentTime);
  });
  lbVideo.addEventListener('loadedmetadata', () => {
    lbDuration.textContent = fmtTime(lbVideo.duration);
    document.getElementById('lbLength').textContent = fmtTime(lbVideo.duration);
  });
  lbScrubber.addEventListener('input', () => {
    if (lbVideo.duration) lbVideo.currentTime = (lbScrubber.value / 100) * lbVideo.duration;
  });
  lbVideo.addEventListener('play',  () => updatePlayBtn(true));
  lbVideo.addEventListener('pause', () => updatePlayBtn(false));

  lbPrev.addEventListener('click', () => loadProject((currentIdx - 1 + PROJECTS.length) % PROJECTS.length));
  lbNext.addEventListener('click', () => loadProject((currentIdx + 1) % PROJECTS.length));

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  lbPrev.click();
    if (e.key === 'ArrowRight') lbNext.click();
    if (e.key === ' ') { e.preventDefault(); togglePlay(); }
  });
})();
    
  }, []);

  return (
    <>

      
<div id="loader">
  <div className="loader-logo">Edito <em>Studios</em></div>
  <div className="loader-bar-wrap"><div className="loader-bar"></div></div>
  <div className="loader-label">Loading</div>
</div>

<div className="ambient-light"></div>


<div id="reel-lightbox" role="dialog" aria-modal="true">
  <button className="lb-close" id="lbClose">&#x2715;</button>
  <div className="lb-inner">
    <div className="lb-video-col">
      <div className="lb-video-wrap">
        <video id="lbVideo" loop playsInline preload="none"></video>
      </div>
      <div className="lb-controls">
        <div className="lb-timeline">
          <span className="lb-time" id="lbCurrent">0:00</span>
          <input className="lb-scrubber" id="lbScrubber" type="range" min="0" max="100" value="0" step="0.1" />
          <span className="lb-time" id="lbDuration">0:00</span>
        </div>
        <div className="lb-bottom-bar">
          <button className="lb-icon-btn" id="lbPlayBtn" title="Play / Pause">
            <svg className="icon-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            <svg className="icon-pause" style={{display:'none'}} viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          </button>
          <button className="lb-icon-btn" id="lbMuteBtn" title="Mute / Unmute">
            <svg id="lbVolIcon" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
          </button>
          <button className="lb-speed" id="lbSpeedBtn">1×</button>
        </div>
      </div>
    </div>
    <div className="lb-info-col">
      <p className="lb-counter" id="lbCounter">01 / 07</p>
      <p className="lb-category" id="lbCategory">Short-Form</p>
      <h2 className="lb-title" id="lbTitle">Brand Reel Production</h2>
      <p className="lb-desc" id="lbDesc">A showcase of precision editing and creative storytelling.</p>
      <div className="lb-meta-table">
        <div className="lb-meta-row"><span className="lb-meta-key">Role</span><span className="lb-meta-val" id="lbRole">Video Editor</span></div>
        <div className="lb-meta-row"><span className="lb-meta-key">Tools</span><span className="lb-meta-val" id="lbTools">Premiere Pro · After Effects</span></div>
        <div className="lb-meta-row"><span className="lb-meta-key">Client</span><span className="lb-meta-val" id="lbClient">Brand Project</span></div>
        <div className="lb-meta-row"><span className="lb-meta-key">Length</span><span className="lb-meta-val" id="lbLength">—</span></div>
      </div>
      <div className="lb-nav-row">
        <button className="lb-nav-btn" id="lbPrev"><svg viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/></svg></button>
        <button className="lb-nav-btn" id="lbNext"><svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg></button>
        <span className="lb-nav-hint">← → to navigate</span>
      </div>
    </div>
  </div>
</div>

<div className="modal-overlay" id="modal-privacy">
  <div className="modal-box">
    <button className="modal-close" onClick={() => window.closeModal('modal-privacy')}>&#x2715;</button>
    <p className="modal-title">Privacy Policy</p>
    <p className="modal-date">Effective: January 2026</p>
    <div className="modal-body">
      <p>Edito Studios ("we", "our", "us") respects your privacy. This policy explains how we collect, use, and protect your information when you contact us or use our services.</p>
      <h3>Information We Collect</h3>
      <p>We collect information you provide directly — such as your name, email address, phone number, and project details — when you fill out our contact form or reach out via WhatsApp or email.</p>
      <h3>How We Use Your Information</h3>
      <p>Your information is used solely to respond to your inquiry, provide our services, and communicate about ongoing projects. We do not sell or share your personal information with third parties.</p>
      <h3>Data Retention</h3>
      <p>We retain your information for as long as necessary to fulfil the purposes outlined above or as required by applicable law. You may request deletion of your data at any time.</p>
      <h3>Cookies</h3>
      <p>This website does not use tracking cookies or third-party analytics tools. Google Fonts may load from Google's servers; please refer to Google's privacy policy for details.</p>
      <h3>Your Rights</h3>
      <p>You have the right to access, correct, or delete any personal information we hold about you. To exercise these rights, contact us at editostudios.in@gmail.com.</p>
      <h3>Contact</h3>
      <p>For privacy-related questions, reach us at editostudios.in@gmail.com or via WhatsApp at +91 98173 55071.</p>
    </div>
  </div>
</div>

<div className="modal-overlay" id="modal-terms">
  <div className="modal-box">
    <button className="modal-close" onClick={() => window.closeModal('modal-terms')}>&#x2715;</button>
    <p className="modal-title">Terms &amp; Conditions</p>
    <p className="modal-date">Effective: January 2026</p>
    <div className="modal-body">
      <p>By engaging Edito Studios for any service, you agree to the following terms. Please read them carefully.</p>
      <h3>Services</h3>
      <p>Edito Studios provides video editing, motion graphics, 3D animation, and brand visual services as agreed upon in individual project scopes.</p>
      <h3>Payment</h3>
      <p>A deposit of 50% is required before project commencement. The remaining balance is due upon delivery of final files. Projects will not be released until payment is received in full.</p>
      <h3>Revisions</h3>
      <p>Each project includes a defined number of revision rounds as specified in your project agreement. Additional revisions beyond this scope may be billed at our standard hourly rate.</p>
      <h3>Intellectual Property</h3>
      <p>Upon receipt of full payment, the client receives full rights to the final deliverable. Edito Studios retains the right to display work in its portfolio unless a non-disclosure agreement is signed.</p>
      <h3>Cancellations</h3>
      <p>If a project is cancelled after commencement, the deposit is non-refundable. Work completed up to the point of cancellation will be billed proportionally.</p>
      <h3>Limitation of Liability</h3>
      <p>Edito Studios is not liable for any indirect, incidental, or consequential damages arising from the use of our services.</p>
      <h3>Governing Law</h3>
      <p>These terms are governed by the laws of India. Any disputes shall be resolved in the courts of Rajasthan, India.</p>
    </div>
  </div>
</div>


<nav>
  <a href="#" className="nav-logo">
    <img src="https://pub-e0a8aa70a40f4319bc68be430138a334.r2.dev/Asset%202.png" alt="Edito Studios" onError={(e)=>{
  e.target.style.display='none';
  e.target.nextElementSibling.style.display='block';
}}/>
    <span
  style={{
    display:'none',
    fontFamily:'var(--serif)',
    fontWeight:300,
    fontSize:'1.2rem',
    color:'var(--ink)',
    letterSpacing:'0.08em'
  }}
>
  Edito <em style={{fontStyle:'italic', color:'var(--grey2)'}}>Studios</em>
</span>
  </a>
  <ul className="nav-links">
    <li><a href="#services">Services</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#work">Work</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
  <button className="nav-burger" id="burger" onClick={() => window.toggleMenu()} aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
</nav>

<div className="mobile-menu" id="mobile-menu">
  <a href="#services" onClick={() => window.closeMenu()}>Services</a>
  <a href="#about" onClick={() => window.closeMenu()}>About</a>
  <a href="#work" onClick={() => window.closeMenu()}>Work</a>
  <a href="#contact" onClick={() => window.closeMenu()}>Contact</a>
</div>


<div className="hero-wrap">
  <div id="hero">
    <p className="hero-eyebrow">Video Editing Studio &nbsp;·&nbsp; India &nbsp;·&nbsp; Remote Worldwide</p>
    <h1 className="hero-headline">
  Your story<br />
  deserves to<br />
  <em>be felt.</em>
</h1>
    <p className="hero-sub">From raw footage to cinematic reels — we shape content that stops the scroll, holds attention, and turns viewers into believers.</p>
    <div className="hero-actions">
      <a href="#work" className="hero-link">See Our Work</a>
      <a href="#contact" className="hero-link ghost">Start a Project</a>
    </div>
  </div>
  <span className="hero-scroll">Scroll to explore</span>
</div>

<hr className="section-divider" />


<section id="about">
  <div className="container">
    <div className="about-grid">
      <blockquote className="about-quote reveal">We don't just edit videos. We build the visual language of your brand.</blockquote>
      <div>
        <p className="section-label reveal d1">About The Studio</p>
        <p className="about-body reveal d2">
          Edito Studios was built on a single conviction — <strong>great content is the result of great partnership.</strong><br /><br />
          We pair strategic creative direction with world-class execution. Our team brings over <strong>3 years of professional experience</strong> across agencies in India and Dubai, delivering for brands on Instagram, YouTube, Amazon, Flipkart, and beyond.<br /><br />
          We think in stories. We work in pixels. We deliver in frames.
        </p>
        <div className="stats-row reveal d3">
          <div className="stat"><div className="n">70+</div><div className="l">Projects</div></div>
          <div className="stat"><div className="n">3</div><div className="l">Countries</div></div>
          <div className="stat"><div className="n">5+</div><div className="l">Platforms</div></div>
        </div>
      </div>
    </div>
  </div>
</section>

<hr className="section-divider" />


<section id="work">
  <div className="container">
    <div className="work-header">
      <h2 className="work-title reveal">
  Selected<br />
  <em>work.</em>
</h2>
    </div>
  </div>

  <div className="reel-stage-wrap reveal">
    <div className="reel-stage" id="reelStage">
      <div className="reel-track" id="reelTrack">

        
        <div className="reel-card" data-idx="0">
          <div className="reel-placeholder"><span className="rp-num">01</span><span className="rp-name">Brand Reel Production</span><span className="rp-label">Short-Form</span></div>
          <video data-src="https://pub-e0a8aa70a40f4319bc68be430138a334.r2.dev/1.mp4" loop muted playsInline preload="none"></video>
          <div className="reel-texture"></div>
        </div>
        <div className="reel-card" data-idx="1">
          <div className="reel-placeholder"><span className="rp-num">02</span><span className="rp-name">YouTube Tutorial Series</span><span className="rp-label">Long-Form</span></div>
          <video data-src="https://pub-e0a8aa70a40f4319bc68be430138a334.r2.dev/2.mp4" loop muted playsInline preload="none"></video>
          <div className="reel-texture"></div>
        </div>
        <div className="reel-card" data-idx="2">
          <div className="reel-placeholder"><span className="rp-num">03</span><span className="rp-name">Product Visualisation</span><span className="rp-label">3D Animation</span></div>
          <video data-src="https://pub-e0a8aa70a40f4319bc68be430138a334.r2.dev/3.mp4" loop muted playsInline preload="none"></video>
          <div className="reel-texture"></div>
        </div>
        <div className="reel-card" data-idx="3">
          <div className="reel-placeholder"><span className="rp-num">04</span><span className="rp-name">Dynamic Motion Graphics</span><span className="rp-label">Motion</span></div>
          <video data-src="https://pub-e0a8aa70a40f4319bc68be430138a334.r2.dev/4.mp4" loop muted playsInline preload="none"></video>
          <div className="reel-texture"></div>
        </div>
        <div className="reel-card" data-idx="4">
          <div className="reel-placeholder"><span className="rp-num">05</span><span className="rp-name">Multi-Platform Campaign</span><span className="rp-label">Social</span></div>
          <video data-src="https://pub-e0a8aa70a40f4319bc68be430138a334.r2.dev/5.mp4" loop muted playsInline preload="none"></video>
          <div className="reel-texture"></div>
        </div>
        <div className="reel-card" data-idx="5">
          <div className="reel-placeholder"><span className="rp-num">06</span><span className="rp-name">Cinematic Brand Story</span><span className="rp-label">Brand Film</span></div>
          <video data-src="https://pub-e0a8aa70a40f4319bc68be430138a334.r2.dev/6.mp4" loop muted playsInline preload="none"></video>
          <div className="reel-texture"></div>
        </div>
        <div className="reel-card" data-idx="6">
          <div className="reel-placeholder"><span className="rp-num">07</span><span className="rp-name">School Admission Reel</span><span className="rp-label">Institution</span></div>
          <video data-src="https://pub-e0a8aa70a40f4319bc68be430138a334.r2.dev/7.mp4" loop muted playsInline preload="none"></video>
          <div className="reel-texture"></div>
        </div>

       
        <div className="reel-card" data-idx="0" aria-hidden="true">
          <div className="reel-placeholder"><span className="rp-num">01</span><span className="rp-name">Brand Reel Production</span><span className="rp-label">Short-Form</span></div>
          <video data-src="https://pub-e0a8aa70a40f4319bc68be430138a334.r2.dev/1.mp4" loop muted playsInline preload="none"></video>
          <div className="reel-texture"></div>
        </div>
        <div className="reel-card" data-idx="1" aria-hidden="true">
          <div className="reel-placeholder"><span className="rp-num">02</span><span className="rp-name">YouTube Tutorial Series</span><span className="rp-label">Long-Form</span></div>
          <video data-src="https://pub-e0a8aa70a40f4319bc68be430138a334.r2.dev/2.mp4" loop muted playsInline preload="none"></video>
          <div className="reel-texture"></div>
        </div>
        <div className="reel-card" data-idx="2" aria-hidden="true">
          <div className="reel-placeholder"><span className="rp-num">03</span><span className="rp-name">Product Visualisation</span><span className="rp-label">3D Animation</span></div>
          <video data-src="https://pub-e0a8aa70a40f4319bc68be430138a334.r2.dev/3.mp4" loop muted playsInline preload="none"></video>
          <div className="reel-texture"></div>
        </div>
        <div className="reel-card" data-idx="3" aria-hidden="true">
          <div className="reel-placeholder"><span className="rp-num">04</span><span className="rp-name">Dynamic Motion Graphics</span><span className="rp-label">Motion</span></div>
          <video data-src="https://pub-e0a8aa70a40f4319bc68be430138a334.r2.dev/4.mp4" loop muted playsInline preload="none"></video>
          <div className="reel-texture"></div>
        </div>
        <div className="reel-card" data-idx="4" aria-hidden="true">
          <div className="reel-placeholder"><span className="rp-num">05</span><span className="rp-name">Multi-Platform Campaign</span><span className="rp-label">Social</span></div>
          <video data-src="https://pub-e0a8aa70a40f4319bc68be430138a334.r2.dev/5.mp4" loop muted playsInline preload="none"></video>
          <div className="reel-texture"></div>
        </div>
        <div className="reel-card" data-idx="5" aria-hidden="true">
          <div className="reel-placeholder"><span className="rp-num">06</span><span className="rp-name">Cinematic Brand Story</span><span className="rp-label">Brand Film</span></div>
          <video data-src="https://pub-e0a8aa70a40f4319bc68be430138a334.r2.dev/6.mp4" loop muted playsInline preload="none"></video>
          <div className="reel-texture"></div>
        </div>
        <div className="reel-card" data-idx="6" aria-hidden="true">
          <div className="reel-placeholder"><span className="rp-num">07</span><span className="rp-name">School Admission Reel</span><span className="rp-label">Institution</span></div>
          <video data-src="https://pub-e0a8aa70a40f4319bc68be430138a334.r2.dev/7.mp4" loop muted playsInline preload="none"></video>
          <div className="reel-texture"></div>
        </div>

      </div>
    </div>
  </div>
</section>

<hr className="section-divider" />


<section id="contact">
  <div className="container">
    <div className="contact-inner">
      <div className="reveal">
        <p className="section-label">Let's Create</p>
        <h2 className="contact-headline">Have a project<br />in <em>mind?</em></h2>
        <p className="contact-sub">Open to long-term collaborations, project-based work, and agency partnerships. We'd love to hear about your vision.</p>
        <div className="contact-meta-stacked">
          <div className="contact-meta-item">
            <p className="meta-label">WhatsApp</p>
            <p className="meta-value"><a href="https://wa.me/919817355071">+91 98173 55071</a></p>
          </div>
          <div className="contact-meta-item">
            <p className="meta-label">Instagram</p>
            <p className="meta-value"><a
  href="https://instagram.com/editostudios"
  target="_blank"
  rel="noreferrer"
>@editostudios</a></p>
          </div>
          <div className="contact-meta-item">
            <p className="meta-label">Based In</p>
            <p className="meta-value">India &nbsp;·&nbsp; Remote Worldwide</p>
          </div>
        </div>
      </div>
      <div className="reveal d2">
        <form
  className="contact-form"
  id="contact-form"
  onSubmit={(e) => window.handleSubmit(e)}
>
          <div className="form-row">
            <label htmlFor="cf-name">Your Name</label>
            <input type="text" id="cf-name" name="name" placeholder="Jane Smith" />
          </div>
          <div className="form-row">
            <label htmlFor="cf-email">Email Address</label>
            <input type="email" id="cf-email" name="email" placeholder="hello@yourbrand.com" />
          </div>
          <div className="form-row">
            <label htmlFor="cf-service">Service Interested In</label>
            <select id="cf-service" name="service">
              <option value="" disabled>Select a service</option>
              <option>Reels &amp; Short-Form</option>
              <option>YouTube Long-Form</option>
              <option>Motion Graphics</option>
              <option>3D Animation</option>
              <option>Brand Visuals &amp; Strategy</option>
              <option>Full Package</option>
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="cf-message">Tell Us About Your Project</label>
            <textarea id="cf-message" name="message" placeholder="What are you working on? Timelines, goals, references..."></textarea>
          </div>
          <button type="submit" className="form-submit">
            Send Message <span className="form-submit-arrow">&#x2192;</span>
          </button>
        </form>
        <p className="form-success" id="form-success">Thank you — we'll be in touch within 24 hours.</p>
      </div>
    </div>
  </div>
</section>


<footer>
  <div className="footer-top">
    <a href="#" className="footer-logo-wrap">
      <img src="https://pub-e0a8aa70a40f4319bc68be430138a334.r2.dev/Asset%202.png" alt="Edito Studios" onError={(e)=>{
    e.target.style.display='none';
  }}
/>
    </a>
    <div className="footer-links">
      <a href="#services">Services</a>
      <a href="#about">About</a>
      <a href="#work">Work</a>
      <a
  href="https://instagram.com/editostudios"
  target="_blank"
  rel="noreferrer"
>Instagram</a>
      <a href="https://wa.me/919817355071">WhatsApp</a>
    </div>
  </div>
  <div className="footer-bottom">
    <p className="footer-copy">&copy; 2026 Edito Studios. All rights reserved.</p>
    <div className="footer-legal">
      <a href="#" onClick={(e)=>{
  e.preventDefault();
  window.openModal('modal-privacy');
}}>Privacy Policy</a>
      <a href="#" onClick={(e)=>{
  e.preventDefault();
 window.openModal('modal-terms');
}}>Terms &amp; Conditions</a>
    </div>
  </div>
</footer>


    </>
  );
}

export default App;