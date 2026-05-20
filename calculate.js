let cash = 0.0;
let transport = 0.0;
let economy = 0.0;

let expenses = 0.0;
let transportExpenses = 0.0;

function calcEarnings() {
    data.earnings.forEach(e => {
        if (e['category'] == 'salario') {
            cash = e['amount'];
            if (cash >= 700) {
                economy += 500;

                cash = cash - 500;
            } else if(cash > 300){
                economy += 300;

                cash = cash - 300;
            }
        } else if (e['category'] == 'transporte') {
            transport = e['amount'];
        }
    });

    data.expenses.forEach(e => {
        if (e['category'] == 'transporte') {
            transportExpenses += e['amount'];
        } else {
            expenses += e['amount']
        }
    });

    cash -= expenses;
    transport -= transportExpenses;

    updateSummary(cash, transport, economy);
}
calcEarnings()