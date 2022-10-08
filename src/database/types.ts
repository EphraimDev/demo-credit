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
}

export interface AccountCreateInterface {
  user_id: number;
  available_balance?: number;
  book_balance?: number;
  total_credit?: number;
  total_debit?: number;
  is_active?: boolean;
}

export interface AccountWhereInterface {
  id?: number;
  user_id?: number;
  available_balance?: number;
  book_balance?: number;
  total_credit?: number;
  total_debit?: number;
  is_active?: boolean;
}

export interface TransactionCreateInterface {
  to_account?: number;
  from_account?: number;
  amount: string;
  status?: "PENDING" | "COMPLETED" | "FAILED";
  type: "FUNDING" | "TRANSFER" | "WITHDRAWAL";
  comment?: string;
  ref: string;
}

export interface TransactionWhereInterface {
  id?: number;
  to_account?: number;
  from_account?: number;
  amount?: string;
  status?: "PENDING" | "COMPLETED" | "FAILED";
  type?: "FUNDING" | "TRANSFER" | "WITHDRAWAL";
  ref?: string;
  comment?: string;
}
