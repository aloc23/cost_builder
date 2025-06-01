
function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
  updateTotals();
}

function updateBreakdownSum(className, targetId, toggleId) {
  const useBreakdown = document.getElementById(toggleId).checked;
  if (useBreakdown) {
    const items = document.querySelectorAll('.' + className);
    let total = 0;
    items.forEach(input => total += Number(input.value));
    document.getElementById(targetId).value = total;
  }
}

function updateTotals() {
  updateBreakdownSum("padel_overhead_item", "padel_overheads", "padel_overhead_toggle");
  updateBreakdownSum("padel_staff_item", "padel_salaries", "padel_staff_toggle");
  updateBreakdownSum("gym_overhead_item", "gym_overheads", "gym_overhead_toggle");
  updateBreakdownSum("gym_staff_item", "gym_salaries", "gym_staff_toggle");

  const padelTotal = Number(document.getElementById('padel_structure').value) +
                     Number(document.getElementById('padel_courts').value) +
                     Number(document.getElementById('padel_amenities').value) +
                     Number(document.getElementById('padel_ground').value) +
                     Number(document.getElementById('padel_maintenance')?.value || 0) +
                     Number(document.getElementById('padel_salaries').value) +
                     Number(document.getElementById('padel_overheads').value);

  const gymTotal = Number(document.getElementById('gym_equipment').value) +
                   Number(document.getElementById('gym_amenities').value) +
                   Number(document.getElementById('gym_flooring').value) +
                   Number(document.getElementById('gym_maintenance')?.value || 0) +
                   Number(document.getElementById('gym_salaries').value) +
                   Number(document.getElementById('gym_overheads').value);

  document.getElementById('padel_total').textContent = padelTotal.toLocaleString();
  document.getElementById('gym_total').textContent = gymTotal.toLocaleString();
  document.getElementById('combined_padel').textContent = padelTotal.toLocaleString();
  document.getElementById('combined_gym').textContent = gymTotal.toLocaleString();
  document.getElementById('grand_total').textContent = (padelTotal + gymTotal).toLocaleString();

  updateFinancials(padelTotal, gymTotal);
  updateChart(padelTotal, gymTotal);
}

function updateFinancials(padelTotal, gymTotal) {
  const monthlyRevenue = Number(document.getElementById('monthly_revenue').value);
  const annualRevenue = monthlyRevenue * 12;
  const annualCost = (
    Number(document.getElementById('padel_salaries').value) +
    Number(document.getElementById('padel_overheads').value) +
    Number(document.getElementById('gym_salaries').value) +
    Number(document.getElementById('gym_overheads').value)
  );
  const profit = annualRevenue - annualCost;
  const investment = padelTotal + gymTotal;
  const roiYears = investment > 0 && profit > 0 ? (investment / profit).toFixed(2) : "N/A";
  const breakeven = Math.ceil(annualCost / 12);

  document.getElementById('annual_revenue').textContent = annualRevenue.toLocaleString();
  document.getElementById('annual_cost').textContent = annualCost.toLocaleString();
  document.getElementById('annual_profit').textContent = profit.toLocaleString();
  document.getElementById('roi_years').textContent = roiYears;
  document.getElementById('breakeven_revenue').textContent = breakeven.toLocaleString();
}

let costChart;
function updateChart(padelTotal, gymTotal) {
  const ctx = document.getElementById('costChart').getContext('2d');
  if (costChart) costChart.destroy();
  costChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Padel', 'Gym'],
      datasets: [{
        data: [padelTotal, gymTotal],
        backgroundColor: ['#FFC107', '#03A9F4']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Investment Breakdown'
        }
      }
    }
  });
}

document.querySelectorAll('input[type="number"]').forEach(input => {
  input.addEventListener('input', updateTotals);
});
document.querySelectorAll('input[type="checkbox"]').forEach(input => {
  input.addEventListener('change', updateTotals);
});

window.onload = updateTotals;
