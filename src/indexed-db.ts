import { validateBeforeTransaction, createTransaction, optionsGenerator } from './Utils';

interface DBConfig {
  dbName: string;
  version: number;
}

export type Key = string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange;
export interface IndexDetails {
  indexName: string;
  order: string;
}
const indexedDB: IDBFactory =
  window.indexedDB || (<any>window).mozIndexedDB || (<any>window).webkitIndexedDB || (<any>window).msIndexedDB;

export function openDatabase(dbName: string, version: number, upgradeCallback?: Function) {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(dbName, version);
    let db: IDBDatabase;
    request.onsuccess = (event: Event) => {
      db = request.result;
      resolve(db);
    };
    request.onerror = (event: Event) => {
      reject(`IndexedDB error: ${request.error}`);
    };
    if (typeof upgradeCallback === 'function') {
      request.onupgradeneeded = (event: Event) => {
        upgradeCallback(event, db);
      };
    }
  });
}

export function DBOperations(dbName: string, version: number, currentStore?: string) {
  return {
    add<T>(value: T, key?: any) {
      return new Promise<number>((resolve, reject) => {
        openDatabase(dbName, version).then((db: IDBDatabase) => {
          let transaction = createTransaction(db, optionsGenerator(DBMode.readwrite, currentStore, reject, resolve)),
            objectStore = transaction.objectStore(currentStore);
          let request = objectStore.add(value, key);
          request.onsuccess = (evt: any) => {
            key = evt.target.result;
            resolve(key);
          };
        });
      });
    },
    getByID<T>(id: string | number) {
      return new Promise<T>((resolve, reject) => {
        openDatabase(dbName, version).then((db: IDBDatabase) => {
          validateBeforeTransaction(db, currentStore, reject);
          let transaction = createTransaction(db, optionsGenerator(DBMode.readonly, currentStore, reject, resolve)),
            objectStore = transaction.objectStore(currentStore),
            request: IDBRequest;
          request = objectStore.get(+id);
          request.onsuccess = function(event: Event) {
            console.log('BY KEY', event);
            console.log('BY KEY', request);
            resolve((event.target as any).result as T);
          };
        });
      });
    },
    getAll<T>(keyRange?: IDBKeyRange, indexDetails?: IndexDetails) {
      return new Promise<T[]>((resolve, reject) => {
        openDatabase(dbName, version).then(db => {
          validateBeforeTransaction(db, currentStore, reject);
          let transaction = createTransaction(db, optionsGenerator(DBMode.readonly, currentStore, reject, resolve)),
            objectStore = transaction.objectStore(currentStore),
            result: Array<any> = [],
            request: IDBRequest;
          if (indexDetails) {
            let index = objectStore.index(indexDetails.indexName),
              order = indexDetails.order === 'desc' ? 'prev' : 'next';
            request = index.openCursor(keyRange, <IDBCursorDirection>order);
          } else {
            request = objectStore.openCursor(keyRange);
          }
          request.onerror = function(e) {
            reject(e);
          };
          request.onsuccess = function*(evt: Event) {
            let cursor: IDBCursorWithValue = (<IDBRequest>evt.target).result;
            if (cursor) {
              result.push(cursor.value);
              cursor.continue();
            } else {
              yield result;
              resolve(result);
            }
          };
        });
      });
    },
    getAllSync<T>(cb: any) {
      openDatabase(dbName, version).then(db => {
        validateBeforeTransaction(db, currentStore, () => {});
        let transaction = createTransaction(db, optionsGenerator(DBMode.readonly, currentStore, () => {}, () => {})),
          objectStore = transaction.objectStore(currentStore),
          result: Array<any> = [],
          request: IDBRequest;
        request = objectStore.getAll();
        request.onerror = function(e) {
          cb(e);
        };
        request.onsuccess = function(evt: Event) {
          cb(result);
        };
      });
    },
    update<T>(key: any, value: T) {
      return new Promise<any>((resolve, reject) => {
        openDatabase(dbName, version).then(db => {
          validateBeforeTransaction(db, currentStore, reject);
          let transaction = createTransaction(db, optionsGenerator(DBMode.readwrite, currentStore, reject, resolve)),
            objectStore = transaction.objectStore(currentStore);
          transaction.oncomplete = event => {
            console.log('SUCCESS UPDATE: ', event);
            resolve(event);
          };
          objectStore.put(value, key);
        });
      });
    },
    deleteRecord(key: Key) {
      return new Promise<any>((resolve, reject) => {
        openDatabase(dbName, version).then(db => {
          validateBeforeTransaction(db, currentStore, reject);
          let transaction = createTransaction(db, optionsGenerator(DBMode.readwrite, currentStore, reject, resolve)),
            objectStore = transaction.objectStore(currentStore);
          let request = objectStore.delete(key);
          request.onsuccess = event => {
            resolve(event);
          };
        });
      });
    },
    clear() {
      return new Promise<any>((resolve, reject) => {
        openDatabase(dbName, version).then(db => {
          validateBeforeTransaction(db, currentStore, reject);
          let transaction = createTransaction(db, optionsGenerator(DBMode.readwrite, currentStore, reject, resolve)),
            objectStore = transaction.objectStore(currentStore);
          objectStore.clear();
          transaction.oncomplete = event => {
            console.log('Clear: ', event);
            resolve();
          };
        });
      });
    },
    openCursor(cursorCallback: (event: Event) => void, keyRange?: IDBKeyRange) {
      return new Promise<void>((resolve, reject) => {
        openDatabase(dbName, version).then(db => {
          validateBeforeTransaction(db, currentStore, reject);
          let transaction = createTransaction(db, optionsGenerator(DBMode.readonly, currentStore, reject, resolve)),
            objectStore = transaction.objectStore(currentStore),
            request = objectStore.openCursor(keyRange);

          request.onsuccess = (event: Event) => {
            cursorCallback(event);
            resolve();
          };
        });
      });
    },
    getByIndex(indexName: string, key: any) {
      return new Promise<any>((resolve, reject) => {
        openDatabase(dbName, version).then(db => {
          validateBeforeTransaction(db, currentStore, reject);
          let transaction = createTransaction(db, optionsGenerator(DBMode.readonly, currentStore, reject, resolve)),
            objectStore = transaction.objectStore(currentStore),
            index = objectStore.index(indexName),
            request = index.get(key);
          request.onsuccess = (event: Event) => {
            console.log('GET BY INDEX: ', (<IDBOpenDBRequest>event.target).result);
            resolve((<IDBOpenDBRequest>event.target).result);
          };
        });
      });
    }
  };
}

export enum DBMode {
  readonly = 'readonly',
  readwrite = 'readwrite'
}
