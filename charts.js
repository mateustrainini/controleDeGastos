let pieChart = null;

function renderPieChart() {
    const despesasMes = data.expenses.filter(e => e.month === selectedMonth);

    const expenAlimentacao = despesasMes
        .filter(e => e.category === "alimentacao")
        .reduce((total, e) => total + Number(e.amount), 0);

    const expenTransporte = despesasMes
        .filter(e => e.category === "transporte")
        .reduce((total, e) => total + Number(e.amount), 0);

    const expenLazer = despesasMes
        .filter(e => e.category === "lazer")
        .reduce((total, e) => total + Number(e.amount), 0);

    const expenOutros = despesasMes
        .filter(e => e.category === "outros")
        .reduce((total, e) => total + Number(e.amount), 0);

    // PIE CHART - Despesas no Mês
    let divPieChart = document.getElementById('pieChart');

    if (pieChart) {
        pieChart.destroy();
    }

    pieChart = new Chart(divPieChart, {
        type: 'pie',
        data: {
            labels: [
                'Alimentação',
                'Transporte',
                'Lazer',
                'Outros'
            ],
            datasets: [{
                data: [expenAlimentacao, expenTransporte, expenLazer, expenOutros],
                backgroundColor: [
                    '#dc3545',  // Alimentação
                    '#fde400', // Transporte               
                    '#198754', // Lazer
                    '#0069cc' // Outros
                ]
            }]
        },
        options: {
            cutout: '65%',
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let total = context.dataset.data.reduce((a, b) => a + b, 0);
                            let value = context.raw;
                            let percent = ((value / total) * 100).toFixed(1);
                            return `${context.label}: ${value} (${percent}%)`;
                        }
                    }
                }
            }
        }
    });
}
renderPieChart();

//📈 GRÁFICO DE COLUNAS - Despesas por mês

const totalsPorMes = data.expenses.reduce((acc, item) => {
    const mesKey = item.month || item.dateISO?.slice(0, 7);

    if (!mesKey) return acc;

    acc[mesKey] = (acc[mesKey] || 0) + Number(item.amount || 0);
    return acc;
}, {});

const anosDisponiveis = [...new Set(
    data.expenses
        .map(item => item.month || item.dateISO?.slice(0, 7))
        .filter(Boolean)
        .map(mesKey => mesKey.slice(0, 4))
)];

const anoBase = anosDisponiveis[0] || String(new Date().getFullYear());

const mesesDoAno = Array.from({ length: 12 }, (_, index) => {
    const mesNumero = String(index + 1).padStart(2, '0');
    return `${anoBase}-${mesNumero}`;
});

const nomesMeses = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

const dadosPorMes = mesesDoAno.map((mesKey, index) => ({
    label: nomesMeses[index],
    valor: totalsPorMes[mesKey] || 0
}));

new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: {
        labels: dadosPorMes.map(item => item.label),
        datasets: [{
            label: 'Despesas por mês',
            data: dadosPorMes.map(item => item.valor),
            backgroundColor: '#dc3545',
            borderRadius: 6
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
})