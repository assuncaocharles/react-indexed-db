import { DBMode } from "./indexed-db.js";
import { createDatabaseTransaction } from "./createDatabaseTransaction.js";

export function createReadwriteTransaction(
  database: IDBDatabase,
  store: string,
  resolve: (e?: any) => void,
  reject: (e: Event) => void,
) {
  return createDatabaseTransaction(
    database,
    DBMode.readwrite,
    store,
    resolve,
    reject,
  );
}
