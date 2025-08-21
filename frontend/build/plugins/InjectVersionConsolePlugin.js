import HtmlWebpackPlugin from 'html-webpack-plugin';

export default // 빌드시, index.html에 버전 정보 넣기
class InjectVersionConsolePlugin {
  constructor({ version, commit, message, builtAt }) {
    this.version = version;
    this.commit = commit;
    this.message = message;
    this.builtAt = builtAt;
  }
  apply(compiler) {
    // "컴파일" 객체가 만들어질 때마다 한번씩 호출되는 훅에 구독
    compiler.hooks.compilation.tap('InjectVersionConsolePlugin', (compilation) => {
      // HtmlWebpackPlugin이 노출한 훅 세트 가져오기
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tap(
        'InjectVersionConsolePlugin',
        (data) => {
          const banner = `
<script>
    console.info(
      [
        '%c📦 Version : v${this.version}',
        '%c🔀 Commit  : ${this.commit}',
        '%c🕒 Built   : ${this.builtAt}'
      ].join('\\n'),
      'font-weight:bold;color:#4cafef;',
      'font-weight:bold;color:#9c27b0;',
      'font-weight:bold;color:#ff9800;'
    );
</script>`;
          // 최종 HTML 문자열을 바꿔치기
          data.html = data.html.replace('</body>', `${banner}\n</body>`);
        }
      );
    });
  }
}
