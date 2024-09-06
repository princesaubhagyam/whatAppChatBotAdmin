import React from 'react';

import PageContainer from 'src/components/container/PageContainer';
import img from 'src/assets/images/backgrounds/banner-Privacy-Policy.jpg';
import { Card, Typography, Breadcrumbs as MuiBreadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { IconCircle } from '@tabler/icons';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Privacy Policy' }];

function PrivacyPolicy() {
  return (
    <PageContainer title="Privacy Policy" description="This is the Privacy Policy">
      <Card sx={{ padding: '16px', marginTop: '20px' }}>
        <MuiBreadcrumbs
          separator={
            <IconCircle
              size="4"
              fill="textSecondary"
              fillOpacity={'0.6'}
              style={{ margin: '0 5px' }}
            />
          }
          aria-label="breadcrumb"
          sx={{ marginBottom: '15px', alignItems: 'center', display: 'flex' }} // Adjust margin as needed
        >
          {BCrumb.map((item, index) => (
            <Typography
              key={index}
              color={index === BCrumb.length - 1 ? 'text.primary' : 'text.secondary'}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              {item.to ? (
                <Link component={RouterLink} to={item.to} color="inherit" underline="none">
                  {item.title}
                </Link>
              ) : (
                item.title
              )}
            </Typography>
          ))}
        </MuiBreadcrumbs>
        {/* Banner Image */}
        <img
          src={img}
          alt="Privacy Policy Banner"
          style={{ width: '100%', height: 'auto', marginBottom: '20px' }}
        />
        <div style={{ marginLeft: '25px', marginRight: '25px' }}>
          <Typography variant="h6" paragraph style={{ textAlign: 'justify' }} fontSize={'15px'}>
            Welcome to Saubhagyam Chatbot's Direct API Privacy Policy. Saubhagyam Chatbot, a
            WhatsApp-based engagement platform, is committed to protecting the privacy and security
            of our users' data. This policy outlines our practices regarding the collection, use,
            and sharing of your information when you use our services.
          </Typography>

          <Typography variant="h5" gutterBottom>
            Information We Collect
          </Typography>
          <Typography variant="body1" paragraph style={{ textAlign: 'justify' }}>
            <strong>• Personal Information</strong>
            <br />
            When you use Saubhagyam Chatbot, we collect personal information that you provide to us,
            such as your name, WhatsApp number, email address, and any other company information you
            choose to share while sign-up.
          </Typography>
          <Typography variant="body1" paragraph style={{ textAlign: 'justify' }}>
            <strong>• Engagement Data</strong>
            <br />
            In the Direct API solution, there is no data stored related to your engagement
            activities on WhatsApp, including messages sent and received, engagement metrics, and
            user preferences.
          </Typography>
          <Typography variant="body1" paragraph style={{ textAlign: 'justify' }}>
            <strong>• Technical Information</strong>
            <br />
            Saubhagyam Chatbot will just act as a proxy server to forward messages to & fro between
            business and its clients. This involves all messages relayed via Saubhagyam Chatbot’s
            server but will not persist in the database. Although Saubhagyam Chatbot will maintain
            full webhook delivery logs for 30 days in case of failure in the destination system.
            These logs are only for debugging purposes and are only accessed with proper approval
            and authorized personnel.
          </Typography>

          <Typography variant="h5" gutterBottom>
            How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph style={{ textAlign: 'justify' }}>
            Your information is only used to communicate with you about your account and our
            services like computing WhatsApp Conversation Credit usage and comply with legal
            obligations.
          </Typography>

          <Typography variant="h5" gutterBottom>
            Sharing Your Information
          </Typography>
          <Typography variant="body1" paragraph style={{ textAlign: 'justify' }}>
            We may share your personal information, like your name, email, and phone number, with
            third-party service providers like Chargebee (subscription management system) who assist
            us in delivering our services, in compliance with legal requirements, or during a
            business transfer. We ensure these parties respect your privacy in line with this
            policy.
          </Typography>

          <Typography variant="h5" gutterBottom>
            Your Rights and Choices
          </Typography>
          <Typography variant="body1" paragraph style={{ textAlign: 'justify' }}>
            You have the right to access, update, or delete your personal information on Saubhagyam
            Chatbot. Please contact us if you wish to exercise these rights.
          </Typography>

          <Typography variant="h5" gutterBottom>
            Data Security
          </Typography>
          <Typography variant="body1" paragraph style={{ textAlign: 'justify' }}>
            Saubhagyam Chatbot implements robust security measures to protect your data from
            unauthorized access, alteration, or loss. We continuously update our security practices
            to safeguard your information.
          </Typography>

          <Typography variant="h5" gutterBottom>
            International Data Transfers
          </Typography>
          <Typography variant="body1" paragraph style={{ textAlign: 'justify' }}>
            Although Saubhagyam Chatbot is a global platform, we comply with all data protection
            laws to ensure your information is securely managed and resides in India (ap-south-1).
          </Typography>

          <Typography variant="h5" gutterBottom>
            Children's Privacy
          </Typography>
          <Typography variant="body1" paragraph style={{ textAlign: 'justify' }}>
            Saubhagyam Chatbot does not knowingly collect data from children under the age of 18. We
            encourage parents and guardians to monitor their children's internet usage.
          </Typography>

          <Typography variant="h5" gutterBottom>
            Updates to This Policy
          </Typography>
          <Typography variant="body1" paragraph style={{ textAlign: 'justify' }}>
            We may update this policy to reflect changes in our practices. We will notify you of any
            significant changes and post the updated policy on our platform.
          </Typography>
        </div>
      </Card>
    </PageContainer>
  );
}

export default PrivacyPolicy;
