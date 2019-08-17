import React, { useState } from "react";
import { Person } from "./PersonModel";
import { AccessDB } from "react-indexed-db";
import { Input, Button } from "antd";

export default function ShowByID() {
  const [person, setPerson] = useState<Person | null>(null);
  const [id, setID] = useState<string | number | null>(null);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div
        style={{
          display: "flex"
        }}
      >
        <Input
          style={{ width: 200, marginRight: 16 }}
          onChange={({ target: { value } }) => {
            setID(value);
          }}
        ></Input>
        <AccessDB objectStore="people">
          {({ getByID }) => {
            return (
              <div>
                <Button
                  onClick={() => {
                    if (id) {
                      getByID<Person>(id).then(person => {
                        setPerson(person);
                      });
                    }
                  }}
                >
                  GET
                </Button>
              </div>
            );
          }}
        </AccessDB>
      </div>
      <div style={{ marginTop: 16, fontSize: 24 }}>
        {JSON.stringify(person)}
      </div>
    </div>
  );
}
