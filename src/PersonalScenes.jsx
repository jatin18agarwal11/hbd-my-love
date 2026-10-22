import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, Crown, Heart, Pause, Play, Sparkles, Star } from 'lucide-react';
import { config, photos, featuredPhoto } from './config';
import { distanceStory } from './distanceStory';

const birthdayWishes = ['Happy Birthday, my Bubu.', 'I wish I could be there with you.', 'You deserve to feel celebrated.', 'A little piece of my heart, for you.', 'My one and only favorite person.', 'Same sky. And I’m still choosing you.'];

export function PhotoSlides({ indices = [featuredPhoto.id, 34, 40, 24, 46], label = 'A slideshow of my favorite person', compact = false, birthday = false }) {
  const reduced = useReducedMotion();
  const [slide, setSlide] = useState(0); const [playing, setPlaying] = useState(false); const touch = useRef(null);
  useEffect(() => {
    if (!playing || reduced) return;
    const timer = setInterval(() => { if (!document.hidden) setSlide(n => (n + 1) % indices.length); }, 6000);
    return () => clearInterval(timer);
  }, [playing, reduced, indices.length]);
  const next = delta => setSlide(n => (n + delta + indices.length) % indices.length);
  const photo = photos[indices[slide]];
  return <div className={`photo-slides ${compact ? 'compact' : ''} ${birthday ? 'birthday-carousel' : ''}`} role="region" aria-roledescription="carousel" aria-label={label} onKeyDown={e => { if (e.key === 'ArrowRight') { e.preventDefault(); next(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); next(-1); } }}>
    {birthday && <p className="birthday-carousel-heading">23 OCTOBER · YOUR LITTLE BIRTHDAY ALBUM</p>}<span className="photo-doodle doodle-top">{birthday ? 'every little wish is for you.' : 'I wish I were next to you.'}</span>
    <div className="slide-stack" onTouchStart={e => { touch.current = e.touches[0].clientX; }} onTouchEnd={e => { if (touch.current !== null) { const distance = touch.current - e.changedTouches[0].clientX; if (Math.abs(distance) > 45) next(distance > 0 ? 1 : -1); touch.current = null; } }}>
      <div className="photo-sparkles" aria-hidden="true"><span>✧</span><span>✦</span><span>✧</span></div><div className="stack-paper paper-one"/><div className="stack-paper paper-two"/>
      <AnimatePresence initial={false} mode="popLayout"><motion.figure key={slide} className="slide-photo" role="group" aria-roledescription="slide" aria-label={`${slide + 1} of ${indices.length}`} whileHover={reduced ? undefined : { rotate: 0, y: -4 }} initial={reduced ? false : { opacity: 0, x: 55, rotate: 7, scale: .94 }} animate={{ opacity: 1, x: 0, rotate: -3, scale: 1 }} exit={reduced ? {} : { opacity: 0, x: -55, rotate: -9, scale: .96 }} transition={{ type: 'spring', stiffness: 125, damping: 21 }}>
        <div className="slide-image"><span className="slide-unavailable">A portrait of my favorite person</span><img src={photo?.src} alt={`Bubu — ${photo?.caption}`} loading={compact ? 'lazy' : 'eager'} onError={e => { e.currentTarget.style.visibility = 'hidden'; }} /></div>
        <figcaption>{photo?.caption}<span>♡</span></figcaption><span className="photo-tape"/>
      </motion.figure></AnimatePresence>
      <motion.span className="sticker-heart" aria-hidden="true" animate={reduced ? {} : { rotate: [10, 18, 10], y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity }}>♡</motion.span>
      <span className="photo-stamp">MY FAVORITE<br/><b>ALWAYS YOU</b></span>
    </div>
    <div className="slide-controls"><button className="icon-button" onClick={() => next(-1)} aria-label="Previous slide"><ArrowLeft size={17}/></button><span aria-live={playing ? 'off' : 'polite'}>{String(slide + 1).padStart(2, '0')} <i>/ {String(indices.length).padStart(2, '0')}</i></span><button className="icon-button" onClick={() => next(1)} aria-label="Next slide"><ArrowRight size={17}/></button>{!reduced && <button className="icon-button play-slides" aria-label={playing ? 'Pause slideshow' : 'Play slideshow'} aria-pressed={playing} onClick={() => setPlaying(p => !p)}>{playing ? <Pause size={14}/> : <Play size={14}/>}</button>}</div>
    {birthday && <div className="birthday-slide-note" aria-live={playing ? 'off' : 'polite'}><AnimatePresence mode="wait" initial={false}><motion.p key={slide} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? {} : { opacity: 0, y: -5 }} transition={{ duration: .3 }}>{birthdayWishes[slide % birthdayWishes.length]}</motion.p></AnimatePresence><small>A WISH FROM ME TO YOU · {slide + 1} / {indices.length}</small></div>}
  </div>;
}

export function PersonalizedWelcome({ onStart }) {
  const reduced = useReducedMotion();
  return <div className="personal-welcome"><motion.div className="welcome-lettering" initial={reduced ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
    <p className="opening-aside">Well, well, well… look who’s here.</p>
    <h1>OH MY GOD,<br/><em>IT’S YOU!</em><motion.span aria-hidden="true" animate={reduced ? {} : { rotate: [0, 13, -8, 0] }} transition={{ duration: 5, repeat: Infinity }}>✧</motion.span></h1>
    <p className="favorite-list">My one and only favorite person. My favorite notification.<br className="desktop"/> My favorite thought. My favorite human.</p>
    <p className="nickname-intro">Welcome, Bubu… or should I say…</p>
    <div className="nickname-label">MY BELOVED<br/><strong>INDEPENDENT WOMAN</strong><Crown size={22}/></div>
    <p className="welcome-tease">Yes, you. The girl who can get angry at me in 0.2 seconds, somehow tolerate my nonsense, and still be the person I want to tell everything to.</p>
    <p className="welcome-tease small-tease">Come on, madam. I’ve made a tiny universe for you. And before you start judging my creativity, at least explore it first.</p>
    <button className="button welcome-start" onClick={onStart}>Fineee, Show Me What You’ve Made <Sparkles size={18}/></button>
    <p className="made-for-one">I made this because I miss you. And because you mean so much to me.</p>
  </motion.div><PhotoSlides/></div>;
}

const stats = [
  ['Special Ability', 'Getting angry in 0.2 seconds.'],
  ['Passive Skill', 'Caring for her favorite idiot even while handling her own battles.'],
  ['Ultimate Ability', 'Somehow making everything feel better just by being herself.'],
  ['Weakness', 'Absolutely not accepting that she’s adorable. (Allegedly.)'],
  ['Rarity', 'One of One. No duplicates available.'],
  ['Favorite Person', 'Me. Hopefully.']
];
export function CharacterProfile() {
  const reduced = useReducedMotion(); const [reply, setReply] = useState('I tease you a lot, Bubu. But I really do admire how you keep going, and how you still find room to care about me.');
  return <div className="character-scene"><div className="character-heading"><p className="eyebrow">THE WAY I SEE YOU, BUBU</p><h2>Character Profile<br/><em>Unlocked!</em></h2><p>You make me laugh. You care about me. And I notice.</p></div><div className="character-layout"><motion.div className="legendary-card" initial={reduced ? false : { rotateY: -24, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ duration: .8 }}><div className="rarity-strip"><Star size={13}/> LEGENDARY · ONE OF ONE <Star size={13}/></div><img src={featuredPhoto.src} alt="Bubu, our one-of-one Independent Queen" loading="lazy"/><div className="character-name"><Crown size={29}/><span>Bubu</span><small>THE INDEPENDENT QUEEN</small></div><span className="character-serial">NO. 001 / ONLY ONE EXISTS</span></motion.div><div className="character-details"><p className="character-class"><Crown size={17}/> CLASS: THE INDEPENDENT QUEEN</p><dl>{stats.map(([name, text], i) => <motion.div key={name} initial={reduced ? false : { opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: reduced ? 0 : i * .06 }}><dt>{name}</dt><dd>{text}</dd></motion.div>)}</dl><div className="queen-dialogue"><span>THERE’S SOMETHING ELSE I WANT YOU TO KNOW</span><p aria-live="polite">{reply}</p></div><div className="queen-actions"><button className="button secondary" onClick={() => setReply('Okay, okay. I won’t argue with you. I still think you’re cute, though.')} >I am NOT adorable.</button><button className="text-button" onClick={() => setReply('You don’t have to look after me all the time. I want to hear how you’re doing, too. Even when the answer isn’t “I’m fine.” ♡')}><Heart size={15}/> A note for the queen</button></div></div></div></div>;
}

export function BirthdayLetter({ onClose }) {
  const reduced = useReducedMotion(); const [sealed, setSealed] = useState(false); const [showAll, setShowAll] = useState(false); const container = useRef(null);
  useEffect(() => { if (sealed) { container.current?.closest('[role="dialog"]')?.scrollTo({ top: 0, behavior: 'instant' }); container.current?.querySelector('.sealed-heading')?.focus(); } }, [sealed]);
  return <div className="personal-letter" ref={container}>{!sealed ? <>
    <p className="eyebrow">23 OCTOBER 2026 · JUST BETWEEN US</p><h2>What I don’t<br/><em>say enough.</em></h2><p className="letter-salutation">Dear Bubu,</p>
    {!reduced && <button className="text-button reveal-letter" onClick={() => setShowAll(true)} disabled={showAll}>{showAll ? 'Every word, all yours.' : 'Show every word without animation'}</button>}
    <div className="letter-lines"><h3 className="letter-part-title">If I could be there with you…</h3>{distanceStory.letter.map((paragraph, i) => <motion.p key={`distance-${i}`} initial={reduced || showAll ? false : { opacity: 0, y: 9 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={{ duration: .65 }}>{paragraph}</motion.p>)}<h3 className="letter-part-title">And the things I don’t say enough…</h3>{config.letter.map((paragraph, i) => <p key={i} className={i === 8 || i === 14 ? 'letter-emphasis' : ''}>{paragraph.split(/(?<=[.!?])\s+(?=[A-Z])/).map((line, j) => <motion.span key={`${i}-${j}-${showAll}`} initial={reduced || showAll ? false : { opacity: 0, y: 9 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .65, delay: reduced || showAll ? 0 : j * .09 }}>{line}{' '}</motion.span>)}</p>)}</div>
    <p className="letter-signature">From your favorite irritant,<br/>{config.signature}</p><button className="button seal-button" onClick={() => setSealed(true)}>Fold this letter, keep the love <Heart size={17}/></button>
  </> : <div className="sealed-letter"><h2 tabIndex={-1} className="sealed-heading">Every word.<br/><em>Every bit of my heart.</em></h2><div className="closing-envelope" aria-hidden="true"><motion.div className="envelope-note" initial={{ y: -40 }} animate={{ y: 8 }} transition={{ duration: reduced ? 0 : .65 }}>Dear Bubu…<Heart size={20}/></motion.div><div className="envelope-front"/><motion.div className="envelope-flap" initial={{ rotateX: 180 }} animate={{ rotateX: 0 }} transition={{ delay: reduced ? 0 : .5, duration: reduced ? 0 : .8 }}/><motion.div className="envelope-seal" initial={{ opacity: 0, scale: .4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: reduced ? 0 : 1.2, duration: reduced ? 0 : .5 }}><Heart size={26} fill="currentColor"/></motion.div></div><p>For my Bubu. To open whenever you need a little love.</p><button className="button" onClick={onClose}>Keep this in my heart <Heart size={16}/></button><button className="text-button" onClick={() => { setSealed(false); setShowAll(true); }}>Read my letter again</button></div>}</div>;
}

export function FinalSignature() { return <div className="personal-signature"><p>Made with all my love, a questionable amount of coding, and an unreasonable amount of affection for one particular independent woman.</p><p>From your favorite irritant,</p><strong>Your forever hopeful Player 2 ❤️</strong><small>P.S. Bubu is still cute. Independent Woman is just your upgraded legendary title.</small></div>; }
