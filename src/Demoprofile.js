import React, { useEffect, useState } from 'react';
import {
  Avatar,
  FormControl,
  OutlinedInput,
  Typography,
  Grid,
  Stack,
  Box,
  Button,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import PageContainer from '../../../components/container/PageContainer';
import apiClient from 'src/api/axiosClient';
import Spinner from 'src/views/spinner/Spinner';

const UserProfile = () => {
  const [userData, setUserData] = useState({
    display_name: '',
    profile_pic: '',
    whatsApp_number: '',
    user_email: '',
    user_full_name: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editImage, setEditImage] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setEditMode(queryParams.get('edit') === 'true');
    fetchUserProfile();
  }, [location.search]);

  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.get('/auth/user_profile/');
      console.log('API Response:', response);
      if (response.status === 200) {
        setUserData(response.data.data);
      }
    } catch (error) {
      console.error('There was an error fetching the user data!', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
    navigate('?edit=true');
  };

  const handleCancelClick = () => {
    setEditMode(false);
    navigate('/user-profile');
  };

  const handleSaveClick = async () => {
    const formData = new FormData();
    formData.append('display_name', userData.display_name);
    formData.append('user_full_name', userData.user_full_name);

    try {
      const response = await apiClient.patch('/auth/user_profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        setUserData(response.data.data);
        setEditMode(false);
        navigate('/user-profile');
      }
    } catch (error) {
      console.error('There was an error updating the user data!', error);
      setError('Failed to update user data');
    }
  };

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === 'profile_pic') {
      setUserData({ ...userData, [id]: files[0] });
    } else {
      setUserData({ ...userData, [id]: value });
    }
  };

  const handleEditImageClick = () => {
    setEditImage(true);
  };

  const handleSaveImageClick = async () => {
    const formData = new FormData();
    if (userData.profile_pic instanceof File) {
      formData.append('profile_pic', userData.profile_pic);
    }

    try {
      const response = await apiClient.patch('/auth/user_profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        setUserData(response.data.data);
        setEditImage(false);
        navigate('/user-profile');
      }
    } catch (error) {
      console.error('There was an error updating the profile picture!', error);
      setError('Failed to update profile picture');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <PageContainer title="User Profile" description="This is User Profile page">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <Grid container spacing={2} sx={{ width: '60%', alignItems: 'center' }}>
          <Grid item xs={12} md={3}>
            <Avatar
              src={userData.profile_pic}
              sx={{
                width: 100,
                height: 100,
                backgroundColor: 'primary.main',
                marginBottom: 2,
              }}
            >
              {(!userData.profile_pic || userData.profile_pic === '') && userData.user_full_name
                ? userData.user_full_name.charAt(0)
                : ''}
            </Avatar>
            {editImage ? (
              <FormControl sx={{ mt: 2 }}>
                <OutlinedInput type="file" id="profile_pic" fullWidth onChange={handleChange} />
                <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSaveImageClick}>
                  Save Image
                </Button>
              </FormControl>
            ) : (
              <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleEditImageClick}>
                Edit Image
              </Button>
            )}
          </Grid>

          <Grid item xs={12} md={9}>
            <Stack sx={{ flexDirection: 'column' }}>
              <FormControl sx={{ mt: 2 }}>
                <Typography>Display Name</Typography>
                <OutlinedInput
                  id="display_name"
                  value={userData.display_name}
                  fullWidth
                  readOnly={!editMode}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl sx={{ mt: 2 }}>
                <Typography>Full Name</Typography>
                <OutlinedInput
                  id="user_full_name"
                  value={userData.user_full_name}
                  fullWidth
                  readOnly={!editMode}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl sx={{ mt: 2 }}>
                <Typography>Email</Typography>
                <OutlinedInput
                  id="user_email"
                  value={userData.user_email}
                  fullWidth
                  readOnly
                />
              </FormControl>
              <FormControl sx={{ mt: 2 }}>
                <Typography>Whatsapp Number</Typography>
                <OutlinedInput
                  id="whatsApp_number"
                  value={userData.whatsApp_number || ''}
                  fullWidth
                  readOnly
                />
              </FormControl>
              {!editMode ? (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, width: '30%' }}
                  onClick={handleEditClick}
                >
                  Edit
                </Button>
              ) : (
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveClick}
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleCancelClick}
                  >
                    Cancel
                  </Button>
                </Stack>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default UserProfile;
import React, { useEffect, useState } from 'react';
import {
  Avatar,
  FormControl,
  OutlinedInput,
  Typography,
  Grid,
  Stack,
  Box,
  Button,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import PageContainer from '../../../components/container/PageContainer';
import apiClient from 'src/api/axiosClient';
import Spinner from 'src/views/spinner/Spinner';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editImage, setEditImage] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setEditMode(queryParams.get('edit') === 'true');
    fetchUserProfile();
  }, [location.search]);

  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.get('/auth/user_profile/');
      setUserData(response.data.data);
    } catch (error) {
      console.error('There was an error fetching the user data!', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
    navigate('?edit=true');
  };

  const handleCancelClick = () => {
    setEditMode(false);
    navigate('/user-profile');
  };

  const handleSaveClick = async () => {
    const formData = new FormData();
    formData.append('display_name', userData.display_name);
    formData.append('user_full_name', userData.user_full_name);

    try {
      const response = await apiClient.patch('/auth/user_profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        setUserData(response.data.data);
        setEditMode(false);
        navigate('/user-profile');
      }
    } catch (error) {
      console.error('There was an error updating the user data!', error);
      setError('Failed to update user data');
    }
  };

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === 'profile_pic') {
      setUserData({ ...userData, [id]: files[0] });
    } else {
      setUserData({ ...userData, [id]: value });
    }
  };

  const handleEditImageClick = () => {
    setEditImage(true);
  };

  const handleSaveImageClick = async () => {
    const formData = new FormData();
    if (userData.profile_pic instanceof File) {
      formData.append('profile_pic', userData.profile_pic);
    }

    try {
      const response = await apiClient.patch('/auth/user_profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        setUserData(response.data.data);
        setEditImage(false);
        navigate('/user-profile');
      }
    } catch (error) {
      console.error('There was an error updating the profile picture!', error);
      setError('Failed to update profile picture');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  const avatarSrc =
    userData && userData.profile_pic
      ? userData.profile_pic instanceof File
        ? URL.createObjectURL(userData.profile_pic)
        : userData.profile_pic
      : '';

  return (
    <PageContainer title="User Profile" description="This is User Profile page">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <Grid container spacing={2} sx={{ width: '60%', alignItems: 'center' }}>
          <Grid item xs={12} md={3}>
            <Avatar
              src={avatarSrc}
              sx={{
                width: 100,
                height: 100,
                backgroundColor: 'primary.main',
                marginBottom: 2,
              }}
            >
              {userData && userData.user_full_name
                ? userData.user_full_name.charAt(0)
                : ''}
            </Avatar>
            {editImage ? (
              <FormControl sx={{ mt: 2 }}>
                <OutlinedInput type="file" id="profile_pic" fullWidth onChange={handleChange} />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={handleSaveImageClick}
                >
                  Save Image
                </Button>
              </FormControl>
            ) : 


            import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { IconMessage2Share } from '@tabler/icons';
import createMetaAxiosInstance from 'src/api/axiosClientMeta';
import apiClient from 'src/api/axiosClient';
import toast from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import img from 'src/assets/images/backgrounds/Template_background.jpg';

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

const TemplateModal = ({ open, handleClose, broadcastId }) => {
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [broadcastDetails, setBroadcastDetails] = useState({
    broadcast: broadcastId,
    template: null,
  });
  const [templateDetails, setTemplateDetails] = useState(null);

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
      } else {
        setTemplateDetails(null); // Reset template details when no template is selected
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
      setLoading(false); // Ensure loading state is reset
      return;
    }
    try {
      const res = await apiClient.post('/api/send_template/', {
        broadcast: broadcastDetails.broadcast,
        template: templateDetails,
      });
      if (res.status === 200 || res.status === 201) {
        toast.success('Broadcast scheduled successfully!');
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
    <Dialog open={open} onClose={handleClose} closeAfterTransition maxWidth={'md'}>
      <Fade in={open}>
        <form onSubmit={sendBroadcastMsg}>
          <Box
            sx={{
              outline: 'none',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              width: '100%',
            }}
          >
            <FormLabel>Select template</FormLabel>
            <Select
              value={broadcastDetails.template}
              fullWidth
              displayEmpty
              name="template"
              onChange={handleFieldChange}
              sx={{ marginBottom: '2rem'}}
            >
              {templates?.map((temp) => (
                <MenuItem key={temp.id} value={temp.id}>
                  {temp.name}
                </MenuItem>
              ))}
            </Select>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Stack gap={2}>
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
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
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
                          borderRadius: '4px',
                        }}
                      >
                        {templateDetails?.components.map((component) => {
                          switch (component.type) {
                            case 'HEADER':
                              return component.format === 'IMAGE' ? (
                                <img
                                  key={component.type}
                                  src={component.parameters[0].image.link}
                                  alt={component.type}
                                  style={{ width: '100%', height: 'auto' }}
                                />
                              ) : (
                                <Typography key={component.type} variant="h5">
                                  {component.text}
                                </Typography>
                              );
                            case 'BODY':
                              return (
                                <Typography key={component.type} variant="body1">
                                  {component.text.split('\n').map((item, idx) => (
                                    <React.Fragment key={idx}>
                                      {item}
                                      <br />
                                    </React.Fragment>
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
              <Button size="large" variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
            </Stack>
          </Box>
        </form>
      </Fade>
    </Dialog>
  );
};

export default TemplateModal;
