import { buildOrderClause, buildWhereClause, Filter, Sorter } from '../filterUtils';

describe('filterUtils', () => {
  it('builds a where clause with filters', () => {
    const filter = [
      { campo: 'nome', operador: 'like', valor: 'teste' },
      { campo: 'preco', operador: '>=', valor: 0 },
      { campo: 'preco', operador: '<=', valor: 20 },
      { campo: 'bairro', operador: 'in', valor: ['Centro', 'Bodocongó'] },
      { campo: 'categoria', operador: 'in', valor: ['Livro'] },
      { campo: 'genero', operador: 'hasSome', valor: ['Romance', 'Drama'] },
      { campo: 'concordaVender', operador: '=', valor: true },
    ];

    const result = buildWhereClause(filter);

    expect(result).toEqual({
      nome: { contains: 'teste', mode: 'insensitive' },
      preco: { gte: 0, lte: 20 },
      endereco: { bairro: { in: ['Centro', 'Bodocongó'] } },
      categoria: { in: ['Livro'] },
      genero: { hasSome: ['Romance', 'Drama'] },
      concordaVender: true,
    });
  });

  it('builds an order clause with sorters', () => {
    const sorter: Sorter = { campo: 'nome', ordem: 'DESC' };

    const result = buildOrderClause([sorter]);

    expect(result).toEqual([{ nome: 'desc' }]);
  });
});
