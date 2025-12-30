import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import VendorCategoryList from './VendorCategoryList.jsx'


const Page = () => {
    return (
        <Panel
            header={
                <>
                    <h3 className="title">Vendor Category</h3>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Vendor</Breadcrumb.Item>
                        <Breadcrumb.Item active>Category</Breadcrumb.Item>
                    </Breadcrumb>
                </>
            }
        >
            <VendorCategoryList/>
        </Panel>
    );
};

export default Page;
