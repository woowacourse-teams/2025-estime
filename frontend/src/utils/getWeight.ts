export const getSimpleWeight = (vote: number, participantCount: number) => {
  const perOnePersonWeight = 1 / participantCount;
  return vote * perOnePersonWeight;
};
// 가중치 계산 전략의 공통 인터페이스
// 서로의 파라메터가 다르므로, 공통 인터페이스를 만들고, 팩토리 패턴을 통해서 구현부를 다르게 하여,
// 가중치 계산 전략을 생성.
// 향후에 AB 테스트처럼 쓰는데, 구현 인터페이스가 다를수 있어서 이렇게 유지.
export type WeightCalculateStrategy = (value: number, min: number, max: number) => number;

export const createSimpleWeightStrategy = (): WeightCalculateStrategy => {
  return (value: number, min: number, max: number) => getSimpleWeight(value, max);
};

export const weightCalculateStrategy = createSimpleWeightStrategy();
