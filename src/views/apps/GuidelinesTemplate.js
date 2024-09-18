import React, { useState } from 'react';
import PageContainer from 'src/components/container/PageContainer';
import {
  Card,
  Typography,
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Alert,
} from '@mui/material';
import { IconCircle } from '@tabler/icons';
import { Link as RouterLink } from 'react-router-dom';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Guidelines' }];

function GuidelinesTemplate() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <PageContainer title="Guidelines" description="This is the Privacy Policy">
      {/* Breadcrumb */}
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
        sx={{ marginBottom: '15px', marginTop: '8px', alignItems: 'center', display: 'flex' }}
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

      {/* Tabs for Utility and Marketing Templates */}
      <Card sx={{ padding: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="template tabs">
          <Tab label="Marketing Template" />
          <Tab label="Utility Template" />
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ marginTop: 2 }}>
          {activeTab === 0 && (
            <div style={{ marginLeft: '14px', marginRight: '14px' }}>
              <Typography variant="h6" paragraph style={{ textAlign: 'justify' }}>
                {' '}
                General Guidelines for Creating Marketing Message Template
              </Typography>
              <Typography gutterBottom>
                {' '}
                Marketing templates are our most flexible. They can enable businesses to achieve a
                wide range of goals, from generating awareness to driving sales and more.This
                includes things like promotions or special offers; welcoming / closing messages;
                updates, invites, or suggestions; or calls to complete a new transaction or give a
                response.
              </Typography>
              <Typography gutterBottom>
                <strong>Here's a key point:</strong> If a template includes both utility and
                marketing content, it will be considered a marketing template. Basically, any
                conversation that isn't purely for utility will be labeled as marketing.
              </Typography>
              <Typography gutterBottom>
                <strong>•</strong> Let's explore a few examples to show how messages fit into
                various marketing template categories:
              </Typography>
              <Typography variant="h6" gutterBottom mt={2}>
                Examples:
              </Typography>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Table style={{ width: '85%', borderCollapse: 'collapse' }}>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        style={{
                          width: '30%',
                          padding: '10px',
                          verticalAlign: 'top',
                          border: '1px solid #ccc',
                          minWidth: '400px ',
                        }}
                      >
                        <Typography gutterBottom>
                          <strong>Promotions or offers:</strong>
                          <br />
                          <strong>•</strong> Request customers to install or take a specific action
                          with your app.
                        </Typography>
                      </TableCell>
                      <TableCell
                        style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'justify' }}
                      >
                        <ul style={{ paddingLeft: '20px', margin: 0, listStyleType: 'disc' }}>
                          <li style={{ marginBottom: '10px' }}>
                            <Typography gutterBottom>
                              "Buy 4 or more shirts, and get 1 free!"
                            </Typography>
                          </li>
                          <li style={{ marginBottom: '10px' }}>
                            <Typography gutterBottom>
                              "Thanks for your order! Use code SAVE15 for 15% off your next order!"
                            </Typography>
                          </li>
                          <li>
                            <Typography gutterBottom>
                              {
                                '"Thank you for using our app. We noticed you have not used our latest feature, {{1}}. Click here {{2}} to learn more about how this benefits you!"'
                              }
                            </Typography>
                          </li>
                        </ul>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          width: '30%',
                          padding: '10px',
                          verticalAlign: 'top',
                          border: '1px solid #ccc',
                          minWidth: '400px ',
                        }}
                      >
                        <Typography gutterBottom>
                          <strong>Build Customer Relationships:</strong>
                          <br />
                          <strong>•</strong> Strengthen customer relationships through personalized
                          messages or by prompting new conversations.
                        </Typography>
                      </TableCell>
                      <TableCell
                        style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'justify' }}
                      >
                        <ul style={{ paddingLeft: '20px', margin: 0, listStyleType: 'disc' }}>
                          <li style={{ marginBottom: '10px' }}>
                            <Typography gutterBottom>
                              {
                                '"{{1}}, did you think we’d forget? No way! Happy birthday! We wish you the best in the year ahead."'
                              }
                            </Typography>
                          </li>
                          <li style={{ marginBottom: '10px' }}>
                            <Typography gutterBottom>
                              "Hello, welcome to our profile on WhatsApp!"
                            </Typography>
                          </li>
                          <li style={{ marginBottom: '10px' }}>
                            <Typography gutterBottom>
                              "As we approach the end of the year, we reflect on what drives us:
                              You. Thank you for being a valued customer. We look forward to
                              continuing to serve you"
                            </Typography>
                          </li>
                        </ul>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          width: '30%',
                          padding: '10px',
                          verticalAlign: 'top',
                          border: '1px solid #ccc',
                          minWidth: '400px ',
                        }}
                      >
                        <Typography gutterBottom>
                          <strong>Sales:</strong>
                          <br />
                          <strong>•</strong> Send general promotional offers to customers related to
                          sales events, coupons or other content intended to drive sales.
                        </Typography>
                      </TableCell>
                      <TableCell style={{ padding: '10px', border: '1px solid #ccc' }}>
                        <ul style={{ paddingLeft: '20px', margin: 0, listStyleType: 'disc' }}>
                          <li style={{ marginBottom: '10px' }}>
                            <Typography gutterBottom>
                              {
                                '"Upgrade to our Premium cabin to enjoy more benefits, like additional legroom and priority boarding. Click {{1}} or log into our app to upgrade."'
                              }
                            </Typography>
                          </li>
                          <li style={{ marginBottom: '10px' }}>
                            <Typography gutterBottom>
                              "Don’t forget! Today only, get double points on your purchases. Visit
                              your nearest store and use your phone number at check-out."
                            </Typography>
                          </li>
                        </ul>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          width: '30%',
                          padding: '10px',
                          verticalAlign: 'top',
                          border: '1px solid #ccc',
                          minWidth: '400px ',
                        }}
                      >
                        <Typography gutterBottom>
                          <strong>Awareness :</strong>
                          <br />
                          <strong>•</strong> Generate awareness of your business, products, or
                          services among customers who have subscribed to receive messages from your
                          business on WhatsApp.
                        </Typography>
                      </TableCell>
                      <TableCell style={{ padding: '10px', border: '1px solid #ccc' }}>
                        <ul style={{ paddingLeft: '20px', margin: 0, listStyleType: 'disc' }}>
                          <li style={{ marginBottom: '10px' }}>
                            <Typography gutterBottom>
                              "Did you know? We installed a new tower in your area so you can enjoy
                              a better network experience. To learn more, visit our site."
                            </Typography>
                          </li>
                          <li style={{ marginBottom: '10px' }}>
                            <Typography gutterBottom>
                              {
                                '"Diwali is around the corner! Join us at {{1}} on October 24 to celebrate with friends and family. For more details about our event, click {{2}}."'
                              }
                            </Typography>
                          </li>
                          <li style={{ marginBottom: '10px' }}>
                            <Typography gutterBottom>
                              Hi [Customer's First Name]! We’re excited to introduce our latest
                              [Product/Service], designed to [mention key benefit]. As a thank you
                              for being a loyal subscriber, enjoy an exclusive [Discount
                              Percentage]% off with code WHATSAPP20. Discover more and grab your
                              offer here: [Link]. Feel free to reply with any questions!
                            </Typography>
                          </li>
                        </ul>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          width: '30%',
                          padding: '10px',
                          verticalAlign: 'top',
                          border: '1px solid #ccc',
                          minWidth: '400px ',
                        }}
                      >
                        <Typography gutterBottom>
                          <strong>Exclusive Webinars or Workshops :</strong>
                          <br />
                          <strong>•</strong> Send personalized invitations to specific customer
                          segments who are most likely to be interested in the webinar or workshop.
                        </Typography>
                      </TableCell>
                      <TableCell style={{ padding: '10px', border: '1px solid #ccc' }}>
                        <ul style={{ paddingLeft: '20px', margin: 0, listStyleType: 'disc' }}>
                          <li style={{ marginBottom: '10px' }}>
                            <Typography gutterBottom>
                              "Hi [Customer's First Name]! Join us for an exclusive
                              [Webinar/Workshop Title] on [Date] at [Time]. Discover [Key Benefit or
                              Topic] and get insider tips from our experts. Reserve your spot now:
                              [Registration Link]. Looking forward to seeing you there!"
                            </Typography>
                          </li>
                          <li style={{ marginBottom: '10px' }}>
                            <Typography gutterBottom>
                              "Hi [Customer's First Name]! Don’t miss our exclusive
                              [Webinar/Workshop Title] on [Date] at [Time]. Learn about [Key Benefit
                              or Topic] and engage with industry experts. Secure your spot here:
                              [Registration Link]. See you there!"
                            </Typography>
                          </li>
                        </ul>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  /* width: 85%; */
                  marginTop: '16px',
                }}
              >
                <Alert severity="info" sx={{ width: '85%', fontSize: '14px' }}>
                  Please note: The examples provided are for illustration purposes only. Templates
                  with similar content or wording might be classified differently depending on their
                  specific details.
                </Alert>
              </div>
            </div>
          )}
          {activeTab === 1 && (
            <div style={{ marginLeft: '14px', marginRight: '14px' }}>
              <Typography variant="h6" paragraph style={{ textAlign: 'justify' }}>
                General Guidelines for Creating Utility Message Template
              </Typography>
              <Typography gutterBottom paragraph style={{ textAlign: 'justify' }}>
                Utility templates are pre-approved message formats designed to address specific
                transactions. They are used primarily to confirm, suspend, or alter a particular
                transaction or subscription. These templates are pre-approved and are intended for
                practical use, emphasizing operational details over promotional content.
              </Typography>
              <Typography gutterBottom paragraph style={{ textAlign: 'justify' }}>
                <strong>For instance,</strong> notifications regarding an active transaction,
                updates after a purchase, or statements for recurring billing are examples of
                messages that fall into this category.
              </Typography>
              <Typography gutterBottom paragraph style={{ textAlign: 'justify' }}>
                <strong>•</strong> Let's explore a few examples to show how messages fit into
                various marketing template categories:
              </Typography>
              <Typography variant="h6" gutterBottom mt={2}>
                Examples:
              </Typography>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Table style={{ width: '85%', borderCollapse: 'collapse' }}>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        style={{
                          width: '30%',
                          padding: '10px',
                          verticalAlign: 'top',
                          border: '1px solid #ccc',
                          minWidth: '400px ',
                        }}
                      >
                        <Typography gutterBottom variant="h6">
                          Order Management
                        </Typography>
                        <Typography gutterBottom>
                          <strong>•</strong> Use specific order or transaction details in your
                          message to confirm, update, or cancel an order or transaction with a
                          customer.
                        </Typography>
                      </TableCell>
                      <TableCell style={{ padding: '10px', border: '1px solid #ccc' }}>
                        <ul style={{ paddingLeft: '20px', margin: 0, listStyleType: 'disc' }}>
                          <li style={{ marginBottom: '10px' }}>
                            <Typography>"Your order #0021 is confirmed"</Typography>
                          </li>
                          <li style={{ marginBottom: '10px' }}>
                            <Typography>
                              {' '}
                              {
                                '"Your order {{1}} has been successfully confirmed. We’ll update you when your package is on its way."'
                              }
                            </Typography>
                          </li>
                          <li style={{ marginBottom: '10px' }}>
                            <Typography>
                              "We regret to inform you that an item from your order is currently on
                              backorder. We will provide an estimated shipping date soon. If you
                              prefer to cancel and get a refund, please click here: [Link]."
                            </Typography>
                          </li>
                          <li style={{ marginBottom: '10px' }}>
                            <Typography>
                              {' '}
                              {
                                '"Your order {{1}} has been successfully canceled. If you have any questions or need further assistance, please let us know."'
                              }
                            </Typography>
                          </li>
                        </ul>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          width: '30%',
                          padding: '10px',
                          verticalAlign: 'top',
                          border: '1px solid #ccc',
                          minWidth: '400px ',
                        }}
                      >
                        <Typography gutterBottom variant="h6">
                          Managing Opt-In on WhatsApp
                        </Typography>
                        <Typography gutterBottom>
                          <strong>•</strong> Verify the consent to receive WhatsApp messages
                          following an opt-in collected through other platforms (such as a website
                          or email). Also, confirm any requests to opt out.
                        </Typography>
                      </TableCell>
                      <TableCell style={{ padding: '10px', border: '1px solid #ccc' }}>
                        <ul style={{ paddingLeft: '20px', margin: 0, listStyleType: 'disc' }}>
                          <li style={{ marginBottom: '10px' }}>
                            <Typography>
                              "Hello [Name]! 🎉 Thank you for signing up to receive updates from us
                              on WhatsApp. You're all set to receive our latest news, offers, and
                              updates directly here. If you ever want to unsubscribe, just let us
                              know. Have a great day!"
                            </Typography>
                          </li>
                          <li style={{ marginBottom: '10px' }}>
                            <Typography>
                              "Thank you for confirming your opt-out preference. You will no longer
                              receive messages from us on WhatsApp."
                            </Typography>
                          </li>
                          <li style={{ marginBottom: '10px' }}>
                            <Typography>
                              "Thanks for confirming opt-in! You’re in. You’ll now receive
                              notifications via WhatsApp."
                            </Typography>
                          </li>
                        </ul>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          width: '30%',
                          padding: '10px',
                          verticalAlign: 'top',
                          border: '1px solid #ccc',
                          minWidth: '400px ',
                        }}
                      >
                        <Typography gutterBottom variant="h6">
                          Feedback Surveys
                        </Typography>
                        <Typography gutterBottom>
                          <strong>•</strong> Collect feedback on previous orders, interactions or
                          ongoing relationships with customers.
                        </Typography>
                      </TableCell>
                      <TableCell style={{ padding: '10px', border: '1px solid #ccc' }}>
                        <ul style={{ paddingLeft: '20px', margin: 0, listStyleType: 'disc' }}>
                          <li style={{ marginBottom: '10px' }}>
                            <Typography>
                              {' '}
                              {
                                'Your order {{1}} has been successfully delivered! If you encountered any issues, please contact us here: {{2}}.'
                              }
                            </Typography>
                          </li>
                          <li style={{ marginBottom: '10px' }}>
                            <Typography>
                              "We value your feedback as it helps us improve. To share your thoughts
                              on your recent visit to our location, please click here . Thank you!"
                            </Typography>
                          </li>
                          <li style={{ marginBottom: '10px' }}>
                            <Typography>
                              {' '}
                              {
                                '"You recently chatted with us online regarding order . We’d love to hear about your experience. Click here to complete a brief survey: {{2}}."'
                              }
                            </Typography>
                          </li>
                        </ul>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          width: '30%',
                          padding: '10px',
                          verticalAlign: 'top',
                          border: '1px solid #ccc',
                          minWidth: '400px ',
                        }}
                      >
                        <Typography gutterBottom variant="h6">
                          Account Alerts or Updates
                        </Typography>
                        <Typography gutterBottom>
                          <strong>•</strong> Communicate crucial account updates, such as urgent
                          alerts, safety notifications, payment reminders, and other information
                          related to products or services that have already been purchased or
                          subscribed to.
                        </Typography>
                      </TableCell>
                      <TableCell style={{ padding: '10px', border: '1px solid #ccc' }}>
                        <ul style={{ paddingLeft: '20px', margin: 0, listStyleType: 'disc' }}>
                          <li style={{ marginBottom: '10px' }}>
                            <Typography>
                              "Account update for the one ending in [Date]: Your current balance is
                              [amount]."
                            </Typography>
                          </li>
                          <li style={{ marginBottom: '10px' }}>
                            <Typography>
                              {' '}
                              {
                                'To complete your profile setup, please upload a photo by clicking here: {{1}}.'
                              }
                            </Typography>
                          </li>
                          <li style={{ marginBottom: '10px' }}>
                            <Typography>
                              {' '}
                              {
                                '"Our service will be temporarily unavailable from {{1}} to {{2}} for maintenance. We apologize for any inconvenience."'
                              }
                            </Typography>
                          </li>
                        </ul>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  /* width: 85%; */
                  marginTop: '16px',
                }}
              >
                <Alert severity="info" sx={{ width: '85%', fontSize: '14px' }}>
                  Please note: The examples provided are for illustration purposes only. Templates
                  with similar content or wording might be classified differently depending on their
                  specific details.
                </Alert>
              </div>
            </div>
          )}
        </Box>
      </Card>
    </PageContainer>
  );
}

export default GuidelinesTemplate;
