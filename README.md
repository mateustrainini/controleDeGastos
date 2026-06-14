# Controle de Gastos

Aplicativo web simples para registrar ganhos e despesas mensais, com filtros por mês e resumo financeiro.

## Funcionalidades

- Adicionar Ganhos e Despesas via modais separados.
- Filtrar lançamentos por mês (seletor no topo).
- Visualizar lista de ganhos em modal e excluir entradas.
- Resumo mensal com cálculo de caixa, transporte, economia e total de gastos.

## Regras de economia

- Para cada lançamento de categoria `salario` aplica-se regra fixa:
  - Salário >= 700 → economia = 500
  - 300 < Salário < 700 → economia = 300
  - Caso contrário → economia = 0
- A economia é subtraída do salário para compor o `Caixa`.

## Estrutura de dados (localStorage)

Chave: `controle-de-gastos-data`
Formato armazenado:

{
  "earnings": [ /* { id, description, category, amount, createdAt, month } */ ],
  "expenses": [ /* { id, description, category, amount, date, dateISO, month } */ ],
  "summary": { /* resumo do mês selecionado */ }
}

- `month` é salvo como `YYYY-MM` para permitir filtros por mês.
- Ganhos agora incluem campo de data no modal para permitir registrar em meses anteriores.

## Uso

1. Abra `index.html` no navegador.
2. Selecione o mês no seletor `Mês:` para ver lançamentos específicos.
3. Clique em `+ Adicionar Ganho` ou `+ Adicionar Despesa` para abrir o modal correspondente.
4. Preencha os campos e confirme — os dados são salvos no `localStorage`.
5. Em `Ganhos Registrados` você pode visualizar e excluir ganhos do mês selecionado.

## Observações e troubleshooting

- Se algo não aparecer, abra o console do navegador (F12) para ver erros.
- Arquivo `calculate.js` foi removido da carga inicial porque gerava conflito; a lógica está consolidada em `script.js`.
