

import React, { useEffect, useState } from 'react';
import { Grid, Card, Typography, Box, CircularProgress } from '@mui/material';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import 'antd/dist/reset.css'; // Make sure to import Ant Design styles
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
const { RangePicker } = DatePicker;

const BCrumb = [
  {
    to: '/templates',
    title: 'Template',
  },
  {
    title: 'Template Insight',
  },
];

const rangePresets = [
  {
    label: 'Last 7 Days',
    value: [dayjs().subtract(7, 'day'), dayjs()],
  },
  {
    label: 'Last 14 Days',
    value: [dayjs().subtract(14, 'day'), dayjs()],
  },
  {
    label: 'Last 30 Days',
    value: [dayjs().subtract(30, 'day'), dayjs()],
  },
  {
    label: 'Last 90 Days',
    value: [dayjs().subtract(90, 'day'), dayjs()],
  },
];

const TemplateInsights = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([moment('2024-08-15'), moment('2024-08-22')]);
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
            dateRange[0].toDate(),
            'yyyy-MM-dd',
          )}&end=${format(dateRange[1].toDate(), 'yyyy-MM-dd')}`,
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
  }, [id, dateRange]);

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
  const dateFormat = 'YYYY/MM/DD';
  const handleDateRangeChange = (dates, dateStrings) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
    } else {
      console.log('Clear');
    }
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
        lg={12}
      >
        <Grid item sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
        <Grid item>
          <RangePicker
            // value={dateRange}
            defaultValue={[dayjs('2024-08-15', dateFormat), dayjs('2024-08-22', dateFormat)]}
            onChange={handleDateRangeChange}
            format="YYYY-MM-DD"
            style={{ width: '250px' }}
            presets={rangePresets}
            size="large"
          />
        </Grid>
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
