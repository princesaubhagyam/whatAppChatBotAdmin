import React from 'react';
import PageContainer from 'src/components/container/PageContainer';
import img from 'src/assets/images/backgrounds/banner-Terms-Conditions.jpg';
import { Card, Typography, Breadcrumbs as MuiBreadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { IconCircle } from '@tabler/icons';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Terms & Conditions' }];

function TermsCondition() {
  return (
    <PageContainer title="Terms & Conditions" description="This is the T&C page">
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
          alt="Terms & Conditions Banner"
          style={{ width: '100%', height: 'auto', marginBottom: '20px' }}
        />
        <div style={{ marginLeft: '25px', marginRight: '25px' }}>
          <Typography variant="h6" paragraph style={{ textAlign: 'justify' }} fontSize={'16px'}>
            Welcome to the Saubhagyam Chatbot's Terms & Conditions page. By using our platform, you
            agree to comply with and be bound by the following terms and conditions of use. Please
            review the following terms carefully.
          </Typography>

          <Typography variant="h5" gutterBottom>
            Use of the Platform
          </Typography>
          <Typography variant="body1" paragraph style={{ textAlign: 'justify' }}>
            • By accessing and using Saubhagyam Chatbot, you agree to use the platform only for
            lawful purposes and in a manner that does not infringe the rights of, or restrict, or
            inhibit the use and enjoyment of this platform by any third party.
          </Typography>
          <Typography variant="body1" paragraph style={{ textAlign: 'justify' }}>
            • You are responsible for maintaining the confidentiality of your account information,
            including your password, and for all activities that occur under your account.
          </Typography>
          <Typography variant="body1" paragraph style={{ textAlign: 'justify' }}>
            • You agree to notify us immediately of any unauthorized use of your account or any
            other breach of security.
          </Typography>
          <Typography variant="body1" paragraph style={{ textAlign: 'justify' }}>
            • The user is obligated to provide valid information during the registration process;
            users who provide invalid contact information will be unable to use the service.
          </Typography>

          <Typography variant="h5" gutterBottom>
            Intellectual Property
          </Typography>
          <Typography variant="body1" paragraph style={{ textAlign: 'justify' }}>
            • All content on this platform, including but not limited to text, graphics, logos,
            icons, and images, is the property of Saubhagyam Chatbot or its content suppliers and is
            protected by international copyright laws.
          </Typography>
          <Typography variant="body1" paragraph style={{ textAlign: 'justify' }}>
            • You may not modify, copy, distribute, transmit, display, perform, reproduce, publish,
            license, create derivative works from, transfer, or sell any information, software,
            products, or services obtained from this platform without our prior written permission.
          </Typography>

          <Typography variant="h5" gutterBottom>
            Limitation of Liability
          </Typography>
          <Typography variant="body1" paragraph style={{ textAlign: 'justify' }}>
            • Saubhagyam Chatbot will not be liable for any damages of any kind arising from the use
            of this platform, including but not limited to direct, indirect, incidental, punitive,
            and consequential damages.
          </Typography>
          <Typography variant="body1" paragraph style={{ textAlign: 'justify' }}>
            • We do not warrant that the platform will be uninterrupted or error-free, nor do we
            make any warranty as to the results that may be obtained from the use of the platform.
          </Typography>

          <Typography variant="h5" gutterBottom>
            Governing Law
          </Typography>
          <Typography variant="body1" paragraph style={{ textAlign: 'justify' }}>
            • These terms and conditions are governed by and construed in accordance with the laws
            of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that
            location.
          </Typography>

          <Typography variant="h5" gutterBottom>
            Changes to Terms
          </Typography>
          <Typography variant="body1" paragraph style={{ textAlign: 'justify' }}>
            • We reserve the right to modify these terms and conditions at any time. Any changes
            will be posted on this page, and your continued use of the platform after any such
            changes have been made constitutes your acceptance of the new terms.
          </Typography>

          <Typography variant="h5" gutterBottom>
            Contact Information
          </Typography>
          <Typography variant="body1" paragraph style={{ textAlign: 'justify' }}>
            • If you have any questions about these Terms & Conditions, please contact us at
            info@saubhagyam.com.
          </Typography>
        </div>
      </Card>
    </PageContainer>
  );
}

export default TermsCondition;
