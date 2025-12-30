
import { Breadcrumb, Panel } from 'rsuite';
import LeadList from './LeadList.jsx';
// import VenueCategoryList from './VenueCategoryList';

const Page = () => {
    return (
        <Panel
            header={
                <>
                    <h3 className="title">Leads</h3>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Lead</Breadcrumb.Item>
                        <Breadcrumb.Item active>List</Breadcrumb.Item>
                    </Breadcrumb>
                </>
            }
        >
            <LeadList/>
            {/* <VenueCategoryList /> */}
        </Panel>
    );
};

export default Page;
