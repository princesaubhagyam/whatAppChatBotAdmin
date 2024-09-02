import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Modal,
  Fade,
  Select,
  MenuItem,
  FormLabel,
  Typography,
  Stack,
  Input,
  CardMedia,
  Dialog,
  Grid,
  InputLabel,
  OutlinedInput,
  FormControl,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { IconMessage2Share } from '@tabler/icons';
import createMetaAxiosInstance from 'src/api/axiosClientMeta';
import apiClient from 'src/api/axiosClient';
import toast from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import img from 'src/assets/images/backgrounds/Template_background.jpg';
import EventContext from 'src/BroadcastContext';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const HeaderComponent = ({ componentData, updateHeaderLink }) => {
  switch (componentData.format) {
    case 'IMAGE':
      return (
        <>
          <label>Link to image</label>
          <Input
            type="url"
            placeholder="Add link to image here"
            onChange={(e) => updateHeaderLink(e, 'IMAGE')}
            variant="outlined"
            //value={currentLink}
            //value={componentData.parameters?.[0]?.image?.link || ''}
            fullWidth
            required
          />
        </>
      );
    case 'VIDEO':
      return (
        <>
          <label>Link to video</label>
          <Input
            type="url"
            placeholder="Add link to video here"
            onChange={(e) => updateHeaderLink(e, 'VIDEO')}
            //value={componentData.parameters?.[0]?.video?.link || ''}
            variant="outlined"
            fullWidth
            //value={currentLink}
            required
          />
        </>
      );
    case 'DOCUMENT':
      return (
        <>
          <label>Link to document</label>
          <Input
            type="url"
            placeholder="Add link to document here"
            onChange={(e) => updateHeaderLink(e, 'DOCUMENT')}
            variant="outlined"
            fullWidth
            //value={componentData.link}
            //value={componentData.parameters?.[0]?.document?.link || ''}
            required
          />
        </>
      );
    default:
      return <></>;
  }
};

const BodyVariableComponent = ({ bodyData, updateBodyVariable }) => {
  if (bodyData?.parameters?.length > 0) {
    return (
      <>
        <label>Body variables</label>
        {new Array(bodyData?.parameters?.length).fill('').map((field, idx) => {
          return (
            <Stack direction="horizontal" alignItems={'center'} gap={2} key={idx}>
              <p>{`{{${idx + 1}}}`}</p>
              <Input
                fullWidth
                required
                inputProps={{ maxLength: 100 }}
                onChange={(e) => updateBodyVariable(e, idx)}
              ></Input>
            </Stack>
          );
        })}
      </>
    );
  }
  return <></>;
};

const TemplateModal = ({ open, handleClose, broadcastId, checkBroadcastHistory }) => {
  const activeBroadcast = useSelector((state) => state.chatReducer.selectedBroadcast);
  console.log(activeBroadcast?.members, "hello")
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [defaultHeaderHandles, setDefaultHeaderHandles] = useState({});
  const { toggleOnOff } = useContext(EventContext);
  const [broadcastDetails, setBroadcastDetails] = useState({
    broadcast: broadcastId,
    template: null,
  });
  const [templateDetails, setTemplateDetails] = useState();
  const [previewLink, setPreviewLink] = useState(null);
  // console.log(previewLink, 'previewLink');

  const fetchTemplates = async () => {
    try {
      const metaInstance = createMetaAxiosInstance();
      const res = await metaInstance.get('message_templates?');
      if (res.status === 200) {
        const approvedTemplates = res.data.data.filter(
          (template) => template.status === 'APPROVED',
        );
        setTemplates(approvedTemplates);
      }
    } catch (err) {
      console.warn(err, '++++++++++++++++++');
    }
  };

  const addBodyVariableEmptyArray = (resData) => {
    const updatedData = { ...resData };
    updatedData.components = updatedData.components.map((component) => {
      if (component?.type === 'BODY' && component?.example?.body_text) {
        component.parameters = new Array(component.example.body_text?.[0].length).fill({
          type: 'text',
          text: null,
        });
      }
      return component;
    });
    return updatedData;
  };

  const fetchTemplateById = async () => {
    try {
      if (broadcastDetails?.template) {
        const metaInstance = createMetaAxiosInstance({ addBAId: false });
        const res = await metaInstance.get(broadcastDetails.template);
        if (res.status === 200) {
          const updatedData = addBodyVariableEmptyArray(res.data);
          setTemplateDetails(updatedData);
          setPreviewLink(res?.data?.components[0]?.example?.header_handle[0]);
          // Store default values
          const defaultValues = {};
          updatedData.components.forEach((component) => {
            if (component.type === 'HEADER') {
              defaultValues[component.format] = component.example?.header_handle?.[0];
            }
          });
          setDefaultHeaderHandles(defaultValues);
        }
      }
    } catch (err) {
      toast.error('There was an error fetching the template details!');
    }
  };

  useEffect(() => {
    fetchTemplates();
    setBroadcastDetails({
      broadcast: broadcastId,
      template: null,
      body_message: '',
    });
  }, [broadcastId]);

  useEffect(() => {
    fetchTemplateById();
  }, [broadcastDetails?.template]);

  const handleFieldChange = (e) => {
    if(activeBroadcast.members == )
    setBroadcastDetails({
      ...broadcastDetails,
      broadcast: broadcastId,
      [e.target.name]: e.target.value,
    });
  };

  const sendBroadcastMsg = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!broadcastDetails.template) {
      toast.error('Please select template!');
      return;
    }
    console.log(templateDetails, 'templateDetails =====');
    try {
      const res = await apiClient.post('/api/send_template/', {
        broadcast: broadcastDetails.broadcast,
        template: templateDetails,
      });
      if (res.status === 200 || res.status === 201) {
        toast.success('Broadcast scheduled successfully!');
        toggleOnOff();
        handleClose();
      }
    } catch (err) {
      console.warn(err);
      toast.error(err?.response?.data?.message ?? 'There was an error! Please try again!');
    } finally {
      setLoading(false);
    }
  };
  // const sendBroadcastMsg = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   if (!broadcastDetails.template) {
  //     toast.error('Please select template!');
  //     setLoading(false);
  //     return;
  //   }

  //   const updatedTemplateDetails = { ...broadcastDetails.template };

  //   console.log('Updated Template Details:=========', updatedTemplateDetails);

  //   if (!Array.isArray(updatedTemplateDetails.components)) {
  //     console.error('Components property is not an array:', updatedTemplateDetails.components);
  //     toast.error('Template components are missing or incorrectly formatted.');
  //     setLoading(false);
  //     return;
  //   }

  //   updatedTemplateDetails.components = updatedTemplateDetails.components.map((component) => {
  //     if (component.type === 'HEADER') {
  //       const headerLink = component.example?.header_handle?.[0];

  //       component.parameters = [
  //         {
  //           type: 'image',
  //           image: {
  //             link: previewLink ? previewLink : '',
  //           },
  //         },
  //       ];
  //     }
  //     return component;
  //   });

  //   try {
  //     const res = await apiClient.post('/api/send_template/', {
  //       broadcast: broadcastDetails.broadcast,
  //       template: updatedTemplateDetails,
  //     });

  //     if (res.status === 200 || res.status === 201) {
  //       toast.success('Broadcast scheduled successfully!');
  //       toggleOnOff(); // Trigger history check
  //       handleClose();
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //     toast.error(err?.response?.data?.message ?? 'There was an error! Please try again!');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const updateHeaderLink = (e, format) => {
    const newLink = e.target.value;
    setPreviewLink(newLink);

    const newHeaderComponent = {
      type: 'HEADER',
      format,
      parameters: [
        {
          type: format.toLowerCase(),
          [format.toLowerCase()]: {
            link: newLink || defaultHeaderHandles[format],
          },
        },
      ],
    };

    setTemplateDetails((prevDetails) => ({
      ...prevDetails,
      components: prevDetails.components.map((component) =>
        component.type === 'HEADER' ? newHeaderComponent : component,
      ),
    }));
  };

  const updateBodyParameter = (e, paramIdx) => {
    const tmpTemplateDetails = { ...templateDetails };
    tmpTemplateDetails.components = tmpTemplateDetails.components.map((component) => {
      if (component.type === 'BODY') {
        const newParameters = component.parameters.map((param, idx) => {
          if (idx === paramIdx) {
            return {
              ...param,
              text: e.target.value,
            };
          }
          return param;
        });
        return {
          ...component,
          parameters: newParameters,
        };
      }
      return component;
    });
    setTemplateDetails(tmpTemplateDetails);
  };
  const resetTemplateSelection = () => {
    setBroadcastDetails({
      ...broadcastDetails,
      template: null,
    });
    setTemplateDetails(null);
    handleClose();
  };
  return (
    <Dialog
      open={open}
      onClose={() => {
        //handleClose();
        resetTemplateSelection();
      }}
      closeAfterTransition
      maxWidth={'md'}
      sx={{ height: '90%' }}
    >
      <Fade in={open}>
        <form onSubmit={sendBroadcastMsg}>
          <Box
            sx={{
              outline: 'none',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              width: '100%',
              minWidth: '500px',
              minHeight: '500px',
            }}
          >
            <Typography variant="h6" component="h2" mb={2}>
              Templates
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Select template</InputLabel>
              <Select
                value={broadcastDetails.template}
                fullWidth
                // displayEmpty
                name="template"
                onChange={handleFieldChange}
                sx={{ marginBottom: '2rem' }}
                label="Select Template"
              >
                {templates?.map((temp) => (
                  <MenuItem key={temp.id} value={temp.id}>
                    {temp.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Grid container spacing={2} minWidth={'650px'} maxWidth={'750px'}>
              <Grid item xs={12} sm={6}>
                <Stack gap={2}>
                  {broadcastDetails?.template &&
                    (templateDetails?.components?.[0]?.type === 'HEADER' ? (
                      <HeaderComponent
                        componentData={templateDetails?.components?.[0]}
                        updateHeaderLink={updateHeaderLink}
                      />
                    ) : (
                      <></>
                    ))}
                  {broadcastDetails?.template &&
                    (templateDetails?.components?.[1]?.type === 'BODY' ? (
                      <BodyVariableComponent
                        bodyData={templateDetails?.components?.[1]}
                        updateBodyVariable={updateBodyParameter}
                      />
                    ) : (
                      <></>
                    ))}
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} lg={6}>
                <Box>
                  {templateDetails ? (
                    <CardMedia
                      component="div"
                      image={img}
                      sx={{
                        overflow: 'auto',
                        backgroundSize: 'cover',
                        boxShadow: '0px 1px 5px #00000025',
                        p: 2,
                        border: '1px solid lightgrey',
                        borderRadius: '8px',
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: '#E9FEEE',
                          padding: 1,
                          boxShadow: '0px 1px 110px #00000025',
                          borderBottom: '1px solid #80808078',
                        }}
                      >
                        {/* Preview section for template */}
                        {templateDetails?.components.map((component) => {
                          switch (component.type) {
                            case 'HEADER': {
                              //const headerHandle = component.example?.header_handle?.[0] || component.parameters?.[0]?.[component.format.toLowerCase()]?.link;
                              const headerLink =
                                component.parameters?.[0]?.[component.format.toLowerCase()]?.link;
                              const headerHandle =
                                headerLink || component.example?.header_handle?.[0];

                              const headerText = component.example?.header_text?.[0];

                              if (headerHandle) {
                                const isVideo = component.format === 'VIDEO';
                                const isDocument = component.format === 'DOCUMENT';

                                if (isVideo) {
                                  return (
                                    <CardMedia
                                      key={component.type}
                                      component="video"
                                      image={headerHandle}
                                      controls
                                      title={component.type}
                                      //sx={{ height: 200 }}
                                      autoPlay
                                    />
                                  );
                                } else if (isDocument) {
                                  return (
                                    <Box sx={{ mb: 2, overflow: 'hidden', height: '200px' }}>
                                      <iframe
                                        src={headerHandle}
                                        width="100%"
                                        height="400px"
                                        title="Document Preview"
                                        style={{ border: 'none', overflow: 'hidden' }}
                                      ></iframe>
                                    </Box>
                                  );
                                } else {
                                  return (
                                    <CardMedia
                                      key={component.type}
                                      component="img"
                                      image={headerHandle}
                                      title={component.type}
                                      //sx={{ height: 200 }}
                                    />
                                  );
                                }
                              }

                              if (headerText) {
                                return (
                                  <Typography key={'1'} variant="body1">
                                    <span key={'1'}>
                                      {headerText}
                                      <br />
                                    </span>
                                  </Typography>
                                );
                              }

                              return null;
                            }

                            case 'BODY':
                              return (
                                <Typography key={component.type} variant="body1">
                                  {component.text.split('\n').map((item, idx) => (
                                    <span key={idx}>
                                      {item}
                                      <br />
                                    </span>
                                  ))}
                                </Typography>
                              );
                            case 'FOOTER':
                              return (
                                <Typography key={component.type} variant="caption">
                                  {component.text}
                                </Typography>
                              );
                            default:
                              return null;
                          }
                        })}
                      </Box>
                      <Box
                        sx={{
                          backgroundColor: 'white',
                          width: '100%',
                          mt: '1px',
                          boxShadow: '0px 1px 5px #00000025',
                        }}
                      >
                        {templateDetails?.components.map((component) => {
                          if (component.type === 'BUTTONS') {
                            return (
                              <Button
                                key={component.type}
                                variant="outline"
                                href={component.buttons[0].url}
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
                              >
                                <IconMessage2Share />
                                {component?.buttons[0].icon}
                                {component?.buttons[0].text}
                              </Button>
                            );
                          }
                          return null;
                        })}
                      </Box>
                    </CardMedia>
                  ) : (
                    <></>
                  )}
                </Box>
              </Grid>
            </Grid>
            {templateDetails ? (
              <Stack direction="row" gap={2} justifyContent="flex-end" marginTop={4}>
                <LoadingButton
                  size="large"
                  startIcon={<IconMessage2Share />}
                  type="submit"
                  variant="contained"
                  loading={loading}
                >
                  Send broadcast
                </LoadingButton>
                <Button variant="contained" color="error" onClick={resetTemplateSelection}>
                  Cancel
                </Button>
              </Stack>
            ) : (
              <></>
            )}
          </Box>
        </form>
      </Fade>
    </Dialog>
  );
};

export default TemplateModal;
