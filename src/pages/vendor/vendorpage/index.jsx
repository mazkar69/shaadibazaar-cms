import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import VendorPageList from './VendorPageList.jsx';


const Page = () => {
    return (
        <Panel
            header={
                <>
                    <h3 className="title">Vendor Page</h3>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Vendor</Breadcrumb.Item>
                        <Breadcrumb.Item active>Page</Breadcrumb.Item>
                    </Breadcrumb>
                </>
            }
        >
            <VendorPageList/>
        </Panel>
    );
};

export default Page;
