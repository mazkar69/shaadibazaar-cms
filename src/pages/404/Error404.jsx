import React from 'react';

import { IconButton } from 'rsuite';
import ArrowLeftLine from '@rsuite/icons/ArrowLeftLine';
import ErrorPage from '../../components/ErrorPage/index.jsx';
import Link from '../../components/Link.jsx';

export default ()=>{
  return (
    <ErrorPage code={404}>
      <p className="error-page-title">Oops… You just found an error page</p>
      <p className="error-page-subtitle text-muted ">
        We are sorry but the page you are looking for was not found
      </p>
      <IconButton icon={<ArrowLeftLine />}  as={Link}  appearance="primary" href="/">
        Take me home
      </IconButton>
    </ErrorPage>
  );
}
