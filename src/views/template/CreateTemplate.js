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
  TextField,
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
import Undo from '@mui/icons-material/Undo';
import LaunchIcon from '@mui/icons-material/Launch';
import Launch from '@mui/icons-material/Launch';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import { Replay5Outlined, Reply } from '@mui/icons-material';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import apiClient from 'src/api/axiosClient';
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
const validatioSecondSchema = yup.object().shape({
  type: yup.string().oneOf(['HEADER', 'BODY', 'FOOTER', 'BUTTONS']).required(),
  format: yup.string().when('type', {
    is: 'HEADER',
    then: yup.string().oneOf(['TEXT']).required(),
    otherwise: yup.string().notRequired(),
  }),
  text: yup.string().when('type', {
    is: 'BODY',
    then: yup.string().required(),
    otherwise: yup.string().notRequired(),
  }),
  example: yup.object().when('type', {
    is: 'HEADER',
    then: yup
      .object({
        header_text: yup.array().of(yup.string()).required(),
      })
      .required(),
    is: 'BODY',
    then: yup
      .object({
        body_text: yup.array().of(yup.array().of(yup.string())).required(),
      })
      .required(),
    otherwise: yup.object().notRequired(),
  }),
  buttons: yup.array().when('type', {
    is: 'BUTTONS',
    then: yup
      .array()
      .of(
        yup
          .object()
          .shape({
            type: yup.string().oneOf(['QUICK_REPLY']).required(),
            text: yup.string().required('Quick reply button text requied!'),
          })
          .required(),
      )
      .required(),
    otherwise: yup.array().notRequired(),
  }),
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
  const [mediaRes, setMediaRes] = useState();
  console.log(mediaRes);
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

  const [variables, setVariables] = useState([{ id: 1, value: '' }]);
  const [variablesTitle, setVariablesTitle] = useState([{ id: 1, value: '' }]);

  const addVariable = () => {
    setVariables([...variables, { id: variables.length + 1, value: '' }]);
    formikTemplate.values.body = formikTemplate.values.body + `{{${variables.length + 1}}}`;
  };

  const removeVariable = (id) => {
    setVariables(variables.filter((variable) => variable.id !== id));
    const placeholderToRemove = `{{${id}}}`;
    formikTemplate.values.body = formikTemplate.values.body.replace(placeholderToRemove, '');
  };

  const handleVariableChange = (id, event) => {
    const newVariables = variables.map((variable) => {
      if (variable.id === id) {
        return { ...variable, value: event.target.value };
      }
      return variable;
    });
    setVariables(newVariables);
  };
  const addVariableTitle = () => {
    setVariablesTitle([...variablesTitle, { id: variablesTitle.length + 1, value: '' }]);
    formikTemplate.values.text = formikTemplate.values.text + `{{${variablesTitle.length + 1}}}`;
  };

  const removeVariableTitle = (id) => {
    setVariablesTitle(variablesTitle.filter((variable) => variable.id !== id));
    const placeholderToRemove = `{{${id}}}`;
    formikTemplate.values.text = formikTemplate.values.text.replace(placeholderToRemove, '');
  };

  const handleVariableChangeTitle = (id, event) => {
    const newVariables = variablesTitle.map((variable) => {
      if (variable.id === id) {
        return { ...variable, value: event.target.value };
      }
      return variable;
    });
    setVariablesTitle(newVariables);
  };
  const formikTemplate = useFormik({
    initialValues: {
      body: 'Welcome {{1}}!',
      buttonText: '',
      footer: '',
      text: 'Hi {{1}}!',
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const bodyValues = variables.map((v) => v.value);
        const titleValues = variables.map((v) => v.value);

        let reqBody = {
          name: preData.name,
          language: preData.language,
          category: preData.category,
          components: [
            {
              type: 'HEADER',
              format: HeaderSelect,
              text: HeaderSelect === 'TEXT' ? values.text : '',
              // media: HeaderSelect === 'MEDIA' ? mediaContent : null,
              example: {
                header_text: titleValues,
              },
            },
            {
              type: 'BODY',
              text: values.body,
              example: {
                body_text: [bodyValues],
              },
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
        if (HeaderSelect === 'MEDIA') {
          reqBody.components[0] = {
            type: 'HEADER',
            format: mediaType === 'image' ? 'IMAGE' : 'VIDEO',
            example: {
              header_handle: [mediaRes],
            },
          };
        }
        if (phoneNumber) {
          reqBody.components[3] = {
            type: 'BUTTONS',
            buttons: [
              {
                type: 'PHONE_NUMBER',
                text: values.buttonText,
                phone_number: phoneNumber,
              },
            ],
          };
        }
        if (callToActionURL) {
          reqBody.components[3] = {
            type: 'BUTTONS',
            buttons: [
              {
                type: 'URL',
                text: values.buttonText,
                url: callToActionURL,
                example: ['summer2023'],
                icon: buttonIcon,
              },
            ],
          };
        }
        let isFormIsValid = true;
        // reqBody.components.forEach((data, index) => {
        //   validatioSecondSchema
        //     .validate(data)
        //     .then(() => (isFormIsValid = true))
        //     .catch((err) => {
        //       isFormIsValid = false;

        //       toast.error(`${err.errors}`, { duration: 2000 });
        //     });
        // });

        if (isFormIsValid) {
          const metaClient = createMetaAxiosInstance();
          const response = await metaClient.post('/message_templates', reqBody);

          if (response) {
            setLoading(false);
            toast.success('Template created!', { duration: 2000 });
            navigate('/templates');
          }
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);

        toast.error(error.response.data.error.error_user_msg, { duration: 2000 });
      }
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

  const handleMediaContentChange = async (event) => {
    setMediaContent(URL.createObjectURL(event.target.files[0]));

    const response = await apiClient.post(
      `/api/create_session_facebook/?file_length=${event.target.files[0].size}&file_type=${event.target.files[0].type}`,
    );
    if (response) {
      let mediaFile = new FormData();
      mediaFile.append('data', event.target.files[0]);
      const finalResponse = await apiClient.post(
        `/api/upload_file_facebook/${response.data.id}`,
        mediaFile,
        {
          headers: { 'content-type': 'multipart/form-data' },
        },
      );

      setMediaRes(finalResponse.data.h);
      console.log(finalResponse.data.h);
    }
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
    let num = countPlaceholders(e.target.value);
    if (variables.length < num) {
      setVariables([...variables, { id: variables.length + 1, value: '' }]);
    }
    if (variables.length > num) {
      setVariables(variables.splice(-1));
    }
    setInputLength(e.target.value.length);
    formikTemplate.handleChange(e);
  };
  const handleFieldChangeTitle = (e) => {
    let num = countPlaceholders(e.target.value);
    if (variablesTitle.length < num) {
      setVariablesTitle([...variablesTitle, { id: variablesTitle.length + 1, value: '' }]);
    }
    if (variablesTitle.length > num) {
      setVariables(variablesTitle.splice(-1));
    }
    setInputLength(e.target.value.length);
    formikTemplate.handleChange(e);
  };
  const countPlaceholders = (template) => {
    const matches = template.match(/{{\d+}}/g);
    return matches ? matches.length : 0;
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
          {' '}
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
                            onChange={handleFieldChangeTitle}
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
                          {variablesTitle.map((variable, index) => (
                            <Box display="flex" alignItems="center" mt={2} key={variable.id}>
                              <TextField
                                fullWidth
                                size="small"
                                label={`{{${index + 1}}}`}
                                value={variable.value}
                                onChange={(event) => handleVariableChangeTitle(variable.id, event)}
                                variant="outlined"
                              />
                              <IconButton
                                aria-label="delete"
                                onClick={() => removeVariableTitle(variable.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          ))}
                          <Box mt={2}>
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              onClick={addVariableTitle}
                            >
                              Add Variable
                            </Button>
                          </Box>
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
                            <Button variant="outlined" component="label">
                              <FileUploadIcon fontSize="small" variant="outlined" />
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
                  {variables.map((variable, index) => (
                    <Box display="flex" alignItems="center" mt={2} key={variable.id}>
                      <TextField
                        fullWidth
                        size="small"
                        label={`{{${index + 1}}}`}
                        value={variable.value}
                        onChange={(event) => handleVariableChange(variable.id, event)}
                        variant="outlined"
                      />
                      <IconButton aria-label="delete" onClick={() => removeVariable(variable.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                  <Box mt={2}>
                    <Button variant="outlined" color="primary" size="small" onClick={addVariable}>
                      Add Variable
                    </Button>
                  </Box>
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
                    loadingPosition="center"
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
