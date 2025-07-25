import React, { useLayoutEffect, useRef, useCallback } from 'react';

const FocusTrap = ({ children }: { children: React.ReactNode }) => {
  const modalRef = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback((element: HTMLElement) => {
    return Array.from(
      element.querySelectorAll<HTMLElement>(
        'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
      )
    ).filter((el) => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
    });
  }, []);

  useLayoutEffect(() => {
    const modalEl = modalRef.current;
    if (!modalEl) return;

    const prevActive = document.activeElement as HTMLElement | null;

    const focusableElements = getFocusableElements(modalEl);
    const first = focusableElements[0];

    if (focusableElements.length === 0) {
      modalEl.setAttribute('tabindex', '-1');
      modalEl.focus();
    } else {
      first?.focus();
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const currentFocusableElements = getFocusableElements(modalEl);
      const currentFirst = currentFocusableElements[0];
      const currentLast = currentFocusableElements[currentFocusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === currentFirst || document.activeElement === modalEl) {
          e.preventDefault();
          currentLast?.focus();
        }
      } else {
        if (document.activeElement === currentLast) {
          e.preventDefault();
          currentFirst?.focus();
        }
      }
    };

    modalEl.addEventListener('keydown', onKeyDown);

    return () => {
      modalEl.removeEventListener('keydown', onKeyDown);
      prevActive?.focus();
    };
  }, [getFocusableElements]);

  const setRef = useCallback((element: HTMLElement | null) => {
    modalRef.current = element;
  }, []);

  if (React.isValidElement(children)) {
    const element = children as React.ReactElement<{ ref?: React.Ref<HTMLElement> }>;
    const originalRef = (element as any).ref;

    return React.cloneElement(element, {
      ref: (node: HTMLElement | null) => {
        setRef(node);

        if (typeof originalRef === 'function') {
          originalRef(node);
        } else if (originalRef && typeof originalRef === 'object') {
          originalRef.current = node;
        }
      },
    });
  }

  return children;
};

export default FocusTrap;
