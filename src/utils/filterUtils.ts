export type Filter = {
  campo: string;
  operador: string;
  valor: string | number | string[];
};

export type Sorter = {
  campo: string;
  ordem: 'ASC' | 'DESC';
};

export function buildWhereClause(filters: Filter[] = []) {
  const where: Record<string, unknown> = {};

  filters.forEach(filter => {
    const { campo, operador, valor } = filter;

    switch (operador) {
      case 'like':
        where[campo] = { contains: valor, mode: 'insensitive' };
        break;
      case '>=':
        where[campo] = { gte: valor };
        break;
      case '<=':
        where[campo] = { lte: valor };
        break;
      case 'in':
        where[campo] = { in: valor };
        break;
      default:
        where[campo] = valor;
    }
  });

  return where;
}

export function buildOrderClause(sorters: Sorter[] = []) {
  return sorters.map(sorter => ({
    [sorter.campo]: sorter.ordem.toLowerCase(),
  }));
}
