
import { Breadcrumb, Panel } from 'rsuite';
import UpdateForm from './UpdateForm.jsx';

const Page = () => {
    return (
        <Panel
            header={
                <>
                    <h3 className="title">Update Page</h3>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Venue</Breadcrumb.Item>
                        <Breadcrumb.Item active>Page</Breadcrumb.Item>
                    </Breadcrumb>
                </>
            }
        >

            <UpdateForm/>
            
        </Panel>
    );
};

export default Page;
