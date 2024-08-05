import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Button,
} from '@mui/material';
import apiClient from 'src/api/axiosClient';
import Spinner from 'src/views/spinner/Spinner';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ReplyIcon from '@mui/icons-material/Reply';
import SmsFailedIcon from '@mui/icons-material/SmsFailed';
import EventContext from 'src/BroadcastContext';
import BarChartIcon from '@mui/icons-material/BarChart';
import BarChart from '@mui/icons-material/BarChart';
const truncateText = (text, wordLimit) => {
  if (!text) return '';

  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};

const MessageList = ({ id, refreshKey, checkBroadcastHistory }) => {
  const [broadcastData, setBroadcastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isHistory, setIsHistory] = useState(false);
  const { isOn } = useContext(EventContext);

  // useEffect(() => {
  //   const checkBroadcastHistory = async () => {
  //     try {
  //       const historyResponse = await apiClient.get(`/broadcast-history_checker/${id}/`);
  //       setIsHistory(historyResponse.data.is_history);

  //       if (historyResponse.data.is_history) {
  //         const response = await apiClient.get(`/broadcast-history/${id}/`);
  //         setBroadcastData(response.data.data);
  //       }

  //       setLoading(false);
  //     } catch (err) {
  //       setError(err);
  //       setLoading(false);
  //     }
  //   };

  //   checkBroadcastHistory();
  // }, [id, refreshKey, checkBroadcastHistory]);
  useEffect(() => {
    const checkBroadcastHistory = async () => {
      setLoading(true);
      try {
        const historyResponse = await apiClient.get(`/broadcast-history_checker/${id}/`);
        setIsHistory(historyResponse.data.is_history);

        if (historyResponse.data.is_history) {
          const response = await apiClient.get(`/broadcast-history/${id}/`);
          setBroadcastData(response.data.data);
        }
      } catch (err) {
        setError(err);
        setBroadcastData(null);
      } finally {
        setLoading(false);
      }
    };

    checkBroadcastHistory();
    // Reset the trigger
  }, [id, isOn]);

  if (loading) {
    return <Spinner />;
  }

  if (!isHistory) {
    return <></>;
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <DoneIcon fontSize="small" />;
      case 'delivered':
        return <DoneAllIcon fontSize="small" />;
      case 'read':
        return <DoneAllIcon fontSize="small" sx={{ color: 'green' }} />;
      case 'replied':
        return <ReplyIcon fontSize="small" sx={{ color: '#53BDEB' }} />;
      case 'failed':
        return <SmsFailedIcon fontSize="small" sx={{ color: '#F78154' }} />;
      default:
        return <></>;
    }
  };

  return (
    <Box
      sx={{
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',

        width: '320px',
        boxShadow: '0px 1px 110px #00000025',
      }}
    >
      {broadcastData && (
        <>
          {broadcastData.broadcast_histories.map((history, index) => (
            <List
              key={index}
              sx={{ paddingTop: '0px', paddingBottom: '0px', borderRadius: '5rem !important' }}
            >
              <Box sx={{ backgroundColor: '#E9FEEE', padding: '10px', borderRadius: '0px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h4" sx={{ fontSize: '1rem', color: 'rgb(26, 77, 46)' }}>
                    {history.template}
                  </Typography>
                  <Button sx={{ height: '25px', width: '30px !important', minWidth: '30px !important' }}>
                    <BarChart />
                  </Button>
                </div>
                <Typography sx={{ fontSize: '0.80rem' }}>
                  {truncateText(history.template_body, 10)}
                </Typography>
              </Box>
              <Box sx={{ backgroundColor: '#B8E7CB', padding: '10px', borderRadius: '0px' }}>
                {history.message_statuses.map((status, idx) => (
                  <ListItem key={idx} sx={{ padding: 0, marginBottom: '1px' }}>
                    <ListItemAvatar>
                      <Typography variant="h6">{status.count} </Typography>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontSize: '0.95rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          {status.status}
                          {getStatusIcon(status.status)}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          sx={{ fontSize: '0.95rem' }}
                        >{`${status.percentage}`}</Typography>
                      }
                    />
                  </ListItem>
                ))}
              </Box>
            </List>
          ))}
        </>
      )}
    </Box>
  );
};

export default MessageList;
