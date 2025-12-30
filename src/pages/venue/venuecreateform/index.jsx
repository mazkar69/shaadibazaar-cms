import React from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import VenueAddForm from './VenueAddForm.jsx';
// import CreateForm from './CreateFrom';

const Page = () => {
    return (
        <Panel
            header={
                <>
                    <h3 className="title">Add Venue</h3>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Venue</Breadcrumb.Item>
                        <Breadcrumb.Item active>Add</Breadcrumb.Item>
                    </Breadcrumb>
                </>
            }
        >
            <VenueAddForm/>
        </Panel>
    );
};

export default Page;
