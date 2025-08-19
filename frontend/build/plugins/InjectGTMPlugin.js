import HtmlWebpackPlugin from 'html-webpack-plugin';

export default class InjectGtmInProdPlugin {
  constructor(gtmId = 'GTM-5G2XCWPL') {
    this.gtmId = gtmId;
  }

  apply(compiler) {
    const isProd =
      (compiler.options.mode && compiler.options.mode === 'production') ||
      process.env.NODE_ENV === 'production';

    if (!isProd) return;

    compiler.hooks.compilation.tap('InjectGtmInProdPlugin', (compilation) => {
      if (!HtmlWebpackPlugin || typeof HtmlWebpackPlugin.getHooks !== 'function') return;

      const banner = `
<script>
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', '${this.gtmId}');
</script>`.trim();

      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tap('InjectGtmInProdPlugin', (data) => {
        if (!data.html.includes(`www.googletagmanager.com/gtm.js?id=${this.gtmId}`)) {
          if (data.html.includes('</body>')) {
            data.html = data.html.replace('</body>', `${banner}\n</body>`);
          } else {
            data.html += `\n${banner}\n`;
          }
        }
        return data;
      });
    });
  }
}
