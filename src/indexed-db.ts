import { useCallback } from 'react';
import { validateBeforeTransaction } from './Utils';
import { ObjectStoreMeta, ObjectStoreSchema } from './indexed-hooks';
import { createReadwriteTransaction } from './createReadwriteTransaction';
import { createReadonlyTransaction } from './createReadonlyTransaction';

export type Key = string | number | Date | ArrayBufferView | ArrayBuffer  | IDBKeyRange; // IDBArrayKey
export interface IndexDetails {
  indexName: string;
  order: string;
}
const indexedDB: IDBFactory =
  window.indexedDB || (<any>window).mozIndexedDB || (<any>window).webkitIndexedDB || (<any>window).msIndexedDB;

export function openDatabase(dbName: string, version: number, upgradeCallback?: (e: Event, db: IDBDatabase) => void) {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(dbName, version);
    let db: IDBDatabase;
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    request.onerror = () => {
      reject(`IndexedDB error: ${request.error}`);
    };
    if (typeof upgradeCallback === 'function') {
      request.onupgradeneeded = (event: Event) => {
        upgradeCallback(event, db);
      };
    }
  });
}

export function CreateObjectStore(dbName: string, version: number, storeSchemas: ObjectStoreMeta[]) {
  const request: IDBOpenDBRequest = indexedDB.open(dbName, version);

  request.onupgradeneeded = function(event: IDBVersionChangeEvent) {
    const database: IDBDatabase = (event.target as any).result;
    storeSchemas.forEach((storeSchema: ObjectStoreMeta) => {
      if (!database.objectStoreNames.contains(storeSchema.store)) {
        const objectStore = database.createObjectStore(storeSchema.store, storeSchema.storeConfig);
        storeSchema.storeSchema.forEach((schema: ObjectStoreSchema) => {
          objectStore.createIndex(schema.name, schema.keypath, schema.options);
        });
      }
    });
    database.close();
  };
  request.onsuccess = function(e: any) {
    e.target.result.close();
  };
}

export function DBOperations(dbName: string, version: number, currentStore: string) {
  // Readonly operations
  const getAll = useCallback(
    <T>() => new Promise<T[]>((resolve, reject) => {
      openDatabase(dbName, version).then(db => {
        validateBeforeTransaction(db, currentStore, reject);
        const { store } = createReadonlyTransaction(db, currentStore, resolve, reject);
        const request = store.getAll();

        request.onerror = error => reject(error);

        request.onsuccess = function({ target: { result } }: any) {
          resolve(result as T[]);
        };
      });
    }),
    [dbName, version, currentStore]
  );

  const getByID = useCallback(
    <T>(id: string | number) => new Promise<T>((resolve, reject) => {
      openDatabase(dbName, version).then((db: IDBDatabase) => {
        validateBeforeTransaction(db, currentStore, reject);
        const { store } = createReadonlyTransaction(db, currentStore, resolve, reject);
        const request = store.get(id);

        request.onsuccess = function(event: Event) {
          resolve((event.target as any).result as T);
        };
      });
    }),
    [dbName, version, currentStore],
  );

  const openCursor = useCallback(
    (cursorCallback: (event: Event) => void, keyRange?: IDBKeyRange) => {
      return new Promise<void>((resolve, reject) => {
        openDatabase(dbName, version).then(db => {
          validateBeforeTransaction(db, currentStore, reject);
          const { store } = createReadonlyTransaction(db, currentStore, resolve, reject);
          const request = store.openCursor(keyRange);

          request.onsuccess = (event: Event) => {
            cursorCallback(event);
            resolve();
          };
        });
      });
    },
    [dbName, version, currentStore],
  );

  const getByIndex = useCallback(
    (indexName: string, key: any) => new Promise<any>((resolve, reject) => {
      openDatabase(dbName, version).then(db => {
        validateBeforeTransaction(db, currentStore, reject);
        const { store } = createReadonlyTransaction(db, currentStore, resolve, reject);
        const index = store.index(indexName);
        const request = index.get(key);

        request.onsuccess = (event: Event) => {
          resolve((<IDBOpenDBRequest>event.target).result);
        };
      });
    }),
    [dbName, version, currentStore],
  );

  // Readwrite operations
  const add = useCallback(
    <T>(value: T, key?: any) => new Promise<number>((resolve, reject) => {
      openDatabase(dbName, version).then((db: IDBDatabase) => {
        const { store } = createReadwriteTransaction(db, currentStore, resolve, reject);
        const request = store.add(value, key);

        request.onsuccess = (evt: any) => {
          key = evt.target.result;
          resolve(key);
        };

        request.onerror = error => reject(error);
      });
    }),
    [dbName, version, currentStore],
  );

  const update = useCallback(
    <T>(value: T, key?: any) => new Promise<any>((resolve, reject) => {
      openDatabase(dbName, version).then(db => {
        validateBeforeTransaction(db, currentStore, reject);
        const {
          transaction,
          store,
        } = createReadwriteTransaction(db, currentStore, resolve, reject);

        transaction.oncomplete = event => resolve(event);

        store.put(value, key);
      });
    }),
    [dbName, version, currentStore],
  );

  const deleteRecord = useCallback(
    (key: Key) =>  new Promise<any>((resolve, reject) => {
      openDatabase(dbName, version).then(db => {
        validateBeforeTransaction(db, currentStore, reject);
        const { store } = createReadwriteTransaction(db, currentStore, resolve, reject);
        const request = store.delete(key);

        request.onsuccess = event => resolve(event);
      });
    }),
    [dbName, version, currentStore],
  );

  const clear = useCallback(
    () => new Promise<void>((resolve, reject) => {
      openDatabase(dbName, version).then(db => {
        validateBeforeTransaction(db, currentStore, reject);
        const { store, transaction } = createReadwriteTransaction(db, currentStore, resolve, reject);

        transaction.oncomplete = () => resolve();

        store.clear();
      });
    }),
    [dbName, version, currentStore],
  );

  return {
    add,
    getByID,
    getAll,
    update,
    deleteRecord,
    clear,
    openCursor,
    getByIndex,
  };
}

export enum DBMode {
  readonly = 'readonly',
  readwrite = 'readwrite'
}
