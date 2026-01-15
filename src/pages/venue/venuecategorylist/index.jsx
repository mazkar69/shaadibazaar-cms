import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';

import VenueCategoryList from './VenueCategoryList.jsx';

const Page = () => {
    return (
        <Panel
            header={
                <>
                    <h3 className="title">Venues Category</h3>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Venue</Breadcrumb.Item>
                        <Breadcrumb.Item active>Category</Breadcrumb.Item>
                    </Breadcrumb>
                </>
            }
        >
            <VenueCategoryList />
        </Panel>
    );
};

export default Page;
