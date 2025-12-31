
import { Breadcrumb, Panel } from 'rsuite';
import AssignedLeadList from './AssignedLeadsList.jsx';

const Page = () => {
    return (
        <Panel
            header={
                <>
                    <h3 className="title">Assigned Leads</h3>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Assigned Leads</Breadcrumb.Item>
                        <Breadcrumb.Item active>List</Breadcrumb.Item>
                    </Breadcrumb>
                </>
            }
        >
            <AssignedLeadList/>
        </Panel>
    );
};

export default Page;
