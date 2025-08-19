import { execSync } from 'child_process';

// ── git HEAD 해시 + 빌드 시각 수집 ──
const getBuildMeta = () => {
  let commit = 'unknown';
  let message = 'unknown';
  try {
    commit = execSync('git rev-parse --short HEAD').toString().trim();
    message = execSync('git log -1 --pretty=%s').toString().trim();
  } catch {
    commit = 'unknown';
  }

  const builtAt = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date());

  return { commit, message, builtAt };
};

export default getBuildMeta;
