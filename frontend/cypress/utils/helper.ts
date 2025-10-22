export const createRoom = () => {
  cy.fixture('mockRoomSession.json').then((res) => {
    cy.intercept('POST', `/api/v1/rooms`, {
      statusCode: 200,
      body: res,
    }).as('createRoom');
  });
};

export const getRoomInfo = () => {
  cy.fixture('mockRoomInfo.json').then((res) => {
    cy.intercept('GET', `/api/v1/rooms/123`, {
      statusCode: 200,
      body: res,
    }).as('getRoomInfo');
  });
};

export const getDateTimeSlots = () => {
  cy.fixture('mockDataTimeSlots.json').then((res) => {
    cy.intercept('GET', `/api/v1/rooms/123/statistics/date-time-slots`, {
      statusCode: 200,
      body: res,
    });
  });
};

export const disableSSE = () => {
  cy.intercept('GET', `/api/v1/sse/rooms/123/stream`, (req) => {
    req.reply({
      statusCode: 200,
      headers: {
        'content-type': 'text/event-stream',
        'cache-control': 'no-cache',
        connection: 'keep-alive',
      },
      body: 'event: connected\ndata: {"message":"connected"}\n\n',
      delay: 10000000,
    });
  }).as('sse');
};
