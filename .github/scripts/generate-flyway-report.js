/**
 * Flyway 마이그레이션 검증 결과 리포트 생성
 * GitHub Actions에서 PR 코멘트로 사용
 */

const fs = require('node:fs');

/**
 * @typedef {Object} GitHub
 * @property {Object} rest
 * @property {Object} rest.issues
 * @property {Function} rest.issues.createComment
 */

/**
 * @typedef {Object} Context
 * @property {Object} repo
 * @property {string} repo.owner
 * @property {string} repo.repo
 * @property {Object} issue
 * @property {number} issue.number
 */

/**
 * @typedef {Object} Core
 * @property {Function} warning
 * @property {Function} info
 * @property {Function} setFailed
 */

function readFile(path, core) {
    try {
        return fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : '';
    } catch (error) {
        core.warning(`파일 읽기 실패: ${path} - ${error.message}`);
        return '';
    }
}

/**
 * SQL 에러/경고 라인 파싱
 * 형식: "레벨|사유|파일|SQL쿼리"
 */
function parseLines(content, core) {
    const lines = [];
    for (const line of content.split('\n')) {
        if (line.trim()) {
            const parts = line.split('|');
            if (parts.length >= 4) {
                lines.push({
                    level: parts[0].trim(),
                    reason: parts[1].trim(),
                    file: parts[2].trim(),
                    query: parts[3].trim().replaceAll('\r', '')
                });
            } else {
                // 파싱 실패 시 원본 라인 보존
                core.warning(`파싱 실패: ${line}`);
                lines.push({
                    level: '-',
                    reason: '파싱 실패',
                    file: '-',
                    query: line
                });
            }
        }
    }
    return lines;
}

/**
 * 검증 상태 결정
 */
function getValidationStatus(forbiddenFound, reviewFound) {
    if (forbiddenFound) return '❌ 위험';
    if (reviewFound) return '⚠️ 검토';
    return '✅ 통과';
}

/**
 * 마이그레이션 상태 결정
 */
function getMigrationStatus(status) {
    if (status === 'success') return '✅ 성공';
    if (status === 'failed') return '❌ 실패';
    return '⏭️ 스킵';
}

/**
 * 에러/경고 테이블 생성
 */
function createErrorTable(errors, warnings) {
    const allIssues = [...errors, ...warnings];

    if (allIssues.length === 0) {
        return '| - | - | - | 상세 내용 확인 불가 |\n';
    }

    return allIssues.map(issue =>
        `| ${issue.level} | ${issue.reason} | \`${issue.file}\` | \`${issue.query}\` |`
    ).join('\n') + '\n';
}

/**
 * 메인 리포트 생성
 */
function generateReport(forbiddenFound, reviewFound, migrateStatus, core) {
    // 파일 읽기
    const errorsContent = readFile('forbidden_errors.txt', core);
    const warningsContent = readFile('warning_details.txt', core);
    const migrationErrorContent = readFile('migration_error.txt', core);

    // 기본 리포트 헤더
    let report = `# Flyway 마이그레이션 검증 결과

## 검증 항목

| 검증 유형 | 결과 |
|----------|------|
| 위험 SQL 탐색 | ${getValidationStatus(forbiddenFound, reviewFound)} |
| 마이그레이션 실행 | ${getMigrationStatus(migrateStatus)} |
`;

    // SQL 검증 결과 섹션
    if (forbiddenFound || reviewFound) {
        const header = forbiddenFound ? '## ❌ 위험 단계 SQL 탐지' : '## ⚠️ 검토 단계 SQL 탐지';
        const errors = parseLines(errorsContent, core);
        const warnings = parseLines(warningsContent, core);

        report += `\n${header}\n\n`;
        report += `| 위험 LEVEL | 사유 | 파일 | 대상 SQL |\n`;
        report += `|:----------|:-----|:----|:--------|\n`;
        report += createErrorTable(errors, warnings);
        if (forbiddenFound) {
            report += `\n**이러한 SQL은 프로덕션 데이터를 손실시킬 가능성이 매우 높으므로 수정 필요**\n`;
        }
    }

    // 마이그레이션 실패 섹션
    if (migrateStatus === 'failed' && migrationErrorContent) {
        report += `\n${migrationErrorContent}\n`;
    }

    // 성공 섹션
    if (migrateStatus === 'success') {
        report += `\n## ✅ 검증 성공\n\n모든 마이그레이션 검증 로직 정상 실행\n`;
    }

    return report;
}

/**
 * Flyway 마이그레이션 검증 결과를 생성하고 PR에 코멘트를 작성
 * @param {Object} params
 * @param {GitHub} params.github - GitHub API 클라이언트
 * @param {Context} params.context - GitHub Actions 컨텍스트
 * @param {Core} params.core - GitHub Actions 코어 유틸리티
 */
module.exports = async function generateFlywayReport({github, context, core}) {
    // 환경 변수에서 검증 결과 가져오기
    const forbiddenFound = process.env.FORBIDDEN_FOUND === 'true';
    const reviewFound = process.env.REVIEW_FOUND === 'true';
    const migrateStatus = process.env.MIGRATE_STATUS;

    // 리포트 생성
    const report = generateReport(forbiddenFound, reviewFound, migrateStatus, core);

    // PR 코멘트 작성
    try {
        await github.rest.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: context.issue.number,
            body: report
        });
        core.info('PR 코멘트 작성 완료');
    } catch (error) {
        core.setFailed(`PR 코멘트 작성 실패: ${error.message}`);
        throw error;
    }
};
