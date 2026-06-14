const btnModalEarnings = document.querySelector('#btnModalEarnings');

function renderEarnings() {
    if (document.querySelector('.modal-fog')) return;

    const fog = document.createElement('div');
    fog.className = 'modal-fog';
    fog.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true">
            <button class="modal-close" aria-label="Fechar">&times;</button>
            <h2>Ganhos Registrados</h2>
            <div class="table-wrapper">
                <table id="earnings-table">
                    <thead>
                        <tr>
                            <th>Descrição</th>
                            <th>Categoria</th>
                            <th>Valor</th>
                            <th>Data</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    `;

    document.body.appendChild(fog);
    requestAnimationFrame(() => fog.classList.add('show'));

    const tbody = fog.querySelector('tbody');

    function fillEarningsTable() {
        const earnings = data.earnings.filter(e => (e.month || getMonthKey(e.createdAt)) === selectedMonth);
        tbody.innerHTML = '';
        if (earnings.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">Nenhum ganho cadastrado neste mês.</td>
                </tr>
            `;
            return;
        }

        earnings.forEach(e => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${e.description}</td>
                <td>${categoryEarningLabels[e.category] || e.category}</td>
                <td>${formatCurrency(e.amount)}</td>
                <td>${formatDateOnly(e.createdAt)}</td>
                <td><button type="button" class="action-button" data-id="${e.id}">Excluir</button></td>
            `;
            tbody.appendChild(row);
        });
    }

    fillEarningsTable();

    function close() {
        fog.classList.remove('show');
        document.removeEventListener('keydown', onKey);
        setTimeout(() => fog.remove(), 240);
    }

    function onKey(e) {
        if (e.key === 'Escape') close();
    }

    fog.querySelector('.modal-close').addEventListener('click', close);
    fog.addEventListener('click', e => { if (e.target === fog) close(); });
    document.addEventListener('keydown', onKey);

    tbody.addEventListener('click', e => {
        if (!e.target.matches('button[data-id]')) return;
        const id = e.target.dataset.id;
        data.earnings = data.earnings.filter(item => item.id !== id);
        saveData();
        fillEarningsTable();
        refreshUI();
    });
}

if (btnModalEarnings) {
    btnModalEarnings.addEventListener('click', renderEarnings);
}
