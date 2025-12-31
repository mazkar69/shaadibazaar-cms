
import { Breadcrumb, Panel } from 'rsuite';
import UserList from './UserList';


const Page = () => {
    return (
        <Panel
            header={
                <>
                    <h3 className="title">Manage User</h3>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Manage</Breadcrumb.Item>
                        <Breadcrumb.Item active>User</Breadcrumb.Item>
                    </Breadcrumb>
                </>
            }
        >

            <UserList/>
        </Panel>
    );
};

export default Page;
