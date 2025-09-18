import HtmlWebpackPlugin from 'html-webpack-plugin';

export default class InjectGTMPlugin {
  constructor(options = {}) {
    this.gtmId = options.gtmId || 'GTM-5G2XCWPL';
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('InjectGTMPlugin', (compilation) => {
      const hooks = HtmlWebpackPlugin.getHooks(compilation);

      hooks.beforeEmit.tap('InjectGTMPlugin', (data) => {
        const headScript = `
<!-- Google Tag Manager -->
<script>
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','${this.gtmId}');
</script>
<!-- End Google Tag Manager -->`;

        const bodyNoscript = `
<!-- Google Tag Manager (noscript) -->
<noscript>
  <iframe src="https://www.googletagmanager.com/ns.html?id=${this.gtmId}"
          height="0" width="0" style="display:none;visibility:hidden"></iframe>
</noscript>
<!-- End Google Tag Manager (noscript) -->`;

        // head 끝나기 전에 스크립트 삽입
        data.html = data.html.replace('</head>', `${headScript}\n</head>`);
        // body 시작 직후 noscript 삽입
        data.html = data.html.replace('<body>', `<body>\n${bodyNoscript}`);
      });
    });
  }
}
