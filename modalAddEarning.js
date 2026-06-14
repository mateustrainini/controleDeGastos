const btnAddEarning = document.getElementById('btnAddEarning');

function openEarningModal() {
    if (document.querySelector('.modal-fog')) return;

    const fog = document.createElement('div');
    fog.className = 'modal-fog';
    fog.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true">
            <button class="modal-close" aria-label="Fechar">&times;</button>
            <h2>Adicionar Ganho</h2>
            <form id="earning-modal-form" class="earnings-form">
                <div class="form-row">
                    <label for="modal-description-earning">Descrição</label>
                    <input type="text" id="modal-description-earning" name="description" required>
                </div>
                <div class="form-row">
                    <label for="modal-category-earning">Categoria</label>
                    <select id="modal-category-earning" name="category" required>
                        <option value="">Selecione</option>
                        <option value="salario">Salário</option>
                        <option value="transporte">Vale Transporte</option>
                        <option value="outros">Outros</option>
                    </select>
                </div>
                <div class="form-row">
                    <label for="modal-amount-earning">Valor (R$)</label>
                    <input type="number" id="modal-amount-earning" name="amount" placeholder="0.00" step="0.01" min="0" required>
                </div>
                <div class="form-row">
                    <label for="modal-date-earning">Data</label>
                    <input type="date" id="modal-date-earning" name="date" required>
                </div>
                <div class="form-actions">
                    <button type="submit">Adicionar</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(fog);
    requestAnimationFrame(() => fog.classList.add('show'));

    const form = fog.querySelector('#earning-modal-form');
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

    form.addEventListener('submit', event => {
        event.preventDefault();

        const description = form.querySelector('#modal-description-earning').value.trim();
        const category = form.querySelector('#modal-category-earning').value;
        const amount = parseFloat(form.querySelector('#modal-amount-earning').value);

        if (!description || !category || Number.isNaN(amount) || amount <= 0) return;

        const dateValue = form.querySelector('#modal-date-earning').value; // YYYY-MM-DD
        const createdAt = dateValue || new Date().toISOString();
        const earning = {
            id: Date.now().toString(),
            description,
            category,
            amount,
            createdAt,
            month: getMonthKey(createdAt),
        };

        data.earnings.push(earning);
        saveData();
        refreshUI();
        close();
    });
}

if (btnAddEarning) {
    btnAddEarning.addEventListener('click', openEarningModal);
}
