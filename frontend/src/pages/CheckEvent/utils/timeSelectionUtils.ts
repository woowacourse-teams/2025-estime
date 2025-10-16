import type React from 'react';

/**
 * 선택 모드 - 셀을 선택에 추가하거나 제거
 * @typedef {'add' | 'remove'} SelectionMode
 */
export type SelectionMode = 'add' | 'remove';

/**
 * 2D 좌표를 나타내는 점
 * @property {number} x - X 좌표
 * @property {number} y - Y 좌표
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * 사각형 영역을 나타내는 좌표
 * @property {number} left - 좌측 경계
 * @property {number} top - 상단 경계
 * @property {number} right - 우측 경계
 * @property {number} bottom - 하단 경계
 */
export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/**
 * 시간 셀의 히트박스 정보
 * @property {string} key - 셀의 고유 식별자
 * @property {number} left - 좌측 경계 (컨테이너 기준)
 * @property {number} right - 우측 경계 (컨테이너 기준)
 * @property {number} top - 상단 경계 (컨테이너 기준)
 * @property {number} bottom - 하단 경계 (컨테이너 기준)
 */
export interface TimeCellHitbox {
  key: string;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

/** 기본 셀 선택자 */
export const CELL_SELECTOR = '.time-table-cell';

/** 기본 데이터 속성 키 */
export const DATA_KEY = 'time';

/**
 * 이벤트 타겟에서 셀의 key 값을 추출합니다.
 * 드래그 이벤트가 아닌 클릭할때 해당 key 값을 추출합니다.
 *
 * @param {React.PointerEvent} event - 포인터 이벤트 객체
 * @param {string} [selector='.time-table-cell'] - 셀을 찾기 위한 CSS 선택자
 * @param {string} [dataKey='time'] - data 속성의 키 이름
 * @returns {string | null} 셀의 key 값 또는 찾을 수 없는 경우 null
 *
 * @example
 * // 기본 사용법
 * const cellKey = getCellKeyFromEvent(event);
 *
 */
export const getCellKeyFromEvent = (
  event: React.PointerEvent,
  selector: string = CELL_SELECTOR,
  dataKey: string = DATA_KEY
): string | null => {
  const targetCell = (event.target as HTMLElement | null)?.closest(selector) as HTMLElement | null;
  return targetCell?.dataset?.[dataKey] ?? null;
};

/**
 * 컨테이너 요소의 경계 영역을 가져옵니다.
 *
 * @param {HTMLElement | null} container - 컨테이너 요소
 * @returns {DOMRectReadOnly | null} 컨테이너의 경계 정보 또는 null
 *
 * @example
 * const bounds = getContainerBounds(containerElement);
 */
export const getContainerBounds = (container: HTMLElement | null): DOMRectReadOnly | null =>
  container?.getBoundingClientRect() ?? null;

/**
 * 브라우저 뷰포트 기준 포인터 좌표를 컨테이너 로컬 좌표로 변환합니다.
 * 이 변환이 없으면, x, y 좌표가 뷰포트 기준이 되어 올바른 셀을 찾지 못합니다.
 *
 * @param {React.PointerEvent} event - 포인터 이벤트 객체
 * @param {DOMRectReadOnly} bounds - 컨테이너의 경계 정보
 * @returns {Point} 컨테이너 기준 로컬 좌표
 *
 * @example
 * const bounds = getContainerBounds(container);
 * const localPoint = toLocalPoint(event, bounds);
 */
export const toLocalPoint = (event: React.PointerEvent, bounds: DOMRectReadOnly): Point => ({
  x: event.clientX - bounds.left,
  y: event.clientY - bounds.top,
});

/**
 * 컨테이너 내의 모든 셀에 대한 히트박스 정보를 수집합니다.
 * 좌표는 컨테이너 기준 상대 좌표로 계산됩니다.
 *
 * @param {HTMLElement | null} container - 컨테이너 요소
 * @param {DOMRectReadOnly} bounds - 컨테이너의 경계 정보
 * @param {string} [selector='.time-table-cell'] - 셀 선택자
 * @param {string} [dataKey='time'] - data 속성 키
 * @returns {TimeCellHitbox[]} 히트박스 정보 배열
 *
 * @example
 * const bounds = getContainerBounds(container);
 * const hitboxes = populateHitboxes(container, bounds);
 * console.log(`Found ${hitboxes.length} cells`);
 */
export const populateHitboxes = (
  container: HTMLElement | null,
  bounds: DOMRectReadOnly,
  selector: string = CELL_SELECTOR,
  dataKey: string = DATA_KEY
): TimeCellHitbox[] => {
  if (!container) return [];

  const cellElements = container.querySelectorAll<HTMLElement>(`${selector}[data-${dataKey}]`);

  const hitboxes: TimeCellHitbox[] = [];

  cellElements.forEach((cellElement) => {
    const key = cellElement.dataset[dataKey]!;
    const cellRect = cellElement.getBoundingClientRect();
    hitboxes.push({
      key,
      left: cellRect.left - bounds.left,
      right: cellRect.right - bounds.left,
      top: cellRect.top - bounds.top,
      bottom: cellRect.bottom - bounds.top,
    });
  });

  return hitboxes;
};

/**
 * 두 점으로부터 사각형을 생성합니다.
 * 시작점과 끝점의 위치와 관계없이 올바른 사각형을 만듭니다.
 * 방향을 기억하는 연산입니다.
 * https://www.joshuawootonn.com/react-drag-to-select#using-a-vector
 *
 * @param {Point} startPoint - 시작점
 * @param {Point} endPoint - 끝점
 * @returns {Rect} 생성된 사각형
 *
 */
export const makeRectFromPoints = (startPoint: Point, endPoint: Point): Rect => ({
  left: Math.min(startPoint.x, endPoint.x),
  top: Math.min(startPoint.y, endPoint.y),
  right: Math.max(startPoint.x, endPoint.x),
  bottom: Math.max(startPoint.y, endPoint.y),
});

/**
 * 두 사각형이 겹치는지 확인합니다.
 *
 * @param {Rect} rect1 - 첫 번째 사각형
 * @param {Rect} rect2 - 두 번째 사각형
 * @returns {boolean} 겹치면 true, 아니면 false
 *
 */
export const overlaps = (rect1: Rect, rect2: Rect): boolean =>
  rect1.left < rect2.right &&
  rect1.right > rect2.left &&
  rect1.top < rect2.bottom &&
  rect1.bottom > rect2.top;

/**
 * 현재 선택 상태를 기반으로 편집 모드를 결정합니다.
 * 이미 선택된 셀을 고르면, 'remove' 모드, 선택되지 않은 셀 고르면 'add' 모드가 됩니다.
 *
 * @param {Set<string>} selectedKeys - 현재 선택된 키 집합
 * @param {string} key - 확인할 키
 * @returns {SelectionMode} 'add' 또는 'remove' 모드
 *
 */
export const decideEditMode = (selectedKeys: Set<string>, key: string): SelectionMode =>
  selectedKeys.has(key) ? 'remove' : 'add';

/**
 * 단일 키에 대해 선택 상태 갱신을 시도합니다.
 * 반환되는 boolean은 실제로 상태가 변경되었는지 여부를 나타냅니다.
 * 이 boolean은 UI 업데이트 여부를 결정하는 데 유용합니다.
 *
 * @param {Set<string>} selectedKeys - 선택된 키 집합 (직접 수정됨)
 * @param {string} key - 작업할 키
 * @param {SelectionMode} mode - 선택 모드 ('add' 또는 'remove')
 * @returns {boolean} 선택 상태가 변경되었으면 true, 아니면 false
 *
 */
export const applySelection = (
  selectedKeys: Set<string>,
  key: string,
  mode: SelectionMode
): boolean => {
  const isAlreadySelected = selectedKeys.has(key);
  if (mode === 'add' && !isAlreadySelected) {
    selectedKeys.add(key);
    return true;
  }
  if (mode === 'remove' && isAlreadySelected) {
    selectedKeys.delete(key);
    return true;
  }
  return false;
};

/**
 * 드래그 영역과 겹치는 모든 셀에 대해 일괄 선택 작업을 수행합니다.
 * sweep, 즉 쓸어담기 선택을 구현합니다.
 *
 * @param {Set<string>} selectedKeys - 선택된 키 집합 (직접 수정됨)
 * @param {TimeCellHitbox[]} hitboxes - 셀 히트박스 배열
 * @param {Rect} region - 드래그 영역
 * @param {SelectionMode} mode - 선택 모드
 * @returns {boolean} 하나 이상의 셀이 변경되었으면 true
 *
 */
export const sweepSelection = (
  selectedKeys: Set<string>,
  hitboxes: TimeCellHitbox[],
  region: Rect,
  mode: SelectionMode
) => {
  for (const cellHitbox of hitboxes) {
    if (!overlaps(region, cellHitbox)) continue;
    applySelection(selectedKeys, cellHitbox.key, mode);
  }
};

/**
 * requestAnimationFrame을 사용한 배치 처리 유틸리티를 생성합니다.
 * 여러 업데이트 요청을 하나의 프레임으로 배치 처리하여 성능을 최적화합니다.
 *
 * @param {() => void} flush - 실행할 콜백 함수
 * @returns {{schedule: () => void, cancel: () => void}} 스케줄링 및 취소 함수
 *
 */

export const createRafBatch = (flush: () => void) => {
  let animationFrameId: number | null = null;
  const schedule = () => {
    if (animationFrameId != null) return;
    animationFrameId = requestAnimationFrame(() => {
      animationFrameId = null;
      flush();
    });
  };
  const cancel = () => {
    if (animationFrameId != null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };
  return { schedule, cancel };
};

/**
 * 컨테이너에 드래깅 상태를 나타내는 CSS 클래스를 토글합니다.
 * 'dragging' 클래스는 드래깅 중일 때 추가되고, 드래깅이 끝나면 제거됩니다.
 * 이는 드래깅중 스크롤 방지에 활용됩니다.
 *
 * @param {HTMLElement | null} container - 컨테이너 요소
 * @param {boolean} isDragging - 드래깅 상태
 *
 */
export const setDraggingClass = (container: HTMLElement | null, isDragging: boolean) => {
  if (!container) return;
  container.classList.toggle('dragging', isDragging);
};

/**
 * DOM의 셀 요소에 'selected' 클래스를 동기화합니다.
 * selectedKeys에 포함된 셀에만 'selected' 클래스가 추가됩니다.
 * 실제 DOM 조작을 시도합니다.
 * 실제 View에 업데이트 되는 시점은 requestAnimationFrame 배치에 의해 결정됩니다.
 *
 * @param {HTMLElement | null} container - 컨테이너 요소
 * @param {Set<string>} selectedKeys - 선택된 키 집합
 * @param {string} [selector='.time-table-cell'] - 셀 선택자
 * @param {string} [dataKey='time'] - data 속성 키
 *
 */
export const syncCellClasses = (
  container: HTMLElement | null,
  selectedKeys: Set<string>,
  selector: string = CELL_SELECTOR,
  dataKey: string = DATA_KEY
) => {
  if (!container) return;
  container.querySelectorAll<HTMLElement>(selector).forEach((cellElement) => {
    const key = cellElement.dataset?.[dataKey];
    if (!key) return;
    cellElement.classList.toggle('selected', selectedKeys.has(key));
  });
};
