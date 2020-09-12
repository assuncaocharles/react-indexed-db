import { DBMode } from './indexed-db';
import { createDatabaseTransaction } from './createDatabaseTransaction';


export function createReadonlyTransaction(
  database: IDBDatabase,
  store: string,
  resolve: Function,
  reject: Function
  ) {
  return createDatabaseTransaction(
    database,
    DBMode.readonly,
    store,
    resolve,
    reject
  );
};
