const form = document.getElementById('contact-form');
const statusBox = document.getElementById('form-status');
const yearNode = document.getElementById('year');

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (form && statusBox) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;

      statusBox.textContent = 'Sending message...';
    statusBox.className = 'form-status';
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
      });

        const contentType = response.headers.get('content-type') || '';
        const result = contentType.includes('application/json') ? await response.json() : {};

      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'Unable to send message.');
      }

      statusBox.textContent = result.message || 'Thanks! Your message was sent successfully.';
      statusBox.classList.add('success');
      form.reset();
    } catch (error) {
      const mailtoLink = `mailto:bbek75059@gmail.com?subject=${encodeURIComponent('Portfolio contact')}&body=${encodeURIComponent(`Name: ${payload.name || ''}\nEmail: ${payload.email || ''}\n\nMessage:\n${payload.message || ''}`)}`;
      const fallbackLink = document.createElement('a');
      fallbackLink.href = mailtoLink;
      fallbackLink.textContent = 'Open email app';
      fallbackLink.className = 'status-link';
      statusBox.replaceChildren(
        document.createTextNode('The online form is temporarily unavailable.'),
        document.createTextNode(' '),
        fallbackLink
      );
      statusBox.classList.add('error');
    } finally {
      window.clearTimeout(timeoutId);
      if (submitButton) submitButton.disabled = false;
    }
  });
}


/* ===== CURSOR ===== */
const dot=document.getElementById('cursor-dot'),ring=document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  dot.style.left=mx+'px';dot.style.top=my+'px';
});
(function loop(){rx+=(mx-rx)*.13;ry+=(my-ry)*.13;
  ring.style.left=rx+'px';ring.style.top=ry+'px';
  requestAnimationFrame(loop);})();
/* ===== PAGE LOADER ===== */
window.addEventListener('load',()=>{
  const L=document.getElementById('page-loader');
  setTimeout(()=>L.classList.add('hide'),900);
  setTimeout(()=>L.style.display='none',1900);
});

/* ===== SCROLL PROGRESS ===== */
const sb=document.getElementById('scroll-bar');
window.addEventListener('scroll',()=>{
  sb.style.width=(window.scrollY/(document.documentElement.scrollHeight-innerHeight)*100)+'%';
},{passive:true});

/* ===== OVERSCROLL FLASH ===== */
const fl=document.getElementById('overscroll-flash');let ft=null;
window.addEventListener('scroll',()=>{
  const y=window.scrollY,max=document.documentElement.scrollHeight-innerHeight;
  if(y<=0||y>=max-2){fl.classList.add('show');clearTimeout(ft);ft=setTimeout(()=>fl.classList.remove('show'),500);}
},{passive:true});

/* ===== BACK TO TOP ===== */
const bt=document.getElementById('back-top');
window.addEventListener('scroll',()=>{
  window.scrollY>400?bt.classList.add('show'):bt.classList.remove('show');
},{passive:true});

/* ===== SCROLL REVEAL ===== */
const ro=new IntersectionObserver(entries=>{
  entries.forEach((e,index)=>{
    if(e.isIntersecting){
      const delay = Number(e.target.dataset.delay || 0) || index * 80;
      e.target.style.transitionDelay = `${delay}ms`;
      e.target.classList.add('visible');
      ro.unobserve(e.target);
    }
  });
},{threshold:.12, rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.reveal').forEach((el, index) => {
  if (!el.dataset.delay) el.dataset.delay = String(index * 70);
  ro.observe(el);
});

/* ===== COUNTER ANIMATION ===== */
function animateCount(el){
  const target=+el.dataset.target,dur=1600,start=performance.now();
  (function step(now){
    const p=Math.min((now-start)/dur,1);
    const ease=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
    el.textContent=Math.round(ease*target);
    if(p<1)requestAnimationFrame(step);
  })(start);
}
const co=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){animateCount(e.target);co.unobserve(e.target);}});
},{threshold:.5});
document.querySelectorAll('.count-num').forEach(el=>co.observe(el));

/* ===== GAMIFICATION BAR ===== */
const xpFill=document.getElementById('xp-fill');
const xpCard=document.querySelector('.xp-card');
if(xpFill&&xpCard){
  const xpObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        xpFill.style.width='72%';
        xpCard.style.boxShadow='0 0 0 1px rgba(99,102,241,.2), 0 18px 60px rgba(99,102,241,.16)';
        xpObserver.disconnect();
      }
    });
  },{threshold:.5});
  xpObserver.observe(xpCard);
}

/* ===== TIMELINE REVEAL ===== */
document.querySelectorAll('.timeline-item').forEach((item,index)=>{
  item.classList.add('visible');
  item.style.transitionDelay=`${index*80}ms`;
});

/* ===== TYPING EFFECT ===== */
const words=['Bekzod','Developer','Designer','Creative'];
let wi=0,ci=0,del=false;
const typed=document.getElementById('typed-text');
function type(){
  if(!typed)return;
  const w=words[wi];
  if(!del){typed.textContent=w.slice(0,++ci);if(ci===w.length){del=true;setTimeout(type,1800);return;}}
  else{typed.textContent=w.slice(0,--ci);if(ci===0){del=false;wi=(wi+1)%words.length;}}
  setTimeout(type,del?55:88);
}
setTimeout(type,2200);

/* ===== MOUSE PARALLAX ===== */
const glow=document.querySelector('.hero-glow');
document.addEventListener('mousemove',e=>{
  if(!glow)return;
  glow.style.transform=`translate(${(e.clientX/innerWidth-.5)*38}px,${(e.clientY/innerHeight-.5)*38}px)`;
});

/* ===== TILT EFFECT ===== */
document.querySelectorAll('.card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=((e.clientX-r.left)/r.width-.5)*18;
    const y=((e.clientY-r.top)/r.height-.5)*-18;
    card.style.transform=`perspective(900px) rotateX(${y}deg) rotateY(${x}deg) translateY(-10px)`;
  });
  card.addEventListener('mouseleave',()=>{
    card.style.transition='transform .5s cubic-bezier(.22,1,.36,1)';
    card.style.transform='';
    setTimeout(()=>card.style.transition='',500);
  });
});

/* ===== PROJECT FILTERS ===== */
const filterButtons=document.querySelectorAll('.filter-btn');
const projectCards=document.querySelectorAll('.project-grid .card[data-tag]');
filterButtons.forEach(button=>{
  button.addEventListener('click',()=>{
    const filter=button.dataset.filter;
    filterButtons.forEach(item=>{
      const isActive=item===button;
      item.classList.toggle('active',isActive);
      item.setAttribute('aria-pressed',String(isActive));
    });
    projectCards.forEach(card=>{
      const matches=filter==='all'||card.dataset.tag===filter;
      card.classList.toggle('project-card-hidden',!matches);
    });
  });
});

/* ===== PROJECT MODAL ===== */
const overlay=document.getElementById('modal-overlay');
const dialogPreviousFocus=new WeakMap();
function focusableElements(dialog){
  return [...dialog.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')];
}
function activateDialog(dialog, initialSelector){
  dialogPreviousFocus.set(dialog,document.activeElement);
  const initial=dialog.querySelector(initialSelector) || focusableElements(dialog)[0];
  if(initial) initial.focus({preventScroll:true});
}
function deactivateDialog(dialog){
  const previous=dialogPreviousFocus.get(dialog);
  dialogPreviousFocus.delete(dialog);
  if(previous && typeof previous.focus==='function') previous.focus({preventScroll:true});
}
document.addEventListener('keydown',event=>{
  if(event.key!=='Tab') return;
  const dialog=document.querySelector('[role="dialog"].open');
  if(!dialog) return;
  const focusable=focusableElements(dialog);
  if(!focusable.length) return;
  const first=focusable[0];
  const last=focusable[focusable.length-1];
  if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
});
function openModal(card){
  const modalImg=document.getElementById('modal-img');
  modalImg.src=card.dataset.img;
  modalImg.alt=card.dataset.title || 'Project preview';
  const modalLive=document.getElementById('modal-live');
  const modalGithub=document.getElementById('modal-github');
  modalLive.href=card.dataset.live || '#';
  modalGithub.href=card.dataset.github || '#';
  modalLive.hidden=!card.dataset.live;
  modalGithub.hidden=!card.dataset.github;
  document.getElementById('modal-tag').textContent=card.dataset.tag;
  document.getElementById('modal-title').textContent=card.dataset.title;
  document.getElementById('modal-desc').textContent=card.dataset.desc;
  document.getElementById('case-problem').textContent=card.dataset.problem||'';
  document.getElementById('case-process').textContent=card.dataset.process||'';
  document.getElementById('case-solution').textContent=card.dataset.solution||'';
  document.getElementById('case-result').textContent=card.dataset.result||'';
  const tb=document.getElementById('modal-tech');tb.replaceChildren();
  card.dataset.tech.split(',').forEach(t=>{
    const s=document.createElement('span');s.className='tech-badge';s.textContent=t.trim();tb.appendChild(s);
  });
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  activateDialog(overlay,'.modal-close');
}
function closeModal(){overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');document.body.style.overflow='';deactivateDialog(overlay);}
document.querySelectorAll('.card[data-modal]').forEach(c=>{
  c.addEventListener('click',()=>openModal(c));
  c.addEventListener('keydown',e=>{
    if(e.key==='Enter'||e.key===' '){e.preventDefault();openModal(c);}
  });
});
document.getElementById('modal-close').addEventListener('click',closeModal);
overlay.addEventListener('click',e=>{if(e.target===overlay)closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

/* ===== ACTIVE NAV ===== */
const navLinks=document.querySelectorAll('.nav-links a[href^="#"]');
const mobileMenuToggle=document.getElementById('mobile-menu-toggle');
const mobileNav=document.querySelector('.nav-links');
mobileMenuToggle.addEventListener('click',()=>{
  const isOpen=mobileNav.classList.toggle('open');
  mobileMenuToggle.classList.toggle('open',isOpen);
  mobileMenuToggle.setAttribute('aria-expanded',String(isOpen));
});
navLinks.forEach(link=>link.addEventListener('click',()=>{
  mobileNav.classList.remove('open');
  mobileMenuToggle.classList.remove('open');
  mobileMenuToggle.setAttribute('aria-expanded','false');
}));
function setActiveNav(targetId){
  navLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${targetId}`));
}
navLinks.forEach(link=>{
  link.addEventListener('click',()=>setActiveNav(link.getAttribute('href').slice(1)));
});
const navObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting)
      setActiveNav(e.target.id);
  });
},{rootMargin:'-20% 0px -55% 0px',threshold:0});
document.querySelectorAll('section[id]').forEach(s=>navObs.observe(s));
setActiveNav(location.hash ? location.hash.slice(1) : 'home');

/* ===== DARK / LIGHT MODE ===== */
const toggleBtn=document.getElementById('theme-toggle');
const paletteBtn=document.getElementById('palette-toggle');
const html=document.documentElement;
const languageToggle=document.getElementById('language-toggle');
const translations={
  en:{
    'nav.home':'Home','nav.gallery':'Gallery','nav.about':'About','nav.journey':'Journey','nav.certificates':'Certificates','nav.achievements':'Achievements','nav.projects':'Projects','nav.contact':'Contact',
    'loader.title':'Welcome to Rustamov Bekzod’s Portfolio','loader.subtitle':'Academic profile and professional work',
    'hero.badge':'Available for freelance & collaborations','hero.signature':'Future-focused builder','hero.subtitle':'I design and build polished digital experiences that balance clarity, performance, and modern visual storytelling. I am preparing for IELTS and SAT while growing through frontend development, product thinking, and international education goals.','hero.cta.projects':'View Projects →','hero.cta.talk':'Let’s Talk','hero.cta.cv':'Open CV','hero.card.title':'Portfolio','hero.card.subtitle':'Product-minded web design & responsive UI','hero.stat.years':'Years learning','hero.stat.projects':'Live projects','hero.stat.responsive':'Responsive',
    'gallery.label':'My Life','gallery.title':'Gallery','gallery.hint':'Move your mouse over the photos',
    'about.label':'Who I am','about.title':'About','about.titleAccent':'Me','about.p1':'I’m Rustamov Bekzod, a young frontend developer and visual designer from Samarkand, currently preparing for IELTS and SAT while building a future in technology, education, and international opportunity.','about.p2':'I have completed training in AI and frontend development and enjoy creating digital experiences that feel clear, purposeful, and memorable. I value discipline, curiosity, and thoughtful design in both work and life.','about.p3':'My long-term goal is to build a meaningful career in technology, develop a strong foundation in international education, and study IT in a top university abroad. I’m focused on becoming a reliable builder with both technical skill and a strong creative perspective.','about.highlight1.title':'Journey:','about.highlight1.text':'I am growing through learning, practical experience, and a consistent focus on frontend and AI-driven product thinking.','about.highlight2.title':'Focus:','about.highlight2.text':'performance, accessibility, visual clarity, and user-centered digital experiences designed to feel trustworthy and modern.','about.highlight3.title':'Approach:','about.highlight3.text':'structured thinking, clean implementation, and design details that make each product feel intentional, polished, and easy to use.','about.skill.html':'HTML & CSS','about.skill.js':'JavaScript','about.skill.uiux':'UI / UX Design','about.skill.responsive':'Responsive Design','about.stats.experience':'Years of Learning','about.stats.projects':'Live Projects','about.stats.passion':'Passion for Code','about.insight1.title':'What I focus on','about.insight1.text':'I build clean, fast interfaces that balance usability, visual rhythm, and product clarity. Every section is designed to serve a purpose, not just decorate the page.','about.insight2.title':'What clients usually value','about.insight2.text':'Clear communication, polished visuals, responsive layouts, and a seamless experience from desktop to mobile.','about.insight3.title':'Latest updates','about.insight3.text':'Recent work focuses on stronger storytelling, cleaner product presentation, and more mature portfolio design for personal and professional brands.',
    'journey.label':'Growth','journey.title':'Journey & Experience','journey.levelup':'Level Up','journey.mapTitle':'Developer Growth Map','journey.mapText':'I am building my future through focus, discipline, and continuous learning. Every milestone brings me closer to becoming a stronger builder in technology and design.','journey.level':'Developer Level','journey.xp':'XP 720 / 1000','journey.nextUnlock':'Next unlock: AI Mastery','journey.item2010':'Born in Samarkand','journey.item2010Text':'The beginning of a journey shaped by curiosity, ambition, and the dream of building something meaningful.','journey.item2024':'Learning Frontend & Design','journey.item2024Text':'I began developing strong foundations in HTML, CSS, JavaScript, and visual design with a focus on quality and clarity.','journey.item2025':'AI Certificates & Digital Growth','journey.item2025Text':'I expanded my knowledge through AI-related learning and started creating more polished digital experiences.','journey.itemNow':'Preparing for the Future','journey.itemNowText':'I am preparing for higher opportunities, stronger studies, and a future in international technology.',
    'cert.label':'Credentials','cert.title':'Certificates','cert.view':'View certificate ↗','cert.verified':'Verified course',
    'achievements.label':'Milestones','achievements.title':'Selected Achievements','achievement.gai.index':'01 / CREDENTIAL','achievement.gai.title':'Generative AI Foundations','achievement.gai.text':'Completed a Google Cloud course covering generative AI, large language models, prompt engineering, and responsible AI.','achievement.iot.index':'02 / CREDENTIAL','achievement.iot.title':'IoT and Cloud Computing','achievement.iot.text':'Completed Yonsei University coursework in wireless technologies, connected devices, cloud computing, and IoT systems.','achievement.portfolio.index':'03 / PRACTICE','achievement.portfolio.title':'Responsive Portfolio System','achievement.portfolio.text':'Built and refined a responsive portfolio with accessible navigation, interactive project presentation, themes, and contact workflows.','project.portfolio.title':'Personal Brand Portfolio','project.portfolio.desc':'A live personal website combining frontend development, UI/UX thinking, and a clear professional identity.','project.portfolio.focusLabel':'Focus:','project.portfolio.focus':'Personal branding, responsive layout, and strong visual storytelling.','project.portfolio.stackLabel':'Stack:','project.portfolio.stack':'HTML, CSS, JavaScript, Netlify.','project.portfolio.live':'Live demo ↗','project.design.title':'UI Component System','project.design.desc':'A reusable component library with a consistent token-based design system, built for speed and visual clarity.','project.design.resultLabel':'Result:','project.design.result':'Consistent design language across all projects with reusable, documented CSS components.','project.design.stackLabel':'Stack:','project.design.stack':'CSS, Design Tokens, HTML, JavaScript.','project.design.live':'GitHub ↗','project.app.title':'Weather Dashboard','project.app.desc':'Real-time weather app using OpenWeatherMap API — city search, 5-day forecast, and dynamic weather-based UI.','project.app.resultLabel':'Result:','project.app.result':'Demonstrates async API integration, error handling, and responsive layout in a working real-world app.','project.app.stackLabel':'Stack:','project.app.stack':'JavaScript, REST API, HTML, CSS.','filters.all':'All','filters.frontend':'Frontend','filters.uiux':'UI/UX','filters.webapp':'Web App',
    'section.projects.label':'My Work','section.projects.title':'Projects','section.contact.label':'Get in touch','section.contact.title':'Contact','section.contact.copy':'Open for freelance work, front-end collaborations, and long-term product projects. If you need a modern, fast, and polished digital experience, I’m ready to help.','section.contact.note':'Prefer a quick intro? Use the form below or reach out directly through one of the links above.','section.contact.email':'Email','section.contact.telegram':'Telegram','section.contact.instagram':'Instagram','section.contact.phone':'Phone','section.contact.write':'Write email','section.contact.chat':'Open chat','section.contact.profile':'View profile','section.contact.call':'Call now','section.contact.submit':'Send Message →','section.footer':'Designed & built by {name} · {year}',
    'form.name':'Your Name','form.email':'Email Address','form.message':'Message','form.submit':'Send Message →','form.placeholder.name':'Bekzod Rustamov','form.placeholder.email':'hello@example.com','form.placeholder.message':'Tell me about your project...',
    'status.sending':'Sending...', 'status.success':'Your message has been sent successfully.','status.error':'Something went wrong. Please try again or send an email directly.'
  },
  uz:{
    'nav.home':'Bosh sahifa','nav.gallery':'Galereya','nav.about':'Men haqimda','nav.journey':'Yo‘lim','nav.certificates':'Sertifikatlar','nav.achievements':'Yutuqlar','nav.projects':'Loyihalar','nav.contact':'Bog‘lanish',
    'loader.title':'Rustamov Bekzod portfoliosiga xush kelibsiz','loader.subtitle':'Akademik profil va professional ishlar',
    'hero.badge':'Frilanser va hamkorlik uchun tayyor','hero.signature':'Kelajakka yo‘naltirilgan quruvchi','hero.subtitle':'Men aniq, tezkor va zamonaviy raqamli tajribalar yarataman, ular ishlatilishi qulay, ko‘rinishi nafis va samarador bo‘ladi. IELTS va SATga tayyorgarlik ko‘ryapman, shu bilan birga frontend, mahsulot fikri va xalqaro ta’lim maqsadlarida rivojlanaman.','hero.cta.projects':'Loyihalarni ko‘rish →','hero.cta.talk':'Bog‘laning','hero.cta.cv':'CV ochish','hero.card.title':'Portfolio','hero.card.subtitle':'Mahsulotga yo‘naltirilgan web dizayn & moslashuvchan UI','hero.stat.years':'Yillik tajriba','hero.stat.projects':'Loyihalar','hero.stat.responsive':'Moslashuvchan',
    'gallery.label':'Hayotim','gallery.title':'Galereya','gallery.hint':'Fotosuratlar ustiga sichqonchani olib keting',
    'about.label':'Men kimman','about.title':'Men haqimda','about.titleAccent':'Men','about.p1':'Men Rustamov Bekzod, Samarqandlik yosh frontend dasturchi va vizual dizaynerman. Hozir IELTS va SATga tayyorgarlik ko‘ryapman, shu bilan birga texnologiya, ta’lim va xalqaro imkoniyatlar yo‘lida kelajagimni qurayapman.','about.p2':'Men AI va frontend rivojlanish bo‘yicha o‘rganganman va aniq, maqsadli, esda qolarli raqamli tajribalar yaratishni yaxshi ko‘raman. Men intizom, qiziqish va o‘ylangan dizaynga katta e’tibor beraman.','about.p3':'Mening uzoq muddatli maqsadim texnologiya sohasida ma’noqli martaba qurish, xalqaro ta’lim asoslarini mustahkamlash va chet elning yuqori talablari bo‘lgan universitetda IT sohasini o‘rganish. Men texnik ko‘nikma va ijodiy qarashga ega ishonchli quruvchiga aylanishga intilaman.','about.highlight1.title':'Yo‘l:','about.highlight1.text':'Men o‘rganish, amaliy tajriba va frontend hamda AI-ga asoslangan mahsulot fikri orqali rivojlanayapman.','about.highlight2.title':'E’tibor:','about.highlight2.text':'samaradorlik, kirishimlilik, vizual aniqlik va foydalanuvchiga ishonch bag‘ishlovchi raqamli tajribalar.','about.highlight3.title':'Yondashuv:','about.highlight3.text':'tuzilgan fikrlash, toza ishga solish va dizayn detallarini hisobga olish, shunda har bir mahsulot maqsadli, nafis va qulay bo‘ladi.','about.skill.html':'HTML & CSS','about.skill.js':'JavaScript','about.skill.uiux':'UI / UX Dizayn','about.skill.responsive':'Moslashuvchan Dizayn','about.stats.experience':'Tajriba yillari','about.stats.projects':'Bajarilgan loyihalar','about.stats.passion':'Kodga ishtiyoq','about.insight1.title':'Nima ustida ishlayman','about.insight1.text':'Men tez va toza interfeyslar yarataman, ular ishlatilishini osonlashtiradi, vizual ritmni saqlaydi va mahsulotga ma’no beradi. Har bir bo‘lim maqsadga xizmat qilish uchun mo‘ljallangan.','about.insight2.title':'Mijozlar nima qadrlaydi','about.insight2.text':'Aniq muloqot, nafis vizual, moslashuvchan maket va kompyuter bilan mobil qurilmalar uchun silliq tajriba.','about.insight3.title':'So‘nggi yangilanishlar','about.insight3.text':'So‘nggi ishlar kuchli hikoya, toza mahsulot taqdimoti va shaxsiy/ professional brendlar uchun yanada yetuk portfolio dizayniga qaratilgan.',
    'journey.label':'O‘sish','journey.title':'Yo‘l va tajriba','journey.levelup':'Daraja oshirish','journey.mapTitle':'Dasturchi o‘sish xaritasi','journey.mapText':'Men kelajagimni diqqat, intizom va uzluksiz o‘rganish orqali qurayapman. Har bir bosqich meni texnologiya va dizaynda kuchli quruvchi qilishga yaqinlashtiradi.','journey.level':'Dasturchi darajasi','journey.xp':'XP 720 / 1000','journey.nextUnlock':'Keyingi ochilish: AI ustasi','journey.item2010':'Samarqandda tug‘ilgan','journey.item2010Text':'Qiziqish, maqsad va ma’no yaratish orzusining boshlanishi.','journey.item2024':'Frontend & dizayn o‘rganish','journey.item2024Text':'HTML, CSS, JavaScript va vizual dizayn asoslarini sifati va aniqligiga e’tibor qaratib o‘rganishni boshladim.','journey.item2025':'AI sertifikatlari & raqamli o‘sish','journey.item2025Text':'AI bilan bog‘liq bilimlarni kengaytirib, yanada yaxshilangan raqamli tajribalar yaratishni boshladim.','journey.itemNow':'Kelajakka tayyorgarlik','journey.itemNowText':'Men yuqori imkoniyatlar, kuchli ta’lim va xalqaro texnologiya kelajagi uchun tayyorgarlik ko‘ryapman.',
    'cert.label':'Kredensiallar','cert.title':'Sertifikatlar','cert.view':'Sertifikatni ko‘rish ↗','cert.verified':'Tasdiqlangan kurs',
    'achievements.label':'Bosqichlar','achievements.title':'Tanlangan yutuqlar','achievement.gai.index':'01 / KREDENSIAL','achievement.gai.title':'Generative AI Foundations','achievement.gai.text':'Google Cloud kursini yakunladi, unda generativ AI, katta tilli modellar, prompt muhandisligi va mas’uliyatli AI yoritilgan.','achievement.iot.index':'02 / KREDENSIAL','achievement.iot.title':'IoT va Cloud Computing','achievement.iot.text':'Yonsei universitetining simsiz texnologiyalar, ulangan qurilmalar, bulutli hisoblash va IoT tizimlari bo‘yicha kursini yakunladi.','achievement.portfolio.index':'03 / PRAKTIKA','achievement.portfolio.title':'Responsive Portfolio System','achievement.portfolio.text':'Kirishlar, interaktiv loyiha taqdimoti, mavzular va aloqa jarayonlarini o‘z ichiga olgan moslashuvchan portfolioni yaratdi va takomillashtirdi.','project.portfolio.title':'Shaxsiy brend portfeli','project.portfolio.desc':'Frontend rivojlanishi, UI/UX fikrlashi va aniq professional identifikatsiyani birlashtirgan jonli shaxsiy veb-sayt.','project.portfolio.focusLabel':'E’tibor:','project.portfolio.focus':'Shaxsiy brend, moslashuvchan maket va kuchli vizual hikoya.','project.portfolio.stackLabel':'Stack:','project.portfolio.stack':'HTML, CSS, JavaScript, Netlify.','project.portfolio.live':'Live demo ↗','project.design.title':'Dizayn yaratish','project.design.desc':'Aniq vizual tizim, moslashuvchan maket va sifatli interaktiv naqshlar bilan jonli shaxsiy brend tajribasi.','project.design.resultLabel':'Natija:','project.design.result':'Loyihaning har bir bloki maqsadli bo‘lib ko‘rinishini ta’minlash orqali umumiy sifatni yaxshiladi.','project.design.stackLabel':'Stack:','project.design.stack':'Figma, CSS, dizayn tizimlari.','project.design.live':'Loyihani ko‘rish ↗','project.app.title':'Web ilova','project.app.desc':'O‘sib boruvchi komponentlar va silliq, qulay foydalanuvchi interaksiyasi bilan yaratilgan moslashuvchan interfeys konsepsiyasi.','project.app.resultLabel':'Natija:','project.app.result':'Mahsulot o‘sishi uchun kengaytiriladigan va moslashtiriladigan UI tayanch yaratildi.','project.app.stackLabel':'Stack:','project.app.stack':'JavaScript, CSS, REST API, HTML.','filters.all':'Barchasi','filters.frontend':'Frontend','filters.uiux':'UI/UX','filters.webapp':'Web ilova',
    'section.projects.label':'Mening ishim','section.projects.title':'Loyihalar','section.contact.label':'Bog‘lanish','section.contact.title':'Bog‘lanish','section.contact.copy':'Frilanser ishlar, front-end hamkorlik va uzoq muddatli mahsulot loyihalari uchun tayyorman. Zamonaviy, tez va nafis raqamli tajriba kerak bo‘lsa, men yordam berishga tayyorman.','section.contact.note':'Tezkor kirish kerakmi? Quyidagi formadan foydalaning yoki yuqoridagi havolalardan biriga murojat qiling.','section.contact.email':'Email','section.contact.telegram':'Telegram','section.contact.instagram':'Instagram','section.contact.phone':'Telefon','section.contact.write':'Email yozing','section.contact.chat':'Chatni oching','section.contact.profile':'Profilni ko‘rish','section.contact.call':'Hozir qo‘ng‘iroq qiling','section.contact.submit':'Xabar yuborish →','section.footer':'Dizayn va tayyorlangan {name} · {year}',
    'form.name':'Ismingiz','form.email':'Email manzilingiz','form.message':'Xabar','form.submit':'Xabar yuborish →','form.placeholder.name':'Bekzod Rustamov','form.placeholder.email':'salom@example.com','form.placeholder.message':'Loyihangiz haqida yozing...',
    'status.sending':'Yuborilmoqda...','status.success':'Xabaringiz muvaffaqiyatli yuborildi.','status.error':'Nimadir noto‘g‘ri ketdi. Qayta urinib ko‘ring yoki to‘g‘ridan-to‘g‘ri email yuboring.'
  },
  ru:{
    'nav.home':'Главная','nav.gallery':'Галерея','nav.about':'Обо мне','nav.journey':'Путь','nav.certificates':'Сертификаты','nav.achievements':'Достижения','nav.projects':'Проекты','nav.contact':'Контакты',
    'loader.title':'Добро пожаловать в портфолио Rustamov Bekzod','loader.subtitle':'Академический профиль и профессиональная работа',
    'hero.badge':'Готов к фрилансу и сотрудничеству','hero.signature':'Создатель, ориентированный на будущее','hero.subtitle':'Я создаю понятные, быстрые и современные цифровые продукты, которые выглядят качественно и работают без лишнего шума. Готовлюсь к IELTS и SAT, одновременно развиваясь в frontend, продуктовом мышлении и международном образовании.','hero.cta.projects':'Смотреть проекты →','hero.cta.talk':'Связаться','hero.cta.cv':'Открыть CV','hero.card.title':'Портфолио','hero.card.subtitle':'Product-minded веб-дизайн и адаптивный UI','hero.stat.years':'Лет опыта','hero.stat.projects':'Проекты','hero.stat.responsive':'Адаптивный',
    'gallery.label':'Моя жизнь','gallery.title':'Галерея','gallery.hint':'Наведите курсор на фотографии',
    'about.label':'Кто я','about.title':'Обо','about.titleAccent':'мне','about.p1':'Я Rustamov Bekzod, молодой frontend-разработчик и визуальный дизайнер из Самарканда. В настоящее время готовлюсь к IELTS и SAT, одновременно строя своё будущее в технологиях, образовании и международных возможностях.','about.p2':'Я прошёл обучение в области AI и frontend-разработки и люблю создавать цифровые продукты, которые выглядят ясно, целенаправленно и запоминающе. Для меня важны дисциплина, любопытство и продуманный дизайн.','about.p3':'Моя долгосрочная цель — построить содержательную карьеру в технологиях, укрепить основу в международном образовании и изучать IT в ведущем зарубежном университете. Я стремлюсь стать надёжным специалистом с сильной технической и творческой базой.','about.highlight1.title':'Путь:','about.highlight1.text':'Я расту благодаря обучению, практическому опыту и постоянному развитию в frontend и AI-продуктовом мышлении.','about.highlight2.title':'Фокус:','about.highlight2.text':'производительность, доступность, визуальная ясность и пользовательский опыт, который вызывает доверие и ощущение современности.','about.highlight3.title':'Подход:','about.highlight3.text':'структурное мышление, чистая реализация и детали дизайна, которые делают продукт осмысленным, аккуратным и удобным.','about.skill.html':'HTML & CSS','about.skill.js':'JavaScript','about.skill.uiux':'UI / UX Дизайн','about.skill.responsive':'Адаптивный дизайн','about.stats.experience':'Лет опыта','about.stats.projects':'Завершённых проектов','about.stats.passion':'Страсть к коду','about.insight1.title':'На чём я фокусируюсь','about.insight1.text':'Я создаю чистые и быстрые интерфейсы, которые сочетают удобство, ритм визуального языка и понятность продукта. Каждый блок продуман и служит делу, а не просто украшает страницу.','about.insight2.title':'Что ценят клиенты','about.insight2.text':'Чёткое общение, качественная визуальность, адаптивные макеты и бесшовный опыт на компьютере и мобильных устройствах.','about.insight3.title':'Последние обновления','about.insight3.text':'Недавняя работа сосредоточена на более сильном storytelling, более ясной подаче проектов и более зрелом дизайнерском уровне для личных и профессиональных брендов.',
    'journey.label':'Рост','journey.title':'Путь и опыт','journey.levelup':'Поднять уровень','journey.mapTitle':'Карта роста разработчика','journey.mapText':'Я строю своё будущее через концентрацию, дисциплину и постоянное обучение. Каждый этап приближает меня к тому, чтобы стать сильнее в технологиях и дизайне.','journey.level':'Уровень разработчика','journey.xp':'XP 720 / 1000','journey.nextUnlock':'Следующий уровень: AI мастерство','journey.item2010':'Родился в Самарканде','journey.item2010Text':'Начало пути, сформированного любопытством, амбициями и мечтой о создании чего-то значимого.','journey.item2024':'Изучение Frontend и дизайна','journey.item2024Text':'Я начал закладывать крепкую основу в HTML, CSS, JavaScript и визуальном дизайне с акцентом на качество и ясность.','journey.item2025':'Сертификаты AI и цифровой рост','journey.item2025Text':'Я расширил знания в AI и начал создавать более качественные цифровые решения.','journey.itemNow':'Подготовка к будущему','journey.itemNowText':'Я готовлюсь к более высоким возможностям, серьёзному обучению и будущему в международной технологии.',
    'cert.label':'Удостоверения','cert.title':'Сертификаты','cert.view':'Посмотреть сертификат ↗','cert.verified':'Проверенный курс',
    'achievements.label':'Этапы','achievements.title':'Выбранные достижения','achievement.gai.index':'01 / КРЕДЕНЦИАЛ','achievement.gai.title':'Основы Generative AI','achievement.gai.text':'Завершил курс Google Cloud по generative AI, большим языковым моделям, prompt engineering и ответственному AI.','achievement.iot.index':'02 / КРЕДЕНЦИАЛ','achievement.iot.title':'IoT и облачные вычисления','achievement.iot.text':'Завершил курс Yonsei University по беспроводным технологиям, подключённым устройствам, облачным вычислениям и IoT-системам.','achievement.portfolio.index':'03 / ПРАКТИКА','achievement.portfolio.title':'Адаптивная система портфолио','achievement.portfolio.text':'Создал и улучшил адаптивное портфолио с доступной навигацией, интерактивной подачей проектов, темами и рабочими процессами контактов.','project.portfolio.title':'Личное бренд-портфолио','project.portfolio.desc':'Живой личный сайт, объединяющий фронтенд-разработку, UI/UX мышление и чёткую профессиональную идентичность.','project.portfolio.focusLabel':'Фокус:','project.portfolio.focus':'Личный бренд, адаптивный макет и сильное визуальное storytelling.','project.portfolio.stackLabel':'Стек:','project.portfolio.stack':'HTML, CSS, JavaScript, Netlify.','project.portfolio.live':'Live demo ↗','project.design.title':'Дизайн-проект','project.design.desc':'Живой личный бренд-опыт с чёткой визуальной системой, адаптивным макетом и качественными паттернами взаимодействия.','project.design.resultLabel':'Результат:','project.design.result':'Повысил воспринимаемое качество макета, сделав каждый блок более осознанным.','project.design.stackLabel':'Стек:','project.design.stack':'Figma, CSS, дизайн-системы.','project.design.live':'Смотреть проект ↗','project.app.title':'Веб-приложение','project.app.desc':'Создан как адаптивная концепция интерфейса с масштабируемыми компонентами и плавным пользовательским взаимодействием.','project.app.resultLabel':'Результат:','project.app.result':'Создана UI-основа, которую легко расширять и адаптировать под рост продукта.','project.app.stackLabel':'Стек:','project.app.stack':'JavaScript, CSS, REST API, HTML.','filters.all':'Все','filters.frontend':'Frontend','filters.uiux':'UI/UX','filters.webapp':'Веб-приложение',
    'section.projects.label':'Мои работы','section.projects.title':'Проекты','section.contact.label':'Связаться','section.contact.title':'Контакты','section.contact.copy':'Открыт для фриланса, фронтенд-сотрудничества и долгосрочных продуктов. Если вам нужен современный, быстрый и качественный цифровой опыт, я готов помочь.','section.contact.note':'Нужен быстрый старт? Напишите через форму ниже или свяжитесь напрямую по ссылкам выше.','section.contact.email':'Email','section.contact.telegram':'Telegram','section.contact.instagram':'Instagram','section.contact.phone':'Телефон','section.contact.write':'Написать email','section.contact.chat':'Открыть чат','section.contact.profile':'Посмотреть профиль','section.contact.call':'Позвонить сейчас','section.contact.submit':'Отправить сообщение →','section.footer':'Создано и разработано {name} · {year}',
    'form.name':'Ваше имя','form.email':'Email адрес','form.message':'Сообщение','form.submit':'Отправить сообщение →','form.placeholder.name':'Bekzod Rustamov','form.placeholder.email':'hello@example.com','form.placeholder.message':'Расскажите о вашем проекте...','status.sending':'Отправка...','status.success':'Ваше сообщение успешно отправлено.','status.error':'Что-то пошло не так. Попробуйте ещё раз или отправьте письмо напрямую.'
  }
};
Object.assign(translations.en, {
  'modal.cert.about':'About This Certificate', 'modal.cert.demonstrates':'What This Demonstrates', 'modal.cert.skills':'Skills Covered', 'modal.cert.verification':'Verification',
  'modal.project.problem':'Problem', 'modal.project.process':'Process', 'modal.project.solution':'Solution', 'modal.project.result':'Result',
  'proof.result.kicker':'Learning', 'proof.result.value':'2+ years', 'proof.result.text':'consistent front-end study and hands-on product practice',
  'proof.portfolio.kicker':'Projects', 'proof.portfolio.value':'3+ live', 'proof.portfolio.text':'portfolio, UI component system, and a real-time web app',
  'proof.focus.kicker':'Focus', 'proof.focus.value':'Clean + fast', 'proof.focus.text':'clarity, speed, and thoughtful interaction design'
});
Object.assign(translations.uz, {
  'modal.cert.about':'Bu sertifikat haqida', 'modal.cert.demonstrates':'Bu nimani ko‘rsatadi', 'modal.cert.skills':'O‘rganilgan ko‘nikmalar', 'modal.cert.verification':'Tasdiqlash',
  'modal.project.problem':'Muammo', 'modal.project.process':'Jarayon', 'modal.project.solution':'Yechim', 'modal.project.result':'Natija',
  'proof.result.kicker':'Natija', 'proof.result.value':'2+ yil', 'proof.result.text':'frontend o‘rganish va mahsulotga yo‘naltirilgan amaliyot',
  'proof.portfolio.kicker':'Loyihalar', 'proof.portfolio.value':'3+ jonli', 'proof.portfolio.text':'portfolio, UI komponent tizimi va real-time web ilova',
  'proof.focus.kicker':'E’tibor', 'proof.focus.value':'Toza + tez', 'proof.focus.text':'aniqlik, tezlik va o‘ylangan interaksiya dizayni'
});
Object.assign(translations.ru, {
  'modal.cert.about':'Об этом сертификате', 'modal.cert.demonstrates':'Что это подтверждает', 'modal.cert.skills':'Освоенные навыки', 'modal.cert.verification':'Проверка',
  'modal.project.problem':'Проблема', 'modal.project.process':'Процесс', 'modal.project.solution':'Решение', 'modal.project.result':'Результат',
  'proof.result.kicker':'Результат', 'proof.result.value':'2+ года', 'proof.result.text':'изучение frontend и практика продуктового мышления',
  'proof.portfolio.kicker':'Портфолио', 'proof.portfolio.value':'10+ проектов', 'proof.portfolio.text':'дизайн-системы, landing pages и цифровые продукты',
  'proof.focus.kicker':'Фокус', 'proof.focus.value':'Чисто + быстро', 'proof.focus.text':'ясность, скорость и продуманный дизайн взаимодействия'
});
function updateLanguageButton(selected){
  if(!languageToggle) return;
  const label = selected === 'en' ? 'EN' : selected === 'uz' ? 'UZ' : 'RU';
  languageToggle.textContent = label;
  const ariaText = selected === 'en' ? 'Switch to Uzbek' : selected === 'uz' ? 'Switch to Russian' : 'Switch to English';
  languageToggle.setAttribute('aria-label', ariaText);
  languageToggle.title = ariaText;
}
function applyLanguage(language){
  const selected = translations[language] ? language : 'en';
  document.documentElement.lang = selected;

  const applyText = (element, value) => {
    if (!element || !value) return;
    if (element.dataset.i18n === 'section.footer') {
      const year = document.getElementById('year');
      element.innerHTML = value
        .replace('{name}', '<span>Rustamov Bekzod</span>')
        .replace('{year}', year ? '<span id="year"></span>' : '<span></span>');
      const footerYear = element.querySelector('#year');
      if (footerYear) footerYear.textContent = new Date().getFullYear();
      return;
    }

    const textNode = [...element.childNodes].find(node => node.nodeType === Node.TEXT_NODE);
    if (textNode) {
      textNode.textContent = value;
      return;
    }

    element.textContent = value;
  };

  document.body.classList.add('is-translating');
  clearTimeout(window.langTransitionTimer);
  window.langTransitionTimer = setTimeout(() => {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.dataset.i18n;
      const value = translations[selected][key];
      applyText(element, value);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.dataset.i18nPlaceholder;
      const value = translations[selected][key];
      if (value) element.placeholder = value;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      const key = element.dataset.i18nAria;
      const value = translations[selected][key];
      if (value) element.setAttribute('aria-label', value);
    });
    document.body.classList.remove('is-translating');
  }, 180);

  updateLanguageButton(selected);
  localStorage.setItem('language', selected);
}
if(languageToggle){
  languageToggle.addEventListener('click',()=>{
    const order=['en','uz','ru'];
    const current=document.documentElement.lang || 'en';
    const next=order[(order.indexOf(current)+1)%order.length];
    applyLanguage(next);
  });
}
applyLanguage(localStorage.getItem('language')||'en');
function getRgb(hex){
  const value=hex.replace('#','');
  return [parseInt(value.slice(0,2),16),parseInt(value.slice(2,4),16),parseInt(value.slice(4,6),16)];
}
function getLuminance(rgb){
  return rgb.reduce((total,channel,index)=>{
    const normalized=channel/255;
    const linear=normalized<=.03928?normalized/12.92:Math.pow((normalized+.055)/1.055,2.4);
    return total+[.2126,.7152,.0722][index]*linear;
  },0);
}
function getContrast(first,second){
  const lighter=Math.max(getLuminance(first),getLuminance(second));
  const darker=Math.min(getLuminance(first),getLuminance(second));
  return (lighter+.05)/(darker+.05);
}
function blendRgb(color,target,amount){
  return color.map((channel,index)=>Math.round(channel+(target[index]-channel)*amount));
}
function rgbToHex(rgb){
  return `#${rgb.map(channel=>channel.toString(16).padStart(2,'0')).join('')}`;
}
function getReadableAccent(color){
  const accent=getRgb(color);
  const background=getRgb(html.classList.contains('light')?'#f4f4f8':'#05050a');
  let readable=accent;
  const target=getLuminance(background)>.5?[0,0,0]:[255,255,255];
  let amount=0;
  while(getContrast(readable,background)<4.5&&amount<1){
    amount+=.05;
    readable=blendRgb(accent,target,amount);
  }
  return rgbToHex(readable);
}
function updateAccentContrast(color){
  const accent=getRgb(color);
  const foreground=getContrast(accent,[255,255,255])>=getContrast(accent,[0,0,0])?'#ffffff':'#111111';
  html.style.setProperty('--accent-text',getReadableAccent(color));
  html.style.setProperty('--accent-foreground',foreground);
  html.style.setProperty('--accent-glow',`rgba(${accent.join(',')},.28)`);
}
// Saved preference
if(localStorage.getItem('theme')==='light'){
  html.classList.add('light');toggleBtn.textContent='☀️';
}
toggleBtn.addEventListener('click',()=>{
  html.classList.toggle('light');
  const isLight=html.classList.contains('light');
  toggleBtn.textContent=isLight?'☀️':'🌙';
  localStorage.setItem('theme',isLight?'light':'dark');
  updateAccentContrast(palettePicker.value);
  // smooth icon swap
  toggleBtn.style.transform='rotate(360deg) scale(1.2)';
  setTimeout(()=>toggleBtn.style.transform='',400);
});

/* ===== CUSTOM COLOR PALETTE ===== */
const palettePicker=document.getElementById('palette-picker');
const paletteReset=document.getElementById('palette-reset');
const savedColor=localStorage.getItem('siteColor');
const defaultColors={purple:'#9278f0',indigo:'#6366f1',pink:'#ec4899',grad:'linear-gradient(135deg,#6366f1,#a855f7,#ec4899)',gradSoft:'linear-gradient(135deg,rgba(99,102,241,.15),rgba(168,85,247,.10))'};
function applySiteColor(color){
  html.style.setProperty('--purple',color);
  html.style.setProperty('--indigo',color);
  html.style.setProperty('--pink',color);
  html.style.setProperty('--grad',`linear-gradient(135deg,${color},color-mix(in srgb, ${color} 72%, white),color-mix(in srgb, ${color} 68%, black))`);
  html.style.setProperty('--grad-soft',`linear-gradient(135deg,color-mix(in srgb, ${color} 15%, transparent),color-mix(in srgb, ${color} 10%, transparent))`);
  updateAccentContrast(color);
  palettePicker.value=color;
}
function resetSiteColor(){
  html.style.removeProperty('--purple');
  html.style.removeProperty('--indigo');
  html.style.removeProperty('--pink');
  html.style.removeProperty('--grad');
  html.style.removeProperty('--grad-soft');
  updateAccentContrast(defaultColors.purple);
  palettePicker.value=defaultColors.purple;
  localStorage.removeItem('siteColor');
}
if(savedColor && /^#[0-9a-f]{6}$/i.test(savedColor)) applySiteColor(savedColor);
else updateAccentContrast(defaultColors.purple);
paletteBtn.addEventListener('click',()=>palettePicker.click());
paletteReset.addEventListener('click',resetSiteColor);
palettePicker.addEventListener('input',event=>{
  applySiteColor(event.target.value);
  localStorage.setItem('siteColor',event.target.value);
  paletteBtn.style.transform='rotate(360deg) scale(1.2)';
  setTimeout(()=>paletteBtn.style.transform='',400);
});

/* ===== CERTIFICATE MODAL ===== */
/* ===== CV DOWNLOAD ===== */
const cvBtn=document.getElementById('cv-btn');
cvBtn.addEventListener('click',()=>{
  window.open('cv.html','_blank','noopener');
});

const certOverlay=document.getElementById('cert-overlay');
const certClose=document.getElementById('cert-close');

function setCertificateVerification(container, issuer, platform, verifyUrl){
  const issuerStrong=document.createElement('strong');
  issuerStrong.className='cert-emphasis';
  issuerStrong.textContent=issuer;

  const platformStrong=document.createElement('strong');
  platformStrong.className='cert-emphasis';
  platformStrong.textContent=platform;

  const verifyLink=document.createElement('a');
  verifyLink.className='cert-emphasis cert-verify-link';
  verifyLink.href=verifyUrl || '#';
  verifyLink.target='_blank';
  verifyLink.rel='noopener';
  verifyLink.textContent=verifyUrl || 'verification link';

  container.replaceChildren(
    document.createTextNode('Issued by '),
    issuerStrong,
    document.createTextNode(' and delivered through '),
    platformStrong,
    document.createTextNode('. Verify this credential at '),
    verifyLink,
    document.createTextNode('.')
  );
}

document.querySelectorAll('[data-img][data-title]').forEach(btn=>{
  if(!btn.classList.contains('card'))
    btn.addEventListener('click',()=>{
      document.getElementById('cert-img').src=btn.dataset.img;
      document.getElementById('cert-title').textContent=btn.dataset.title||'Certificate';
      document.getElementById('cert-sub').textContent=btn.dataset.sub||'';
      document.getElementById('cert-download').href=btn.dataset.img;
      document.getElementById('cert-about').textContent=btn.dataset.about||'';
      document.getElementById('cert-demonstrates').textContent=btn.dataset.demonstrates||'';
      const skills=document.getElementById('cert-skills');
      skills.replaceChildren();
      (btn.dataset.skills||'').split('|').filter(Boolean).forEach(skill=>{
        const tag=document.createElement('span');
        tag.className='cert-skill-tag';
        tag.textContent=skill;
        skills.appendChild(tag);
      });
      const verification=document.getElementById('cert-verification');
      setCertificateVerification(verification,btn.dataset.issuer||'',btn.dataset.platform||'',btn.dataset.verify||'');
      certOverlay.classList.add('open');
      certOverlay.setAttribute('aria-hidden','false');
      document.body.style.overflow='hidden';
      activateDialog(certOverlay,'.cert-close');
    });
});

    function closeCertModal(){certOverlay.classList.remove('open');certOverlay.setAttribute('aria-hidden','true');document.body.style.overflow='';deactivateDialog(certOverlay);}
    certClose.addEventListener('click',closeCertModal);
    certOverlay.addEventListener('click',e=>{if(e.target===certOverlay)closeCertModal();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCertModal();});

/* ===== CERT INFO SCROLL ANIMATION ===== */
const certBox = document.querySelector('.cert-modal-box');
const certItems = document.querySelectorAll('.cert-info-item');

// IntersectionObserver for cert info items
const certInfoObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting) { e.target.classList.add('visible'); }
  });
}, { threshold: 0.2, root: certBox });

// Activate observer when modal opens
document.querySelectorAll('[data-img][data-title]').forEach(btn => {
  if(!btn.classList.contains('card'))
    btn.addEventListener('click', () => {
      setTimeout(() => {
        certItems.forEach(el => certInfoObs.observe(el));
      }, 400);
    });
});

/* ===== PARTICLES ===== */
(function(){
  const cv=document.getElementById('particles-canvas');
  if(!cv)return;
  const ctx=cv.getContext('2d');
  let W,H;
  const N=70,pts=[];
  const colors=['#6366f1','#a855f7','#ec4899','#9278f0'];
  function resize(){W=cv.width=innerWidth;H=cv.height=innerHeight;}
  resize();window.addEventListener('resize',resize);
  for(let i=0;i<N;i++)pts.push({
    x:Math.random()*innerWidth,y:Math.random()*innerHeight,
    vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,
    r:Math.random()*1.6+.4,a:Math.random()*.7+.1
  });
  function draw(){
    ctx.clearRect(0,0,W,H);
    pts.forEach((p,i)=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x=W;if(p.x>W)p.x=0;
      if(p.y<0)p.y=H;if(p.y>H)p.y=0;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=colors[i%colors.length];ctx.globalAlpha=p.a;ctx.fill();
      for(let j=i+1;j<pts.length;j++){
        const q=pts[j],dx=p.x-q.x,dy=p.y-q.y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<130){
          ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);
          ctx.strokeStyle=`rgba(146,120,240,${(1-d/130)*.15})`;
          ctx.globalAlpha=1;ctx.lineWidth=.5;ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ===== NEW UNIFORM GALLERY ===== */
(function(){
  const grid = document.getElementById('gallery-uniform-grid');
  const preview = document.getElementById('gallery-preview');
  const trail = document.getElementById('gallery-preview-trail');
  const hint = document.getElementById('gallery-hint-wrap');
  if(!grid) return;

  const uItems = Array.from(grid.querySelectorAll('.g-uni-item'));
  const uPhotos = uItems.map(el=>el.querySelector('img').src);
  let current = 0;
  let previewIndex = -1;
  let previewActive = false;
  let lastPreviewUpdate = 0;
  const previewUpdateDelay = 190;

  function setPreviewImage(index){
    if(!preview) return;
    const img = preview.querySelector('img');
    if(!img) return;
    img.src = uPhotos[index];
    img.alt = `Photo ${index + 1}`;
    previewIndex = index;
  }

  function showPreview(x, y){
    if(!preview) return;
    preview.style.left = `${x}px`;
    preview.style.top = `${y}px`;
    preview.classList.add('show');
    previewActive = true;
    if(hint) hint.style.opacity = '0';

    if(trail){
      const item = document.createElement('div');
      item.className = 'trail-item';
      const img = document.createElement('img');
      img.src = preview.querySelector('img').src;
      img.alt = '';
      item.appendChild(img);
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      item.style.animationDelay = `${Math.random() * 0.9}s`;
      trail.appendChild(item);
      setTimeout(()=> item.remove(), 1400);
    }
  }

  function hidePreview(){
    if(!preview) return;
    preview.classList.remove('show');
    previewActive = false;
    if(hint) hint.style.opacity = '1';
  }

  const section = document.querySelector('.gallery-section-hero');
  if(section){
    section.addEventListener('pointermove', e=>{
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const now = Date.now();

      if (previewActive && now - lastPreviewUpdate < previewUpdateDelay) {
        preview.style.left = `${x}px`;
        preview.style.top = `${y}px`;
        return;
      }

      lastPreviewUpdate = now;
      let index = Math.floor(Math.random() * uPhotos.length);
      if(index === previewIndex && uPhotos.length > 1){
        index = (index + 1) % uPhotos.length;
      }
      setPreviewImage(index);
      showPreview(x, y);
    });

    section.addEventListener('pointerleave', hidePreview);
  }

  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCnt = document.getElementById('lb-counter');
  const lbClose = document.getElementById('lb-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');
  if(!lb || !lbImg || !lbCnt) return;

  function setLb(i){ lbImg.src=uPhotos[i]; lbCnt.textContent=(i+1)+' / '+uPhotos.length; }
  function openLb(i){ current=i; setLb(i); lb.classList.add('open'); lb.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; activateDialog(lb,'.lb-close'); }
  function closeLb(){ lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); document.body.style.overflow=''; deactivateDialog(lb); }
  function prev(){ current=(current-1+uPhotos.length)%uPhotos.length; setLb(current); }
  function next(){ current=(current+1)%uPhotos.length; setLb(current); }

  preview.addEventListener('click', ()=>{
    if(previewIndex >= 0) openLb(previewIndex);
  });

  uItems.forEach((item,i)=> item.addEventListener('click',()=>openLb(i)));
  if(lbClose) lbClose.addEventListener('click', closeLb);
  if(lbPrev) lbPrev.addEventListener('click', prev);
  if(lbNext) lbNext.addEventListener('click', next);
  lb.addEventListener('click', e=>{ if(e.target===lb) closeLb(); });
  document.addEventListener('keydown', e=>{
    if(!lb.classList.contains('open')) return;
    if(e.key==='ArrowLeft') prev();
    if(e.key==='ArrowRight') next();
    if(e.key==='Escape') closeLb();
  });
})();

window.addEventListener('load', ()=>{
  setTimeout(()=>{
    if (!window.location.hash || window.location.hash === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, 120);
});

</script>
</body>
</html>



