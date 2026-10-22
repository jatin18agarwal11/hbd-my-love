import { useId, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Heart, Moon, Sparkles, Star } from 'lucide-react';
import { featuredPhoto } from './config';
import { distanceStory } from './distanceStory';
import playerTwoPhoto from './player-two.webp';

// Hand-drawn mainland silhouette. This illustration is not a boundary or navigation map.
const mainland = 'M211 23 L232 38 255 31 270 51 261 71 276 89 261 102 268 119 287 132 299 158 322 168 342 176 365 176 384 183 399 180 404 165 426 159 443 146 464 143 479 130 493 137 508 153 494 166 483 172 486 192 475 211 473 230 461 234 449 214 439 204 435 184 417 188 410 201 393 197 380 201 366 214 354 230 349 250 334 260 321 273 308 298 294 312 285 330 279 359 271 381 262 396 253 425 250 450 241 478 232 493 224 486 216 462 206 442 199 417 193 393 181 369 172 345 165 324 156 304 150 283 143 270 136 262 120 266 102 255 89 236 102 234 117 240 128 232 118 220 100 220 85 212 78 200 91 196 103 201 119 195 131 181 137 161 150 146 159 124 178 116 185 103 180 88 187 75 177 60 184 46 201 43 Z';
const route = 'M223 157 C280 85 386 105 465 210';

export function IndiaConnection({ compact = false }) {
  const uid = useId().replaceAll(':', ''); const reduced = useReducedMotion();
  return <figure className={`india-connection ${compact ? 'compact-map' : ''}`}>
    <svg viewBox="0 0 590 550" role="img" aria-labelledby={`${uid}-title ${uid}-desc`}>
      <title id={`${uid}-title`}>From me in Modinagar to you in Kohima</title><desc id={`${uid}-desc`}>A stylized illustration of India with approximate city positions, connected by a trail of hearts. Approximately 2,200 kilometres apart; this is not a live location or navigation map.</desc>
      <defs><linearGradient id={`${uid}-land`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#4c3b63"/><stop offset="1" stopColor="#24253e"/></linearGradient><linearGradient id={`${uid}-trail`}><stop stopColor="#eeb2cd"/><stop offset="1" stopColor="#ecc9a0"/></linearGradient><filter id={`${uid}-glow`} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4"/></filter></defs>
      <g className="map-stars" fill="#e9cfdf">{Array.from({ length: 22 }, (_, i) => <circle key={i} cx={25 + i * 67 % 550} cy={25 + i * 43 % 490} r={i % 3 === 0 ? 1.8 : 1} opacity={.25 + i % 4 * .15}/>)}</g>
      <g transform="translate(10 18)"><path d={mainland} fill={`url(#${uid}-land)`} stroke="#c7a1cc" strokeWidth="1.2" strokeOpacity=".4"/><path d="M199 159q61 63 132 57M159 233q59 38 137 62M185 324q45 8 94 35" fill="none" stroke="#b997c2" opacity=".09" strokeDasharray="3 8"/>
      <path d={route} fill="none" stroke="#efb9d3" strokeWidth="9" opacity=".16" filter={`url(#${uid}-glow)`}/><motion.path d={route} fill="none" stroke={`url(#${uid}-trail)`} strokeWidth="1.8" strokeDasharray="3 6" initial={reduced ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduced ? 0 : 2.5 }}/>
      <g className="city-marker" transform="translate(223 157)"><circle className="marker-ring" r="17"/><circle className="marker-ring ring-two" r="10"/><circle r="5" fill="#f3bdd2"/><circle r="2" fill="#fff4f7"/></g>
      <g className="city-marker kohima-marker" transform="translate(465 210)"><circle className="marker-ring" r="17"/><circle className="marker-ring ring-two" r="10"/><circle r="5" fill="#f5d4a7"/><circle r="2" fill="#fff9eb"/></g>
      <g className="map-city-label"><text x="202" y="153" textAnchor="end">MODINAGAR</text><text className="map-city-sub" x="202" y="170" textAnchor="end">me, missing you.</text><text x="461" y="255" textAnchor="middle">KOHIMA</text><text className="map-city-sub" x="461" y="272" textAnchor="middle">you, my favorite.</text></g>
      <g className="traveling-message"><path d="M-7-4L0 1 7-4M-7-5H7V5H-7Z" fill="#f0bcd4" stroke="#fcf1f7" strokeWidth=".7"/></g>
      <g fill="#e7b7d0" className="trail-hearts"><text x="281" y="119">♡</text><text x="356" y="129">✧</text><text x="411" y="167">♡</text></g>
      <text className="map-country-label" x="221" y="270" textAnchor="middle">SAME SKY.</text><text className="map-country-label" x="221" y="291" textAnchor="middle">DIFFERENT CITIES.</text></g>
    </svg><div className="distance-map-caption"><strong>~2,200 KM APART</strong><span>A little message, from me to you.</span></div><figcaption>Illustrated map · approximate city positions & distance · not live locations</figcaption>
  </figure>;
}

export function DistanceOpening({ onEnter }) {
  const reduced = useReducedMotion();
  return <div className="distance-opening"><div className="distance-opening-copy"><p className="eyebrow">MODINAGAR → KOHIMA · 23 OCTOBER 2026</p><h1>Two little worlds.<br/><em>And you, in mine.</em></h1><p className="opening-story">Somewhere in India, there’s a girl in Kohima who has absolutely no idea how much one person in Modinagar is smiling while making this website for her.</p><div className="distance-lines">{['2,200 kilometres between our locations.', 'One very dramatic, occasionally irritating boyfriend in Modinagar.', 'One independent, occasionally angry, ridiculously lovable queen in Kohima.', 'And one little universe where the distance doesn’t get to decide whether we can make a memory together.'].map((line, i) => <motion.p key={line} initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: reduced ? 0 : .3 + i * .16 }}>{line}</motion.p>)}</div><button className="button" onClick={onEnter}>Enter Our Little Universe <Sparkles size={17}/></button><small>The kilometres are approximate. How much you mean to me isn’t.</small></div><IndiaConnection/></div>;
}

export function BirthdayAcrossMap() {
  return <div className="birthday-across-map"><div className="two-skies" aria-hidden="true"><span><Moon size={18}/> MODINAGAR</span><div className="sky-thread">✧ · ♡ · ✧ · ♡ · ✧</div><span>KOHIMA <Star size={18}/></span></div><p className="birthday-night-date">23 <em>October</em> 2026</p><div className="birthday-map-words"><p>Tonight, somewhere in Kohima, my favorite girl is celebrating another year of being wonderfully, stubbornly, beautifully herself.</p><p>And here in Modinagar, I’m wishing I could be there to celebrate with you.</p><p>Until I can give you a birthday hug in person, here’s a little piece of my heart, wrapped in code, stars, memories, and all the words I sometimes struggle to say out loud.</p><p>Happy Birthday, my one and only favorite person. ♡</p></div></div>;
}

export function CoopScene({ onDate }) {
  const [line, setLine] = useState(0); const reduced = useReducedMotion();
  return <div className="coop-scene"><p className="eyebrow">NO MATTER HOW MANY KILOMETRES</p><h2>2,200 KM Apart.<br/><em>Still on the Same Team.</em></h2><p className="coop-intro">I can’t be beside you tonight, Bubu. But I’d really like to spend a little time with you.</p><div className="coop-players"><div className="player-profile"><div className="avatar-ring"><img src={featuredPhoto.src} alt="You, my Player 1"/></div><span>PLAYER 1 · KOHIMA</span><h3>My Beloved<br/>Independent Woman</h3></div><div className="pixel-bridge" aria-hidden="true"><span>✦</span>{[0, 1, 2, 3, 4].map(i => <motion.span key={i} animate={reduced ? {} : { opacity: [.25, 1, .25], y: [0, -5, 0] }} transition={{ duration: 2.5, delay: i * .25, repeat: Infinity }}>♥</motion.span>)}<span>✦</span></div><div className="player-profile"><div className="avatar-ring boyfriend-avatar"><img src={playerTwoPhoto} alt="Me, your Player 2, in Modinagar" className="player-two-photo"/></div><span>PLAYER 2 · MODINAGAR</span><h3>Your Favorite Irritant<br/><small>(hopefully)</small></h3></div></div><dl className="coop-stats"><div><dt>Distance</dt><dd>Approximately 2,200 km</dd></div><div><dt>Team status</dt><dd>Better together</dd></div><div><dt>Next quest</dt><dd>A virtual date</dd></div><div><dt>My mission</dt><dd>Make more memories, one call at a time.</dd></div></dl><div className="coop-dialogue"><small>A LITTLE CONVERSATION I IMAGINED…</small><motion.div key={line} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><span>{distanceStory.dialogue[line].speaker}:</span><p>{distanceStory.dialogue[line].text}</p></motion.div><button className="text-button" onClick={() => setLine(n => (n + 1) % distanceStory.dialogue.length)}>{line === distanceStory.dialogue.length - 1 ? 'Read it again' : 'And then…'} <ArrowRight size={15}/></button></div><p className="connection-notice"><Heart size={12}/> Long-distance connection detected. Cuteness levels critically high.</p><button className="button" onClick={onDate}>Let’s make a little time for us <ArrowRight size={17}/></button></div>;
}

export function DistanceFinal() {
  const reduced = useReducedMotion();
  return <div className="distance-final"><h2>Until the map<br/><em>brings us closer.</em></h2><IndiaConnection compact/><div className="distance-final-words">{distanceStory.final.map(line => <motion.p key={line} initial={reduced ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .6 }}>{line}</motion.p>)}</div><p className="same-sky-signoff">Same sky. Different cities.<br/>One very special person in my heart.</p><p className="next-call">Until our next call, my Player 1. ❤️</p></div>;
}
