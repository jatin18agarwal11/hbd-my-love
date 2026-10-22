import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowDown, Heart, Sparkles } from 'lucide-react';

const momentTitles = [
  ['A little collection of you', 'I wanted all these little glimpses of you in one place.'],
  ['And a few more to keep close', 'There is never just one photo I want to remember.'],
  ['Every frame belongs here', 'Because all these versions of you are my favorite.'],
];

function Frames({ photos, onOpen, className = '' }) {
  const reduced = useReducedMotion();
  return <div className={`photo-grid memory-frame-grid ${className}`}>
    {photos.map((photo, index) => <motion.button
      type="button"
      className={`photo-card memory-frame ${index === 0 ? 'memory-frame-lead' : ''}`}
      key={photo.filename}
      onClick={() => onOpen(photo.id)}
      aria-label={`Open photo ${photo.id + 1}: ${photo.caption}`}
      initial={reduced ? false : { opacity: 0, y: 18, rotate: index % 2 ? 1.2 : -1.2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: .08 }}
      whileHover={reduced ? undefined : { y: -5, rotate: index % 2 ? 1.5 : -1.5, scale: 1.015 }}
      transition={{ duration: reduced ? 0 : .55, delay: reduced ? 0 : (index % 6) * .035 }}
    >
      <div className="photo-wrap" style={{ '--memory-photo': `url("${photo.src}")` }}><span className="memory-missing" hidden><Heart size={21}/> a little photo of you</span><img src={photo.src} alt={`Bubu — ${photo.caption}`} loading="lazy" decoding="async" onError={event => { event.currentTarget.hidden = true; event.currentTarget.previousElementSibling.hidden = false; }}/><span className="photo-open"><Heart size={18}/></span></div>
      <span className="photo-caption"><span>{photo.caption}</span><small>{String(photo.id + 1).padStart(2, '0')}</small></span>
      <span className="memory-tape" aria-hidden="true"/>
    </motion.button>)}
  </div>;
}

export default function MemoryStory({ photos, moments, mode, onModeChange, onOpen }) {
  const [visibleCount, setVisibleCount] = useState(6);
  useEffect(() => setVisibleCount(6), [mode]);
  let remaining = visibleCount;
  const visibleMoments = moments.flatMap(moment => {
    if (!remaining) return [];
    const visiblePhotos = moment.photos.slice(0, remaining);
    remaining -= visiblePhotos.length;
    return [{ ...moment, visiblePhotos }];
  });
  return <div className="memory-story">
    <div className="memory-story-preface"><span className="memory-heartline"><Heart size={16}/> A LITTLE LOVE, IN EVERY FRAME <Heart size={16}/></span><h3>There are so many little<br/><em>versions of you I love.</em></h3><p>I didn’t want to choose just one. So I brought all fifty together, in the order they found their way into my camera roll.</p><span className="memory-underline" aria-hidden="true"/></div>
    <div className="memory-view-switch" role="group" aria-label="Choose how to view the photos"><button type="button" aria-pressed={mode === 'moments'} onClick={() => onModeChange('moments')}>Our little moments</button><button type="button" aria-pressed={mode === 'all'} onClick={() => onModeChange('all')}>Browse all memories</button></div>
    {mode === 'moments' ? <div className="memory-moments">
      {visibleMoments.map((moment, momentIndex) => {
        const [title, note] = momentTitles[momentIndex] || [`Another little collection`, `Still, every bit of you is worth keeping.`];
        return <section className="memory-moment" key={moment.photos[0]?.filename || momentIndex}>
          <header className="memory-moment-heading"><span className="memory-moment-number">{String(momentIndex + 1).padStart(2, '0')} <i>/ {String(moments.length).padStart(2, '0')}</i></span><div><h4>{title}</h4><p>{note}</p></div><span className="memory-moment-count">{moment.photos.length} {moment.photos.length === 1 ? 'photo' : 'photos'} <Heart size={14}/></span></header>
          <Frames photos={moment.visiblePhotos} onOpen={onOpen} className="moment-frames"/>
          {momentIndex < visibleMoments.length - 1 && <div className="memory-thread" aria-hidden="true"><span/><Heart size={14} fill="currentColor"/><span/></div>}
        </section>;
      })}
    </div> : <Frames photos={photos.slice(0, visibleCount)} onOpen={onOpen} className="all-memory-frames"/>}
    <div className="memory-load-progress" aria-live="polite"><span>{Math.min(visibleCount, photos.length)} of {photos.length} memories</span>{visibleCount < photos.length && <button type="button" className="button secondary" onClick={() => setVisibleCount(count => Math.min(count + 6, photos.length))}>Show the next 6 <ArrowDown size={15}/></button>}</div>
    <p className="memory-story-signoff"><Sparkles size={15}/> Fifty little frames. One very loved girl. <Heart size={14}/></p>
  </div>;
}
