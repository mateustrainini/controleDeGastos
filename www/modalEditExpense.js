function openEditExpenseModal(index) {
    if (document.querySelector('.modal-fog')) return;

    let expense = data.expenses[index];

    const fog = document.createElement('div');
    fog.className = 'modal-fog';
    fog.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true">
            <button class="modal-close" aria-label="Fechar">&times;</button>
            <h2>Adicionar Despesa</h2>
            <form id="expense-modal-form" class="expense-form">
                <div class="form-row">
                    <label for="modal-description">Descrição</label>
                    <input type="text" id="modal-description" name="description" required>
                </div>
                <div class="form-row">
                    <label for="modal-category">Categoria</label>
                    <select id="modal-category" name="category" required>
                        <option value="">Selecione</option>
                        <option value="alimentacao">Alimentação</option>
                        <option value="transporte">Transporte</option>
                        <option value="lazer">Lazer</option>
                        <option value="outros">Outros</option>
                    </select>
                </div>
                <div class="form-row">
                    <label for="modal-amount">Valor (R$)</label>
                    <input type="number" id="modal-amount" name="amount" placeholder="0.00" step="0.01" min="0" required>
                </div>
                <div class="form-row">
                    <label for="modal-date">Data</label>
                    <input type="date" id="modal-date" name="date" required>
                </div>
                <div class="form-actions">
                    <button type="submit">Adicionar</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(fog);
    requestAnimationFrame(() => fog.classList.add('show'));
    const form = fog.querySelector('#expense-modal-form');
    const closeButton = fog.querySelector('.modal-close');
    function close() {
        fog.classList.remove('show');
        document.removeEventListener('keydown', onKey);
        setTimeout(() => fog.remove(), 240);
    }
    function onKey(e) {
        if (e.key === 'Escape') close();
    }

    closeButton.addEventListener('click', close);
    fog.addEventListener('click', e => { if (e.target === fog) close(); });
    document.addEventListener('keydown', onKey);

    let inputDescription = fog.querySelector('#modal-description');
    let selectCategory = fog.querySelector('#modal-category');
    let inputValue = fog.querySelector('#modal-amount');
    let inputDate = fog.querySelector('#modal-date');

    inputDescription.value = expense.description;
    selectCategory.value = expense.category;
    inputValue.value = expense.amount;
    inputDate.value = expense.dateISO;

    form.addEventListener('submit', event => {
        event.preventDefault();

        const description = form.querySelector('#modal-description').value.trim();
        const category = form.querySelector('#modal-category').value;
        const amount = parseFloat(form.querySelector('#modal-amount').value);
        const dateValue = form.querySelector('#modal-date').value;

        if (!description || !category || Number.isNaN(amount) || amount <= 0 || !dateValue) return;

        expense.description = description;
        expense.category = category;
        expense.amount = amount;
        expense.date = formatDateOnly(dateValue);
        expense.dateISO = dateValue;

        saveData();
        refreshUI();
        close();
    });
}