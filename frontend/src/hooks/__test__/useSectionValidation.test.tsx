// import { renderHook } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import useSectionValidation from '../CreateRoom/useSectionValidation';

// describe('useSectionValidation은', () => {
//   it('초기 상태를 반환한다', () => {
//     const { result } = renderHook(() => useSectionValidation(false, false));
//     expect(result.current.showValidation.current).toBe(false);
//     expect(result.current.shouldShake).toBe(false);
//   });
//   it('isCalendarReady가 false이면, 올바른 상태를 반환한다', () => {
//     const { result } = renderHook(() => useSectionValidation(false, false));
//     expect(result.current.validateSection()).toBe(false);
//   });
//   it('isCalendarReady와 isBasicReady가 true이면, 올바른 상태를 반환한다', () => {
//     const { result } = renderHook(() => useSectionValidation(true, true));
//     expect(result.current.validateSection()).toBe(true);
//   });
// });
