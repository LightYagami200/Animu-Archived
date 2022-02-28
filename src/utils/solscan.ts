// =====================
// SECTION | IMPORTS
// =====================
import axios, { AxiosInstance } from 'axios';
// =====================!SECTION

// =====================
// SECTION | INTERFACES
// =====================
export interface SolanaTransaction {
  blockTime: number;
  slot: number;
  txHash: string;
  fee: number;
  status: string;
  lamport: number;
  signer: string[];
  logMessage: string[];
  inputAccount: Array<{
    account: string;
    signer: boolean;
    writable: boolean;
    preBalance: number;
    postBalance: number;
  }>;
  recentBlockhash: string;
  innerInstructions: Array<{
    index: 0;
    parsedInstructions: [
      {
        programId: string;
        program: string;
        type: string;
        name: string;
        params: {
          source: string;
          destination: string;
          amount: number;
        };
      },
    ];
  }>;
  tokenBalanes: Array<{
    account: string;
    amount: {
      postAmount: string;
      preAmount: string;
    };
    token: {
      decimals: number;
      tokenAddress: string;
      name: string;
      symbol: string;
      icon: string;
    };
  }>;
  parsedInstruction: Array<{
    programId: string;
    program: string;
    type: string;
    data: string;
    dataEncode: string;
    params: {
      nonceAccount: string;
      nonceAuthority: string;
      recentBlockhashesSysvar: string;
    };
  }>;
  confirmations: null | number;
  tokenTransfers: Array<{
    source: string;
    destination: string;
    source_owner: string;
    destination_owner: string;
    amount: string;
    token: {
      address: string;
      symbol: string;
      icon: string;
      decimals: number;
    };
    type: string;
  }>;
  solTransfers: Array<{
    source: string;
    destination: string;
    amount: number;
  }>;
  serumTransactions: any[];
  raydiumTransactions: any[];
  unknownTransfers: Array<{
    programId: string;
    event: [
      {
        source: string;
        destination: string;
        amount: number;
        type: string;
        decimals: number;
        symbol: string;
        tokenAddress: string;
      },
    ];
  }>;
}
// ===================== !SECTION

// =====================
// SECTION | SOLSCAN
// =====================
export class SolScan {
  private http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: 'https://public-api.solscan.io',
      timeout: 10000,
    });
  }

  /**
   * Get a transaction by signature
   *
   * @param signature Transaction Signature
   */
  public async getTransaction(signature: string) {
    const { data } = await this.http.get(`/transaction/${signature}`);
    return data as SolanaTransaction;
  }

  /**
   * Convert Lamport to SOL
   *
   * @param lamport Lamport
   */
  public lamportToSol(lamport: number) {
    return lamport / 1000000000;
  }
}
// =====================!SECTION
