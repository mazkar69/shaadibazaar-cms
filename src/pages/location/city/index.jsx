import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';

import CityList from './CityList.jsx';

const Page = () => {
    return (
        <Panel
            header={
                <>
                    <h3 className="title">City</h3>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item>City</Breadcrumb.Item>
                        <Breadcrumb.Item active>all</Breadcrumb.Item>
                    </Breadcrumb>
                </>
            }
        >
            <CityList/>
        </Panel>
    );
};

export default Page;
