import React, { useState } from 'react';
import { Breadcrumb, Panel } from 'rsuite';
import UpdateImage from './UpdateImage.jsx';



const Page = () => {

    const [name, setName] = useState([])


    return (

        <Panel
            header={
                <>
                    <h3 className="title">Update Images</h3>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Venue</Breadcrumb.Item>
                        <Breadcrumb.Item active>Image</Breadcrumb.Item>
                        <Breadcrumb.Item active>{name}</Breadcrumb.Item>
                    </Breadcrumb>
                </>
            }
        >

            <UpdateImage setName={setName}/>
           
        </Panel>
    );
};

export default Page;
