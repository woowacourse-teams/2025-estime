// import { act, renderHook } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import { ReactNode } from 'react';
// import { BrowserRouter } from 'react-router';
// import useCreateRoom from '../useCreateRoom';

// describe('useCreateRoom은', () => {
//   beforeEach(() => {
//     jest.useFakeTimers();
//     jest.setSystemTime(new Date('2025-08-06T09:00:00Z'));
//     jest.resetModules();
//   });
//   afterEach(() => {
//     jest.useRealTimers();
//   });
//   it('초기 상태를 반환한다', () => {
//     const wrapper = ({ children }: { children: ReactNode }) => (
//       <BrowserRouter>{children}</BrowserRouter>
//     );

//     const { result } = renderHook(() => useCreateRoom(), {
//       wrapper,
//     });

//     expect(result.current.title.value).toBe('');
//     expect(result.current.availableDates.value).toEqual(new Set());
//     expect(result.current.time.value).toEqual({ startTime: '', endTime: '' });
//     expect(result.current.deadLine.value).toEqual({
//       date: '2025-08-07',
//       // UTC 9시 + 9시간(한국 타임존) = 18시
//       time: '18:00',
//     });
//     expect(result.current.isPublic.value).toBe('public');
//     expect(result.current.isCalendarReady).toBe(false);
//     expect(result.current.isBasicReady).toBe(false);
//   });
//   it('올바른 TimeRange를 넣었을때, 올바른 상태를 반환한다', () => {
//     const wrapper = ({ children }: { children: ReactNode }) => (
//       <BrowserRouter>{children}</BrowserRouter>
//     );

//     const { result } = renderHook(() => useCreateRoom(), {
//       wrapper,
//     });
//     act(() => {
//       result.current.time.set({ startTime: '10:00', endTime: '11:00' });
//     });
//     expect(result.current.time.value).toEqual({ startTime: '10:00', endTime: '11:00' });
//   });
//   it('올바르지 않은 TimeRange를 넣었을때, invalid 상태를 반환한다', () => {
//     const wrapper = ({ children }: { children: ReactNode }) => (
//       <BrowserRouter>{children}</BrowserRouter>
//     );

//     const { result } = renderHook(() => useCreateRoom(), {
//       wrapper,
//     });
//     act(() => {
//       result.current.time.set({ startTime: '11:00', endTime: '10:00' });
//     });
//     expect(result.current.time.valid).toEqual(false);
//   });

//   it('올바른 달력의 날짜를 넣었을때, 올바른 상태를 반환한다', () => {
//     const wrapper = ({ children }: { children: ReactNode }) => (
//       <BrowserRouter>{children}</BrowserRouter>
//     );

//     const { result } = renderHook(() => useCreateRoom(), {
//       wrapper,
//     });
//     act(() => {
//       result.current.availableDates.set(new Set(['2025-08-06']));
//     });
//     expect(result.current.availableDates.value).toEqual(new Set(['2025-08-06']));
//     expect(result.current.isCalendarReady).toBe(true);
//   });
//   it('날짜의 달력이 없으면, isCalendarReady는 false를 반환한다', () => {
//     const wrapper = ({ children }: { children: ReactNode }) => (
//       <BrowserRouter>{children}</BrowserRouter>
//     );

//     const { result } = renderHook(() => useCreateRoom(), {
//       wrapper,
//     });

//     // 초기 상태에는 달력이 없음.
//     expect(result.current.isCalendarReady).toBe(false);
//   });
//   it('basic에 필요한 필수정보를 입력했을때, isBasicReady는 true를 반환한다', () => {
//     const wrapper = ({ children }: { children: ReactNode }) => (
//       <BrowserRouter>{children}</BrowserRouter>
//     );

//     const { result } = renderHook(() => useCreateRoom(), {
//       wrapper,
//     });
//     act(() => {
//       result.current.title.set('test');
//       result.current.time.set({ startTime: '10:00', endTime: '11:00' });
//     });
//     expect(result.current.isBasicReady).toBe(true);
//   });
//   it('basic에 필요한 필수정보가 빠져있으면, isBasicReady는 false를 반환한다', () => {
//     const wrapper = ({ children }: { children: ReactNode }) => (
//       <BrowserRouter>{children}</BrowserRouter>
//     );

//     const { result } = renderHook(() => useCreateRoom(), {
//       wrapper,
//     });
//     act(() => {
//       result.current.time.set({ startTime: '10:00', endTime: '11:00' });
//     });
//     expect(result.current.isBasicReady).toBe(false);
//   });
// });
