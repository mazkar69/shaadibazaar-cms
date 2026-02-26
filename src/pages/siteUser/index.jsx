import { Breadcrumb, Panel } from 'rsuite';
import SiteUserList from './SiteUserList.jsx';

const Page = () => {
    return (
        <Panel
            header={
                <>
                    <h3 className="title">Site Users</h3>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Site Users</Breadcrumb.Item>
                        <Breadcrumb.Item active>List</Breadcrumb.Item>
                    </Breadcrumb>
                </>
            }
        >
            <SiteUserList />
        </Panel>
    );
};

export default Page;
