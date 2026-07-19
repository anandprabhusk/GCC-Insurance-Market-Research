// KPI Patch — runs after DOM load to update the AI Ideas KPI strip
// Reflects Batch 1 (11 new cards) + Batch 2 (17 new cards) additions
(function(){
  var kpiCards = document.querySelectorAll('[data-sec="ai-ideas"] .kpi-card');
  if(!kpiCards.length) return;
  // Card 0: Total Ideas 48 -> 76
  var n0 = kpiCards[0].querySelector('.kpi-num');
  if(n0) n0.textContent = '76';
  var d0 = kpiCards[0].querySelector('.kpi-delta');
  if(d0) d0.textContent = 'Across 8 domains';
  // Card 1: Quick Wins 22 -> 35
  var n1 = kpiCards[1].querySelector('.kpi-num');
  if(n1) n1.textContent = '35';
  var d1 = kpiCards[1].querySelector('.kpi-delta');
  if(d1) d1.textContent = '<90 days';
  // Card 2: Revenue Opportunity — keep
  // Card 3: Global Precedents 31 -> 48
  var n3 = kpiCards[3].querySelector('.kpi-num');
  if(n3) n3.textContent = '48';
})();
