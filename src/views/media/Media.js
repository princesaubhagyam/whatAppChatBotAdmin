import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { Box } from '@mui/material';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Media',
  },
];

const Media = () => {
  return (
    <PageContainer title="Templates" description="this is Search Table page">
    {/* breadcrumb */}
    <Breadcrumb title="Templates" items={BCrumb} createUrl={'/media'} />
    {/* end breadcrumb */}
    <Box>
      {/* <TemplatesTableList /> */}
    </Box>
  </PageContainer>
  );
};

export default Media;
