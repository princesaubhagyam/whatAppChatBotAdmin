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
