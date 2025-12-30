
import { Breadcrumb, Panel } from 'rsuite';

import VendorList from './VendorList.jsx';

const Page = () => {
  return (
    <Panel
      header={
        <>
          <h3 className="title">Vendors</h3>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Vendor</Breadcrumb.Item>
            <Breadcrumb.Item active>List</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <VendorList/>
    </Panel>
  );
};

export default Page;
