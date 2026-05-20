const btnModal = document.querySelector('#btnModalEarnings');

loadData();

function renderEarnings() {
    // prevent duplicate modals
    if (document.querySelector('.modal-fog')) return;

    let fog = document.createElement('div');
    fog.className = 'modal-fog';
    fog.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <button id="btnClose" aria-label="Fechar">X</button>
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
                    <tbody>

                    </tbody>
                </table>
            </div>
      </div>
    `;

    const tbody = fog.querySelector('tbody');
    if (data.earning == '' || data.earnings == null) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">Nenhuma despesa cadastrada ainda.</td>
            </tr>
        `;
    } else if (data.earnings != '' && data.earnings !== null) {
        // append rows instead of overwriting so all earnings appear
        data.earnings.forEach(e => {
            tbody.innerHTML += `
            <tr>
                <td>${e.description}</td>
                <td>${categoryEarningLabels[e.category] || e.category}</td>
                <td>${formatCurrency(e.amount)}</td>
                <td>${formatDateOnly(e.createdAt)}</td>
                <td>
                    <button type="button" class="action-button" value="${e.id}">Excluir</button>
                </td>
            </tr>
        `;

            let btnDelete = tbody.querySelector('.action-button');
            btnDelete.addEventListener('click', () => deleteEarning(e.id));
        });
    }

    document.body.append(fog);

    // mark modal as open in storage so it survives reload
    localStorage.setItem('earningsModalOpen', '1');

    // trigger show class to run transitions
    requestAnimationFrame(() => fog.classList.add('show'));

    const btnClose = fog.querySelector('#btnClose');

    function closeModal() {
        fog.classList.remove('show');
        document.removeEventListener('keydown', onKeyDown);
        setTimeout(() => {
            fog.remove();
            localStorage.removeItem('earningsModalOpen');
        }, 240);
    }

    btnClose.addEventListener('click', () => {
        closeModal();
    });

    // click outside modal (on the fog) closes it
    fog.addEventListener('click', (e) => {
        if (e.target === fog) closeModal();
    });

    // ESC closes modal
    function onKeyDown(e) {
        if (e.key === 'Escape') closeModal();
    }
    document.addEventListener('keydown', onKeyDown);
}

if (btnModal) {
    btnModal.addEventListener('click', renderEarnings);
}

// reopen modal after reload if was open
if (localStorage.getItem('earningsModalOpen') === '1') {
    // small timeout to ensure scripts and data are ready
    setTimeout(() => {
        renderEarnings();
    }, 50);
}

function deleteEarning(earningId) {
    data.earnings = data.earnings.filter((earning) => earning.id !== earningId);
    saveData();
    renderEarnings();
    window.location.reload();
}