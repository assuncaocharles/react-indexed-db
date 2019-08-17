import React, { useState } from "react";
import { Button, Modal, Input } from "antd";
import { Person } from "./PersonModel";
import { AccessDB } from "react-indexed-db";

export default function EditPerson({
  showModal,
  person,
  toggleModal

}: {
  showModal: boolean;
  person: Person;
  toggleModal: (visible: boolean) => void
}) {
  const [editPerson, setEditPerson] = useState<Person>(person);
  return (
    <div>
      <AccessDB objectStore="people">
      {({update}) => {
        return (
          <div>
            <Modal
              title="Basic Modal"
              visible={showModal}
              onOk={() => {
                update<Person>({...person, ...editPerson}).then((result) =>{
                  toggleModal(false);
                })
              }}
              onCancel={() => { toggleModal(false);}}
            >
              <Input
                placeholder="Name"
                value={editPerson.name}
                onChange={({ target: { value } }) => {
                  setEditPerson({ ...editPerson, name: value });
                }}
              />
              <Input
                placeholder="Email"
                value={editPerson.email}
                onChange={({ target: { value } }) => {
                  setEditPerson({ ...editPerson, email: value });
                }}
              />
            </Modal>
          </div>
        );
      }}
    </AccessDB>
    </div>
  );
}
