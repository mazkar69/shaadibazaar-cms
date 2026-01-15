
import { Breadcrumb, Panel } from 'rsuite';
import VenuePageList from './VenuePageList.jsx';


const Page = () => {
    return (
        <Panel
            header={
                <>
                    <h3 className="title">Venue Page</h3>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Venue</Breadcrumb.Item>
                        <Breadcrumb.Item active>Page</Breadcrumb.Item>
                    </Breadcrumb>
                </>
            }
        >
            <VenuePageList/>
        </Panel>
    );
};

export default Page;
