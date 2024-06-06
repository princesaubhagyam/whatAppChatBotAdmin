import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  MenuItem,
  FormControl,
  Alert,
  Typography,
  FormHelperText,
  CardMedia,
  Radio,
  RadioGroup,
  IconButton,
} from '@mui/material';
import React, { useState } from 'react';
import PageContainer from 'src/components/container/PageContainer';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import CustomRadio from 'src/components/forms/theme-elements/CustomRadio';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import ParentCard from 'src/components/shared/ParentCard';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import Languages from 'src/utils/Languages.json';
import { FieldArray, useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router';
import { IconMessage2Share } from '@tabler/icons';
import { Remove } from '@mui/icons-material';
const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  { to: '/templates', title: 'Templates' },
  { title: 'Create Template' },
];
const category = [
  {
    value: 'MARKETING',
    label: 'Marketing',
  },
  {
    value: 'UTILITY',
    label: 'Utility',
  },
  {
    value: 'AUTHENTICATION',
    label: 'Authentication',
  },
];

const validationSchema = yup.object({
  name: yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Display name is Required'),
  category: yup.string().required('Category is Required'),
  language: yup.string().required('Language is Required'),
});

export default function CreateTemplate() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [HeaderSelect, setHeaderSelect] = useState('TEXT');
  console.log(HeaderSelect);
  const formik = useFormik({
    initialValues: {
      name: '',
      category: '',
      language: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setStep(1);
    },
  });
  const formikTemplate = useFormik({
    initialValues: {
      name: '',
      category: '',
      language: '',
      dynamicFields: [{ value: '' }],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // setStep(1);
      console.log(values);
    },
  });
  const handleAddVariable = () => {
    formikTemplate.setFieldValue(
      'headerContent',
      formikTemplate.values.headerContent +
        ' {{' +
        (formikTemplate.values.dynamicFields.length + 1) +
        '}}',
    );
    formikTemplate.setFieldValue('dynamicFields', [
      ...formikTemplate.values.dynamicFields,
      { value: '' },
    ]);
  };
  return (
    <PageContainer title="Create Template" description="this is Search Table page">
      {/* breadcrumb */}
      <Breadcrumb title="Create Template" items={BCrumb} />
      {/* end breadcrumb */}
      {step === 0 && (
        <ParentCard title="New message template">
          {/* <Alert severity="info">Person Info</Alert> */}
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
                </CustomSelect>{' '}
                {formik.errors.category && (
                  <FormHelperText error id="category">
                    {formik.errors.category}
                  </FormHelperText>
                )}
                <CustomFormLabel htmlFor="category">Select language</CustomFormLabel>
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
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    mr: 1,
                  }}
                  type="submit"
                >
                  Next
                </Button>
                <Button variant="contained" color="error" onClick={() => navigate(-1)}>
                  Back
                </Button>
              </Grid>
            </Grid>
          </form>

          <Grid container spacing={3} mb={3} mt={1}></Grid>
        </ParentCard>
      )}
      {step === 1 && (
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
                      onChange={(e) => setHeaderSelect(e.target.value)}
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
                        />
                        {formikTemplate.errors.text && (
                          <FormHelperText error id="text">
                            {formikTemplate.errors.text}
                          </FormHelperText>
                        )}{' '}
                        {/* <Button variant="outlined" onClick={handleAddVariable}>
                          Add Variable
                        </Button> */}
                      </>
                    )}
                    {HeaderSelect === 'MEDIA' && (
                      <FormControl>
                        <RadioGroup
                          row
                          aria-label="HeaderSelect-input"
                          value={formikTemplate.values.color}
                          onChange={formikTemplate.handleChange}
                          name="HeaderSelectinput"
                          id="HeaderSelectinput"
                        >
                          <FormControlLabel
                            value="Image"
                            control={
                              <Radio
                                sx={{
                                  color: 'primary.main',
                                  '&.Mui-checked': { color: 'primary.main' },
                                }}
                              />
                            }
                            label="Image"
                          />
                          <FormControlLabel
                            value="Video"
                            control={
                              <Radio
                                sx={{
                                  color: 'primary.main',
                                  '&.Mui-checked': { color: 'primary.main' },
                                }}
                              />
                            }
                            label="Video"
                          />
                          <FormControlLabel
                            value="Document"
                            control={
                              <Radio
                                sx={{
                                  color: 'primary.main',
                                  '&.Mui-checked': { color: 'primary.main' },
                                }}
                              />
                            }
                            label="Document"
                          />
                          <FormControlLabel
                            value="Location"
                            control={
                              <Radio
                                sx={{
                                  color: 'primary.main',
                                  '&.Mui-checked': { color: 'primary.main' },
                                }}
                              />
                            }
                            label="Location"
                          />
                        </RadioGroup>
                      </FormControl>
                    )}

                    {formikTemplate.errors.color && (
                      <FormHelperText error id="HeaderSelectinput">
                        {' '}
                        {formikTemplate.errors.color}{' '}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
                {/* <FieldArray
                  name="dynamicFields"
                  render={(arrayHelpers) => (
                    <>
                      {formikTemplate.values.dynamicFields.map((field, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <CustomTextField
                            name={`dynamicFields[${index}].value`}
                            label={`Enter content for {{${index + 1}}}`}
                            value={field.value}
                            onChange={formikTemplate.handleChange}
                            fullWidth
                          />
                          <IconButton onClick={() => arrayHelpers.remove(index)}>
                            <Remove />
                          </IconButton>
                        </Box>
                      ))}
                    </>
                  )}
                /> */}
                <CustomFormLabel htmlFor="body">Body</CustomFormLabel>
                <Typography variant="subtitle1">
                  Enter the text for your message in the language that you've selected. Enter text
                  in English (UK)
                </Typography>

                <CustomTextField
                  multiline
                  fullWidth
                  id="body"
                  name="body"
                  value={formikTemplate.values.body}
                  onChange={formikTemplate.handleChange}
                />
                {formikTemplate.errors.body && (
                  <FormHelperText error id="body">
                    {formikTemplate.errors.body}
                  </FormHelperText>
                )}
                <CustomFormLabel htmlFor="footer">Footer</CustomFormLabel>
                <Typography variant="subtitle1">
                  Add a short line of text to the bottom of your message template. If you add the
                  marketing opt-out button, the associated footer will be shown here by default.
                </Typography>

                <CustomTextField
                  fullWidth
                  id="footer"
                  name="body"
                  value={formikTemplate.values.footer}
                  onChange={formikTemplate.handleChange}
                />
                {formikTemplate.errors.footer && (
                  <FormHelperText error id="footer">
                    {formikTemplate.errors.footer}
                  </FormHelperText>
                )}
                <CustomFormLabel htmlFor="name">Buttons</CustomFormLabel>
                <Typography variant="subtitle1">
                  Create buttons that let customers respond to your message or take action.
                </Typography>
              </Grid>
              <Grid item lg={4} md={12} sm={12}>
                <Box>
                  <Box>
                    <Typography variant="h6">Message preview</Typography>
                  </Box>
                  <Box p={4}>
                    {[
                      {
                        type: 'HEADER',
                        format: 'IMAGE',
                        example: {
                          header_handle: [
                            'https://scontent.whatsapp.net/v/t61.29466-34/389963313_826737116030264_3604284851198093791_n.jpg?ccb=1-7&_nc_sid=8b1bef&_nc_ohc=nEKhUYR2tCIQ7kNvgEpDGgf&_nc_ht=scontent.whatsapp.net&edm=AH51TzQEAAAA&oh=01_Q5AaIOv5rdeq1iCJcqwixaONX3xB-sXms0NfoWnCq5-DsbWF&oe=6687DD06',
                          ],
                        },
                      },
                      {
                        type: 'BODY',
                        text: "It's a great pleasure to announce {{1}} affiliate program globally! Anyone can join the program and can pass the inquiries to get handsome advertising fees!\n\nBecome an affiliate partner with us and earn money!\n\nPromote our services, share your unique link, and receive advertising fees for every sale made through your referrals.\n\nWe look forward to partnering with you!",
                        example: {
                          body_text: [['text']],
                        },
                      },
                      {
                        type: 'FOOTER',
                        text: 'Affiliate program',
                      },
                      {
                        type: 'BUTTONS',
                        buttons: [
                          {
                            type: 'URL',
                            text: 'Join now',
                            url: 'https://saubhagyam.com/',
                          },
                        ],
                      },
                    ].map((component) => {
                      switch (component.type) {
                        case 'HEADER':
                          return (
                            <Box>
                              <img
                                src={component.example.header_handle[0]}
                                alt={component.type}
                                width={260}
                              />
                            </Box>
                          );
                        case 'BODY':
                          return (
                            <Typography
                              key={component.type}
                              variant="body2"
                              color="black"
                              fontSize={12}
                            >
                              {component.text.split('\n').map(function (item, idx) {
                                return (
                                  <span key={idx}>
                                    {item}
                                    <br />
                                  </span>
                                );
                              })}
                            </Typography>
                          );
                        case 'FOOTER':
                          return (
                            <Typography key={component.type} variant="caption">
                              {component.text}
                            </Typography>
                          );
                        case 'BUTTONS':
                          return (
                            <Box
                              key={component.type}
                              variant="outline"
                              href={component.buttons[0].url}
                            >
                              {component?.buttons[0].text}
                            </Box>
                          );
                        default:
                          return null;
                      }
                    })}{' '}
                  </Box>
                </Box>
              </Grid>
              <Grid item lg={12} md={12} sm={12}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    mr: 1,
                  }}
                  type="submit"
                >
                  Create Template
                </Button>
                <Button variant="contained" color="error" onClick={() => setStep(0)}>
                  Back
                </Button>
              </Grid>
            </Grid>
          </form>

          <Grid container spacing={3} mb={3} mt={1}></Grid>
        </ParentCard>
      )}
    </PageContainer>
  );
}
