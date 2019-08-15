import React, { ReactNode } from 'react';
import { ReactIndexedDB } from './react-indexed-db';

const IndexedDBContext = React.createContext<{ db: ReactIndexedDB; name: string; version: number }>({
  db: null,
  name: null,
  version: null
});
const IndexedDBProvider = IndexedDBContext.Provider;
const IndexedDBCosumer = IndexedDBContext.Consumer;

export function IndexedDB({ name, version, children }: { name: string; version: number; children: ReactNode }) {
  return (
    <IndexedDBProvider value={{ db: new ReactIndexedDB(name, version), name, version }}>{children}</IndexedDBProvider>
  );
}

export function AccessDB({ children }: { children: (db: ReactIndexedDB) => {} }) {
  return (
    <IndexedDBCosumer>
      {value => {
        const { db } = value;
        return children(db);
      }}
    </IndexedDBCosumer>
  );
}
