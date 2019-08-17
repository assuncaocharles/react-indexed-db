import React, { useState } from "react";
import { AccessDB } from "react-indexed-db";
import { Person } from "./PersonModel";
import { Input, Form, Button } from "antd";

export default function NewPerson() {
  const [person, setPerson] = useState({ name: "", email: "" });
  return (
    <AccessDB objectStore="people">
      {({ add }) => {
        return (
          <Form layout="inline" onSubmit={() => {}}>
            <Form.Item>
              <Input
                placeholder="Name"
                onChange={({ target: { value } }) => {
                  setPerson({ ...person, name: value });
                }}
              />
            </Form.Item>
            <Form.Item>
              <Input
                placeholder="Email"
                onChange={({ target: { value } }) => {
                  setPerson({ ...person, email: value });
                }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                onClick={() => {
                  add<Person>(person).then(
                    (event: any) => {
                      console.log("ID Auto Generated: ", event);
                    },
                    (error: any) => {
                      console.log(error);
                    }
                  );
                }}
              >
                ADD
              </Button>
            </Form.Item>
          </Form>
        );
      }}
    </AccessDB>
  );
}
