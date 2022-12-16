import {
  createTransaction as defaultCreateTransaction,
  optionsGenerator as defaultOptionsBuilder,
} from "./Utils.js";
import { DBMode } from "./indexed-db.js";

export function createDatabaseTransaction(
  database: IDBDatabase,
  mode: DBMode,
  storeName: string,
  resolve: (e?: Event) => void,
  reject: (e: Event) => void,
  createTransaction: typeof defaultCreateTransaction = defaultCreateTransaction,
  buildOptions: typeof defaultOptionsBuilder = defaultOptionsBuilder,
) {
  const options = buildOptions(mode, storeName, reject, resolve);
  const transaction: IDBTransaction = createTransaction(database, options);
  const store = transaction.objectStore(storeName);

  return {
    store,
    transaction,
  };
}
