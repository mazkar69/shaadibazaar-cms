import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';

import LocalityList from './LocalityList';

const Page = () => {
    return (
        <Panel
            header={
                <>
                    <h3 className="title">Locality</h3>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Location</Breadcrumb.Item>
                        <Breadcrumb.Item active>all</Breadcrumb.Item>
                    </Breadcrumb>
                </>
            }
        >
            <LocalityList/>
        </Panel>
    );
};

export default Page;
