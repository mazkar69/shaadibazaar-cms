import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import VendorAddForm from './VendorAddForm.jsx';


const Page = () => {
    return (
        <Panel
            header={
                <>
                    <h3 className="title">Add Vendor</h3>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Vendor</Breadcrumb.Item>
                        <Breadcrumb.Item active>Add</Breadcrumb.Item>
                    </Breadcrumb>
                </>
            }
        >
            <VendorAddForm/>
        </Panel>
    );
};

export default Page;
