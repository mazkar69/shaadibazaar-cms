
import { Breadcrumb, Panel } from 'rsuite';
import ConversionList from './ConversionList.jsx';

const Page = () => {
    return (
        <Panel
            header={
                <>
                    <h3 className="title">Conversion</h3>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Conversion</Breadcrumb.Item>
                        <Breadcrumb.Item active>List</Breadcrumb.Item>
                    </Breadcrumb>
                </>
            }
        >
            <ConversionList/>
        </Panel>
    );
};

export default Page;
