import { disableSSE } from 'cypress/utils/helper';

describe('Vote Page Test', () => {
  beforeEach(() => {
    // SSE 비활성화
    disableSSE();

    cy.fixture('rooms').as('roomsData');
    cy.fixture('dateTimeSlots').as('dateSlotsData');

    cy.get('@roomsData').then((roomsData) => {
      cy.intercept('GET', '**/api/v1/rooms/**', roomsData).as('getRoomInfo');
    });

    cy.get('@dateSlotsData').then((dateTimeSlots) => {
      cy.intercept('GET', '**/api/v1/rooms/**/statistics/date-time-slots', dateTimeSlots).as(
        'getDateTimeSlots'
      );
    });

    cy.visit('/check?id=TEST');
  });

  it('방 정보를 불러와서 표시한다', () => {
    cy.wait('@getRoomInfo');
    cy.wait('@getDateTimeSlots');

    // 방 제목이 표시되는지 확인
    cy.contains('테스트').should('be.visible');
  });

  it('로그인 모달을 통해 참가자 입장이 가능하다', () => {
    const userNickName = '앙구일구';

    cy.wait('@getRoomInfo');
    cy.wait('@getDateTimeSlots');

    // 등록 버튼 클릭 - 로그인 모달 열기
    cy.get('[aria-label="등록"]').click();

    // 모달이 열렸는지 확인
    cy.get('input').should('be.visible');

    // 닉네임 입력
    cy.get('input').type(userNickName);

    // participants POST API intercept
    cy.intercept('POST', '**/api/v1/rooms/**/participants', {
      statusCode: 200,
      body: {
        code: 200,
        success: true,
        message: null,
        data: { participantName: userNickName },
      },
    }).as('createParticipant');

    // 기존 투표 데이터 GET API intercept (URL 인코딩된 닉네임)
    cy.intercept('GET', `**/api/v1/rooms/**/votes/participants?participantName=**`, {
      statusCode: 200,
      body: {
        code: 200,
        success: true,
        message: null,
        data: {
          participantName: userNickName,
          selectedTimes: [],
        },
      },
    }).as('getParticipantVotes');

    // 입장 버튼 클릭
    cy.get('button').contains('입장').click();

    // API 호출 확인
    cy.wait('@createParticipant');
    cy.wait('@getParticipantVotes');

    // 카드 플립 애니메이션 완료 대기
    cy.wait(800);

    // 저장 버튼이 DOM에 존재하는지 확인 (로그인 성공)
    cy.get('button').contains('저장').should('exist');
  });

  it('투표 후 저장할 수 있다', () => {
    const userNickName = '앙구일구';

    cy.wait('@getRoomInfo');
    cy.wait('@getDateTimeSlots');

    // 로그인 과정
    cy.get('[aria-label="등록"]').click();
    cy.get('input').type(userNickName);

    cy.intercept('POST', '**/api/v1/rooms/**/participants', {
      statusCode: 200,
      body: {
        code: 200,
        success: true,
        data: { participantName: userNickName },
      },
    }).as('createParticipant');

    cy.intercept('GET', `**/api/v1/rooms/**/votes/participants?participantName=**`, {
      statusCode: 200,
      body: {
        code: 200,
        success: true,
        data: {
          participantName: userNickName,
          selectedTimes: [],
        },
      },
    }).as('getParticipantVotes');

    cy.get('button').contains('입장').click();
    cy.wait('@createParticipant');
    cy.wait('@getParticipantVotes');

    // 카드 플립 애니메이션 완료 대기
    cy.wait(800);

    cy.intercept('PUT', '**/api/v1/rooms/**/votes/participants', {
      statusCode: 200,
      body: {
        code: 200,
        success: true,
        message: '투표가 저장되었습니다.',
      },
    }).as('saveVote');

    // 저장 버튼 클릭 (force: true로 3D transform 이슈 우회)
    // 기다려면 매번 800ms 대기해야 해서 force 옵션 사용
    cy.get('button').contains('저장').click({ force: true });

    // 저장 API 호출 확인
    cy.wait('@saveVote');

    cy.contains('시간표 저장이 완료되었습니다!').should('be.visible');
  });

  it.only('기존 투표 데이터가 있는 경우 불러와서 표시한다', () => {
    cy.fixture('votedDateTimeSlots').then((votedDateTimeSlots) => {
      cy.intercept('GET', '**/api/v1/rooms/**/statistics/date-time-slots', votedDateTimeSlots).as(
        'getDateTimeSlotsWithVotes'
      );
    });

    cy.visit('/check?id=TEST');

    cy.wait('@getRoomInfo');
    cy.wait('@getDateTimeSlotsWithVotes');

    // 데이터가 렌더링될 때까지 약간 대기
    cy.wait(500);

    // 모든 사람이 참여 가능한 시간대 확인 (voteCount: 3, weight: 1)
    cy.get('[data-cell-id="2025-10-22T00:00"]').then(($el) => {
      console.log('찾은 요소:', $el);
      console.log('aria-label:', $el.attr('aria-label'));
      console.log('tabindex:', $el.attr('tabindex'));
      console.log('모든 속성:', $el[0]);
    });

    cy.get('[data-cell-id="2025-10-22T00:00"]')
      .should(
        'have.attr',
        'aria-label',
        '2025년 10월 22일 00:00 테스트1, 테스트2, 테스트3 참여가능'
      )
      .and('have.attr', 'tabindex', '0'); // 참가자가 있으면 tabindex는 0
  });

  it.skip('힛맵 모드로 전환하여 통계를 확인할 수 있다', () => {
    cy.wait('@getRoomInfo');
    cy.wait('@getDateTimeSlots');

    // 확인 버튼 클릭 (힛맵 모드로 전환)
    cy.get('[aria-label="확인"]').click();
  });
});
