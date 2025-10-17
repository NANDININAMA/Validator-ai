// Very simple scoring example: you can make it more advanced with NLP later.
function scoreTextField(text) {
  if (!text) return 0;
  const len = text.trim().length;
  if (len < 30) return 2;
  if (len < 100) return 5;
  if (len < 300) return 8;
  return 10;
}

function computeScoreAndClass({ problem, solution, market, revenueModel, team }) {
  // weights sum to 1
  const weights = {
    problem: 0.25,
    solution: 0.25,
    market: 0.2,
    revenueModel: 0.15,
    team: 0.15
  };

  const sProblem = scoreTextField(problem);
  const sSolution = scoreTextField(solution);
  const sMarket = scoreTextField(market);
  const sRevenue = scoreTextField(revenueModel);
  const sTeam = scoreTextField(team);

  // normalize into 0-100
  const rawScore = (sProblem * weights.problem + sSolution * weights.solution + sMarket * weights.market + sRevenue * weights.revenueModel + sTeam * weights.team) / 10;
  const score = Math.round(rawScore * 100);

  let classification = 'Low';
  if (score >= 70) classification = 'High';
  else if (score >= 40) classification = 'Moderate';

  const suggestions = [];
  if (sProblem < 5) suggestions.push('Strengthen the problem statement with specifics and evidence.');
  if (sSolution < 5) suggestions.push('Describe a clearer, testable solution and differentiation.');
  if (sMarket < 5) suggestions.push('Quantify target market size and personas.');
  if (sRevenue < 5) suggestions.push('Explain pricing and revenue channels in more detail.');
  if (sTeam < 5) suggestions.push('Highlight team roles, experience, and execution plan.');
  if (classification === 'Low') suggestions.push('Consider narrowing scope and validating assumptions with small experiments.');

  const breakdown = { problem: sProblem, solution: sSolution, market: sMarket, revenueModel: sRevenue, team: sTeam };

  return { score, classification, suggestions, breakdown };
}

module.exports = { computeScoreAndClass, scoreTextField };
