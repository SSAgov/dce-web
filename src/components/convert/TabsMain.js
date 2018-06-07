import React from 'react';
import ConverTab from './ConvertTab';
import TestTab from './TestTab';
import RetrieveTab from './RetrieveTab';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './ReactTabs.css';


const TabsMain = () => {
    return (
        <div className="container">
            <Tabs defaultIndex={0}>
                <TabList>
                    <Tab>Convert</Tab>
                    <Tab>Test</Tab>
                    <Tab>Retrieve</Tab>
                </TabList>
                <TabPanel>
                    <ConverTab />
                </TabPanel>
                <TabPanel>
                    <TestTab />
                </TabPanel>
                <TabPanel>
                    <RetrieveTab />
                </TabPanel>
            </Tabs>
        </div>
    )
}


export default TabsMain;