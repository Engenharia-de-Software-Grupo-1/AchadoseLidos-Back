import { CategoriaProduto, EstadoConservacaoProduto, StatusConta, StatusProduto } from '@prisma/client';

export const DELETED_CONTA = {
  email: '-',
  senha: '-',
  status: StatusConta.EXCLUIDA,
  resetToken: null,
  resetTokenExpiresAt: null,
};

export const DELETED_SEBO = {
  nome: 'Sebo Excluído',
  cpfCnpj: '-',
  concordaVender: false,
  telefone: null,
  horarioFuncionamento: null,
  biografia: null,
  estanteVirtual: null,
  instagram: null,
  curadores: null,
  historia: null,
  fotoPerfil: null,
  mercadoLivre: null,
  enjoei: null,
  amazon: null,
};

export const DELETED_ENDERECO = {
  cep: '--------',
  estado: '--',
  cidade: '-',
  bairro: '-',
  rua: '-',
  numero: '-',
  complemento: null,
  ehPublico: false,
};

export const DELETED_USUARIO = {
  nome: 'Usuário Excluído',
  cpf: '-----------',
  telefone: '-----------',
  biografia: null,
  twitter: null,
  instagram: null,
  skoob: null,
  goodreads: null,
  fotoPerfil: null,
};

export const DELETED_PRODUTO = {
  nome: 'Produto Excluído',
  preco: 0,
  status: StatusProduto.EXCLUIDO,
  categoria: CategoriaProduto.OUTRO,
  generos: ['Outro'],
  qtdEstoque: 0,
  estadoConservacao: EstadoConservacaoProduto.DESCONHECIDO,
  anoEdicao: null,
  anoLancamento: null,
  autores: null,
  descricao: null,
};
