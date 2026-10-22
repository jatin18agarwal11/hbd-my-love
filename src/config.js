import { nickname, signature, letter, dialogue, proposal } from './personalCopy';
export const featuredPhotoFilename = 'WhatsApp Image 2026-10-21 at 22.26.14 (1).jpeg';
// Personal messages live in personalCopy.js; captions use original image filenames.
export const config = { birthday: '2026-10-23', recipient: 'Bubu', nickname, signature, letter, dialogue, proposal, captions: {} };
const assets = import.meta.glob('../img/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}', { eager: true, query: '?url', import: 'default' });
export const photos = Object.entries(assets).sort(([a], [b]) => a.localeCompare(b, 'en')).map(([path, src], index) => ({ src, filename: path.split('/').pop(), caption: config.captions[path.split('/').pop()] || ['I miss this face.', 'You make me smile, Bubu.', 'I wish I were beside you.', 'My one and only favorite.', 'Yes, I still think you’re cute.'][index % 5], id: index }));
export const featuredPhoto = photos.find(photo => photo.filename === featuredPhotoFilename) || photos[0];
