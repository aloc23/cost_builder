
function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
  updateTotals();
}

function updateTotals() {
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
  const revCourts = +document.getElementById('rev_courts').value;
  const revGym = +document.getElementById('rev_gym').value;
  const revCoach = +document.getElementById('rev_coaching').value;
  const revOther = +document.getElementById('rev_other').value;

  const monthlyRevenue = revCourts + revGym + revCoach + revOther;
  const annualRevenue = monthlyRevenue * 12;

  document.getElementById('monthly_revenue_display').textContent = monthlyRevenue.toLocaleString();

  // VAT
  const vatChecked = document.getElementById('include_vat').checked;
  const vatRate = +document.getElementById('vat_rate').value / 100;
  if (vatChecked) {
    document.getElementById('vat_section').style.display = 'block';
    const vatAmount = monthlyRevenue * vatRate;
    document.getElementById('vat_amount').textContent = vatAmount.toFixed(2);
    document.getElementById('revenue_with_vat').textContent = (monthlyRevenue + vatAmount).toFixed(2);
  } else {
    document.getElementById('vat_section').style.display = 'none';
  }

  // Costs
  const annualCost = (
    +document.getElementById('padel_salaries').value +
    +document.getElementById('padel_overheads').value +
    +document.getElementById('gym_salaries').value +
    +document.getElementById('gym_overheads').value
  );

  const profit = annualRevenue - annualCost;
  const roiYears = investment > 0 && profit > 0 ? (investment / profit).toFixed(2) : "N/A";

  document.getElementById('annual_revenue').textContent = annualRevenue.toLocaleString();
  document.getElementById('annual_cost').textContent = annualCost.toLocaleString();
  document.getElementById('annual_profit').textContent = profit.toLocaleString();
  document.getElementById('roi_years').textContent = roiYears;

  updateChart(padelTotal, gymTotal);
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
        legend: { position: 'bottom' },
        title: { display: true, text: 'Investment Breakdown' }
      }
    }
  });
}

document.querySelectorAll('input[type="number"]').forEach(input => {
  input.addEventListener('input', updateTotals);
});
document.getElementById('include_vat').addEventListener('change', updateTotals);

window.onload = updateTotals;
