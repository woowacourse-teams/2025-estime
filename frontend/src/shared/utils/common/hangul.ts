type ParticleType = '이/가' | '은/는' | '을/를' | '와/과';

export const getKoreanParticle = (word: string, type: ParticleType) => {
  const lastChar = word.charCodeAt(word.length - 1);
  const hasJongseong = (lastChar - 0xac00) % 28 !== 0;

  const particles: Record<ParticleType, [string, string]> = {
    '이/가': ['이', '가'],
    '은/는': ['은', '는'],
    '을/를': ['을', '를'],
    '와/과': ['과', '와'],
  };

  const [withJongseong, withoutJongseong] = particles[type];
  return hasJongseong ? withJongseong : withoutJongseong;
};
