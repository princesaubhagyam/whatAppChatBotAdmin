import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import { Box } from '@mui/material';
import BroadcastTableList from './BroadcastTableList';
import { useSelector } from 'react-redux';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Broadcast',
  },
];

const Media = () => {
  const broadcasts = useSelector((state) => state.chatReducer.broadcasts);
  console.log('Broadcasts:', broadcasts);
  return (
    <PageContainer title="Templates" description="this is Search Table page">
      {/* breadcrumb */}
      <Breadcrumb title="Broadcasts" items={BCrumb} /*createUrl={'/media'}*/ />
      {/* end breadcrumb */}
      <Box>
        <BroadcastTableList broadcasts={broadcasts} />
      </Box>
    </PageContainer>
  );
};

export default Media;
