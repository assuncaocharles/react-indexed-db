import React, { useState, Fragment } from "react";
import { AccessDB } from "react-indexed-db";
import { Person } from "./PersonModel";
import NewPerson from "./NewPerson";
import AllPersons from "./AllPersons";
import { Tabs } from "antd";
import ShowByID from "./ShowByID";
const { TabPane } = Tabs;

export default function PanelExample() {
  return (
    <Fragment>
      <NewPerson />
      <Tabs defaultActiveKey="1" onChange={() => {}}>
        <TabPane tab="Show All" key="1">
          <AllPersons />
        </TabPane>
        <TabPane tab="Get By ID" key="2">
          <ShowByID />
        </TabPane>
        <TabPane tab="Tab 3" key="3">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    </Fragment>
  );
}
