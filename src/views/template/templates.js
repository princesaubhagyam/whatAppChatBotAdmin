import * as React from 'react';

import { Box } from '@mui/material';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import TemplatesTableList from './TemplatesTableList';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Templates',
  },
];

const Templates = () => {
  return (
    <PageContainer title="Templates" description="this is Search Table page">
      {/* breadcrumb */}
      <Breadcrumb title="Templates" items={BCrumb} createUrl={'/templates/createtemplate'} />
      {/* end breadcrumb */}
      <Box>
        <TemplatesTableList />
      </Box>
    </PageContainer>
  );
};

export default Templates;
