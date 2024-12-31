export interface GameResults {
  id: number;
  ip: string;
  localizacao: string;
  agente: string;
  timestamp: string;
  quantidade_solicitada: number;
  nomeros_gerados: number[][];
}
