/// 날짜별로 방에 참여한 인원 수와 가중치, 참여자 이름을 담는 인터페이스
/// 가중치는 0에서 1 사이의 값으로, 최소 인원 수를 0, 최대 인원 수를 1로 매핑합니다.
// https://stackoverflow.com/a/39776893
// 추후에 가중치 계산할때, min과 max에 고정 가중치 같은것을 부여해도 좋을지도?
// function minimalGetWeight(value: number, min: number, max: number): number {
//   // 0 으로 나누기 방지.
//   if (max <= min) return value > min ? 1 : 0;
//   return (value - min) / (max - min);
// }

// 가중치 함수 + // 최소 가시치(minVisible) 적용
// 조금 작은 수는 안보이더라구요. (예 0.02-> 0.2)
// 정책:
// - 값이 모두 동일하고 그 값이 0이면 0 (완전 투명)
// - 값이 모두 동일하고 그 값이 >0이면 minVisible (최소 가시치)
// - 일반 구간은 [min, max]를 0~1로 선형 정규화하고, 0이면 0, 그 외는 minVisible~1로 매핑
// - 표본이 적어 range가 작을 때 극단값 방지를 위해 최소 범위 적용

// TODO: 의존성 주입을 사용하므로, Service레이어로 분리 하는것이 좋을지도. util이라기엔 너무 커진....
export function getMarvinWeight(value: number, min: number, max: number, minVisible = 0.2): number {
  // 0~1로 클램프
  minVisible = Math.min(1, Math.max(0, minVisible));

  // 모두 0
  if (max === 0) return 0;

  // 모두 동일(>0) — 상대적으로 모두 최대
  if (max === min) return 1;

  const minRange = 3; // 최소 단계
  const actualRange = max - min;

  // 범위가 너무 작으면 '최댓값 고정' 상태에서 하한만 끌어내리기
  // => 최댓값은 항상 n=1이 됨
  let adjustedMin = min;
  let anchoredMax = max;

  if (actualRange < minRange) {
    adjustedMin = Math.min(min, max - minRange); // 하한만 확장
  }

  // anchoredMax를 분모에 써서 최댓값이 1.0이 되도록 앵커링
  let n = (value - adjustedMin) / (anchoredMax - adjustedMin);

  if (n <= 0) return 0; // 0표는 완전 투명
  if (n >= 1) n = 1;

  return minVisible + (1 - minVisible) * n;
}
/**
 * 최소 투명도를 보장하는 고도화된 로직 (6표 이상일 때 사용)
 */
const getAdvancedOpacity = (vote: number, max_vote: number, min_opacity = 0.2) => {
  if (vote === 0) return 0;
  if (max_vote <= 1) return min_opacity;
  const normalized_value = (vote - 1) / (max_vote - 1);
  const opacity = min_opacity + normalized_value * (1 - min_opacity);
  return opacity;
};

/**
 * 조건에 따라 최종 투명도를 계산하는 메인 함수
 */
export const getFlintWeight = (vote: number, max_vote: number, min_opacity = 0.2) => {
  // 분기 기준: 최대 투표 수가 5 이하인 경우
  if (max_vote <= 5) {
    // 단순 동등 분할 로직
    if (max_vote === 0) return 0; // 예외 처리
    return vote / max_vote;
  } else {
    // 기존의 고도화된 로직
    return getAdvancedOpacity(vote, max_vote, min_opacity);
  }
};

// 가중치 계산 전략의 공통 인터페이스
// 서로의 파라메터가 다르므로, 공통 인터페이스를 만들고, 팩토리 패턴을 통해서 구현부를 다르게 하여,
// 가중치 계산 전략을 생성.
export type WeightCalculateStrategy = (value: number, min: number, max: number) => number;

export const createMarvinWeightStrategy = (minVisible = 0.2): WeightCalculateStrategy => {
  return (value: number, min: number, max: number) => getMarvinWeight(value, min, max, minVisible);
};

export const createFlintWeightStrategy = (minOpacity = 0.2): WeightCalculateStrategy => {
  return (value: number, min: number, max: number) => getFlintWeight(value, max, minOpacity);
};

export const marvinWeightStrategy = createMarvinWeightStrategy();
export const flintWeightStrategy = createFlintWeightStrategy();
