CREATE TABLE IF NOT EXISTS conta (
  id SERIAL NOT NULL,
  email VARCHAR(100) NOT NULL,
  senha VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL, /* enum TipoConta (SEBO, USUARIO) */
  status VARCHAR(50) NOT NULL, /* enum StatusConta (ATIVA, EXCLUIDA) */
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT pk_conta PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS sebo (
  id SERIAL NOT NULL,
  conta_id INTEGER NOT NULL,
  nome VARCHAR(100) NOT NULL,
  cpf_cnpj VARCHAR(16) NOT NULL,
  concorda_vender BOOL NOT NULL,
  telefone VARCHAR(11),
  biografia TEXT,
  estante_virtual VARCHAR(100),
  instagram VARCHAR(100),
  curadores VARCHAR(255),
  historia TEXT,
  foto_perfil VARCHAR(255),
  CONSTRAINT pk_sebo PRIMARY KEY (id),
  CONSTRAINT fk_sebo_conta FOREIGN KEY (conta_id) REFERENCES conta (id)
);

CREATE TABLE IF NOT EXISTS endereco_sebo (
  id SERIAL NOT NULL,
  sebo_id INTEGER NOT NULL,
  cep VARCHAR(8) NOT NULL,
  estado VARCHAR(2) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  bairro VARCHAR(100) NOT NULL,
  rua VARCHAR(100) NOT NULL,
  numero VARCHAR(100) NOT NULL,
  compl VARCHAR(255),
  eh_publico BOOL NOT NULL,
  CONSTRAINT pk_sebo PRIMARY KEY (id),
  CONSTRAINT fk_endereco_sebo FOREIGN KEY (sebo_id) REFERENCES sebo (id)
);

CREATE TABLE IF NOT EXISTS foto_sebo (
  sebo_id INTEGER NOT NULL,
  url VARCHAR(255) NOT NULL,
  CONSTRAINT pk_foto_sebo PRIMARY KEY (sebo_id, foto),
  CONSTRAINT fk_foto_sebo FOREIGN KEY (sebo_id) REFERENCES sebo (id)
);

CREATE TABLE IF NOT EXISTS usuario (
  id SERIAL NOT NULL,
  conta_id INTEGER NOT NULL,
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(11) NOT NULL,
  telefone VARCHAR(11) NOT NULL,
  biografia TEXT,
  twitter VARCHAR(100),
  instagram VARCHAR(100),
  skoob VARCHAR(100),
  goodreads VARCHAR(100),
  foto_perfil VARCHAR(255),
  CONSTRAINT pk_usuario PRIMARY KEY (id),
  CONSTRAINT fk_usuario_conta FOREIGN KEY (conta_id) REFERENCES conta (id)
);

CREATE TABLE IF NOT EXISTS pedido (
  id SERIAL NOT NULL,
  sebo_id INTEGER NOT NULL,
  usuario_id INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL, /* enum StatusPedido (PENDENTE, CONCLUIDO, CANCELADO) */
  qtd_produtos INTEGER NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT pk_pedido PRIMARY KEY (id),
  CONSTRAINT fk_pedido_sebo FOREIGN KEY (sebo_id) REFERENCES sebo (id),
  CONSTRAINT fk_pedido_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id)
);

CREATE TABLE IF NOT EXISTS produto (
  id SERIAL NOT NULL,
  sebo_id INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL, /* enum StatusProduto (ATIVO (?), EXCLUIDO) */
  nome VARCHAR(255) NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  categoria VARCHAR(100) NOT NULL, /* enum CategoriaProduto (LIVRO, DISCO, ..) */
  qtd_estoque INTEGER NOT NULL,
  estado_conservacao VARCHAR(50) NOT NULL,
  ano_edicao INTEGER,
  ano_lancamento INTEGER,
  autores VARCHAR(255),
  descricao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT pk_produto PRIMARY KEY (id),
  CONSTRAINT fk_produto_sebo FOREIGN KEY (sebo_id) REFERENCES sebo (id)
);

CREATE TABLE IF NOT EXISTS produto_fotos (
  produto_id INTEGER NOT NULL,
  url VARCHAR(255) NOT NULL,
  CONSTRAINT pk_produto_fotos PRIMARY KEY (produto_id, foto),
  CONSTRAINT fk_produto_fotos FOREIGN KEY (produto_id) REFERENCES produto (id)
);

CREATE TABLE IF NOT EXISTS favoritos (
  usuario_id INTEGER NOT NULL,
  produto_id INTEGER NOT NULL,
  CONSTRAINT pk_favoritos PRIMARY KEY (usuario_id, produto_id),
  CONSTRAINT fk_favoritos_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id),
  CONSTRAINT fk_favoritos_produto FOREIGN KEY (produto_id) REFERENCES produto (id)
);

CREATE TABLE IF NOT EXISTS cesta (
  usuario_id INTEGER NOT NULL,
  produto_id INTEGER NOT NULL,
  quantidade INTEGER NOT NULL,
  CONSTRAINT pk_cesta PRIMARY KEY (usuario_id, produto_id),
  CONSTRAINT fk_cesta_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id),
  CONSTRAINT fk_cesta_produto FOREIGN KEY (produto_id) REFERENCES produto (id)
);

CREATE TABLE  IF NOT EXISTS pedido_produtos (
  pedido_id INTEGER NOT NULL,
  produto_id INTEGER NOT NULL,
  quantidade INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL, /* enum StatusProdutoPedido (PENDENTE, CONFIRMADO, CANCELADO) */
  CONSTRAINT pk_pedido_produto PRIMARY KEY (pedido_id, produto_id),
  CONSTRAINT fk_pedido FOREIGN KEY (pedido_id) REFERENCES pedido(id),
  CONSTRAINT fk_produto FOREIGN KEY (produto_id) REFERENCES produto(id)
);