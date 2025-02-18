CREATE TABLE perfil (
  id SERIAL NOT NULL,
  email VARCHAR(100) NOT NULL,
  senha VARCHAR(255) NOT NULL,
  eh_sebo BOOL NOT NULL,
  CONSTRAINT pk_perfil PRIMARY KEY (id)
);

CREATE TABLE sebo (
  id SERIAL NOT NULL,
  id_perfil INTEGER NOT NULL,
  nome VARCHAR(100) NOT NULL,
  cpf_cnpj VARCHAR(16) NOT NULL,
  email VARCHAR(100) NOT NULL,
  senha VARCHAR(255) NOT NULL,
  concorda_vender BOOL NOT NULL,
  telefone VARCHAR(11),
  endereco_cep VARCHAR(8) NOT NULL,
  endereco_estado VARCHAR(2) NOT NULL,
  endereco_cidade VARCHAR(100) NOT NULL,
  endereco_bairro VARCHAR(100) NOT NULL,
  endereco_rua VARCHAR(100) NOT NULL,
  endereco_numero VARCHAR(100) NOT NULL,
  endereco_compl VARCHAR(255),
  endereco_eh_publico BOOL NOT NULL,
  biografia TEXT, /* tipo está correto? */
  estante_virtual VARCHAR(100),
  instagram VARCHAR(100),
  curadores VARCHAR(255),
  historia TEXT,
  foto_perfil VARCHAR(255), /* tipo está correto? */
  CONSTRAINT pk_sebo PRIMARY KEY (id),
  CONSTRAINT fk_sebo_perfil FOREIGN KEY (id_perfil) REFERENCES perfil (id)
);

CREATE TABLE sebo_fotos (
  id_sebo INTEGER NOT NULL,
  foto VARCHAR(255) NOT NULL,
  CONSTRAINT pk_sebo_fotos PRIMARY KEY (id_sebo, foto),
  CONSTRAINT fk_sebo_fotos FOREIGN KEY (id_sebo) REFERENCES sebo (id),
);

CREATE TABLE usuario (
  id SERIAL NOT NULL,
  id_perfil INTEGER NOT NULL,
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
  CONSTRAINT fk_usuario_perfil FOREIGN KEY (id_perfil) REFERENCES perfil (id)
);