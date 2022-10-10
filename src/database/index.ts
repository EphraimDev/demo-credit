import dbConn from "./connect";

/**
 * @typedef {Object} User
 *
 * @returns {Knex.QueryBuilder<User, {}>}
 */
const User = () => dbConn("users");

/**
 * @typedef {Object} Wallet
 *
 * @returns {Knex.QueryBuilder<Wallet, {}>}
 */
const Wallet = () => dbConn("wallets");

/**
 * @typedef {Object} Transaction
 *
 * @returns {Knex.QueryBuilder<Transaction, {}>}
 */
const Transaction = () => dbConn("transactions");

export { User, Wallet, Transaction };
