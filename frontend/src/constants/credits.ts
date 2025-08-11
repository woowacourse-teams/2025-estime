import dummyImage from '@/assets/images/dummy.jpg';
import marvinProfile from '@/assets/images/marvin_profile.png';
import kangSanProfile from '@/assets/images/kang_san_profile.png';
import hoyyProfile from '@/assets/images/hoyy_profile.png';
import flintProfile from '@/assets/images/flint_profile.png';
import dbProfile from '@/assets/images/db_profile.png';
import jeffProfile from '@/assets/images/jeff_profile.png';
export const credits = [
  {
    name: '해삐',
    role: 'Frontend Developer',
    github: 'https://github.com/thgml05',
    imageUrl: dummyImage,
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
    imageUrl: dummyImage,
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
