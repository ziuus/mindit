const ADJECTIVES = ['Quiet', 'Wandering', 'Still', 'Gentle', 'Distant', 'Velvet', 'Silver', 'Hollow', 'Woven', 'Faded', 'Amber', 'Drifting', 'Soft', 'Hidden', 'Pale', 'Tender', 'Muted', 'Twilight', 'Echoed', 'Spare'];
const NOUNS = ['Mountain', 'River', 'Forest', 'Ocean', 'Ember', 'Cloud', 'Field', 'Horizon', 'Garden', 'Lantern', 'Shore', 'Valley', 'Meadow', 'Willow', 'Tide', 'Stone', 'Leaf', 'Flame', 'Rain', 'Mist'];

export function generatePseudonym(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${adj}${noun}${num}`;
}

export function getAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0a0f14&shapeColor=7fb69a`;
}

export function getOrCreateUser(): { pseudonym: string; avatarSeed: string; id: string } {
  if (typeof window === 'undefined') return { pseudonym: 'QuietMountain42', avatarSeed: 'default', id: 'server' };
  const stored = localStorage.getItem('mindit_user');
  if (stored) return JSON.parse(stored);
  const user = {
    id: crypto.randomUUID(),
    pseudonym: generatePseudonym(),
    avatarSeed: crypto.randomUUID(),
  };
  localStorage.setItem('mindit_user', JSON.stringify(user));
  return user;
}
