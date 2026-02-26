import { Breadcrumb, Panel } from 'rsuite';
import BusinessUserList from './BusinessUserList.jsx';

const Page = () => {
    return (
        <Panel
            header={
                <>
                    <h3 className="title">Business Users</h3>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Business Users</Breadcrumb.Item>
                        <Breadcrumb.Item active>List</Breadcrumb.Item>
                    </Breadcrumb>
                </>
            }
        >
            <BusinessUserList />
        </Panel>
    );
};

export default Page;
