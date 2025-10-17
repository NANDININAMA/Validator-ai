const { computeScoreAndClass } = require('../utils/scoring');

test('computeScoreAndClass returns classification and score', () => {
  const payload = {
    problem: 'We have a clear problem description with decent length explanation to pass threshold.',
    solution: 'We propose a viable solution that addresses the need.',
    market: 'Market details are present and reasonable.',
    revenueModel: 'Subscription model is defined.',
    team: 'Small founding team with relevant experience.'
  };
  const { score, classification } = computeScoreAndClass(payload);
  expect(typeof score).toBe('number');
  expect(['Low', 'Moderate', 'High']).toContain(classification);
});
