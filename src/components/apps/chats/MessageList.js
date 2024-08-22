import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Modal,
} from '@mui/material';
import apiClient from 'src/api/axiosClient';
import Spinner from 'src/views/spinner/Spinner';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ReplyIcon from '@mui/icons-material/Reply';
import SmsFailedIcon from '@mui/icons-material/SmsFailed';
import BarChartIcon from '@mui/icons-material/BarChart';
import EventContext from 'src/BroadcastContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MessageList = ({ id, refreshKey, checkBroadcastHistory, isHistory }) => {
  const [broadcastData, setBroadcastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  //const [isHistory, setIsHistory] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [chartData, setChartData] = useState([
    {
      status: 'sent',
      count: 0,
      percentage: 20,
      recipients: [],
    },
    {
      status: 'delivered',
      count: 0,
      percentage: 30,
      recipients: [],
    },
    {
      status: 'read',
      count: 0,
      percentage: 40,
      recipients: [],
    },
    {
      status: 'replied',
      count: 0,
      percentage: 10,
      recipients: [],
    },
    {
      status: 'failed',
      count: 0,
      percentage: 20,
      recipients: [],
    },
  ]);
  // console.log(chartData);
  const { isOn } = useContext(EventContext);

  useEffect(() => {
    const checkBroadcastHistory = async () => {
      setLoading(true);
      try {
        // const historyResponse = await apiClient.get(`/broadcast-history_checker/${id}/`);
        // setIsHistory(historyResponse.data.is_history);
        const response = await apiClient.get(`/broadcast-history/${id}/`);
        if (response.status === 200) {
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
  }, [id, isOn]);

  const handleOpenModal = (data) => {
    const formattedData = data.map((item) => ({
      ...item,
      percentage: Math.round(item.percentage),
    }));
    // setChartData(formattedData);
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

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

  const barChartData = {
    labels: chartData.map((item) => item.status),
    datasets: [
      {
        label: 'Percentage',
        data: chartData.map((item) => item.percentage),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw}%`;
          },
          afterLabel: function (context) {
            return '';
          },
        },

        titleFontColor: '#000000',
        bodyFontColor: '#FF0000',
      },
      legend: {
        display: true,
      },
    },
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Status',
        },
        ticks: {
          autoSkip: false,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Percentage',
        },
        ticks: {
          callback: function (value) {
            return `${value}%`;
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.5,
      },
    },
    options: {
      tooltips: {
        callbacks: {
          label: function (value, data) {
            return 10;
          },
        },
      },
    },
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
                  {/* <Button
                    sx={{ height: '28px', width: '32px !important', minWidth: '30px !important' }}
                    onClick={() => handleOpenModal(history.message_statuses)}
                  >
                    <BarChartIcon />
                  </Button> */}
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
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            // border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Status Bar Chart
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Bar data={barChartData} options={options} />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

const truncateText = (text, wordLimit) => {
  if (!text) return '';

  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};

export default MessageList;
