import { useCallback, useLayoutEffect, useRef } from 'react';

function FocusTrap({ children }: { children: React.ReactNode }) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const focusableElementsRef = useRef<HTMLElement[]>([]);

  // https://allyjs.io/data-tables/focusable.html
  // https://html.spec.whatwg.org/multipage/interaction.html#focusable-area
  // HTML 스펙 기준으로 포커스 가능한 요소를 찾는 함수

  const getFocusableElements = useCallback((element: HTMLElement) => {
    const focusableSelectors = [
      'a[href]',
      'area[href]',
      'input',
      'select',
      'textarea',
      'button',
      'iframe',
      'object',
      'embed',
      '[contenteditable]',
      '[tabindex]:not([tabindex="-1"])',
    ];

    const focusableElements = Array.from(
      element.querySelectorAll<HTMLElement>(focusableSelectors.join(','))
    ).filter((el) => {
      // aria-hidden이나 hidden 속성이 있는 요소 제외
      return (
        el.getAttribute('aria-hidden') !== 'true' &&
        el.getAttribute('aria-disabled') !== 'true' &&
        !el.hasAttribute('disabled') &&
        !el.hasAttribute('readonly') &&
        !el.hasAttribute('hidden') &&
        el.style.display !== 'none' &&
        el.style.visibility !== 'hidden'
      );
    });

    return focusableElements;
  }, []);

  const updateFocusableElements = useCallback(
    (element: HTMLElement) => {
      focusableElementsRef.current = getFocusableElements(element);
    },
    [getFocusableElements]
  );

  useLayoutEffect(() => {
    const element = modalRef.current;
    if (!element) return;

    // 초기 focusable 요소 설정
    updateFocusableElements(element);

    if (focusableElementsRef.current.length === 0) return;

    // data-preferred-focus 속성이 있는 요소를 우선적으로 focus
    const preferredElement = element.querySelector<HTMLElement>('[data-preferred-focus]');
    const firstElement = focusableElementsRef.current[0];

    if (preferredElement) {
      preferredElement.focus();
    } else {
      firstElement.focus();
    }

    // MutationObserver로 DOM 변경 감지
    const observer = new MutationObserver((mutations) => {
      // 관련된 변경사항이 있을 때만 업데이트
      const shouldUpdate = mutations.some((mutation) => {
        // 속성 변경 중 포커스에 영향을 줄 수 있는 것들
        if (mutation.type === 'attributes') {
          const attr = mutation.attributeName;
          return (
            attr === 'disabled' ||
            attr === 'readonly' ||
            attr === 'hidden' ||
            attr === 'aria-hidden' ||
            attr === 'aria-disabled' ||
            attr === 'tabindex' ||
            attr === 'style'
          );
        }
        return false;
      });

      if (shouldUpdate) {
        updateFocusableElements(element);
      }
    });

    observer.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        'disabled',
        'readonly',
        'hidden',
        'aria-hidden',
        'aria-disabled',
        'tabindex',
        'style',
      ],
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        const currentFocusableElements = focusableElementsRef.current;
        if (currentFocusableElements.length === 0) return;

        const currentFirst = currentFocusableElements[0];
        const currentLast = currentFocusableElements[currentFocusableElements.length - 1];

        if (event.shiftKey) {
          // Shift + Tab: 첫 번째 요소에서 마지막 요소로
          if (document.activeElement === currentFirst) {
            event.preventDefault();
            currentLast.focus();
          }
        } else {
          // Tab: 마지막 요소에서 첫 번째 요소로
          if (document.activeElement === currentLast) {
            event.preventDefault();
            currentFirst.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      observer.disconnect();
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [getFocusableElements, updateFocusableElements]);

  return <div ref={modalRef}>{children}</div>;
}

export default FocusTrap;
