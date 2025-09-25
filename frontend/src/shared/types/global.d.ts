export {};

declare global {
  interface Window {
    Kakao: KakaoSDK;
  }
}

interface KakaoSDK {
  init: (appKey: string | undefined) => void;
  isInitialized: () => boolean;
  Link: {
    sendDefault: (options: KakaoLinkDefaultOptions) => void;
  };
}

interface KakaoLinkDefaultOptions {
  objectType: 'feed' | 'list' | 'location' | 'commerce' | 'text';
  content: {
    title: string;
    description?: string;
    imageUrl: string;
    imageWidth?: number;
    imageHeight?: number;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
}
