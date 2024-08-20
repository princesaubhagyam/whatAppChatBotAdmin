import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  MenuItem,
  FormControl,
  Typography,
  FormHelperText,
  CardMedia,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  Card,
  InputAdornment,
} from '@mui/material';
import React, { useState, useEffect } from 'react';

import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import ParentCard from 'src/components/shared/ParentCard';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import Languages from 'src/utils/Languages.json';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router';
import { LoadingButton } from '@mui/lab';
import img from 'src/assets/images/backgrounds/Template_background.jpg';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import createMetaAxiosInstance from 'src/api/axiosClientMeta';

const BCrumb = [
  { to: '/', title: 'Home' },
  { to: '/templates', title: 'Templates' },
  { title: 'Create Template' },
];

const category = [
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'UTILITY', label: 'Utility' },
  { value: 'AUTHENTICATION', label: 'Authentication' },
];

yup.addMethod(yup.string, 'containsUnderscore', function (message) {
  return this.test('contains-underscore', message, function (value) {
    const { path, createError } = this;
    return (
      (value && value.includes('_')) ||
      createError({ path, message: message || 'Must contain at least one underscore' })
    );
  });
});

const validationSchema = yup.object({
  name: yup
    .string()
    .required('Display Name is required')
    .matches(/^[a-z_]+$/, 'Must be in lowercase and contain only underscores')
    .containsUnderscore('Must contain at least one underscore'),
  category: yup.string().required('Category is Required'),
  language: yup.string().required('Language is Required'),
});

export default function CreateTemplate() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [HeaderSelect, setHeaderSelect] = useState('TEXT');
  const [buttonSelect, setButtonSelect] = useState('QUICK_REPLY');
  const [loading, setLoading] = useState(false);
  const [preData, setPreData] = useState();
  const [mediaType, setMediaType] = useState('');
  const [mediaContent, setMediaContent] = useState(null);
  const [previewHtml, setPreviewHtml] = useState('');
  const CHARACTER_LIMIT = 1000;
  const CHARACTER_LIMIT_TEXT = 30;
  const CHARACTER_LIMIT_FOOTER = 50;

  const formik = useFormik({
    initialValues: {
      name: '',
      category: '',
      language: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setStep(1);
      setPreData(values);
    },
  });

  const formikTemplate = useFormik({
    initialValues: {
      body: '',
      buttonText: '',
      footer: '',
      text: '',
    },
    onSubmit: async (values) => {
      setLoading(true);
      let reqBody = {
        name: preData.name,
        language: preData.language,
        category: preData.category,
        components: [
          {
            type: 'HEADER',
            format: HeaderSelect,
            text: HeaderSelect === 'TEXT' ? values.text : '',
            media: HeaderSelect === 'MEDIA' ? mediaContent : null,
          },
          {
            type: 'BODY',
            text: values.body,
          },
          {
            type: 'FOOTER',
            text: values.footer,
          },
          {
            type: 'BUTTONS',
            buttons: [
              {
                type: 'QUICK_REPLY',
                text: values.buttonText,
              },
            ],
          },
        ],
      };
      console.log(reqBody);
      const metaClient = createMetaAxiosInstance();
      const response = await metaClient.post('/message_templates', reqBody);
      console.log(response);
      setLoading(false);
      navigate('/templates');
    },
  });

  useEffect(() => {
    const formatText = (text) => {
      const htmlText = text
        .replace(/\*(.*?)\*/g, '<b>$1</b>') // Bold
        .replace(/_(.*?)_/g, '<i>$1</i>'); // Italic
      setPreviewHtml(htmlText);
    };

    formatText(formikTemplate.values.body);
  }, [formikTemplate.values.body]);

  const handleHeaderSelectChange = (event) => {
    const value = event.target.value;
    setHeaderSelect(value);
    if (value === 'MEDIA') {
      formikTemplate.setFieldValue('text', '');
      formikTemplate.setFieldValue('body', '');
      formikTemplate.setFieldValue('footer', '');
      formikTemplate.setFieldValue('buttonText', '');
    }
  };

  const handleMediaTypeChange = (event) => {
    setMediaType(event.target.value);
  };

  const handleMediaContentChange = (event) => {
    setMediaContent(URL.createObjectURL(event.target.files[0]));
  };

  return (
    <PageContainer title="Create Template" description="this is Search Table page">
      {/* breadcrumb */}
      <Breadcrumb title="Create Template" items={BCrumb} />
      {/* end breadcrumb */}
      {step === 0 && (
        <ParentCard title="New message template">
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item lg={6} md={12} sm={12}>
                <CustomFormLabel htmlFor="name">Display name</CustomFormLabel>
                <Typography variant="subtitle1">Name your message template.</Typography>
                <CustomTextField
                  fullWidth
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
                {formik.errors.name && (
                  <FormHelperText error id="name">
                    {formik.errors.name}
                  </FormHelperText>
                )}
                <CustomFormLabel htmlFor="category">Select Category</CustomFormLabel>
                <Typography variant="subtitle1">
                  Choose a category that best describes your message template.
                </Typography>
                <CustomSelect
                  id="category"
                  fullWidth
                  name="category"
                  variant="outlined"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                >
                  {category.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </CustomSelect>
                {formik.errors.category && (
                  <FormHelperText error id="category">
                    {formik.errors.category}
                  </FormHelperText>
                )}
                <CustomFormLabel htmlFor="language">Select language</CustomFormLabel>
                <Typography variant="subtitle1">
                  Choose languages for your message template. You can delete or add more languages
                  later.
                </Typography>
                <CustomSelect
                  id="language"
                  fullWidth
                  name="language"
                  variant="outlined"
                  value={formik.values.language}
                  onChange={formik.handleChange}
                >
                  {Languages.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.flagname}
                    </MenuItem>
                  ))}
                </CustomSelect>
                {formik.errors.language && (
                  <FormHelperText error id="language">
                    {formik.errors.language}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item lg={12} md={12} sm={12}>
                <Button variant="contained" color="primary" sx={{ mr: 1 }} type="submit">
                  Next
                </Button>
                <Button variant="contained" color="error" onClick={() => navigate(-1)}>
                  Back
                </Button>
              </Grid>
            </Grid>
          </form>
        </ParentCard>
      )}
      {step === 1 && (
        <>
          <ParentCard title="Edit template">
            <form onSubmit={formikTemplate.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item lg={8} md={12} sm={12}>
                  <CustomFormLabel htmlFor="name">Header</CustomFormLabel>
                  <Typography variant="subtitle1">
                    Add a title or choose which type of media you'll use for this header.
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <CustomSelect
                        fullWidth
                        id="HeaderSelect"
                        name="HeaderSelect"
                        value={HeaderSelect}
                        onChange={handleHeaderSelectChange}
                      >
                        <MenuItem value="TEXT">Text</MenuItem>
                        <MenuItem value="MEDIA">Media</MenuItem>
                      </CustomSelect>
                    </Grid>
                    {HeaderSelect === 'MEDIA' && (
                      <>
                        <Grid item xs={3}>
                          <CustomSelect
                            fullWidth
                            id="mediaType"
                            name="mediaType"
                            value={mediaType}
                            onChange={handleMediaTypeChange}
                          >
                            <MenuItem value="IMAGE">Image</MenuItem>
                            <MenuItem value="DOCUMENT">Document</MenuItem>
                            <MenuItem value="VIDEO">Video</MenuItem>
                          </CustomSelect>
                        </Grid>
                        <Grid item xs={3}>
                          <Button
                            variant="outlined"
                            component="label"
                            startIcon={<FileUploadIcon />}
                          >
                            Upload
                            <input
                              hidden
                              accept={mediaType + '/*'}
                              type="file"
                              onChange={handleMediaContentChange}
                            />
                          </Button>
                        </Grid>
                        <Grid item xs={12}>
                          {mediaContent && (
                            <Card>
                              <CardMedia
                                component={mediaType.toLowerCase()}
                                height="300"
                                src={mediaContent}
                                controls
                              />
                            </Card>
                          )}
                        </Grid>
                      </>
                    )}
                  </Grid>

                  <CustomFormLabel htmlFor="body">Body</CustomFormLabel>
                  <Typography variant="subtitle1">
                    This is the main message you want to send. Make sure your text includes any
                    details you want to share with the recipient.
                  </Typography>
                  <CustomTextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    id="body"
                    name="body"
                    inputProps={{
                      maxLength: CHARACTER_LIMIT,
                    }}
                    helperText={`${formikTemplate.values.body.length}/${CHARACTER_LIMIT}`}
                    value={formikTemplate.values.body}
                    onChange={formikTemplate.handleChange}
                  />

                  <CustomFormLabel htmlFor="footer">Footer</CustomFormLabel>
                  <Typography variant="subtitle1">
                    Include a short note or legal disclaimer in the footer of your message.
                  </Typography>
                  <CustomTextField
                    fullWidth
                    variant="outlined"
                    id="footer"
                    name="footer"
                    inputProps={{
                      maxLength: CHARACTER_LIMIT_FOOTER,
                    }}
                    helperText={`${formikTemplate.values.footer.length}/${CHARACTER_LIMIT_FOOTER}`}
                    value={formikTemplate.values.footer}
                    onChange={formikTemplate.handleChange}
                  />

                  <CustomFormLabel htmlFor="buttonText">Button</CustomFormLabel>
                  <Typography variant="subtitle1">Choose a button for your message.</Typography>
                  <RadioGroup
                    aria-labelledby="button-select-label"
                    name="button-select"
                    value={buttonSelect}
                    onChange={(e) => setButtonSelect(e.target.value)}
                  >
                    <FormControlLabel value="QUICK_REPLY" control={<Radio />} label="Quick Reply" />
                  </RadioGroup>
                  <CustomTextField
                    fullWidth
                    variant="outlined"
                    id="buttonText"
                    name="buttonText"
                    inputProps={{
                      maxLength: CHARACTER_LIMIT_TEXT,
                    }}
                    helperText={`${formikTemplate.values.buttonText.length}/${CHARACTER_LIMIT_TEXT}`}
                    value={formikTemplate.values.buttonText}
                    onChange={formikTemplate.handleChange}
                  />
                </Grid>
                <Grid item lg={4} md={12} sm={12}>
                  <Card>
                    <CustomFormLabel>Preview</CustomFormLabel>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Header
                      </Typography>
                      {HeaderSelect === 'TEXT' ? (
                        <Typography variant="body1">{formikTemplate.values.text}</Typography>
                      ) : (
                        mediaContent && (
                          <CardMedia
                            component={mediaType.toLowerCase()}
                            height="300"
                            src={mediaContent}
                            controls
                          />
                        )
                      )}
                      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Body
                      </Typography>
                      <Typography
                        variant="body1"
                        dangerouslySetInnerHTML={{ __html: previewHtml }}
                      />
                      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Footer
                      </Typography>
                      <Typography variant="body2">{formikTemplate.values.footer}</Typography>
                      <Button variant="contained" sx={{ mt: 2 }}>
                        {formikTemplate.values.buttonText}
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <LoadingButton
                  loading={loading}
                  loadingPosition="start"
                  startIcon={<LocalPhoneIcon />}
                  variant="contained"
                  type="submit"
                >
                  Save
                </LoadingButton>
                <Button variant="contained" color="error" onClick={() => setStep(0)}>
                  Back
                </Button>
              </Stack>
            </form>
          </ParentCard>
        </>
      )}
    </PageContainer>
  );
}
import React, { useEffect, useState } from 'react';
import {
  CardContent,
  Card,
  Typography,
  Collapse,
  Box,
  IconButton,
  TextField,
  Button,
  Avatar,
  Input,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { IconEdit } from '@tabler/icons';
import SaveIcon from '@mui/icons-material/Save';
import { Cancel, CameraAlt } from '@mui/icons-material';
import createMetaAxiosInstance from 'src/api/axiosClientMeta';
import apiClient from 'src/api/axiosClient';

const ViewProfileCard = () => {
  const [contactName, setContactName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profileDetails, setProfileDetails] = useState({});
  const [editableProfile, setEditableProfile] = useState({});
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [newProfilePictureHandle, setNewProfilePictureHandle] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metaClient = createMetaAxiosInstance();
        const phoneResponse = await metaClient.get('phone_numbers');
        const fetchedContactName = phoneResponse?.data?.data[0]?.verified_name || 'N/A';
        const fetchedPhoneNumber = phoneResponse?.data?.data[0]?.display_phone_number || 'N/A';

        setContactName(fetchedContactName);
        setPhoneNumber(fetchedPhoneNumber);

        const phoneId = localStorage.getItem('phone_id');
        const profileResponse = await metaClient.get(
          `https://graph.facebook.com/${phoneId}/whatsapp_business_profile`,
          {
            params: {
              fields: 'about,address,description,email,profile_picture_handle,websites,vertical',
            },
          },
        );

        const profileData = profileResponse?.data?.data[0] || {};
        setProfileDetails(profileData);
        setEditableProfile(profileData);
        if (profileData.profile_picture_handle) {
          // Assuming the profile picture URL needs a base URL
          setPreviewImage(profileData.profile_picture_handle);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'websites') {
      setEditableProfile((prev) => ({
        ...prev,
        [name]: value.split(',').map((url) => url.trim()),
      }));
    } else {
      setEditableProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imageUrl = URL.createObjectURL(file);
        setPreviewImage(imageUrl);

        // Upload image
        const sessionResponse = await apiClient.post(
          `/api/create_session_facebook/?file_length=${file.size}&file_type=${file.type}`,
        );

        if (sessionResponse && sessionResponse.data.id) {
          let mediaFile = new FormData();
          mediaFile.append('file', file);

          const uploadResponse = await apiClient.post(
            `/api/upload_file_facebook/${sessionResponse.data.id}`,
            mediaFile,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
            },
          );

          if (uploadResponse && uploadResponse.data.res && uploadResponse.data.res.h) {
            const profilePictureHandle = uploadResponse.data.res.h;
            setNewProfilePictureHandle(profilePictureHandle);
          } else {
            console.error('Image upload failed:', uploadResponse.data.message);
          }
        } else {
          console.error('Failed to create session.');
        }
      } catch (error) {
        console.error(
          'Error uploading file:',
          error.response ? error.response.data : error.message,
        );
      }
    }
  };

  const handleSave = async () => {
    try {
      const metaClient = createMetaAxiosInstance();
      const phoneId = localStorage.getItem('phone_id');
      const dataToUpdate = {
        ...editableProfile,
        profile_picture_handle: newProfilePictureHandle || profileDetails.profile_picture_handle,
      };

      await metaClient.post(
        `https://graph.facebook.com/${phoneId}/whatsapp_business_profile`,
        dataToUpdate,
      );

      setProfileDetails((prev) => ({ ...prev, ...dataToUpdate }));
      setIsEditing(false);
      setNewProfilePictureHandle(null);
      setPreviewImage('');
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  return (
    <Card sx={{ padding: '5px', paddingLeft: '32px', paddingRight: '32px' }}>
      <CardContent sx={{ padding: '8px' }}>
        <Typography variant="h5">{contactName}</Typography>
        <Typography>{phoneNumber}</Typography>
        <Box sx={{ background: '#00720b40', padding: '5px 5px 5px 5px', width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0px',
              cursor: 'pointer',
              height: '18px',
            }}
            onClick={handleToggle}
          >
            <Typography color="primary" sx={{ cursor: 'pointer' }}>
              View your profile
            </Typography>
            <IconButton>{open ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
          </Box>
          <Collapse in={open}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton onClick={handleEditToggle}>
                {isEditing ? <Cancel color="error" /> : <IconEdit style={{ color: 'green' }} />}
              </IconButton>
            </div>
            <Box sx={{ mt: 0, display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  marginRight: '1rem',
                  marginTop: '0.50rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <Avatar
                  src={previewImage || (newProfilePictureHandle ? `https://example.com/path/to/images/${newProfilePictureHandle}` : profileDetails?.profile_picture_handle ? `https://example.com/path/to/images/${profileDetails.profile_picture_handle}` : '')}
                  alt="Profile"
                  sx={{
                    width: 100,
                    height: 100,
                    backgroundColor: '#b6dbc5',
                    marginBottom: 2,
                    border: '3px solid #cfd5d5',
                  }}
                  style={{ borderRadius: '50%' }}
                />
                {isEditing && (
                  <IconButton
                    component="label"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'white',
                      borderRadius: '50%',
                    }}
                  >
                    <CameraAlt style={{ color: 'green' }} />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      sx={{ display: 'none' }}
                    />
                  </IconButton>
                )}
              </div>
              <div style={{ width: '90%' }}>
                {isEditing ? (
                  <>
                    <div style={{ display: 'flex', gap: '22px' }}>
                      <TextField
                        name="email"
                        label="Email"
                        value={editableProfile.email || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        sx={{
                          backgroundColor: '#ffffff73',
                          borderRadius: '6px',
                        }}
                        autoFocus="true"
                      />
                      <TextField
                        name="websites"
                        label="Websites"
                        value={editableProfile.websites?.join(', ') || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        sx={{
                          backgroundColor: '#ffffff73',
                          borderRadius: '6px',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '22px' }}>
                      <TextField
                        name="vertical"
                        label="Vertical"
                        value={editableProfile.vertical || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        sx={{
                          backgroundColor: '#ffffff73',
                          borderRadius: '6px',
                        }}
                      />
                      <TextField
                        name="messaging_product"
                        label="Messaging Product"
                        value={editableProfile.messaging_product || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        sx={{
                          backgroundColor: '#ffffff73',
                          borderRadius: '6px',
                        }}
                      />
                    </div>
                    <TextField
                      name="address"
                      label="Address"
                      value={editableProfile.address || ''}
                      onChange={handleChange}
                      rows={2}
                      multiline
                      margin="normal"
                      fullWidth
                      sx={{
                        backgroundColor: '#ffffff73',
                        borderRadius: '6px',
                      }}
                    />

                    <TextField
                      name="description"
                      label="Description"
                      value={editableProfile.description || ''}
                      onChange={handleChange}
                      rows={2}
                      multiline
                      margin="normal"
                      fullWidth
                      sx={{
                        backgroundColor: '#ffffff73',
                        borderRadius: '6px',
                      }}
                    />
                    <TextField
                      name="about"
                      label="About"
                      value={editableProfile.about || ''}
                      onChange={handleChange}
                      rows={2}
                      multiline
                      margin="normal"
                      fullWidth
                      sx={{
                        backgroundColor: '#ffffff73',
                        borderRadius: '6px',
                      }}
                    />
                  </>
                ) : (
                  <>
                    {profileDetails?.messaging_product && (
                      <Typography lineHeight={'1.664rem'}>
                        <strong style={{ fontWeight: '500' }}>Messaging Product:</strong>{' '}
                        {profileDetails?.messaging_product}
                      </Typography>
                    )}
                    {profileDetails?.email && (
                      <Typography lineHeight={'1.664rem'}>
                        <strong style={{ fontWeight: '500' }}>Email:</strong>{' '}
                        {profileDetails?.email}
                      </Typography>
                    )}
                    {profileDetails?.websites && profileDetails?.websites.length > 0 && (
                      <Typography lineHeight={'1.664rem'}>
                        <strong style={{ fontWeight: '500' }}>Websites:</strong>{' '}
                        {profileDetails?.websites.join(', ')}
                      </Typography>
                    )}
                    {profileDetails?.address && (
                      <Typography lineHeight={'1.664rem'}>
                        <strong style={{ fontWeight: '500' }}>Address:</strong>{' '}
                        {profileDetails?.address}
                      </Typography>
                    )}
                    {profileDetails?.description && (
                      <Typography lineHeight={'1.664rem'}>
                        <strong style={{ fontWeight: '500' }}>Description:</strong>{' '}
                        {profileDetails?.description}
                      </Typography>
                    )}
                    {profileDetails?.about && (
                      <Typography lineHeight={'1.664rem'}>
                        <strong style={{ fontWeight: '500' }}>About:</strong>{' '}
                        {profileDetails?.about}
                      </Typography>
                    )}
                    {profileDetails?.vertical && (
                      <Typography lineHeight={'1.664rem'}>
                        <strong style={{ fontWeight: '500' }}>Vertical:</strong>{' '}
                        {profileDetails?.vertical}
                      </Typography>
                    )}
                  </>
                )}
              </div>
            </Box>
          </Collapse>
        </Box>
        {isEditing && (
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ViewProfileCard;
