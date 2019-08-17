import React, { useState } from "react";
import { AccessDB } from "react-indexed-db";
import { Person } from "./PersonModel";
import { Table, Button } from "antd";
import EditPerson from './EditPerson';

export default function AllPersons() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [person, setPerson] = useState<Person>({name: '', email: ''});
  const [showModal, setShowModal] = useState(false);
  
  return (
    <div style={{ marginTop: 16 }}>
      <AccessDB objectStore="people">
        {({ getAll, deleteRecord }) => {
          getAll<Person>().then((allPersons) => {
            setPersons(allPersons);
          });
          return (
            <Table
              rowKey="id"
              dataSource={persons}
              columns={[
                {
                  title: "ID",
                  dataIndex: "id",
                  key: "id"
                },
                {
                  title: "Name",
                  dataIndex: "name",
                  key: "name"
                },
                {
                  title: "Email",
                  dataIndex: "email",
                  key: "email"
                },
                {
                  title: "Action",
                  key: "action",
                  render: (text, record: Person) => (
                    <span>
                      <Button
                        type="danger"
                        style={{ marginRight: 16 }}
                        onClick={() => {
                          record.id && deleteRecord(record.id);
                        }}
                      >
                        Delete
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => {
                          setPerson({...record});
                          console.log(person, record)
                          setShowModal(!showModal);
                        }}
                      >
                        Edit
                      </Button>
                    </span>
                  )
                }
              ]}
            />
          );
        }}
      </AccessDB>
      <EditPerson showModal={showModal} person={person} toggleModal={setShowModal} />
    </div>
  );
}
