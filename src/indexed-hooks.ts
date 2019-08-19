import { DBOperations, openDatabase, Key } from './indexed-db';

export interface IndexedDBProps {
  name: string;
  version: number;
  objectStoresMeta: ObjectStoreMeta[];
}

export interface ObjectStoreMeta {
  store: string;
  storeConfig: { keyPath: string; autoIncrement: boolean; [key: string]: any };
  storeSchema: ObjectStoreSchema[];
}

export interface ObjectStoreSchema {
  name: string;
  keypath: string;
  options: { unique: boolean; [key: string]: any };
}

export interface useIndexedDB {
  dbName: string;
  version: number;
  objectStore: string;
}

export function initDB({ name, version, objectStoresMeta }: IndexedDBProps) {
  objectStoresMeta.forEach(async (schema: ObjectStoreMeta) => {
    const db = await openDatabase(name, version, (event: any) => {
      let db: IDBDatabase = event.currentTarget.result;
      let objectStore = db.createObjectStore(schema.store, schema.storeConfig);
      schema.storeSchema.forEach((schema: ObjectStoreSchema) => {
        objectStore.createIndex(schema.name, schema.keypath, schema.options);
      });
    });
  });
}

export function useIndexedDB(
  dbName: string,
  version: number,
  objectStore: string
): {
  add: <T = any>(value: T, key?: any) => Promise<number>;
  getByID: <T = any>(id: number | string) => Promise<T>;
  getAll: <T = any>() => Promise<T[]>;
  update: <T = any>(value: T, key?: any) => Promise<any>;
  deleteRecord: (key: Key) => Promise<any>;
  openCursor: (cursorCallback: (event: Event) => void, keyRange?: IDBKeyRange) => Promise<void>;
  getByIndex: (indexName: string, key: any) => Promise<any>;
} {
  return { ...DBOperations(dbName, version, objectStore) };
}
