import { DBMode } from "./indexed-db";
import { createDatabaseTransaction } from "./createDatabaseTransaction";

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
