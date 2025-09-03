interface WindowWithDataLayer extends Window {
  [key: string]: unknown;
}

class GTM {
  static init({ gtmId, dataLayerName = 'dataLayer' }: { gtmId: string; dataLayerName?: string }) {
    if (process.env.NODE_ENV !== 'production') return;

    const windowWithDataLayer = window as unknown as WindowWithDataLayer;

    windowWithDataLayer[dataLayerName] = windowWithDataLayer[dataLayerName] || [];
    (windowWithDataLayer[dataLayerName] as unknown[]).push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    });

    const f = document.getElementsByTagName('script')[0];
    const j = document.createElement('script') as HTMLScriptElement;
    const dl = dataLayerName !== 'dataLayer' ? `&l=${dataLayerName}` : '';
    j.async = true;
    j.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}${dl}`;
    f.parentNode!.insertBefore(j, f);
  }
}

export default GTM;
