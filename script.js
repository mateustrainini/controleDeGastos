const STORAGE_KEY = 'controle-de-gastos-data';

// earnings
const earningsForm = document.getElementById('earnings-form');
const descriptionEarnings = document.getElementById('description-earnings');
const categoryEarnings = document.getElementById('category-earnings');
const amountEarnings = document.getElementById('amount-earnings');

// exepenses
const expenseForm = document.getElementById('expense-form');
const descriptionInput = document.getElementById('description');
const categoryInput = document.getElementById('category');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');

//summary
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

const data = {
    earnings: [],
    expenses: [],
    summary: {},
};

// const month = {
//    data: [earnings: [], expenses: [], summary: {}]
// };

function loadData() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return;
        }

        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
            data.expenses = parsed;
            data.earnings = [];
            data.summary = [];
            return;
        }

        data.expenses = Array.isArray(parsed.expenses) ? parsed.expenses : [];
        data.earnings = Array.isArray(parsed.earnings) ? parsed.earnings : [];
        data.summary = Array.isArray(parsed.summary) ? parsed.summary : [];
    } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error);
        data.expenses = [];
        data.earnings = [];
        data.summary = [];
    }
}

function saveData() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Erro ao salvar dados no localStorage:', error);
    }
}

function formatCurrency(value) {
    return Number(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
    });
}

function formatDateOnly(dateValue) {
    return new Date(dateValue).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

function renderExpenses() {
    expenseTableBody.innerHTML = '';

    if (data.expenses.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="4" class="empty-state">Nenhuma despesa cadastrada ainda.</td>
        `;
        expenseTableBody.appendChild(emptyRow);
        return;
    }

    data.expenses.forEach((expense) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.description}</td>
            <td>${categoryExpenseLabels[expense.category] || expense.category}</td>
            <td>${formatCurrency(expense.amount)}</td>
            <td>${expense.date}</td>
            <td>
                <button type="button" class="action-button" data-id="${expense.id}">Excluir</button>
            </td>
        `;
        expenseTableBody.appendChild(row);
    });
}

function updateSummary(cash, transport, economy) {
    let totalTransportExpenses = 0.0;
    let totalExpenses = 0.0;

    data.expenses.forEach(e => {
        if (e['category'] == 'transporte') {
            totalTransportExpenses += e['amount'];
        } else {
            totalExpenses += e['amount'];
        }
    });
    const totalAllExpenses = data.expenses.reduce((sum, item) => sum + Number(item.amount), 0);

    cashEl.textContent = formatCurrency(cash);
    transportEl.textContent = formatCurrency(transport);
    economyEl.textContent = formatCurrency(economy);
    expensesEl.textContent = formatCurrency(totalExpenses);
    transportExpensesEl.textContent = formatCurrency(totalTransportExpenses);
    totalExpensesEl.textContent = formatCurrency(totalAllExpenses);

    data.summary = {
        'cash': cash,
        'transport': transport,
        'economy': economy,
        'expenses': totalExpenses,
        'transportExpenses': totalTransportExpenses
    }

    saveData();
}

function addExpense(event) {
    event.preventDefault();

    const description = descriptionInput.value.trim();
    const category = categoryInput.value;
    const amount = parseFloat(amountInput.value);
    const date = formatDateOnly(dateInput.value);

    if (!description || !category || Number.isNaN(amount) || amount <= 0 || !date) {
        return;
    }

    const newExpense = {
        id: Date.now().toString(),
        description,
        category,
        amount,
        date,
    };

    data.expenses.push(newExpense);
    saveData();
    renderExpenses();
    updateSummary();
    window.location.reload();
    expenseForm.reset();
    descriptionInput.focus();
}

function addEarning(event) {
    event.preventDefault();

    const description = descriptionEarnings.value.trim();
    const category = categoryEarnings.value;
    const amount = parseFloat(amountEarnings.value);

    if (!description || !category || Number.isNaN(amount) || amount <= 0) {
        return;
    }

    const newEarning = {
        id: Date.now().toString(),
        description,
        category,
        amount,
        createdAt: new Date().toISOString(),
    };

    data.earnings.push(newEarning);
    saveData();
    window.location.reload();
    earningsForm.reset();
    descriptionEarnings.focus();
}

function deleteExpense(expenseId) {
    data.expenses = data.expenses.filter((expense) => expense.id !== expenseId);
    saveData();
    renderExpenses();
    window.location.reload();
}

function handleTableClick(event) {
    const target = event.target;
    if (target.matches('button[data-id]')) {
        const expenseId = target.dataset.id;
        deleteExpense(expenseId);
    }
}

function init() {
    loadData();
    renderExpenses();
    if (earningsForm) {
        earningsForm.addEventListener('submit', addEarning);
    }
    expenseForm.addEventListener('submit', addExpense);
    expenseTableBody.addEventListener('click', handleTableClick);
}

init();
