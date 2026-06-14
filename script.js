const STORAGE_KEY = 'controle-de-gastos-data';

const cashEl = document.getElementById('cash');
const transportEl = document.getElementById('cash-transport');
const economyEl = document.getElementById('cash-economy');
const expensesEl = document.getElementById('expenses');
const transportExpensesEl = document.getElementById('transport-expenses');
const totalExpensesEl = document.getElementById('total-expenses');
const expenseTableBody = document.querySelector('#expense-table tbody');

const categoryEarningLabels = {
    salario: 'Salário',
    transporte: 'Vale Transporte',
    outros: 'Outros',
};

const categoryExpenseLabels = {
    alimentacao: 'Alimentação',
    transporte: 'Transporte',
    lazer: 'Lazer',
    outros: 'Outros',
};

const currentMonth = new Date().toISOString().slice(0, 7);
let selectedMonth = currentMonth;

const data = {
    earnings: [],
    expenses: [],
    summary: {},
};

function loadData() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return;

        const parsed = JSON.parse(stored);

        data.expenses = Array.isArray(parsed.expenses) ? parsed.expenses : [];
        data.earnings = Array.isArray(parsed.earnings) ? parsed.earnings : [];
        data.summary = typeof parsed.summary === 'object' && !Array.isArray(parsed.summary) ? parsed.summary : {};
    } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error);
        data.expenses = [];
        data.earnings = [];
        data.summary = {};
    }
}

function saveData() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Erro ao salvar dados no localStorage:', error);
    }
}

function getMonthKey(dateStr) {
    if (!dateStr) return '';
    if (/^\d{4}-\d{2}/.test(dateStr)) return dateStr.slice(0, 7);
    const parts = dateStr.split('/');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}`;
    return '';
}

function formatCurrency(value) {
    return Number(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
    });
}

function formatDateOnly(dateValue) {
    const d = new Date(dateValue + (dateValue.length === 10 ? 'T00:00:00' : ''));
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function monthLabel(ym) {
    if (!ym) return '';
    const [year, month] = ym.split('-');
    const d = new Date(Number(year), Number(month) - 1, 1);
    return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

function buildMonthOptions() {
    const months = new Set();
    months.add(currentMonth);

    data.expenses.forEach(e => {
        const m = e.month || getMonthKey(e.date);
        if (m) months.add(m);
    });

    data.earnings.forEach(e => {
        const m = e.month || getMonthKey(e.createdAt);
        if (m) months.add(m);
    });

    return Array.from(months).sort().reverse();
}

function renderMonthFilter() {
    const existing = document.getElementById('month-filter-bar');
    if (existing) existing.remove();

    const bar = document.createElement('div');
    bar.id = 'month-filter-bar';
    bar.className = 'month-filter-bar';

    const months = buildMonthOptions();
    const select = document.createElement('select');
    select.id = 'month-select';

    months.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = monthLabel(m);
        if (m === selectedMonth) opt.selected = true;
        select.appendChild(opt);
    });

    select.addEventListener('change', () => {
        selectedMonth = select.value;
        renderExpenses();
        recalcSummary();
    });

    const label = document.createElement('label');
    label.htmlFor = 'month-select';
    label.textContent = 'Mês:';

    bar.appendChild(label);
    bar.appendChild(select);

    const summarySection = document.querySelector('.summary-section');
    summarySection.parentNode.insertBefore(bar, summarySection);
}

function getFilteredExpenses() {
    return data.expenses.filter(e => (e.month || getMonthKey(e.date)) === selectedMonth);
}

function getFilteredEarnings() {
    return data.earnings.filter(e => (e.month || getMonthKey(e.createdAt)) === selectedMonth);
}

function recalcSummary() {
    const monthExpenses = getFilteredExpenses();
    const monthEarnings = getFilteredEarnings();

    // Compute initial pools from earnings
    let totalTransportEarning = 0;
    let totalOtherEarnings = 0;
    let salaryCash = 0;
    let economy = 0;

    monthEarnings.forEach(e => {
        const amt = Number(e.amount);
        if (e.category === 'transporte') {
            totalTransportEarning += amt;
        } else if (e.category === 'salario') {
            let econ = 0;
            if (amt >= 700) econ = 500;
            else if (amt > 300) econ = 300;
            economy += econ;
            salaryCash += amt - econ;
        } else {
            totalOtherEarnings += amt;
        }
    });

    let remCash = salaryCash + totalOtherEarnings; // available cash after applying economy
    let remTransport = totalTransportEarning;
    let remEconomy = economy;

    // Totals for display (original expense sums)
    let totalTransportExpenses = 0;
    let totalOtherExpenses = 0;

    // Helper to get ISO date for sorting
    function expenseISO(e) {
        if (e.dateISO) return e.dateISO;
        if (e.date && /\d{2}\/\d{2}\/\d{4}/.test(e.date)) {
            const [d, m, y] = e.date.split('/');
            return `${y}-${m}-${d}`;
        }
        return '0000-00-00';
    }

    // Sort expenses chronologically to apply deductions in order
    const expensesSorted = monthExpenses.slice().sort((a, b) => {
        return (expenseISO(a) > expenseISO(b)) ? 1 : -1;
    });

    expensesSorted.forEach(e => {
        const amt = Number(e.amount);
        if (e.category === 'transporte') totalTransportExpenses += amt;
        else totalOtherExpenses += amt;

        let remaining = amt;
        if (e.category === 'transporte') {
            const fromTransport = Math.min(remTransport, remaining);
            remTransport -= fromTransport;
            remaining -= fromTransport;
        }

        if (remaining > 0) {
            const fromCash = Math.min(remCash, remaining);
            remCash -= fromCash;
            remaining -= fromCash;
        }

        if (remaining > 0) {
            const fromEcon = Math.min(remEconomy, remaining);
            remEconomy -= fromEcon;
            remaining -= fromEcon;
        }

        // If remaining > 0 here, overall funds insufficient — leave remaining debt (not handled)
    });

    const totalAll = totalTransportExpenses + totalOtherExpenses;

    cashEl.textContent = formatCurrency(remCash);
    transportEl.textContent = formatCurrency(remTransport);
    economyEl.textContent = formatCurrency(remEconomy);
    expensesEl.textContent = formatCurrency(totalOtherExpenses);
    transportExpensesEl.textContent = formatCurrency(totalTransportExpenses);
    totalExpensesEl.textContent = formatCurrency(totalAll);

    data.summary = {
        cash: remCash,
        transport: remTransport,
        economy: remEconomy,
        expenses: totalOtherExpenses,
        transportExpenses: totalTransportExpenses,
        totalAll,
        month: selectedMonth,
    };

    saveData();
}

function renderExpenses() {
    expenseTableBody.innerHTML = '';
    const filtered = getFilteredExpenses();

    if (filtered.length === 0) {
        expenseTableBody.innerHTML = `
            <tr><td colspan="5" class="empty-state">Nenhuma despesa cadastrada neste mês.</td></tr>
        `;
        return;
    }

    filtered.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.description}</td>
            <td>${categoryExpenseLabels[expense.category] || expense.category}</td>
            <td>${formatCurrency(expense.amount)}</td>
            <td>${expense.date}</td>
            <td><button type="button" class="action-button" data-id="${expense.id}">Excluir</button></td>
        `;
        expenseTableBody.appendChild(row);
    });
}

function deleteExpense(id) {
    data.expenses = data.expenses.filter(e => e.id !== id);
    saveData();
    renderMonthFilter();
    renderExpenses();
    recalcSummary();
}

expenseTableBody.addEventListener('click', e => {
    if (e.target.matches('button[data-id]')) deleteExpense(e.target.dataset.id);
});

function refreshUI() {
    renderMonthFilter();
    renderExpenses();
    recalcSummary();
}

function init() {
    loadData();
    refreshUI();
}

init();
