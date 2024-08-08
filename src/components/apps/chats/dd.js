import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Modal,
} from '@mui/material';
import apiClient from 'src/api/axiosClient';
import Spinner from 'src/views/spinner/Spinner';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ReplyIcon from '@mui/icons-material/Reply';
import SmsFailedIcon from '@mui/icons-material/SmsFailed';
import EventContext from 'src/BroadcastContext';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

const truncateText = (text, wordLimit) => {
  if (!text) return '';
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};

// const chartSetting = {
//   yAxis: [
//     {
//       label: 'Percentage',
//     },
//   ],
//   height: 300,
//   sx: {
//     [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
//       transform: 'translateX(-10px)',
//     },
//   },
// };

const MessageList = ({ id, refreshKey, checkBroadcastHistory }) => {
  const [broadcastData, setBroadcastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isHistory, setIsHistory] = useState(false);
  const { isOn } = useContext(EventContext);
  const [openModal, setOpenModal] = useState(false);
  const [selectedChartData, setSelectedChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, [id, isOn]);

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

  const handleOpenModal = (data) => {
    console.log('Opening modal with data:', data);
    const chartData = data.message_statuses.map((status) => ({
      status: status.status,
      percentage: parseFloat(status.percentage),
    }));
    setSelectedChartData(chartData);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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
      {loading && <Spinner />}

      {isHistory && broadcastData && (
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
                  <IconButton
                    sx={{ height: '28px', width: '32px !important', minWidth: '30px !important' }}
                    onClick={() => handleOpenModal(history)}
                  >
                    <BarChart />
                  </IconButton>
                </div>
                <Typography sx={{ fontSize: '0.80rem' }}>
                  {truncateText(history.template_body, 10)}
                </Typography>
              </Box>
              <Box sx={{ backgroundColor: '#B8E7CB', padding: '10px', borderRadius: '0px' }}>
                {history.message_statuses.map((status, idx) => (
                  <ListItem key={idx} sx={{ padding: 0, marginBottom: '1px' }}>
                    <ListItemAvatar>
                      <Typography variant="h6">{status.count}</Typography>
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
                        <Typography sx={{ fontSize: '0.95rem' }}>{`${status.percentage}`}</Typography>
                      }
                    />
                  </ListItem>
                ))}
              </Box>
            </List>
          ))}

          <Modal open={openModal} onClose={handleCloseModal}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                boxShadow: 24,
                p: 4,
                borderRadius: '8px',
                width: '80%',
                height: '80%',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Bar Chart
              </Typography>
              {selectedChartData.length > 0 ? (
                <BarChart
                  dataset={selectedChartData}
                  xAxis={[
                    {
                      scaleType: 'band',
                      dataKey: 'status',
                      tickPlacement: 'middle',
                      tickLabelPlacement: 'middle',
                    },
                  ]}
                  // {...chartSetting}
                  // series={[
                  //   {
                  //     dataKey: 'percentage',
                  //     label: 'Percentage',
                  //   },
                  // ]}
                />
              ) : (
                <Typography>No data available</Typography>
              )}
            </Box>
          </Modal>
        </>
      )}
    </Box>
  );
};

export default MessageList;
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
                  <Button sx={{ height: '28px', width: '32px !important', minWidth: '30px !important' }}>
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
import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Modal
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
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MessageList = ({ id, refreshKey, checkBroadcastHistory }) => {
  const [broadcastData, setBroadcastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isHistory, setIsHistory] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [chartData, setChartData] = useState([]);
  const { isOn } = useContext(EventContext);

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
  }, [id, isOn]);

  const handleOpenModal = (data) => {
    // Format the chart data
    const formattedData = data.map(item => ({
      ...item,
      percentage: Math.round(item.percentage) // Rounding the percentage values
    }));
    setChartData(formattedData);
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
    labels: chartData.map(item => item.status),
    datasets: [{
      label: 'Percentage',
      data: chartData.map(item => item.percentage),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}%`;
          }
        }
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
          // Ensure y-axis percentages are whole numbers
          callback: function(value) {
            return `${value}%`;
          }
        }
      }
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
                  <Button
                    sx={{ height: '28px', width: '32px !important', minWidth: '30px !important' }}
                    onClick={() => handleOpenModal(history.message_statuses)}
                  >
                    <BarChartIcon />
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
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
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
