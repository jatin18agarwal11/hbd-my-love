import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, Clover, Compass, Flame, Moon, Sparkles } from 'lucide-react';
import proposalNight from './proposal-night.webp';

export const animeThemes = [
  { id: 'clover', name: 'Black Clover', mood: 'Grimoire magic', icon: Clover },
  { id: 'bleach', name: 'Bleach', mood: 'Soul moonlight', icon: Moon },
  { id: 'hunter', name: 'Hunter × Hunter', mood: 'A little adventure', icon: Compass },
  { id: 'fairy', name: 'Fairy Tail', mood: 'Guild of two', icon: Flame }
];
export function storyTheme(page) { return ({ distance: 'hunter', welcome: 'fairy', birthday: 'fairy', character: 'clover', universe: 'hunter', quest: 'bleach', proposal: 'bleach', coop: 'clover', date: 'fairy', calendar: 'hunter', invitation: 'fairy', final: 'bleach' })[page] || 'fairy'; }

export function AnimeThemePicker({ theme, automatic, onChange }) {
  return <div className="anime-picker"><p><Sparkles size={14}/> The worlds you wanted me to watch</p><span>You kept telling me about these. I wanted a little of them in something I made for you.</span><div className="anime-theme-buttons">{animeThemes.map(({ id, name, mood, icon: Icon }) => <button type="button" key={id} aria-pressed={theme === id} onClick={() => onChange(id)}><Icon size={18}/><span>{name}<small>{mood}</small></span>{theme === id && <Check size={13}/>}</button>)}</div><button className="follow-story" type="button" aria-pressed={automatic} onClick={() => onChange(null)}>{automatic ? '✓ Worlds change with our story' : 'Let the worlds change with our story'}</button></div>;
}

function CloverWorld() {
  return <g className="clover-world"><g className="magic-circle" transform="translate(1110 450)"><circle r="225"/><circle r="206" strokeDasharray="3 13"/><circle r="185"/><path d="M0-185 160 92H-160ZM0 185-160-92H160Z"/><g fill="currentColor" stroke="none">{[0,90,180,270].map(deg=><path key={deg} transform={`rotate(${deg})`} d="M0 0C-100-45-70-115-25-100C10-90 10-55 0 0Z"/>)}</g></g><g className="grimoire" transform="translate(165 620) rotate(-16)"><path d="M0 0Q65-22 130 0V165Q65 143 0 165Z M130 0Q195-22 260 0V165Q195 143 130 165Z" fill="#152b2d" strokeWidth="2"/><path d="M130 0V165M23 30q42-10 83 0M23 52q42-10 83 0M23 74q42-10 83 0M153 31q42-10 83 0M153 53q42-10 83 0M153 75q42-10 83 0" opacity=".55"/></g><path className="magic-ribbon" d="M-30 400Q200 220 320 500T850 650 1470 200" fill="none" strokeWidth="1.2" strokeDasharray="2 9"/></g>;
}
function SoulWorld() {
  return <g className="soul-world"><circle cx="1110" cy="180" r="95" fill="currentColor" opacity=".18" stroke="none"/><circle cx="1110" cy="180" r="113" opacity=".12"/><path d="M60 590Q300 405 440 85M105 640Q330 465 455 90" fill="none" strokeWidth="2" opacity=".3"/><g transform="translate(850 540)" fill="#141222" stroke="none"><path d="M-60-80Q180-20 430-80L410-49Q180 2-40-49Z"/><path d="M0-42H370V-24H0Z M35-40H60V260H35Z M300-40H325V260H300Z M-5 15H375V31H-5Z"/></g><g className="spirit-ribbons" fill="none" opacity=".24"><path d="M-50 250C220 100 360 490 620 310S1070 140 1480 390"/><path d="M-50 268C220 118 360 508 620 328S1070 158 1480 408"/></g></g>;
}
function HunterWorld() {
  return <g className="hunter-world"><g transform="translate(1130 240)"><circle r="135" strokeDasharray="2 10"/><circle r="115" opacity=".4"/><path d="M0-100 22-22 100 0 22 22 0 100-22 22-100 0-22-22Z" opacity=".4"/><path d="M0-150V-120M150 0H120M0 150V120M-150 0H-120"/></g><path d="M100 170 230 260 350 155 460 270 580 205" fill="none" strokeDasharray="3 7"/>{[[100,170],[230,260],[350,155],[460,270],[580,205]].map(([x,y])=><circle key={x} cx={x} cy={y} r="4" fill="currentColor"/>)}<g fill="#101e22" stroke="none">{[0,70,155,245,1110,1205,1300,1380].map((x,i)=><path key={x} transform={`translate(${x} ${550+i%3*40})`} d="M0-160-75 5h40l-65 90h70l-55 90H85L30 95h70L35 5h40ZM-7 175H7V300H-7Z"/>)}</g></g>;
}
function FairyWorld() {
  return <g className="fairy-world"><g className="fairy-emblem" transform="translate(1150 310)"><path d="M0 65C-120 20-185-120-120-160C-90-60-35-50 0-15C35-50 90-60 120-160C185-120 120 20 0 65Z" fill="currentColor" opacity=".13"/><path d="M0 65V-90M0 15Q-90-30-120-140M0 15Q90-30 120-140" fill="none" opacity=".55"/><circle r="190" strokeDasharray="2 16" opacity=".35"/></g><g fill="#27182b" stroke="none"><path d="M-30 820V670H25V605L75 560 125 605V670H170V630L215 590 260 630V820Z"/><path d="M1020 820V690H1080V620L1120 580 1160 620V690H1200V550L1260 490 1320 550V690H1450V820Z"/></g><g className="fairy-lights" fill="currentColor" stroke="none">{[0,1,2,3,4,5].map(i=><path key={i} transform={`translate(${95+i*245} ${180+i%3*120})`} d="M0-8 4-2 8 0 4 2 0 8-4 2-8 0-4-2Z"/>)}</g></g>;
}

export function AnimeAtmosphere({ theme, page }) {
  const reduced = useReducedMotion();
  return <div className={`anime-atmosphere atmosphere-${theme} ${page === 'proposal' ? 'proposal-atmosphere' : ''}`} aria-hidden="true"><AnimatePresence initial={false}>{page === 'proposal' ? <motion.div key="proposal-image" className="proposal-anime-image" style={{ backgroundImage: `url(${proposalNight})` }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .8 }}/> : <motion.div key={theme} className="anime-world" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .9 }}><svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="currentColor" strokeWidth="1">{theme === 'clover' ? <CloverWorld/> : theme === 'bleach' ? <SoulWorld/> : theme === 'hunter' ? <HunterWorld/> : <FairyWorld/>}</g></svg></motion.div>}</AnimatePresence><div className="anime-dust">{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ left: `${(i * 31.7) % 100}%`, top: `${(i * 19.4) % 100}%`, '--duration': `${7 + i % 5}s`, animationDelay: `${-i * .7}s` }}/>)}</div><div className="anime-reading-veil"/></div>;
}
