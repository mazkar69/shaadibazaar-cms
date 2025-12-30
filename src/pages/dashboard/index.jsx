
import { Panel } from 'rsuite';
import Copyright from '../../components/Copyright.jsx';
import Dashboard from './Dashboard.jsx';
// import PageToolbar from '@/components/PageToolbar';

const Page = () => {
  return (
    <Panel header={<h3 className="title">Dashboard</h3>}>
    
      <Dashboard/>
      <Copyright />
    </Panel>
  );
};

export default Page;
