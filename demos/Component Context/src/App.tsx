import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "antd/dist/antd.css";
import { IndexedDB } from "react-indexed-db";
import Panel from "./Panel";

const App: React.FC = () => {
  return (
    <IndexedDB
      name="MyDB"
      version={1}
      objectStoresMeta={[
        {
          store: "people",
          storeConfig: { keyPath: "id", autoIncrement: true },
          storeSchema: [
            { name: "name", keypath: "name", options: { unique: false } },
            { name: "email", keypath: "email", options: { unique: false } }
          ]
        }
      ]}
    >
      <Panel />
    </IndexedDB>
  );
};

export default App;
