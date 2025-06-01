
function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
  updateTotals();
}

function sumInputs(selector) {
  return [...document.querySelectorAll(selector)].reduce((sum, input) => sum + (+input.value || 0), 0);
}

function updateBreakdownSum(selector, toggleId, totalId) {
  if (document.getElementById(toggleId).checked) {
    document.getElementById(totalId).value = sumInputs(selector);
  }
}

function updateTotals() {
  updateBreakdownSum(".padel_overhead_item", "padel_overhead_toggle", "padel_overheads");
  updateBreakdownSum(".padel_staff_item", "padel_staff_toggle", "padel_salaries");
  updateBreakdownSum(".gym_overhead_item", "gym_overhead_toggle", "gym_overheads");
  updateBreakdownSum(".gym_staff_item", "gym_staff_toggle", "gym_salaries");

  const padelTotal = +document.getElementById('padel_structure').value +
                     +document.getElementById('padel_courts').value +
                     +document.getElementById('padel_amenities').value +
                     +document.getElementById('padel_ground').value +
                     +document.getElementById('padel_overheads').value +
                     +document.getElementById('padel_salaries').value;

  const gymTotal = +document.getElementById('gym_equipment').value +
                   +document.getElementById('gym_amenities').value +
                   +document.getElementById('gym_flooring').value +
                   +document.getElementById('gym_overheads').value +
                   +document.getElementById('gym_salaries').value;

  document.getElementById('padel_total').textContent = padelTotal.toLocaleString();
  document.getElementById('gym_total').textContent = gymTotal.toLocaleString();
  document.getElementById('combined_padel').textContent = padelTotal.toLocaleString();
  document.getElementById('combined_gym').textContent = gymTotal.toLocaleString();
  document.getElementById('grand_total').textContent = (padelTotal + gymTotal).toLocaleString();

  updateRevenue(padelTotal + gymTotal);
}

function updateRevenue(investment) {
  const courts = +document.getElementById('rev_courts').value;
  const gym = +document.getElementById('rev_gym').value;
  const coaching = +document.getElementById('rev_coaching').value;
  const other = +document.getElementById('rev_other').value;

  const monthlyRevenue = courts + gym + coaching + other;
  const annualRevenue = monthlyRevenue * 12;
  document.getElementById('monthly_revenue_display').textContent = monthlyRevenue.toLocaleString();

  const vatChecked = document.getElementById('include_vat').checked;
  const vatRate = +document.getElementById('vat_rate').value / 100;
  const vatAmount = monthlyRevenue * vatRate;

  if (vatChecked) {
    document.getElementById('vat_section').style.display = 'block';
    document.getElementById('vat_amount').textContent = vatAmount.toFixed(2);
    document.getElementById('revenue_with_vat').textContent = (monthlyRevenue + vatAmount).toFixed(2);
  } else {
    document.getElementById('vat_section').style.display = 'none';
  }

  const annualCost = +document.getElementById('padel_salaries').value +
                     +document.getElementById('padel_overheads').value +
                     +document.getElementById('gym_salaries').value +
                     +document.getElementById('gym_overheads').value;

  const profit = annualRevenue - annualCost;
  const roi = investment > 0 && profit > 0 ? (investment / profit).toFixed(2) : "N/A";

  document.getElementById('annual_revenue').textContent = annualRevenue.toLocaleString();
  document.getElementById('annual_cost').textContent = annualCost.toLocaleString();
  document.getElementById('annual_profit').textContent = profit.toLocaleString();
  document.getElementById('roi_years').textContent = roi;

  updateChart(padelTotal = investment - gymTotal, gymTotal);
}

let costChart;
function updateChart(padel, gym) {
  const ctx = document.getElementById('costChart').getContext('2d');
  if (costChart) costChart.destroy();
  costChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Padel', 'Gym'],
      datasets: [{
        data: [padel, gym],
        backgroundColor: ['#FFC107', '#2196F3']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: true, text: 'Investment Breakdown' }
      }
    }
  });
}

document.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', updateTotals);
});
document.getElementById('include_vat').addEventListener('change', updateTotals);

window.onload = updateTotals;
