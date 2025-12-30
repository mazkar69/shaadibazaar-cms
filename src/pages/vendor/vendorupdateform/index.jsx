import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import VendorUpdateForm from './VendorUpdateForm';


const Page = () => {
    return (
        <Panel
            header={
                <>
                    <h3 className="title">Update Vendor</h3>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Vendor</Breadcrumb.Item>
                        <Breadcrumb.Item active>Update</Breadcrumb.Item>
                    </Breadcrumb>
                </>
            }
        >

            <VendorUpdateForm/>
            
        </Panel>
    );
};

export default Page;
