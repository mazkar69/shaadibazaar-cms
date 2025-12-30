
import ReactDOM from 'react-dom/client';
import App from './App';

import 'rsuite/dist/rsuite.min.css';
import { BrowserRouter } from 'react-router';
import './styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);


