// import React, { useEffect, useState } from 'react';
// import { Grid, Card, Typography, Box, CircularProgress } from '@mui/material';
// import { DatePicker, Space } from 'antd';
// import { Line } from 'react-chartjs-2';
// import apiClient from 'src/api/axiosClient';
// import { useParams } from 'react-router';
// import format from 'date-fns/format';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import PageContainer from 'src/components/container/PageContainer';
// import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
// import AutoGraphIcon from '@mui/icons-material/AutoGraph';
// import moment from 'moment';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// const BCrumb = [
//   {
//     to: '/templates',
//     title: 'Template',
//   },
//   {
//     title: 'Template Insight',
//   },
// ];

// const TemplateInsights = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null); // Added state for error handling
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [templateName, setTemplateName] = useState(null);
//   const [templateLanguage, setTemplateLanguage] = useState(null);
//   const { id } = useParams();
//   const [state, setState] = useState({
//     startDate: new Date('2024-08-15'),
//     endDate: new Date('2024-08-22'),
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       const waba_id = localStorage.getItem('whatsapp_business_account_id');
//       setLoading(true);
//       setError(null); // Reset error state before fetching data
//       try {
//         const response = await apiClient.get(
//           `/api/template_analytics/?template_ids=${id}&whatsapp_business_account_id=${waba_id}&start=${format(
//             state.startDate,
//             'yyyy-MM-dd',
//           )}&end=${format(state.endDate, 'yyyy-MM-dd')}`,
//         );
//         console.log('insight response', response);

//         if (response.data) {
//           setData(response.data);
//           setTemplateLanguage(response?.data?.language);
//           setTemplateName(response?.data?.name);
//         } else {
//           setError('No data available'); // Set error if no data
//         }
//       } catch (error) {
//         setError('Failed to fetch conversation analytics'); // Set error message
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id, state.startDate, state.endDate]);

//   if (loading) {
//     return (
//       <PageContainer title="Templates" description="this is Search Table page">
//         <Breadcrumb title="Templates Insight" items={BCrumb} />
//         <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
//           <CircularProgress />
//         </Box>
//       </PageContainer>
//     );
//   }

//   if (error) {
//     return (
//       <PageContainer title="Templates" description="this is Search Table page">
//         <Breadcrumb title="Templates Insight" items={BCrumb} />
//         <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
//           <Typography variant="h6" color="error">
//             {error}
//           </Typography>
//         </Box>
//       </PageContainer>
//     );
//   }

//   if (!data) {
//     return (
//       <PageContainer title="Templates" description="this is Search Table page">
//         <Breadcrumb title="Templates Insight" items={BCrumb} />
//         <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
//           <Typography variant="h6">No data available</Typography>
//         </Box>
//       </PageContainer>
//     );
//   }

//   const handleDateChange = (dates) => {
//     if (dates) {
//       const [start, end] = dates;
//       if (start && end) {
//         setState({
//           startDate: start.toDate(),
//           endDate: end.toDate(),
//         });
//         setStartDate(start);
//         setEndDate(end);
//       }
//     }
//   };

//   const disabledDate = (current) => {
//     if (!startDate || !endDate) {
//       return false;
//     }
//     // Disable dates before the selected start date and after the selected end date
//     return current && (current < moment(startDate) || current > moment(endDate));
//   };

//   const totals = data?.totals || {};
//   const graphData = data?.graph_data || [];

//   const chartData = {
//     labels: graphData.map((item) => `${format(new Date(item.start), 'dd MMM')}`),
//     datasets: [
//       {
//         label: 'Messages Sent',
//         data: graphData.map((item) => item.sent),
//         borderColor: 'rgba(255, 99, 132, 1)',
//         backgroundColor: 'rgba(255, 99, 132, 0.2)',
//         fill: true,
//         pointRadius: 3,
//       },
//       {
//         label: 'Messages Delivered',
//         data: graphData.map((item) => item.delivered),
//         borderColor: 'rgba(54, 162, 235, 1)',
//         backgroundColor: 'rgba(54, 162, 235, 0.2)',
//         fill: true,
//         borderWidth: 2,
//         pointStyle: 'circle',
//         pointRadius: 4,
//       },
//       {
//         label: 'Messages Read',
//         data: graphData.map((item) => item.read),
//         borderColor: 'rgba(75, 192, 192, 1)',
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         fill: true,
//         pointRadius: 3,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: 'Date',
//           color: '#333',
//           font: {
//             size: 15,
//             weight: 'bold',
//           },
//         },
//       },
//       y: {
//         min: 0,
//         title: {
//           display: true,
//           text: 'Count of Messages',
//           color: '#333',
//           font: {
//             size: 15,
//             weight: 'bold',
//           },
//         },
//       },
//     },
//   };

//   return (
//     <PageContainer title="Templates" description="this is Search Table page">
//       <Breadcrumb title="Templates Insight" items={BCrumb} />

//       <Grid
//         container
//         alignItems="center"
//         justifyContent="space-between"
//         sx={{ marginBottom: 2, marginTop: 2 }}
//       >
//         <Grid item sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//           <Grid>
//             <AutoGraphIcon style={{ color: '#089046', fontSize: '40px' }} />
//           </Grid>
//           <Grid item>
//             <Typography variant="h4" gutterBottom mb={'0px !important'} fontSize={'1.2rem'}>
//               {templateName}
//             </Typography>
//             <Typography variant="h6" gutterBottom>
//               {templateLanguage}
//             </Typography>
//           </Grid>
//         </Grid>

//         <Grid container item xs={6} justifyContent="flex-end" spacing={2}>
//           <Space direction="vertical" size={12}>
//             <DatePicker.RangePicker
//               onChange={handleDateChange}
//               disabledDate={disabledDate}
//               defaultValue={[
//                 state.startDate ? moment(state.startDate) : null,
//                 state.endDate ? moment(state.endDate) : null,
//               ]}
//             />
//           </Space>
//         </Grid>
//       </Grid>

//       <Grid container spacing={2} mb={2} justifyContent={'center'}>
//         <Grid item xs={12} md={4}>
//           <Card variant="outlined" sx={{ padding: 2 }}>
//             <Typography variant="h6">Amount Spent</Typography>
//             <Typography variant="h5">₹{totals.cost.amount_spent?.toFixed(2) || 'N/A'}</Typography>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Card variant="outlined" sx={{ padding: 2 }}>
//             <Typography variant="h6">Cost per message delivered</Typography>
//             <Typography variant="h5">
//               ₹{totals.cost.cost_per_delivered?.toFixed(2) || 'N/A'}
//             </Typography>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Card variant="outlined" sx={{ padding: 2 }}>
//             <Typography variant="h6">Cost per website button click</Typography>
//             <Typography variant="h5">
//               ₹{totals.cost.cost_per_url_button_click?.toFixed(2) || 'N/A'}
//             </Typography>
//           </Card>
//         </Grid>
//       </Grid>
//       <Grid container spacing={2} alignItems={'center'}>
//         <Grid item xs={12} md={8}>
//           <Card variant="outlined" sx={{ padding: 2 }}>
//             <Typography variant="h4" gutterBottom>
//               Performance
//             </Typography>
//             {graphData.length > 0 ? (
//               <Line data={chartData} options={chartOptions} />
//             ) : (
//               <Typography variant="h6" align="center">
//                 No data available
//               </Typography>
//             )}
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <Card variant="outlined" sx={{ padding: 2 }}>
//                 <Typography variant="h6">Messages Sent</Typography>
//                 <Typography variant="h5">{totals.sent || 'N/A'}</Typography>
//               </Card>
//             </Grid>
//             <Grid item xs={12}>
//               <Card variant="outlined" sx={{ padding: 2 }}>
//                 <Typography variant="h6">Messages Delivered</Typography>
//                 <Typography variant="h5">{totals.delivered || 'N/A'}</Typography>
//               </Card>
//             </Grid>
//             <Grid item xs={12}>
//               <Card variant="outlined" sx={{ padding: 2 }}>
//                 <Typography variant="h6">Messages Read</Typography>
//                 <Typography variant="h5">
//                   {totals.read || 'N/A'} (
//                   {totals.sent > 0 ? `${((totals.read / totals.sent) * 100).toFixed(2)}%` : '0%'})
//                 </Typography>
//               </Card>
//             </Grid>
//           </Grid>
//         </Grid>
//       </Grid>
//     </PageContainer>
//   );
// };

// export default TemplateInsights;

import React, { useEffect, useState } from 'react';
import { Grid, Card, Typography, Box, CircularProgress, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Line } from 'react-chartjs-2';
import apiClient from 'src/api/axiosClient';
import { useParams } from 'react-router';
import format from 'date-fns/format';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BCrumb = [
  {
    to: '/templates',
    title: 'Template',
  },
  {
    title: 'Template Insight',
  },
];

const TemplateInsights = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date('2024-08-15'));
  const [endDate, setEndDate] = useState(new Date('2024-08-22'));
  const [templateName, setTemplateName] = useState(null);
  const [templateLanguage, setTemplateLanguage] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const waba_id = localStorage.getItem('whatsapp_business_account_id');
      setLoading(true);
      try {
        const response = await apiClient.get(
          `/api/template_analytics/?template_ids=${id}&whatsapp_business_account_id=${waba_id}&start=${format(
            startDate,
            'yyyy-MM-dd',
          )}&end=${format(endDate, 'yyyy-MM-dd')}`,
        );
        console.log('insight response', response);

        setData(response.data);
        setTemplateLanguage(response?.data?.language);
        setTemplateName(response?.data?.name);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, startDate, endDate]);

  if (loading) {
    return (
      <PageContainer title="Templates" description="this is Search Table page">
        <Breadcrumb title="Templates Insight" items={BCrumb} />
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  const handleStartDateChange = (date) => {
    if (date && endDate < date) {
      setEndDate(date);
    }
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    if (date && date < startDate) {
      setStartDate(date);
    }
    setEndDate(date);
  };

  const totals = data?.totals || {};
  const graphData = data?.graph_data || [];

  const chartData = {
    labels: graphData.map((item) => `${format(new Date(item.start), 'dd MMM')}`),
    datasets: [
      {
        label: 'Messages Sent',
        data: graphData.map((item) => item.sent),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        pointRadius: 3,
      },
      {
        label: 'Messages Delivered',
        data: graphData.map((item) => item.delivered),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        borderWidth: 2,
        pointStyle: 'circle',
        pointRadius: 4,
      },
      {
        label: 'Messages Read',
        data: graphData.map((item) => item.read),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        pointRadius: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          color: '#333',
          font: {
            size: 15,
            weight: 'bold',
          },
        },
      },
      y: {
        min: 0,
        title: {
          display: true,
          text: 'Count of Messages',
          color: '#333',
          font: {
            size: 15,
            weight: 'bold',
          },
        },
      },
    },
  };

  return (
    <PageContainer title="Templates" description="this is Search Table page">
      <Breadcrumb title="Templates Insight" items={BCrumb} />

      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{ marginBottom: 2, marginTop: 2 }}
      >
        <Grid item sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Grid>
            <AutoGraphIcon style={{ color: '#089046', fontSize: '40px' }} />
          </Grid>
          <Grid item>
            <Typography variant="h4" gutterBottom mb={'0px !important'} fontSize={'1.2rem'}>
              {templateName}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {templateLanguage}
            </Typography>
          </Grid>
        </Grid>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container item xs={6} justifyContent="flex-end" spacing={2}>
            <Grid
              item
              xs={6}
              md={3}
              sx={{
                marginTop: '16px',
                marginLeft: '16px',
                background: 'white',
                borderRadius: '6px',
                padding: '0px !important',
              }}
            >
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={handleStartDateChange}
                minDate={new Date('1900-01-01')} // Adjust as needed
                maxDate={endDate} // Disable dates after endDate
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
            <Grid
              item
              xs={6}
              md={3}
              sx={{
                marginTop: '16px',
                marginLeft: '16px',
                background: 'white',
                borderRadius: '6px',
                padding: '0px !important',
              }}
            >
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={handleEndDateChange}
                minDate={startDate} // Disable dates before startDate
                maxDate={new Date('2100-12-31')} // Adjust as needed
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Grid>

      <Grid container spacing={2} mb={2} justifyContent={'center'}>
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ padding: 2 }}>
            <Typography variant="h6">Amount Spent</Typography>
            <Typography variant="h5">₹{totals.cost.amount_spent.toFixed(2)}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ padding: 2 }}>
            <Typography variant="h6">Cost per message delivered</Typography>
            <Typography variant="h5">₹{totals.cost.cost_per_delivered.toFixed(2)}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ padding: 2 }}>
            <Typography variant="h6">Cost per website button click</Typography>
            <Typography variant="h5">
              ₹{totals.cost.cost_per_url_button_click.toFixed(2)}
            </Typography>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems={'center'}>
        <Grid item xs={12} md={8}>
          <Card variant="outlined" sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
              Performance
            </Typography>
            <Line data={chartData} options={chartOptions} />
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ padding: 2 }}>
                <Typography variant="h6">Messages Sent</Typography>
                <Typography variant="h5">{totals.sent}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ padding: 2 }}>
                <Typography variant="h6">Messages Delivered</Typography>
                <Typography variant="h5">{totals.delivered}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ padding: 2 }}>
                <Typography variant="h6">Messages Read</Typography>
                <Typography variant="h5">
                  {totals.read} (
                  {totals.sent > 0 ? `${((totals.read / totals.sent) * 100).toFixed(2)}%` : '0%'})
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default TemplateInsights;
