const btnEditEconomy = document.getElementById('btnEditEconomy');

let editEconomy = false;

let editCashValue = data.summary.cash;
let editEconomyValue = data.summary.economy;

function openEconomyModal() {
    if (document.querySelector('.modal-fog')) return;

    const fog = document.createElement('div');
    fog.className = 'modal-fog';
    fog.innerHTML = `
        <div id="modalEconomy" class="modal economy-modal" role="dialog" aria-modal="true">
            <button class="modal-close" aria-label="Fechar">&times;</button>
            <div class="economy-header">
                <h2>Reorganizar Economia</h2>
            </div>
            <div class="economy-current">
                <h4>Saldo atual</h4>
                <div class="economy-summary">
                    <div class="economy-summary-card">
                        <span>Caixa</span>
                        <strong id="cash">${formatCurrency(editCashValue)}</strong>
                    </div>
                    <div class="economy-summary-card">
                        <span>Economia</span>
                        <strong id="cash-economy">${formatCurrency(editEconomyValue)}</strong>
                    </div>
                </div>
            </div>
            <hr>
            <form id="economy-modal-form" class="economy-form">
                <div class="economy-field">
                    <label for="modal-category-earning">Operação</label>
                    <select id="modal-category-earning" name="category" required>
                        <option value="">Selecione</option>
                        <option value="rem">Adicionar ao caixa</option>
                        <option value="add">Economizar</option>
                    </select>
                </div>
                <div class="economy-field">
                    <label for="modal-amount-earning">Valor (R$)</label>
                    <input type="number" id="modal-amount-earning" name="amount" 
                           placeholder="0.00" step="0.01" min="0"
                           required>
                </div>
                <div class="economy-actions">
                    <button type="submit">Adicionar</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(fog);
    requestAnimationFrame(() => fog.classList.add('show'));

    const form = fog.querySelector('#economy-modal-form');
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

        const operation = form.querySelector('#modal-category-earning').value;
        const amount = parseFloat(form.querySelector('#modal-amount-earning').value);

        if (!operation || Number.isNaN(amount) || amount <= 0) return;

        if (data.summary.cash >= amount) {
            addEconomy(operation, amount);
        }else{
            alert('Quantia inválida');
        }

        editEconomy = true;

        // if (operation == "caixa") {
        //     retira de economia e joga em caixa
        //     addEconomy("rem", amount)

        // } else if (operation == "economia") {
        //     retira de caixa e joga em economia
        //     editEconomyValue += amount;
        //     editCashValue -= amount;
        // } else {
        //     return;
        // }

        refreshUI();
        close();
    });
}

if (btnEditEconomy) {
    btnEditEconomy.addEventListener('click', openEconomyModal);
    edit = true;
}