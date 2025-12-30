
import { Breadcrumb, Panel } from 'rsuite';
import VenueUpdateForm from './VenueUpdateForm.jsx';

const Page = () => {
    return (
        <Panel
            header={
                <>
                    <h3 className="title">Update Venue</h3>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Venue</Breadcrumb.Item>
                        <Breadcrumb.Item active>update</Breadcrumb.Item>
                    </Breadcrumb>
                </>
            }
        >

            <VenueUpdateForm/>
           
        </Panel>
    );
};

export default Page;
