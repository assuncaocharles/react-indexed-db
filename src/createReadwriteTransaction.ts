import { DBMode } from './indexed-db';
import { createDatabaseTransaction } from './createDatabaseTransaction';

export function createReadwriteTransaction(
  database: IDBDatabase,
  store: string,
  resolve: Function,
  reject: Function
) {
  return createDatabaseTransaction(
    database,
    DBMode.readwrite,
    store,
    resolve,
    reject
  );
};
