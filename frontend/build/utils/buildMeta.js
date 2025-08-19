import { execSync } from 'child_process';

// ── git HEAD 해시 + 빌드 시각 수집 ──
const getBuildMeta = () => {
  const commit =
    process.env.COMMIT_HASH ||
    process.env.CODEBUILD_RESOLVED_SOURCE_VERSION ||
    execSync('git rev-parse --short HEAD').toString().trim() ||
    'unknown';

  const builtAt = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date());

  return { commit, builtAt };
};

export default getBuildMeta;
