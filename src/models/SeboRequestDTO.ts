import { ContaRequestDTO } from "./ContaRequestDTO";

interface SeboRequestDTO {
  nome: string;
  cpfCnpj: string;
  concordaVender: boolean;
  telefone?: string;
  biografia?: string;
  estanteVirtual?: string;
  instagram?: string;
  curadores?: string;
  historia?: string;
  fotoPerfil?: string;

  conta: ContaRequestDTO;
  endereco: EnderecoSeboRequestDTO;
  fotos: FotoSeboRequestDTO[];
}

interface EnderecoSeboRequestDTO {
  cep: string,
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
  complemento?: string;
  isPublic: boolean;
}

interface FotoSeboRequestDTO {
  url: string;
}

export { SeboRequestDTO, EnderecoSeboRequestDTO };
