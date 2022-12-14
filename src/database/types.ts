export interface UserCreateInterface {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
}

export interface UserWhereInterface {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  token?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserInterface {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null | undefined;
  phone_number: string;
  token: string | null | undefined;
  password: string | null | undefined;
  is_verified: boolean;
  is_blocked: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface WalletCreateInterface {
  user_id: number;
  available_balance?: number;
  book_balance?: number;
  nuban: string;
  is_active?: boolean;
}

export interface WalletWhereInterface {
  id?: number;
  user_id?: number;
  nuban?: string;
  available_balance?: number;
  book_balance?: number;
  status?: "ACTIVE" | "INACTIVE" | "PND" | "PNC";
  created_at?: Date;
  updated_at?: Date;
}

export interface WalletInterface {
  id: number;
  user_id: number;
  nuban: string;
  available_balance: number;
  book_balance: number;
  status: "ACTIVE" | "INACTIVE" | "PND" | "PNC";
  created_at: Date;
  updated_at: Date;
}

export interface TransactionInterface {
  id: number;
  debit_account: string;
  credit_account: string;
  amount: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  comment: string | null | undefined;
  ref: string;
  created_at: Date;
  updated_at: Date;
}

export interface TransactionCreateInterface {
  debit_account: string;
  credit_account: string;
  amount: string;
  status?: "PENDING" | "COMPLETED" | "FAILED";
  comment?: string;
  ref: string;
}

export interface TransactionWhereInterface {
  id?: number;
  debit_account?: string;
  credit_account?: string;
  amount?: string;
  status?: "PENDING" | "COMPLETED" | "FAILED";
  ref?: string;
  comment?: string;
  created_at?: Date;
  updated_at?: Date;
}
