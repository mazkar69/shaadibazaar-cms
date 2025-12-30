

import { Link as BaseLink } from 'react-router';
import React from 'react';

const Link = React.forwardRef(({ href, children, ...rest }, ref) => (
    <BaseLink ref={ref} to={href} {...rest}>
      {children}
    </BaseLink>
  ));

  export default Link;