import { DBMode } from "./indexed-db.js";
import { createDatabaseTransaction } from "./createDatabaseTransaction.js";

export function createReadonlyTransaction(
  database: IDBDatabase,
  store: string,
  resolve: (payload?: any) => void,
  reject: (e: Event) => void,
) {
  return createDatabaseTransaction(
    database,
    DBMode.readonly,
    store,
    resolve,
    reject,
  );
}
