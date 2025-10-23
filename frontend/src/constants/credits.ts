import marvinProfile from '@/assets/images/profile/marvin_profile.webp';
import kangSanProfile from '@/assets/images/profile/kang_san_profile.webp';
import hoyyProfile from '@/assets/images/profile/hoyy_profile.webp';
import flintProfile from '@/assets/images/profile/flint_profile.webp';
import dbProfile from '@/assets/images/profile/db_profile.webp';
import jeffProfile from '@/assets/images/profile/jeff_profile.webp';
import riverProfile from '@/assets/images/profile/river_profile.webp';
import happiProfile from '@/assets/images/profile/happi_profile.webp';

export const credits = [
  {
    name: '해삐',
    role: 'Frontend Developer',
    github: 'https://github.com/thgml05',
    imageUrl: happiProfile,
  },
  {
    name: '메이토',
    role: 'Frontend Developer',
    github: 'https://github.com/db0111',
    imageUrl: dbProfile,
  },
  {
    name: '호이초이',
    role: 'Frontend Developer',
    github: 'https://github.com/hoyyChoi',
    imageUrl: hoyyProfile,
  },
  {
    name: '마빈',
    role: 'Frontend Developer',
    github: 'https://github.com/spoyodevelop',
    imageUrl: marvinProfile,
  },
  {
    name: '리버',
    role: 'Backend Developer',
    github: 'https://github.com/yeonnhuu',
    imageUrl: riverProfile,
  },
  {
    name: '제프리',
    role: 'Backend Developer',
    github: 'https://github.com/AppleMint98',
    imageUrl: jeffProfile,
  },
  {
    name: '강산',
    role: 'Backend Developer',
    github: 'https://github.com/m-a-king',
    imageUrl: kangSanProfile,
  },
  {
    name: '플린트',
    role: 'Backend Developer',
    github: 'https://github.com/jhan0121',
    imageUrl: flintProfile,
  },
] as const;
