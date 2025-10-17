describe('template spec', () => {
  it('passes', () => {
    cy.visit('localhost:3000');
    cy.contains('날짜 선택');
  });
});
