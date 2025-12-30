
import { Breadcrumb, Panel } from 'rsuite';

import VenueList from './VenueList.jsx';

const Page = () => {
  return (
    <Panel
      header={
        <>
          <h3 className="title">Venues</h3>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item>Venue</Breadcrumb.Item>
            <Breadcrumb.Item active>List</Breadcrumb.Item>
          </Breadcrumb>
        </>
      }
    >
      <VenueList/>
    </Panel>
  );
};

export default Page;
