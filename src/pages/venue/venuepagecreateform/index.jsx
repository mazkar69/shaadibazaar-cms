import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import CreateForm from './CreateFrom.jsx';

const Page = () => {
    return (
        <Panel
            header={
                <>
                    <h3 className="title">Create Page</h3>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Venue</Breadcrumb.Item>
                        <Breadcrumb.Item active>Page</Breadcrumb.Item>
                    </Breadcrumb>
                </>
            }
        >
            <CreateForm/>
        </Panel>
    );
};

export default Page;
