import { Breadcrumb, Panel } from 'rsuite';
import ContactUsList from './ContactUsList.jsx';

const Page = () => {
    return (
        <Panel
            header={
                <>
                    <h3 className="title">Contact Us</h3>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Contact Us</Breadcrumb.Item>
                        <Breadcrumb.Item active>List</Breadcrumb.Item>
                    </Breadcrumb>
                </>
            }
        >
            <ContactUsList />
        </Panel>
    );
};

export default Page;
