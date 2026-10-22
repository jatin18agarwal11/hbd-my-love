import { createContext, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Analytics } from '@vercel/analytics/react';
import { ArrowDown, ArrowRight, ArrowLeft, Heart, Sparkles, Moon, Star, Music2, VolumeX, X, ChevronLeft, ChevronRight, Gamepad2, Film, Utensils, MessageCircle, Gift, Check, Copy, Printer, Menu, RotateCcw, Mail } from 'lucide-react';
import { config, photos, featuredPhoto } from './config';
import MemoryStory from './MemoryStory';
import { chapters, go, nextChapter, previousChapter, readPage, subscribePage } from './navigation';
import { BirthdayLetter, CharacterProfile, FinalSignature, PersonalizedWelcome, PhotoSlides } from './PersonalScenes';
import { BirthdayAcrossMap, CoopScene, DistanceFinal, DistanceOpening } from './DistanceScenes';
import { AnimeAtmosphere, AnimeThemePicker, storyTheme } from './AnimeAtmosphere';

const PageContext = createContext('distance');
const activities = [{ name: 'Anime Night', text: 'Pick an anime, sync our episodes, and react together.', icon: Film }, { name: 'Co-op Gaming', text: 'Play something together, even if I lose spectacularly.', icon: Gamepad2 }, { name: 'Virtual Dinner', text: 'Bring our favorite snacks and forget the distance for a while.', icon: Utensils }, { name: 'Midnight Conversations', text: 'Life, dreams, random nonsense, and everything in between.', icon: Moon }, { name: 'Just Us', text: 'No plans, no pressure. Just a video call and your company.', icon: MessageCircle }];

function Button({ children, secondary, className = '', ...props }) { return <button type="button" className={`button ${secondary ? 'secondary' : ''} ${className}`} {...props}>{children}</button>; }
function Eyebrow({ children }) { return <p className="eyebrow"><span />{children}</p>; }
function Section({ id, children, className = '' }) {
  const reduced = useReducedMotion(); const page = useContext(PageContext);
  if (page !== id) return null;
  return <motion.section id={id} className={`chapter page-scene ${className}`} initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .32, ease: [.22, 1, .36, 1] }}>{children}</motion.section>;
}
function Photo({ index, ...props }) { const [failed, setFailed] = useState(false); useEffect(() => setFailed(false), [index]); const photo = photos[index]; return photo && !failed ? <img src={photo.src} alt={`Portrait ${index + 1} — ${photo.caption}`} onError={() => setFailed(true)} {...props} /> : <span className="photo-fallback"><Heart /> This little star is unavailable</span>; }

function NightScene({ small = false }) {
  return <div className={`night-scene ${small ? 'small' : ''}`} aria-hidden="true"><div className="sky-glow"/><div className="stars">{Array.from({ length: 40 }, (_, i) => <i key={i} style={{ left: `${(i * 37.1) % 100}%`, top: `${(i * 17.3) % 75}%`, animationDelay: `${i % 7}s`, width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2 }} />)}</div><div className="moon"><span /></div><div className="shooting-star"/><svg className="mountains" viewBox="0 0 1440 640" preserveAspectRatio="xMidYMax slice"><defs><linearGradient id={small ? 'backSmall' : 'back'} x2="0" y2="1"><stop stopColor="#62577d"/><stop offset="1" stopColor="#272c4b"/></linearGradient><linearGradient id={small ? 'lakeSmall' : 'lake'} x2="0" y2="1"><stop stopColor="#41405d"/><stop offset="1" stopColor="#141a2a"/></linearGradient></defs><path d="M0 400 110 266 205 320 375 172 500 296 620 224 750 357 900 228 1030 320 1165 180 1325 315 1440 236V640H0Z" fill={`url(#${small ? 'backSmall' : 'back'})`}/><path d="m375 172-63 133 62-31 43 21-10-39 93 40Z M1165 180l-81 137 77-40 65 27Z" fill="#9d88a5" opacity=".25"/><path d="M0 382 132 350 240 425 355 375 520 445 685 393 852 422 1002 356 1190 419 1328 340 1440 366V640H0Z" fill="#262c43"/><path d="M0 472Q360 420 720 470T1440 451V640H0Z" fill={`url(#${small ? 'lakeSmall' : 'lake'})`}/><g stroke="#c8a3b4" opacity=".16" strokeWidth="2"><path d="M820 488h180m-220 18h260m-300 22h330m-360 24h400m-440 28h460"/></g><path d="M0 462q140-62 250 20t230 158H0Z M1440 440q-145 15-260 200h260Z" fill="#111b2b"/><g fill="#131d2d">{[0, 45, 95, 150, 220, 1250, 1320, 1380, 1420].map((x, i) => <g key={x} transform={`translate(${x} ${310 + i % 3 * 40}) scale(${.9 + i % 3 * .25})`}><path d="M0 0-30 76h17l-31 50h25l-32 49H50l-31-49h25L13 76h17Z"/><path d="M-4 160h8v90h-8Z"/></g>)}</g><path d="M490 640h590l-100-25H600Z" fill="#1b2232"/><g fill="#a9b7cb" opacity=".32"><path d="M-10 40Q170 60 250 180 120 150-10 80Z"/><path d="M1440 0q-100 10-210 112 130-42 210-54Z"/></g></svg><div className="fireflies">{Array.from({ length: 9 }, (_, i) => <b key={i} style={{ left: `${10 + i * 10}%`, bottom: `${10 + i % 4 * 6}%`, animationDelay: `${i * .6}s` }}/>)}</div></div>;
}

function MusicControls({ notify }) {
  const [playing, setPlaying] = useState(false); const audio = useRef(null); const timer = useRef(null);
  useEffect(() => () => { clearInterval(timer.current); audio.current?.close(); }, []);
  async function toggle() {
    if (playing) { clearInterval(timer.current); await audio.current?.close(); audio.current = null; setPlaying(false); return; }
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)(); audio.current = ctx; await ctx.resume(); let step = 0;
      const notes = [261.63, 329.63, 392, 493.88, 440, 392, 329.63, 293.66];
      const play = () => { const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.type = 'sine'; osc.frequency.value = notes[step++ % notes.length]; gain.gain.setValueAtTime(0, ctx.currentTime); gain.gain.linearRampToValueAtTime(.045, ctx.currentTime + .15); gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + 2.7); osc.connect(gain).connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 2.8); };
      play(); timer.current = setInterval(play, 850); setPlaying(true);
    } catch { notify('Music is unavailable in this browser. The adventure is still yours.'); }
  }
  return <button className={`music-control ${playing ? 'playing' : ''}`} onClick={toggle} aria-label={playing ? 'Mute background music' : 'Play gentle background music'} aria-pressed={playing}>{playing ? <Music2 size={16}/> : <VolumeX size={16}/>}<span>{playing ? 'Music on' : 'Sound off'}</span><span className="music-bars">ııı</span></button>;
}

function Modal({ children, onClose, label, className = '' }) {
  const ref = useRef(null);
  useEffect(() => { const previous = document.activeElement; const overflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; ref.current?.focus(); const key = e => { if (e.key === 'Escape') onClose(); if (e.key === 'Tab') { const list = ref.current.querySelectorAll('button, a[href], input, textarea, select, [tabindex="0"]'); const first = list[0], last = list[list.length - 1]; if (!list.length) { e.preventDefault(); return; } if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && (document.activeElement === last || document.activeElement === ref.current)) { e.preventDefault(); first.focus(); } } }; document.addEventListener('keydown', key); return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', key); previous?.focus(); }; }, [onClose]);
  return <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}><div className={`modal ${className}`} role="dialog" aria-modal="true" aria-label={label} ref={ref} tabIndex={-1}><button className="icon-button close" onClick={onClose} aria-label="Close dialog"><X/></button>{children}</div></div>;
}

function LegacyMemoryGallery() {
  const [layout, setLayout] = useState('slides'); const [visible, setVisible] = useState(10); const [active, setActive] = useState(null); const close = useRef(() => setActive(null)).current;
  const page = useContext(PageContext);
  useEffect(() => { if (page !== 'universe') setActive(null); }, [page]);
  useEffect(() => { if (active === null) return; const key = e => { if (e.key === 'ArrowRight') setActive(n => (n + 1) % photos.length); if (e.key === 'ArrowLeft') setActive(n => (n - 1 + photos.length) % photos.length); }; document.addEventListener('keydown', key); return () => document.removeEventListener('keydown', key); }, [active]);
  return <Section id="universe"><div className="section-heading"><div><Eyebrow>I KEEP COMING BACK TO THESE</Eyebrow><h2>I wish I were<br/><em>there with you.</em></h2></div><p>Until I can see you in person,<br className="desktop"/> I have these. And they make me smile.</p></div><div className="gallery-meta"><span><Star size={14}/> OUR LITTLE UNIVERSE</span><span>{photos.length} portraits · infinitely special</span></div><div className="gallery-mode" role="group" aria-label="Gallery view"><button aria-pressed={layout === 'slides'} onClick={() => setLayout('slides')}>The photo story</button><button aria-pressed={layout === 'grid'} onClick={() => setLayout('grid')}>All 50 portraits</button></div>{layout === 'slides' ? <div className="gallery-slideshow"><PhotoSlides indices={photos.map(p => p.id)} label="All 50 portraits of Bubu"/><p>I could look at these all day, Bubu.<br/>Swipe, use the arrows, or press play.</p><Button secondary onClick={() => setActive(0)}>Open full-screen gallery <Sparkles size={16}/></Button></div> : <><div className="photo-grid">{photos.slice(0, visible).map((p, i) => <button className="photo-card" key={p.filename} onClick={() => setActive(i)} aria-label={`Open portrait ${i + 1}: ${p.caption}`}><div className="photo-wrap"><Photo index={i} loading="lazy"/><span className="photo-open"><Heart size={18}/></span></div><span className="photo-caption">{p.caption}<small>{String(i + 1).padStart(2, '0')}</small></span></button>)}</div><div className="gallery-bottom"><span>{Math.min(visible, photos.length)} / {photos.length} little stars</span>{visible < photos.length ? <Button secondary onClick={() => setVisible(n => Math.min(n + 10, photos.length))}>Discover more <ArrowDown size={16}/></Button> : <span className="pink">Every star, unlocked. ♡</span>}</div></>}{active !== null && <Modal onClose={close} label="Portrait lightbox" className="lightbox"><Photo index={active}/><div className="lightbox-nav"><button className="icon-button" aria-label="Previous portrait" onClick={() => setActive(n => (n - 1 + photos.length) % photos.length)}><ChevronLeft/></button><p>{photos[active]?.caption}<small>{active + 1} / {photos.length}</small></p><button className="icon-button" aria-label="Next portrait" onClick={() => setActive(n => (n + 1) % photos.length)}><ChevronRight/></button></div></Modal>}</Section>;
}

function MemoryGallery() {
  const [layout, setLayout] = useState('moments');
  const [active, setActive] = useState(null);
  const close = useRef(() => setActive(null)).current;
  const page = useContext(PageContext);
  const orderedPhotos = useMemo(() => [...photos].sort((a, b) => a.filename.localeCompare(b.filename, 'en', { numeric: true })), []);
  const moments = useMemo(() => {
    const groups = [];
    for (const photo of orderedPhotos) {
      const match = photo.filename.match(/ at (\d{2})\.(\d{2})\.(\d{2})/i);
      const seconds = match ? Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]) : null;
      let group = groups.at(-1);
      if (!group || seconds === null || group.seconds === null || seconds - group.seconds > 30) {
        group = { seconds, photos: [] };
        groups.push(group);
      }
      group.photos.push(photo);
      group.seconds = seconds;
    }
    return groups;
  }, [orderedPhotos]);
  const activeIndex = active === null ? -1 : orderedPhotos.findIndex(photo => photo.id === active);
  const movePhoto = delta => setActive(current => {
    const index = orderedPhotos.findIndex(photo => photo.id === current);
    return orderedPhotos[(index + delta + orderedPhotos.length) % orderedPhotos.length]?.id ?? current;
  });
  useEffect(() => { if (page !== 'universe') setActive(null); }, [page]);
  useEffect(() => {
    if (active === null) return;
    const key = event => { if (event.key === 'ArrowRight') movePhoto(1); if (event.key === 'ArrowLeft') movePhoto(-1); };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [active, orderedPhotos]);
  return <Section id="universe" className="active-universe">
    <div className="section-heading"><div><Eyebrow>I KEEP COMING BACK TO THESE</Eyebrow><h2>I wish I were<br/><em>there with you.</em></h2></div><p>Until I can see you in person,<br className="desktop"/> I have these. And they make me smile.</p></div>
    <div className="gallery-meta"><span><Star size={14}/> OUR LITTLE UNIVERSE</span><span>{photos.length} portraits · infinitely special</span></div>
    <MemoryStory photos={orderedPhotos} moments={moments} mode={layout} onModeChange={setLayout} onOpen={setActive}/>
    {active !== null && <Modal onClose={close} label="Portrait lightbox" className="lightbox"><Photo index={active}/><div className="lightbox-nav"><button className="icon-button" aria-label="Previous portrait" onClick={() => movePhoto(-1)}><ChevronLeft/></button><p>{photos[active]?.caption}<small>{activeIndex + 1} / {orderedPhotos.length}</small></p><button className="icon-button" aria-label="Next portrait" onClick={() => movePhoto(1)}><ChevronRight/></button></div></Modal>}
  </Section>;
}

function LoveQuest({ reveal }) {
  const page = useContext(PageContext); const [step, setStep] = useState(0); const [typed, setTyped] = useState(0); const reduced = useReducedMotion(); const line = config.dialogue[step];
  useEffect(() => { if (page !== 'quest') return; setTyped(reduced ? line.length : 0); if (reduced) return; const interval = setInterval(() => setTyped(n => { if (n >= line.length) clearInterval(interval); return Math.min(n + 2, line.length); }), 25); return () => clearInterval(interval); }, [line, reduced, page]);
  return <Section id="quest" className="quest-section"><PhotoSlides compact indices={[featuredPhoto.id, 18, 24, 40, 46]} label="Portraits for our love story"/><div className="quest-copy"><Eyebrow>A LITTLE COURAGE · FROM YOUR FAVORITE IRRITANT</Eyebrow><h2>Bubu, there’s something<br/><em>I want to say.</em></h2><div className="dialogue"><span className="dialogue-name"><Heart size={13}/> A MESSAGE FROM YOUR PLAYER TWO</span><p aria-label={line}><span aria-hidden="true">{line.slice(0, typed)}<span className="typing-cursor">▏</span></span></p><div className="dialogue-footer"><span>{step + 1} / {config.dialogue.length}</span><div>{step > 0 && <button className="icon-button" aria-label="Previous dialogue" onClick={() => setStep(n => n - 1)}><ArrowLeft size={16}/></button>}{step < config.dialogue.length - 1 ? <button className="text-button" onClick={() => setStep(n => n + 1)}>Keep going <ArrowRight size={16}/></button> : <button className="text-button" onClick={reveal}>Reveal the Question <Sparkles size={16}/></button>}</div></div></div><p className="footnote">I’m not great at saying all of this. But I mean it.</p></div></Section>;
}

function ProposalSection({ revealed, setRevealed, celebrate }) {
  const [answer, setAnswer] = useState(null); const reduced = useReducedMotion();
  return <Section id="proposal" className="proposal-section personal-proposal">
    <div className="proposal-moon" aria-hidden="true">☾</div><Eyebrow>ONE PERSON. ONE CHOICE. ALWAYS.</Eyebrow>
    {!revealed ? <><h2>Okay, Bubu.<br/><em>This part is serious.</em></h2><p>Mostly. I’m still me. But I mean every word of what comes next.</p><PhotoSlides compact indices={[featuredPhoto.id, 46, 40]}/><Button onClick={() => setRevealed(true)}>Reveal the Question <Sparkles size={17}/></Button></> :
    <motion.div initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }}>
      <h2>To my beloved<br/><em>independent woman…</em></h2>
      <div className="proposal-letter">{config.proposal.map((line, i) => <motion.p key={line} initial={reduced ? false : { opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .55 }}>{line}</motion.p>)}</div>
      <p className="proposal-address">So, my Bubu, my favorite human, my one-and-only beloved independent woman…</p>
      <h3 className="the-question">Will you let me keep <em>choosing you,</em> making memories with you, and being your <em>Player 2</em> in this little adventure called life?</h3>
      {!answer ? <div className="proposal-actions"><Button onClick={() => { setAnswer('yes'); celebrate('You said yes. I’m smiling so much right now. ♡'); }}>YES! <Heart size={18}/></Button><Button secondary onClick={() => setAnswer('time')}>I need a little time</Button><button className="text-button" onClick={() => setAnswer('no')}>I’d rather not</button></div> :
      <div className="answer" role="status"><Heart/><h3>{answer === 'yes' ? 'My favorite adventure just began.' : answer === 'time' ? 'Your heart, your own pace.' : 'Thank you for being honest with me.'}</h3><p>{answer === 'yes' ? 'Thank you for choosing this little adventure with me, Bubu. More laughter, more listening, and a very hopeful Player 2. ♡' : answer === 'time' ? 'There’s no rush and no pressure. Take all the time you need. You are appreciated, whatever you decide.' : 'Your answer matters, and I respect it. No explanation needed. This birthday universe is still yours to enjoy.'}</p><button className="text-button" onClick={() => setAnswer(null)}>Change my answer</button></div>}
      <p className="footnote">No timer. No pressure. Your answer is yours.</p>
    </motion.div>}
    <button className="text-button next-quest" onClick={() => go('coop')}>I still want to make time for you <ArrowRight size={16}/></button>
  </Section>;
}

function DateQuest() {
  const [chosen, setChosen] = useState([]);
  const toggle = name => setChosen(old => old.includes(name) ? old.filter(activity => activity !== name) : [...old, name]);
  return <Section id="date"><div className="center-heading"><Eyebrow>THE NEXT ADVENTURE · ON YOUR TERMS</Eyebrow><span className="quest-badge"><Sparkles size={13}/> SOMETHING I’D LOVE TO DO WITH YOU</span><h2>Next Stop: You and Me,<br/><em>Online.</em></h2><p>Until geography gives us a break, let’s steal a little time for ourselves.<br className="desktop"/> I’d love an evening with you. Pick what you’d enjoy, Bubu.</p></div><div className="activity-grid">{activities.map(({ name, text, icon: Icon }) => <button type="button" key={name} className={'activity ' + (chosen.includes(name) ? 'active' : '')} aria-pressed={chosen.includes(name)} onClick={() => toggle(name)}><span className="activity-check">{chosen.includes(name) ? <Check size={12}/> : '+'}</span><Icon size={27} strokeWidth={1.3}/><h3>{name}</h3><p>{text}</p></button>)}</div><p className="footnote centered" aria-live="polite">{chosen.length ? 'Your little date list: ' + chosen.join(' · ') + '.' : 'Tap anything that sounds fun—or leave it all open and decide together later.'}</p><p className="date-note centered">No need to plan every detail now. I just want a little time with you.</p></Section>;
}

export default function App() {
  const active = useSyncExternalStore(subscribePage, readPage, readPage); const [menu, setMenu] = useState(false);
  const [themeOverride, setThemeOverride] = useState(null);
  const theme = themeOverride || storyTheme(active);
  const [toast, setToast] = useState(''); const [confetti, setConfetti] = useState(0);
  const [revealed, setRevealed] = useState(false); const [letter, setLetter] = useState(false); const [candles, setCandles] = useState(true);
  const toastTimer = useRef(); const celebrationTimer = useRef(); const reduced = useReducedMotion(); const main = useRef(null);
  const closeLetter = useRef(() => setLetter(false)).current;
  const pageIndex = chapters.findIndex(([id]) => id === active);
  function notify(text) { setToast(text); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(''), 5500); }
  function celebrate(text) { notify(text); setConfetti(n => n + 1); clearTimeout(celebrationTimer.current); celebrationTimer.current = setTimeout(() => setConfetti(0), 4500); }
  useEffect(() => () => { clearTimeout(toastTimer.current); clearTimeout(celebrationTimer.current); }, []);
  useEffect(() => {
    setMenu(false); setLetter(false);
    document.title = `${chapters.find(([id]) => id === active)?.[1]} · Bubu’s Little Universe`;
    window.scrollTo({ top: 0, behavior: 'instant' });
    main.current?.focus({ preventScroll: true });
  }, [active]);
  return <PageContext.Provider value={active}><div className={`universe-shell theme-${theme}`}>
    <AnimeAtmosphere theme={theme} page={active}/>
    <a className="skip-link" href="#main-content" onClick={e => { e.preventDefault(); main.current?.focus(); }}>Skip to this chapter</a>
    <header className="site-header">
      <a href="#/distance" className="brand"><span className="brand-symbol"><Moon size={20}/><Star size={8}/></span>For you, Bubu<span className="brand-dot">.</span></a>
      <nav aria-label="Chapter navigation" className={menu ? 'open' : ''}>{chapters.map(([id, label]) => <a key={id} href={`#/${id}`} onClick={() => setMenu(false)} className={active === id ? 'active' : ''} aria-current={active === id ? 'page' : undefined}>{label}</a>)}<AnimeThemePicker theme={theme} automatic={!themeOverride} onChange={setThemeOverride}/></nav>
      <span className="header-date">23 OCT 2026 <Heart size={12}/></span>
      <button className="menu-button icon-button" aria-label="Toggle chapters" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button>
    </header>
    <div className="page-meter" aria-hidden="true"><motion.span animate={{ width: `${(pageIndex + 1) / chapters.length * 100}%` }} transition={{ duration: reduced ? 0 : .6 }}/></div>
    <main id="main-content" ref={main} tabIndex={-1} className={`chapter-main active-${active}`} aria-label={chapters[pageIndex][1]}>
      {active === 'welcome' && <motion.section id="welcome" className="welcome personal-home" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }}><NightScene/><PersonalizedWelcome onStart={() => { celebrate('Your universe is ready, madam. ♡'); go('distance'); }}/></motion.section>}
      <div className="page-container">
        <Section id="distance" className="distance-page"><DistanceOpening onEnter={() => go('birthday')}/></Section>
        <Section id="birthday" className="birthday-section">
          <div className="birthday-copy"><Eyebrow>23 OCTOBER 2026 · FROM ME, TO YOU</Eyebrow><div className="birthday-date"><span>23</span><div>OCTOBER<br/><small>FRIDAY · 2026</small></div><Star size={23} strokeWidth={1}/></div><h2>Happy Birthday,<br/><em>my Bubu.</em></h2><p>Happy Birthday, Bubu. My Beloved Independent Woman. I wish I could say that to you in person today, see your face, and annoy you just a little.</p><p className="birthday-soft">I’m in Modinagar, you’re in Kohima, and I still want you to feel how much you matter to me. I made this because being far away doesn’t make me want to celebrate you any less.</p><div className="birthday-buttons"><Button secondary onClick={() => setLetter(true)}><Mail size={16}/> What I don’t say enough <ArrowRight size={16}/></Button></div><button className="candle-button" onClick={() => { setCandles(!candles); if (candles) celebrate('A wish for you, Bubu. You deserve good things. ♡'); }}><span className={`candles ${candles ? 'lit' : ''}`} aria-hidden="true">{[1, 2, 3].map(n => <i key={n}><b/></i>)}</span><span>{candles ? 'Make a wish. Blow out the candles.' : 'Wish made. Light the candles again?'}<small>Go on, madam. This moment is yours.</small></span></button></div>
          <PhotoSlides birthday indices={[featuredPhoto.id, 40, 34, 24, 46, 48]} label="Your birthday photo carousel"/><BirthdayAcrossMap/>
        </Section>
        <Section id="character" className="character-page"><CharacterProfile/></Section>
        <MemoryGallery/>
        <LoveQuest reveal={() => { setRevealed(true); go('proposal'); }}/>
        <ProposalSection revealed={revealed} setRevealed={setRevealed} celebrate={celebrate}/>
        <Section id="coop" className="coop-page"><CoopScene onDate={() => go('date')}/></Section>
        <DateQuest/>
      </div>
      <Section id="final" className="final-section"><NightScene small/><div className="final-content"><Eyebrow>THE END? NOT EVEN CLOSE.</Eyebrow><Heart size={28} strokeWidth={1}/><DistanceFinal/><FinalSignature/><Button secondary onClick={() => { go('welcome'); notify('Back to the beginning, Bubu. Your date choices are still here.'); }}><RotateCcw size={15}/> Replay Our Adventure</Button></div></Section>
    </main>
    <nav className="page-navigation" aria-label="Previous and next chapters">
      <button className="page-back" aria-label="Previous chapter" onClick={() => go(previousChapter(readPage()))} disabled={pageIndex === 0}><ArrowLeft size={17}/><span>Previous</span></button>
      <div className="page-counter"><span>{String(pageIndex + 1).padStart(2, '0')} <i>/ {chapters.length}</i></span><small>{chapters[pageIndex][1]}</small></div>
      {nextChapter(active) ? <button className="page-next" onClick={() => go(nextChapter(readPage()))} aria-label={`Next: page ${pageIndex + 2}, ${chapters[pageIndex + 1][1]}`}><span><small>Next · {String(pageIndex + 2).padStart(2, '0')}</small>{chapters[pageIndex + 1][1]}</span><ArrowRight size={17}/></button> : <button className="page-next" onClick={() => go('welcome')}><span>Replay from page 1</span><RotateCcw size={16}/></button>}
    </nav>
    <MusicControls notify={notify}/>
    <AnimatePresence>{toast && <motion.div className="toast" role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><Heart size={18}/>{toast}<button aria-label="Dismiss notification" onClick={() => setToast('')}><X size={15}/></button></motion.div>}</AnimatePresence>
    {confetti > 0 && !reduced && <div className="confetti" key={confetti} aria-hidden="true">{Array.from({ length: 40 }, (_, i) => <i key={i} style={{ left: `${i * 2.5}%`, background: ['#edb4c8', '#cfb9ea', '#f2d29a'][i % 3], animationDelay: `${i % 8 * .12}s`, '--drift': `${i % 2 ? 90 : -90}px` }}/>)}</div>}
    {letter && <Modal onClose={closeLetter} label="What I don’t say enough — a birthday letter for Bubu" className="letter-modal"><BirthdayLetter onClose={closeLetter}/></Modal>}
  </div><Analytics route={active} path={`/#/${active}`} /></PageContext.Provider>;
}
