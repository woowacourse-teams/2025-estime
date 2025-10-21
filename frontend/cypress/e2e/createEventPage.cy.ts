describe('방 생성 플로우', () => {
  beforeEach(() => {
    cy.visit('localhost:3000');
  });

  it('모든 필수 입력값이 주어지면 방이 정상적으로 생성된다.', () => {
    const date = new Date();
    const day = date.getDate();
    cy.get(`[role="button"][aria-label="${day}일 선택 안되어 있음"]`).click();
    cy.get('[aria-label="약속 제목 입력 필드"]').type('아인슈타임 회식');

    cy.contains('약속 만들기').click();

    cy.url().should('include', '/check');
    cy.contains('방 생성이 완료되었습니다.').should('be.visible');
  });

  describe('필수 입력값이 누락되면 방이 생성되지 않는다.', () => {
    it('날짜를 선택하지 않고 약속 제목을 입력하지 않으면 방 생성 버튼 클릭 시 경고 토스트가 표시된다.', () => {
      cy.contains('약속 만들기').click();
      cy.contains('날짜와 기본 설정을 선택해주세요!').should('be.visible');
    });

    it('날짜를 선택하지 않고 방 생성 버튼 클릭 시 경고 토스트가 표시된다.', () => {
      cy.get('[aria-label="약속 제목 입력 필드"]').type('아인슈타임 회식');

      cy.contains('약속 만들기').click();
      cy.contains('날짜를 선택해주세요!').should('be.visible');
    });

    it('약속 제목을 입력하지 않고 방 생성 버튼 클릭 시 경고 토스트가 표시된다.', () => {
      const date = new Date();
      const day = date.getDate();
      cy.get(`[role="button"][aria-label="${day}일 선택 안되어 있음"]`).click();

      cy.contains('약속 만들기').click();
      cy.contains('제목과 시간을 선택해주세요!').should('be.visible');
    });
  });
});
describe('날짜 선택 오류 플로우', () => {
  beforeEach(() => {
    cy.visit('localhost:3000');
  });

  it('날짜 7개 이상 선택 시 경고 토스트가 표시된다.', () => {
    const fixedDate = new Date(2025, 9, 21);
    cy.clock(fixedDate.getTime(), ['Date']);

    cy.visit('localhost:3000');

    const datesToClick = [21, 22, 23, 24, 25, 26, 27, 28];

    datesToClick.forEach((day) => {
      cy.get(`[role="button"][aria-label="${day}일 선택 안되어 있음"]`).click();
    });

    cy.contains('최대 7개의 날짜를 선택할 수 있습니다.').should('be.visible');
  });

  it('과거 날짜 선택 시 경고 토스트가 표시된다.', () => {
    const fixedDate = new Date(2025, 9, 21);
    cy.clock(fixedDate.getTime(), ['Date']);
    cy.get(`[role="button"][aria-label="${fixedDate.getDate() - 1}일 선택 안되어 있음"]`).click();

    cy.contains('과거 날짜는 선택할 수 없습니다.').should('be.visible');
  });
});
