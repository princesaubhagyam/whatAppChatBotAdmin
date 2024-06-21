import * as React from 'react';

import { Box } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import CustomersTableList from './CustomersTableList';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Contacts',
  },
];

const Customers = () => {
  return (
    <PageContainer title="Contacts" description="this is Search Table page">
      {/* breadcrumb */}
      <Breadcrumb title="Contacts" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>
        <CustomersTableList />
      </Box>
    </PageContainer>
  );
};

export default Customers;
