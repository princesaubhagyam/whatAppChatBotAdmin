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
  IconButton,
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
import axiosClientBm from 'src/api/axiosClientBm';
import img from 'src/assets/images/backgrounds/Template_background.jpg';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Undo from '@mui/icons-material/Undo';
import LaunchIcon from '@mui/icons-material/Launch';
import Launch from '@mui/icons-material/Launch';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import { Replay5Outlined, Reply } from '@mui/icons-material';

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

const ErrorText = () => <span style={{ color: 'red' }}>Maximum characters already entered</span>;

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
  const [buttonIcon, setButtonIcon] = useState(<Reply />);

  const [loading, setLoading] = useState(false);
  const [preData, setPreData] = useState();
  const [mediaType, setMediaType] = useState('');
  const [mediaContent, setMediaContent] = useState(null);
  const [previewHtml, setPreviewHtml] = useState('');
  const [callToActionURL, setCallToActionURL] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [inputLength, setInputLength] = useState(0);

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
              {
                type: 'URL',
                text: values.buttonText,
              },
              {
                type: 'PHONE_NUMBER',
                text: values.buttonText,
              },
            ],
          },
        ],
      };
      console.log(reqBody);
      const response = await axiosClientBm.post('/message_templates', reqBody);
      console.log(response);
      setLoading(false);
      navigate('/templates');
    },
  });

  useEffect(() => {
    const formatText = (text) => {
      const htmlText = text
        .replace(/\*([^*]+)\*/g, '<b>$1</b>')
        .replace(/_(.*?)_/g, '<i>$1</i>')
        .replace(/~([^~]+)~/g, '<strike>$1</strike>');
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

  const handleButtonSelectChange = (event) => {
    const value = event.target.value;
    setButtonSelect(value);
    formikTemplate.setFieldValue('buttonText', '');
    switch (value) {
      case 'CALL_TO_PHONE':
        setButtonIcon(<LocalPhoneIcon />);
        break;
      case 'CALL_TO_ACTION':
        setButtonIcon(<Launch />);
        break;
      default:
        setButtonIcon(<Reply />);
        break;
    }
  };

  const handleFieldChange = (e) => {
    setInputLength(e.target.value.length);
    formikTemplate.handleChange(e);
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
                        variant="outlined"
                        value={HeaderSelect}
                        // onChange={(e) => setHeaderSelect(e.target.value)}
                        onChange={handleHeaderSelectChange}
                      >
                        <MenuItem value={'TEXT'}>Text</MenuItem>
                        <MenuItem value={'MEDIA'}>Media</MenuItem>
                      </CustomSelect>
                    </Grid>
                    <Grid item xs={9}>
                      {HeaderSelect === 'TEXT' && (
                        <>
                          <CustomTextField
                            fullWidth
                            id="text"
                            name="text"
                            value={formikTemplate.values.text}
                            onChange={formikTemplate.handleChange}
                            inputProps={{
                              maxLength: CHARACTER_LIMIT_TEXT,
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end" sx={{ fontSize: '12px !important' }}>
                                  <Typography
                                    sx={{ fontSize: '12px !important' }}
                                  >{`${formikTemplate.values.text.length}/${CHARACTER_LIMIT_TEXT}`}</Typography>
                                </InputAdornment>
                              ),
                            }}
                          />

                          {formikTemplate.errors.text && (
                            <FormHelperText error id="text">
                              {formikTemplate.errors.text}
                            </FormHelperText>
                          )}
                        </>
                      )}
                      {HeaderSelect === 'MEDIA' && (
                        <>
                          <RadioGroup
                            row
                            aria-labelledby="media-type-group"
                            name="media-type-group"
                            value={mediaType}
                            onChange={handleMediaTypeChange}
                          >
                            <FormControlLabel value="image" control={<Radio />} label="Image" />
                            <FormControlLabel value="video" control={<Radio />} label="Video" />
                            <FormControlLabel
                              value="document"
                              control={<Radio />}
                              label="Document"
                            />
                          </RadioGroup>
                          {mediaType && (
                            <Button variant="contained" component="label">
                              <FileUploadIcon fontSize="small" />
                              Upload
                              <input
                                type="file"
                                hidden
                                accept={
                                  mediaType === 'image'
                                    ? 'image/*'
                                    : mediaType === 'video'
                                    ? 'video/*'
                                    : 'application/pdf'
                                }
                                onChange={handleMediaContentChange}
                              />
                            </Button>
                          )}
                        </>
                      )}
                    </Grid>
                  </Grid>
                  <CustomFormLabel htmlFor="body">Body</CustomFormLabel>
                  <Typography variant="subtitle1">
                    The main part of your message, containing the message text.
                  </Typography>
                  <CustomTextField
                    fullWidth
                    // id="body"
                    name="body"
                    multiline
                    rows={4}
                    column={2}
                    inputProps={{
                      maxLength: CHARACTER_LIMIT,
                      sx: {
                        '& fieldset': {
                          borderColor: inputLength >= CHARACTER_LIMIT ? 'red' : 'grey',
                          borderWidth: inputLength >= CHARACTER_LIMIT ? 2 : 1,
                        },
                      },
                    }}
                    id="outlined-error-helper-text"
                    helperText={inputLength >= CHARACTER_LIMIT && <ErrorText />}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" sx={{ fontSize: '12px !important' }}>
                          <Typography
                            sx={{ fontSize: '12px !important' }}
                          >{`${formikTemplate.values.body.length}/${CHARACTER_LIMIT}`}</Typography>
                        </InputAdornment>
                      ),
                    }}
                    value={formikTemplate.values.body}
                    onChange={handleFieldChange}
                    // dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />

                  <CustomFormLabel htmlFor="footer">Footer</CustomFormLabel>
                  <Typography variant="subtitle1">
                    Add optional footer text. You can add a short, supporting message at the bottom
                    of your template.
                  </Typography>
                  <CustomTextField
                    fullWidth
                    id="footer"
                    name="footer"
                    value={formikTemplate.values.footer}
                    onChange={formikTemplate.handleChange}
                    inputProps={{
                      maxLength: CHARACTER_LIMIT_FOOTER,
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" sx={{ fontSize: '12px !important' }}>
                          <Typography
                            sx={{ fontSize: '12px !important' }}
                          >{`${formikTemplate.values.footer.length}/${CHARACTER_LIMIT_FOOTER}`}</Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {formikTemplate.errors.footer && (
                    <FormHelperText error id="footer">
                      {formikTemplate.errors.footer}
                    </FormHelperText>
                  )}
                  <CustomFormLabel htmlFor="buttonText">Button Text</CustomFormLabel>
                  <Typography variant="subtitle1">
                    Add a call-to-action button that appears below the body of your message.
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <CustomSelect
                        fullWidth
                        id="buttonSelect"
                        name="buttonSelect"
                        variant="outlined"
                        value={buttonSelect}
                        // onChange={(e) => setButtonSelect(e.target.value)}
                        onChange={handleButtonSelectChange}
                      >
                        <MenuItem value={'QUICK_REPLY'}>Quick Reply</MenuItem>
                        <MenuItem value={'CALL_TO_ACTION'}>Call to Action</MenuItem>
                        <MenuItem value={'CALL_TO_PHONE'}>Call to Phone</MenuItem>
                      </CustomSelect>
                    </Grid>
                    <Grid item xs={9}>
                      <CustomTextField
                        fullWidth
                        id="buttonText"
                        name="buttonText"
                        value={formikTemplate.values.buttonText}
                        onChange={formikTemplate.handleChange}
                      />
                      {formikTemplate.errors.buttonText && (
                        <FormHelperText error id="buttonText">
                          {formikTemplate.errors.buttonText}
                        </FormHelperText>
                      )}

                      {buttonSelect === 'CALL_TO_ACTION' && (
                        <>
                          <CustomFormLabel htmlFor="callToActionURL">URL</CustomFormLabel>
                          <CustomTextField
                            fullWidth
                            id="callToActionURL"
                            name="callToActionURL"
                            value={callToActionURL}
                            onChange={(e) => setCallToActionURL(e.target.value)}
                          />
                          {formikTemplate.errors.callToActionURL && (
                            <FormHelperText error id="callToActionURL">
                              {formikTemplate.errors.callToActionURL}
                            </FormHelperText>
                          )}
                        </>
                      )}

                      {buttonSelect === 'CALL_TO_PHONE' && (
                        <>
                          <Grid>
                            <CustomFormLabel htmlFor="phoneNumber">Phone Number</CustomFormLabel>

                            <CustomTextField
                              fullWidth
                              id="phoneNumber"
                              name="phoneNumber"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            {formikTemplate.errors.phoneNumber && (
                              <FormHelperText error id="phoneNumber">
                                {formikTemplate.errors.phoneNumber}
                              </FormHelperText>
                            )}
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item lg={4} md={12} sm={12}>
                  <Box>
                    <Typography variant="h6" mb={2}>
                      Preview
                    </Typography>
                  </Box>
                  <Box>
                    <CardMedia
                      component="div"
                      image={img}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        border: '1px solid lightgrey',
                        borderRadius: '8px',
                        p: 2,
                        mb: 2,
                        width: '100%',
                        minHeight: '520px',
                        maxHeight: '520px',
                        overflow: 'auto',
                        backgroundSize: 'cover',
                        boxShadow: '0px 1px 5px #00000025',
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: '#E9FEEE',
                          padding: 1,
                          boxShadow: '0px 1px 110px #00000025',
                          width: '100%',
                          maxHeight: '100%',
                          overflow: 'auto',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'pre-line',
                          wordWrap: 'break-word',
                          borderBottom: '1px solid #80808078',
                        }}
                      >
                        {/* {formikTemplate.values.text && (
                          <Box sx={{ mb: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: '600', fontSize: '0.85rem' }}
                            >
                              {formikTemplate.values.text}
                            </Typography>
                          </Box>
                        )}
                        {formikTemplate.values.HeaderSelectinput && HeaderSelect === 'MEDIA' && (
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="h5" sx={{ fontSize: '0.85rem', color: 'blue' }}>
                              {formikTemplate.values.HeaderSelectinput}
                            </Typography>
                          </Box>
                        )} */}
                        {HeaderSelect === 'TEXT' ? (
                          <Typography variant="h6" component="div">
                            {formikTemplate.values.text}
                          </Typography>
                        ) : mediaContent ? (
                          <CardMedia
                            component={mediaType === 'image' ? 'img' : mediaType}
                            src={mediaContent}
                            controls={mediaType === 'video'}
                            controlsList={mediaType === 'video' && []}
                            title={mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}
                            sx={{ height: 140, mb: 2 }}
                          />
                        ) : null}
                        {formikTemplate.values.body && (
                          <Box sx={{ mb: 1 }}>
                            <Typography
                              sx={{ fontSize: '0.83rem' }}
                              dangerouslySetInnerHTML={{ __html: previewHtml }}
                            />
                            {/* {formikTemplate.values.body} */}
                          </Box>
                        )}
                        {formikTemplate.values.footer && (
                          <Box sx={{ mb: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontStyle: 'bold', fontSize: '0.85rem', color: 'gray' }}
                            >
                              {formikTemplate.values.footer}
                            </Typography>
                          </Box>
                        )}
                        {/* {formikTemplate.values.buttonText && (
                          <Box>
                            <Button variant="contained" color="primary" size="small">
                              {formikTemplate.values.buttonText}
                            </Button>
                          </Box>
                        )} */}
                      </Box>
                      <Box sx={{ backgroundColor: 'white', width: '100%' }}>
                        {formikTemplate.values.buttonText && (
                          <Box>
                            <Button
                              sx={{
                                backgroundColor: 'transparent',
                                color: '#0093E1',
                                fontSize: '1rem',
                                fontWeight: '600',
                                width: '100%',
                                '&:hover': { backgroundColor: '#1a4d2e00', color: '#0093E1' },
                                display: 'flex',
                                justifyContent: 'center',
                              }}
                              // variant="contained"
                              // color="primary"
                              // size="small"
                            >
                              {/* <Undo size={24} style={{ marginRight: 2 }} /> */}
                              {buttonIcon}
                              {formikTemplate.values.buttonText}
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </CardMedia>
                  </Box>
                </Grid>

                <Grid item lg={12} md={12} sm={12}>
                  <LoadingButton
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<></>}
                    variant="contained"
                    color="primary"
                    sx={{ mr: 1 }}
                    type="submit"
                  >
                    Save
                  </LoadingButton>
                  <Button variant="contained" color="error" onClick={() => navigate('/templates')}>
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </form>
          </ParentCard>
        </>
      )}
    </PageContainer>
  );
}
