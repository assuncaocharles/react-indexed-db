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

let indexeddbConfiguration: { version: number; name: string } = { version: null, name: null };

export function initDB({ name, version, objectStoresMeta }: IndexedDBProps) {
  indexeddbConfiguration.name = name;
  indexeddbConfiguration.version = version;
  Object.freeze(indexeddbConfiguration);
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
  if (!indexeddbConfiguration.name || !indexeddbConfiguration.version) {
    throw new Error('Please, initialize the DB before the use.');
  }
  return { ...DBOperations(indexeddbConfiguration.name, indexeddbConfiguration.version, objectStore) };
}
