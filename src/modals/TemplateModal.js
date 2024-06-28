import React, { useState } from 'react';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { IconFileImport } from '@tabler/icons';
import createMetaAxiosInstance from 'src/api/axiosClientMeta';
import apiClient from 'src/api/axiosClient';
import toast from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';

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

const HeaderComponent = ({ componentData, updateHeaderImageLink }) => {
  if (componentData.format === 'IMAGE') {
    return (
      <>
        <label>Link to image</label>
        <Input
          type="url"
          placeholder="Add link to image here"
          onChange={updateHeaderImageLink}
          variant="outlined"
          fullWidth
          required
        ></Input>
      </>
    );
  }
  return <></>;
};

const BodyVariableComponent = ({ bodyData, updateBodyVariable }) => {
  if (bodyData?.parameters?.length > 0) {
    return (
      <>
        <label>Body variables</label>
        {new Array(bodyData?.parameters?.length).fill('').map((field, idx) => {
          return (
            <>
              <Stack direction="horizontal" alignItems={'center'} gap={2}>
                <p>{`{{${idx + 1}}}`}</p>
                <Input
                  fullWidth
                  required
                  inputProps={{ maxLength: 100 }}
                  onChange={(e) => updateBodyVariable(e, idx)}
                ></Input>
              </Stack>
            </>
          );
        })}
      </>
    );
  }
  return <></>;
};

const TemplateModal = ({ open, handleClose, broadcastId }) => {
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [broadcastDetails, setBroadcastDetails] = useState({
    broadcast: broadcastId,
    template: null,
  });
  const [templateDetails, setTemplateDetails] = useState();

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
          setTemplateDetails(() => addBodyVariableEmptyArray(res.data));
        }
      }
    } catch (err) {
      toast.error('There was an error fetching the template details!');
    }
  };

  React.useEffect(() => {
    fetchTemplates();
    setBroadcastDetails({
      broadcast: broadcastId,
      template: null,
      body_message: '',
    });
  }, [broadcastId]);

  React.useEffect(() => {
    fetchTemplateById();
  }, [broadcastDetails?.template]);

  React.useEffect(() => {
    console.log(templateDetails, '+=+=+=');
  }, [templateDetails]);

  const handleFieldChange = (e) => {
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
    try {
      const res = await apiClient.post('/api/send_template/', {
        broadcast: broadcastDetails.broadcast,
        template: templateDetails,
      });
      if (res.status === 200 || res.status === 201) {
        toast.success('Broadcast scheduled succesfully!');
        handleClose();
      }
    } catch (err) {
      console.warn(err);
      toast.error(err?.response?.data?.message ?? 'There was an error! Please try again!');
    } finally {
      setLoading(false);
    }
  };

  const updateHeaderImageLink = (e) => {
    const newHeaderComponent = {
      type: 'HEADER',
      format: 'IMAGE',
      parameters: [
        {
          type: 'image',
          image: {
            link: e.target.value,
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

  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition>
      <Fade in={open}>
        <form onSubmit={sendBroadcastMsg}>
          <Box
            sx={{
              outline: 'none',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              width: '60%',
              margin: 'auto',
              mt: 10,
            }}
          >
            <FormLabel>Select template</FormLabel>
            <Select
              value={broadcastDetails.template}
              fullWidth
              displayEmpty
              name="template"
              onChange={handleFieldChange}
            >
              {templates?.map((temp) => (
                <MenuItem value={temp.id}>{temp.name}</MenuItem>
              ))}
            </Select>
            <Stack gap={2} marginTop={4}>
              {broadcastDetails?.template &&
                (templateDetails?.components?.[0]?.type === 'HEADER' ? (
                  <HeaderComponent
                    componentData={templateDetails?.components?.[0]}
                    updateHeaderImageLink={updateHeaderImageLink}
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
              {/* {broadcastDetails?.template &&
              templateDetails?.components?.map((component) => {
                if (component.type !== 'BUTTONS') {
                  return (
                    <div>
                      <Typography fontWeight={'600'}>{component.type}</Typography>
                      {component.type === 'HEADER' &&
                        (component?.format === 'IMAGE' ? (
                          <>
                            <Input
                              type="url"
                              placeholder="Add link to image here"
                              onChange={updateHeaderImageLink}
                              variant="outlined"
                              fullWidth
                            ></Input>
                          </>
                        ) : (
                          <Box style={{ border: '1px solid', padding: 4 }}>{component?.text}</Box>
                        ))}

                      {component.type === 'BODY' && (
                        <Box style={{ border: '1px solid', padding: 4 }}>{component?.text}</Box>
                      )}
                      {component.type === 'FOOTER' && (
                        <Box style={{ border: '1px solid', padding: 4 }}>{component?.text}</Box>
                      )}
                    </div>
                  );
                }
                return <></>;
              })} */}
            </Stack>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <LoadingButton
                loading={loading}
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mr: 2 }}
              >
                Send
              </LoadingButton>
              <Button variant="contained" color="error" onClick={handleClose}>
                Close
              </Button>
            </Box>
          </Box>
        </form>
      </Fade>
    </Modal>
  );
};

export default TemplateModal;
