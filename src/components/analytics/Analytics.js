import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import apiClient from 'src/api/axiosClient';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { Typography, Divider } from '@mui/material';
import Spinner from '../../views/spinner/Spinner';
import BarGraph from './BarGraph';
import EventContext from 'src/BroadcastContext';
import NoData from '../noData/NoData';

function Analytics({ setIsAnalytics }) {
  const [value, setValue] = React.useState('graph');
  const [innerValue, setInnervalue] = React.useState('inner-sent');
  const [messageStatuses, setMessageStatuses] = React.useState([]);
  const [sentData, setSentData] = React.useState([]);
  const [delivered, setDelivered] = React.useState([]);
  const [read, setRead] = React.useState([]);
  const [replied, setReplied] = React.useState([])
  const [failed, setFailed] = React.useState([])
  const [loading, setLoading] = React.useState(true);
  const activeBroadcast = useSelector((state) => state.chatReducer.selectedBroadcast);
  const [graphData, setGraphData] = useState([]);
  const { isOn } = useContext(EventContext);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  function closeAnalyticsHistory() {
    setIsAnalytics(false);
  }
  function handleChangeInner(e, newValue) {
    setInnervalue(newValue);
  }
  useEffect(() => {
    getBroadcastsDataforAnalytics(activeBroadcast);
    fetchAllData();
  }, [activeBroadcast, isOn]);

  function getBroadcastsDataforAnalytics(activeBroadcast) {
    setLoading(true);
    try {
      if (activeBroadcast) {
        apiClient
          .get(`/broadcast-history/${activeBroadcast.id}/`)
          .then((response) => {
            setMessageStatuses(response?.data?.data?.broadcast_histories[0]?.message_statuses);
            if (response?.data?.data?.broadcast_histories[0]?.message_statuses) {
              console.log(response?.data?.data?.broadcast_histories[0]?.message_statuses, 'data');
              setGraphData(
                response?.data?.data?.broadcast_histories[0]?.message_statuses.map((data) => ({
                  name: data.status,
                  value: parseFloat(data.percentage),
                  number: data.count,
                })),
              );
            }
          })
          .catch((error) => {
            console.error('Error fetching history status:', error);
          });
      }
      setLoading(false);
    } catch (error) { }
  }

  console.log(messageStatuses, 'messageStatuses===');

  function getDataByStatus(status, setData) {
    setLoading(true);
    if (messageStatuses && messageStatuses.length > 0) {
      const data = messageStatuses
        .filter((item) => item.status === status)
        .map((item) => item.recipients);
      setData(data);
    }
    setLoading(false);
  }

  function fetchAllData() {
    getDataByStatus('sent', setSentData);
    getDataByStatus('delivered', setDelivered);
    getDataByStatus('read', setRead);
    getDataByStatus('replied', setReplied);
    getDataByStatus('failed', setFailed);
  }

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <TabList onChange={handleChange} onClick={fetchAllData} aria-label="lab API tabs example">
            <Tab label="Analytics Graph" value="graph" />
            <Tab label="Analytics message" value="message" />
          </TabList>
          <CloseIcon
            fontSize="medium"
            sx={{
              marginRight: '10px',
              marginTop: '10px',
              cursor: 'pointer',
            }}
            onClick={closeAnalyticsHistory}
          />
        </Box>
        <TabPanel value="graph" sx={{ display: 'flex', justifyContent: 'center', padding: 0 }}>
          <BarGraph graphData={graphData} />
        </TabPanel>
        <TabPanel value="message" sx={{ padding: '0px !important' }}>
          <TabContext value={innerValue} sx={{ padding: '0px !important' }}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0px !important',
              }}
            >
              <TabList
                onChange={handleChangeInner}
                aria-label="lab API tabs example"
                sx={{ padding: '0px !important' }}
              >
                <Tab label={`Sent(${sentData && sentData[0] && sentData[0].length > 0 ?  sentData[0].length : 0 })`} value="inner-sent" />
                <Tab label={`Delivered( ${delivered && delivered[0] && delivered[0].length > 0 ? delivered[0].length : 0})`} value="inner-deliver" />
                <Tab label={`Read(${read && read[0] && read[0].length > 0 ? read[0].length : 0 })`} value="inner-read" />
                <Tab label={`Replied (${replied && replied[0] && replied[0].length > 0 ? replied[0].length : 0})`} value="inner-replied" />
                <Tab label={`Failed (${failed && failed[0] && failed[0].length > 0 ? failed[0].length : 0})`} value="inner-failed" />
              </TabList>
            </Box>
            <TabPanel value="inner-sent">
              {sentData && Array.isArray(sentData) && sentData.length > 0 && Array.isArray(sentData[0]) && sentData[0].length > 0 ?
                (sentData[0].map(function (item, index) {
                  let firstLetter = item.recipient_contact__name?.charAt(0);
                  return (
                    <div key={index}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          paddingTop: '10px',
                        }}
                      >
                        <Stack direction="row" spacing={2}>
                          <Avatar>{firstLetter}</Avatar>
                        </Stack>
                        <Box
                          sx={{
                            marginLeft: '30px',
                          }}
                        >
                          <Typography component="p" sx={{ margin: 0 }}>
                            {' '}
                            {item.recipient_contact__name}{' '}
                          </Typography>
                          <Typography component="p" sx={{ margin: 0 }}>
                            {item.recipient_contact__contact}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider
                        sx={{
                          marginTop: '20px',
                        }}
                      ></Divider>
                    </div>);
                })) : <NoData />}
            </TabPanel>
            <TabPanel value="inner-deliver">
              {loading ? (
                <Spinner />
              ) : (
                delivered && Array.isArray(delivered) && delivered.length > 0 && Array.isArray(delivered[0]) && delivered[0].length > 0 ?
                  delivered[0].map(function (item, index) {
                    let firstLetter = item.recipient_contact__name?.charAt(0);
                    return (
                      <div key={index}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            paddingTop: '10px',
                          }}
                        >
                          <Stack direction="row" spacing={2}>
                            <Avatar>{firstLetter}</Avatar>
                          </Stack>
                          <Box
                            sx={{
                              marginLeft: '30px',
                            }}
                          >
                            <Typography component="p" sx={{ margin: 0 }}>
                              {' '}
                              {item.recipient_contact__name}{' '}
                            </Typography>
                            <Typography component="p" sx={{ margin: 0 }}>
                              {item.recipient_contact__contact}
                            </Typography>
                          </Box>
                        </Box>
                        <Divider
                          sx={{
                            marginTop: '20px',
                          }}
                        ></Divider>
                      </div>
                    );
                  }) : <NoData />
              )}
            </TabPanel>
            <TabPanel value="inner-read">
              {loading ? (
                <Spinner />
              ) : (read && Array.isArray(read) && read.length > 0 && Array.isArray(read[0]) && read[0].length > 0 ? read[0].map(function (item, index) {
                let firstLetter = item.recipient_contact__name?.charAt(0);
                return (
                  <div key={index}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        paddingTop: '10px',
                      }}
                    >
                      <Stack direction="row" spacing={2}>
                        <Avatar>{firstLetter}</Avatar>
                      </Stack>
                      <Box
                        sx={{
                          marginLeft: '30px',
                        }}
                      >
                        <Typography component="p" sx={{ margin: 0 }}>
                          {' '}
                          {item.recipient_contact__name}{' '}
                        </Typography>
                        <Typography component="p" sx={{ margin: 0 }}>
                          {item.recipient_contact__contact}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider
                      sx={{
                        marginTop: '20px',
                      }}
                    ></Divider>
                  </div>
                );
              }) : <NoData />
              )}
            </TabPanel>
            <TabPanel value="inner-replied">
              {loading ? (
                <Spinner />
              ) : (replied && Array.isArray(replied) && replied.length > 0 && Array.isArray(replied[0]) && replied[0].length > 0 ?
                replied[0].map(function (item, index) {
                  let firstLetter = item.recipient_contact__name?.charAt(0);
                  return (
                    <div key={index}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          paddingTop: '10px',
                        }}
                      >
                        <Stack direction="row" spacing={2}>
                          <Avatar>{firstLetter}</Avatar>
                        </Stack>
                        <Box
                          sx={{
                            marginLeft: '30px',
                          }}
                        >
                          <Typography component="p" sx={{ margin: 0 }}>
                            {' '}
                            {item.recipient_contact__name}{' '}
                          </Typography>
                          <Typography component="p" sx={{ margin: 0 }}>
                            {item.recipient_contact__contact}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider
                        sx={{
                          marginTop: '20px',
                        }}
                      ></Divider>
                    </div>
                  );
                }) : <NoData />
              )}
            </TabPanel>
            <TabPanel value="inner-failed">
              {loading ? (
                <Spinner />
              ) : (failed && Array.isArray(failed) && failed.length > 0 && Array.isArray(failed[0]) && failed[0].length > 0 ?
                failed[0].map(function (item, index) {
                  let firstLetter = item.recipient_contact__name?.charAt(0);
                  return (
                    <div>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          paddingTop: '10px',
                        }}
                      >
                        <Stack direction="row" spacing={2}>
                          <Avatar>{firstLetter}</Avatar>
                        </Stack>
                        <Box
                          sx={{
                            marginLeft: '30px',
                          }}
                        >
                          <Typography component="p" sx={{ margin: 0 }}>
                            {' '}
                            {item.recipient_contact__name}{' '}
                          </Typography>
                          <Typography component="p" sx={{ margin: 0 }}>
                            {item.recipient_contact__contact}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider
                        sx={{
                          marginTop: '20px',
                        }}
                      ></Divider>
                    </div>
                  );
                }) : <NoData />
              )}
            </TabPanel>
          </TabContext>
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default Analytics;
