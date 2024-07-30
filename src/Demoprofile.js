// import React, { useEffect, useState } from 'react';
// import {
//   Avatar,
//   FormControl,
//   OutlinedInput,
//   Typography,
//   Grid,
//   Stack,
//   Box,
//   Button,
// } from '@mui/material';
// import { useLocation, useNavigate } from 'react-router-dom';
// import PageContainer from '../../../components/container/PageContainer';
// import apiClient from 'src/api/axiosClient';
// import Spinner from 'src/views/spinner/Spinner';

// const UserProfile = () => {
//   const [userData, setUserData] = useState({
//     display_name: '',
//     profile_pic: '',
//     whatsApp_number: '',
//     user_email: '',
//     user_full_name: '',
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [editImage, setEditImage] = useState(false);

//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const queryParams = new URLSearchParams(location.search);
//     setEditMode(queryParams.get('edit') === 'true');
//     fetchUserProfile();
//   }, [location.search]);

//   const fetchUserProfile = async () => {
//     try {
//       const response = await apiClient.get('/auth/user_profile/');
//       console.log('API Response:', response);
//       if (response.status === 200) {
//         setUserData(response.data.data);
//       }
//     } catch (error) {
//       console.error('There was an error fetching the user data!', error);
//       setError('Failed to load user data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditClick = () => {
//     setEditMode(true);
//     navigate('?edit=true');
//   };

//   const handleCancelClick = () => {
//     setEditMode(false);
//     navigate('/user-profile');
//   };

//   const handleSaveClick = async () => {
//     const formData = new FormData();
//     formData.append('display_name', userData.display_name);
//     formData.append('user_full_name', userData.user_full_name);

//     try {
//       const response = await apiClient.patch('/auth/user_profile/', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       if (response.status === 200) {
//         setUserData(response.data.data);
//         setEditMode(false);
//         navigate('/user-profile');
//       }
//     } catch (error) {
//       console.error('There was an error updating the user data!', error);
//       setError('Failed to update user data');
//     }
//   };

//   const handleChange = (e) => {
//     const { id, value, files } = e.target;
//     if (id === 'profile_pic') {
//       setUserData({ ...userData, [id]: files[0] });
//     } else {
//       setUserData({ ...userData, [id]: value });
//     }
//   };

//   const handleEditImageClick = () => {
//     setEditImage(true);
//   };

//   const handleSaveImageClick = async () => {
//     const formData = new FormData();
//     if (userData.profile_pic instanceof File) {
//       formData.append('profile_pic', userData.profile_pic);
//     }

//     try {
//       const response = await apiClient.patch('/auth/user_profile/', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       if (response.status === 200) {
//         setUserData(response.data.data);
//         setEditImage(false);
//         navigate('/user-profile');
//       }
//     } catch (error) {
//       console.error('There was an error updating the profile picture!', error);
//       setError('Failed to update profile picture');
//     }
//   };

//   if (loading) {
//     return <Spinner />;
//   }

//   return (
//     <PageContainer title="User Profile" description="This is User Profile page">
//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           height: '80vh',
//         }}
//       >
//         <Grid container spacing={2} sx={{ width: '60%', alignItems: 'center' }}>
//           <Grid item xs={12} md={3}>
//             <Avatar
//               src={userData.profile_pic}
//               sx={{
//                 width: 100,
//                 height: 100,
//                 backgroundColor: 'primary.main',
//                 marginBottom: 2,
//               }}
//             >
//               {(!userData.profile_pic || userData.profile_pic === '') && userData.user_full_name
//                 ? userData.user_full_name.charAt(0)
//                 : ''}
//             </Avatar>
//             {editImage ? (
//               <FormControl sx={{ mt: 2 }}>
//                 <OutlinedInput type="file" id="profile_pic" fullWidth onChange={handleChange} />
//                 <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSaveImageClick}>
//                   Save Image
//                 </Button>
//               </FormControl>
//             ) : (
//               <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleEditImageClick}>
//                 Edit Image
//               </Button>
//             )}
//           </Grid>

//           <Grid item xs={12} md={9}>
//             <Stack sx={{ flexDirection: 'column' }}>
//               <FormControl sx={{ mt: 2 }}>
//                 <Typography>Display Name</Typography>
//                 <OutlinedInput
//                   id="display_name"
//                   value={userData.display_name}
//                   fullWidth
//                   readOnly={!editMode}
//                   onChange={handleChange}
//                 />
//               </FormControl>
//               <FormControl sx={{ mt: 2 }}>
//                 <Typography>Full Name</Typography>
//                 <OutlinedInput
//                   id="user_full_name"
//                   value={userData.user_full_name}
//                   fullWidth
//                   readOnly={!editMode}
//                   onChange={handleChange}
//                 />
//               </FormControl>
//               <FormControl sx={{ mt: 2 }}>
//                 <Typography>Email</Typography>
//                 <OutlinedInput
//                   id="user_email"
//                   value={userData.user_email}
//                   fullWidth
//                   readOnly
//                 />
//               </FormControl>
//               <FormControl sx={{ mt: 2 }}>
//                 <Typography>Whatsapp Number</Typography>
//                 <OutlinedInput
//                   id="whatsApp_number"
//                   value={userData.whatsApp_number || ''}
//                   fullWidth
//                   readOnly
//                 />
//               </FormControl>
//               {!editMode ? (
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   sx={{ mt: 2, width: '30%' }}
//                   onClick={handleEditClick}
//                 >
//                   Edit
//                 </Button>
//               ) : (
//                 <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={handleSaveClick}
//                   >
//                     Save
//                   </Button>
//                   <Button
//                     variant="contained"
//                     color="secondary"
//                     onClick={handleCancelClick}
//                   >
//                     Cancel
//                   </Button>
//                 </Stack>
//               )}
//             </Stack>
//           </Grid>
//         </Grid>
//       </Box>
//     </PageContainer>
//   );
// };

// export default UserProfile;
// import React, { useEffect, useState } from 'react';
// import {
//   Avatar,
//   FormControl,
//   OutlinedInput,
//   Typography,
//   Grid,
//   Stack,
//   Box,
//   Button,
// } from '@mui/material';
// import { useLocation, useNavigate } from 'react-router-dom';
// import PageContainer from '../../../components/container/PageContainer';
// import apiClient from 'src/api/axiosClient';
// import Spinner from 'src/views/spinner/Spinner';

// const UserProfile = () => {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [editImage, setEditImage] = useState(false);

//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const queryParams = new URLSearchParams(location.search);
//     setEditMode(queryParams.get('edit') === 'true');
//     fetchUserProfile();
//   }, [location.search]);

//   const fetchUserProfile = async () => {
//     try {
//       const response = await apiClient.get('/auth/user_profile/');
//       setUserData(response.data.data);
//     } catch (error) {
//       console.error('There was an error fetching the user data!', error);
//       setError('Failed to load user data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditClick = () => {
//     setEditMode(true);
//     navigate('?edit=true');
//   };

//   const handleCancelClick = () => {
//     setEditMode(false);
//     navigate('/user-profile');
//   };

//   const handleSaveClick = async () => {
//     const formData = new FormData();
//     formData.append('display_name', userData.display_name);
//     formData.append('user_full_name', userData.user_full_name);

//     try {
//       const response = await apiClient.patch('/auth/user_profile/', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       if (response.status === 200) {
//         setUserData(response.data.data);
//         setEditMode(false);
//         navigate('/user-profile');
//       }
//     } catch (error) {
//       console.error('There was an error updating the user data!', error);
//       setError('Failed to update user data');
//     }
//   };

//   const handleChange = (e) => {
//     const { id, value, files } = e.target;
//     if (id === 'profile_pic') {
//       setUserData({ ...userData, [id]: files[0] });
//     } else {
//       setUserData({ ...userData, [id]: value });
//     }
//   };

//   const handleEditImageClick = () => {
//     setEditImage(true);
//   };

//   const handleSaveImageClick = async () => {
//     const formData = new FormData();
//     if (userData.profile_pic instanceof File) {
//       formData.append('profile_pic', userData.profile_pic);
//     }

//     try {
//       const response = await apiClient.patch('/auth/user_profile/', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       if (response.status === 200) {
//         setUserData(response.data.data);
//         setEditImage(false);
//         navigate('/user-profile');
//       }
//     } catch (error) {
//       console.error('There was an error updating the profile picture!', error);
//       setError('Failed to update profile picture');
//     }
//   };

//   if (loading) {
//     return <Spinner />;
//   }

//   const avatarSrc =
//     userData && userData.profile_pic
//       ? userData.profile_pic instanceof File
//         ? URL.createObjectURL(userData.profile_pic)
//         : userData.profile_pic
//       : '';

//   return (
//     <PageContainer title="User Profile" description="This is User Profile page">
//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           height: '80vh',
//         }}
//       >
//         <Grid container spacing={2} sx={{ width: '60%', alignItems: 'center' }}>
//           <Grid item xs={12} md={3}>
//             <Avatar
//               src={avatarSrc}
//               sx={{
//                 width: 100,
//                 height: 100,
//                 backgroundColor: 'primary.main',
//                 marginBottom: 2,
//               }}
//             >
//               {userData && userData.user_full_name
//                 ? userData.user_full_name.charAt(0)
//                 : ''}
//             </Avatar>
//             {editImage ? (
//               <FormControl sx={{ mt: 2 }}>
//                 <OutlinedInput type="file" id="profile_pic" fullWidth onChange={handleChange} />
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   sx={{ mt: 2 }}
//                   onClick={handleSaveImageClick}
//                 >
//                   Save Image
//                 </Button>
//               </FormControl>
//             ) : 


//             import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Button,
//   Modal,
//   Fade,
//   Select,
//   MenuItem,
//   FormLabel,
//   Typography,
//   Stack,
//   Input,
//   CardMedia,
//   Dialog,
//   Grid,
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import { IconMessage2Share } from '@tabler/icons';
// import createMetaAxiosInstance from 'src/api/axiosClientMeta';
// import apiClient from 'src/api/axiosClient';
// import toast from 'react-hot-toast';
// import { LoadingButton } from '@mui/lab';
// import img from 'src/assets/images/backgrounds/Template_background.jpg';

// const VisuallyHiddenInput = styled('input')({
//   clip: 'rect(0 0 0 0)',
//   clipPath: 'inset(50%)',
//   height: 1,
//   overflow: 'hidden',
//   position: 'absolute',
//   bottom: 0,
//   left: 0,
//   whiteSpace: 'nowrap',
//   width: 1,
// });

// const HeaderComponent = ({ componentData, updateHeaderImageLink }) => {
//   if (componentData.format === 'IMAGE') {
//     return (
//       <>
//         <label>Link to image</label>
//         <Input
//           type="url"
//           placeholder="Add link to image here"
//           onChange={updateHeaderImageLink}
//           variant="outlined"
//           fullWidth
//           required
//         ></Input>
//       </>
//     );
//   }
//   return <></>;
// };

// const BodyVariableComponent = ({ bodyData, updateBodyVariable }) => {
//   if (bodyData?.parameters?.length > 0) {
//     return (
//       <>
//         <label>Body variables</label>
//         {new Array(bodyData?.parameters?.length).fill('').map((field, idx) => {
//           return (
//             <Stack direction="horizontal" alignItems={'center'} gap={2} key={idx}>
//               <p>{`{{${idx + 1}}}`}</p>
//               <Input
//                 fullWidth
//                 required
//                 inputProps={{ maxLength: 100 }}
//                 onChange={(e) => updateBodyVariable(e, idx)}
//               ></Input>
//             </Stack>
//           );
//         })}
//       </>
//     );
//   }
//   return <></>;
// };

// const TemplateModal = ({ open, handleClose, broadcastId }) => {
//   const [loading, setLoading] = useState(false);
//   const [templates, setTemplates] = useState([]);
//   const [broadcastDetails, setBroadcastDetails] = useState({
//     broadcast: broadcastId,
//     template: null,
//   });
//   const [templateDetails, setTemplateDetails] = useState(null);

//   const fetchTemplates = async () => {
//     try {
//       const metaInstance = createMetaAxiosInstance();
//       const res = await metaInstance.get('message_templates?');
//       if (res.status === 200) {
//         const approvedTemplates = res.data.data.filter(
//           (template) => template.status === 'APPROVED',
//         );
//         setTemplates(approvedTemplates);
//       }
//     } catch (err) {
//       console.warn(err, '++++++++++++++++++');
//     }
//   };

//   const addBodyVariableEmptyArray = (resData) => {
//     const updatedData = { ...resData };
//     updatedData.components = updatedData.components.map((component) => {
//       if (component?.type === 'BODY' && component?.example?.body_text) {
//         component.parameters = new Array(component.example.body_text?.[0].length).fill({
//           type: 'text',
//           text: null,
//         });
//       }
//       return component;
//     });
//     return updatedData;
//   };

//   const fetchTemplateById = async () => {
//     try {
//       if (broadcastDetails?.template) {
//         const metaInstance = createMetaAxiosInstance({ addBAId: false });
//         const res = await metaInstance.get(broadcastDetails.template);
//         if (res.status === 200) {
//           setTemplateDetails(() => addBodyVariableEmptyArray(res.data));
//         }
//       } else {
//         setTemplateDetails(null); // Reset template details when no template is selected
//       }
//     } catch (err) {
//       toast.error('There was an error fetching the template details!');
//     }
//   };

//   useEffect(() => {
//     fetchTemplates();
//     setBroadcastDetails({
//       broadcast: broadcastId,
//       template: null,
//       body_message: '',
//     });
//   }, [broadcastId]);

//   useEffect(() => {
//     fetchTemplateById();
//   }, [broadcastDetails?.template]);

//   const handleFieldChange = (e) => {
//     setBroadcastDetails({
//       ...broadcastDetails,
//       broadcast: broadcastId,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const sendBroadcastMsg = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     if (!broadcastDetails.template) {
//       toast.error('Please select template!');
//       setLoading(false); // Ensure loading state is reset
//       return;
//     }
//     try {
//       const res = await apiClient.post('/api/send_template/', {
//         broadcast: broadcastDetails.broadcast,
//         template: templateDetails,
//       });
//       if (res.status === 200 || res.status === 201) {
//         toast.success('Broadcast scheduled successfully!');
//         handleClose();
//       }
//     } catch (err) {
//       console.warn(err);
//       toast.error(err?.response?.data?.message ?? 'There was an error! Please try again!');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateHeaderImageLink = (e) => {
//     const newHeaderComponent = {
//       type: 'HEADER',
//       format: 'IMAGE',
//       parameters: [
//         {
//           type: 'image',
//           image: {
//             link: e.target.value,
//           },
//         },
//       ],
//     };
//     setTemplateDetails((prevDetails) => ({
//       ...prevDetails,
//       components: prevDetails.components.map((component) =>
//         component.type === 'HEADER' ? newHeaderComponent : component,
//       ),
//     }));
//   };

//   const updateBodyParameter = (e, paramIdx) => {
//     const tmpTemplateDetails = { ...templateDetails };
//     tmpTemplateDetails.components = tmpTemplateDetails.components.map((component) => {
//       if (component.type === 'BODY') {
//         const newParameters = component.parameters.map((param, idx) => {
//           if (idx === paramIdx) {
//             return {
//               ...param,
//               text: e.target.value,
//             };
//           }
//           return param;
//         });
//         return {
//           ...component,
//           parameters: newParameters,
//         };
//       }
//       return component;
//     });
//     setTemplateDetails(tmpTemplateDetails);
//   };

//   return (
//     <Dialog open={open} onClose={handleClose} closeAfterTransition maxWidth={'md'}>
//       <Fade in={open}>
//         <form onSubmit={sendBroadcastMsg}>
//           <Box
//             sx={{
//               outline: 'none',
//               bgcolor: 'background.paper',
//               boxShadow: 24,
//               p: 4,
//               width: '100%',
//             }}
//           >
//             <FormLabel>Select template</FormLabel>
//             <Select
//               value={broadcastDetails.template}
//               fullWidth
//               displayEmpty
//               name="template"
//               onChange={handleFieldChange}
//               sx={{ marginBottom: '2rem'}}
//             >
//               {templates?.map((temp) => (
//                 <MenuItem key={temp.id} value={temp.id}>
//                   {temp.name}
//                 </MenuItem>
//               ))}
//             </Select>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <Stack gap={2}>
//                   {broadcastDetails?.template &&
//                     (templateDetails?.components?.[0]?.type === 'HEADER' ? (
//                       <HeaderComponent
//                         componentData={templateDetails?.components?.[0]}
//                         updateHeaderImageLink={updateHeaderImageLink}
//                       />
//                     ) : (
//                       <></>
//                     ))}
//                   {broadcastDetails?.template &&
//                     (templateDetails?.components?.[1]?.type === 'BODY' ? (
//                       <BodyVariableComponent
//                         bodyData={templateDetails?.components?.[1]}
//                         updateBodyVariable={updateBodyParameter}
//                       />
//                     ) : (
//                       <></>
//                     ))}
//                 </Stack>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Box>
//                   {templateDetails ? (
//                     <CardMedia
//                       component="div"
//                       image={img}
//                       sx={{
//                         overflow: 'auto',
//                         backgroundSize: 'cover',
//                         boxShadow: '0px 1px 5px #00000025',
//                         p: 2,
//                         border: '1px solid lightgrey',
//                         borderRadius: '8px',
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           backgroundColor: '#E9FEEE',
//                           padding: 1,
//                           boxShadow: '0px 1px 110px #00000025',
//                           borderRadius: '4px',
//                         }}
//                       >
//                         {templateDetails?.components.map((component) => {
//                           switch (component.type) {
//                             case 'HEADER':
//                               return component.format === 'IMAGE' ? (
//                                 <img
//                                   key={component.type}
//                                   src={component.parameters[0].image.link}
//                                   alt={component.type}
//                                   style={{ width: '100%', height: 'auto' }}
//                                 />
//                               ) : (
//                                 <Typography key={component.type} variant="h5">
//                                   {component.text}
//                                 </Typography>
//                               );
//                             case 'BODY':
//                               return (
//                                 <Typography key={component.type} variant="body1">
//                                   {component.text.split('\n').map((item, idx) => (
//                                     <React.Fragment key={idx}>
//                                       {item}
//                                       <br />
//                                     </React.Fragment>
//                                   ))}
//                                 </Typography>
//                               );
//                             case 'FOOTER':
//                               return (
//                                 <Typography key={component.type} variant="caption">
//                                   {component.text}
//                                 </Typography>
//                               );
//                             default:
//                               return null;
//                           }
//                         })}
//                       </Box>
//                       <Box
//                         sx={{
//                           backgroundColor: 'white',
//                           width: '100%',
//                           mt: '1px',
//                           boxShadow: '0px 1px 5px #00000025',
//                         }}
//                       >
//                         {templateDetails?.components.map((component) => {
//                           if (component.type === 'BUTTONS') {
//                             return (
//                               <Button
//                                 key={component.type}
//                                 variant="outline"
//                                 href={component.buttons[0].url}
//                                 sx={{
//                                   backgroundColor: 'transparent',
//                                   color: '#0093E1',
//                                   fontSize: '1rem',
//                                   fontWeight: '600',
//                                   width: '100%',
//                                   '&:hover': { backgroundColor: '#1a4d2e00', color: '#0093E1' },
//                                   display: 'flex',
//                                   justifyContent: 'center',
//                                 }}
//                               >
//                                 <IconMessage2Share />
//                                 {component?.buttons[0].icon}
//                                 {component?.buttons[0].text}
//                               </Button>
//                             );
//                           }
//                           return null;
//                         })}
//                       </Box>
//                     </CardMedia>
//                   ) : (
                    
//                     <></>
//                   )}
//                 </Box>
//               </Grid>
//             </Grid>
//             <Stack direction="row" gap={2} justifyContent="flex-end" marginTop={4}>
//               <LoadingButton
//                 size="large"
//                 startIcon={<IconMessage2Share />}
//                 type="submit"
//                 variant="contained"
//                 loading={loading}
//               >
//                 Send broadcast
//               </LoadingButton>
//               <Button size="large" variant="outlined" onClick={handleClose}>
//                 Cancel
//               </Button>
//             </Stack>
//           </Box>
//         </form>
//       </Fade>
//     </Dialog>
//   );
// };

// export default TemplateModal;

//23-07
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
    <Dialog
      open={open}
      onClose={handleClose}
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
                          borderBottom: '1px solid #80808078',
                        }}
                      >
                        {templateDetails?.components.map((component) => {
                          switch (component.type) {
                            case 'HEADER':
                              {
                                const headerHandle = component.example?.header_handle?.[0];
                                const headerText = component.example?.header_text?.[0];
                                if (headerHandle) {
                                  const isVideo = component.format === 'VIDEO';
                                  return isVideo ? (
                                    <CardMedia
                                      key={component.type}
                                      component="video"
                                      image={headerHandle}
                                      controls
                                      title={component.type}
                                      sx={{ height: 200 }}
                                      autoPlay
                                    />
                                  ) : (
                                    <CardMedia
                                      key={component.type}
                                      component="img"
                                      image={headerHandle}
                                      title={component.type}
                                      sx={{ height: 200 }}
                                    />
                                  );
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
                <Button variant="contained" color="error" onClick={handleClose}>
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
import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, IconButton, Tooltip, Typography, TextField, InputAdornment, Paper, Button, Chip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CardMedia, CircularProgress } from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { IconEye, IconSearch, IconTrash } from '@tabler/icons';
import createMetaAxiosClient from 'src/api/axiosClientMeta';
import { LoadingButton } from '@mui/lab';
import CachedIcon from '@mui/icons-material/Cached';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Template name' },
  { id: 'category', numeric: false, disablePadding: false, label: 'Category' },
  { id: 'language', numeric: false, disablePadding: false, label: 'Language' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'action', numeric: false, disablePadding: false, label: 'Action' },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" >
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected, handleSearch, search, handleRefreshpage } = props;

  return (
    <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, ...(numSelected > 0 && { bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity) }) }}>
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle2" component="div">
          {numSelected} Selected
        </Typography>
      ) : (
        <Box sx={{ flex: '1 1 100%', display: 'flex', justifyContent: 'space-between', textAlign: 'right', mr: 1 }}>
          <Button type="submit" variant="contained" onClick={handleRefreshpage}>
            <CachedIcon fontSize="medium" sx={{ marginRight: '2px' }} />
            Refresh
          </Button>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size="1.1rem" />
                </InputAdornment>
              ),
            }}
            sx={{ background: 'white', borderRadius: 4 }}
            placeholder="Search..."
            size="small"
            onChange={handleSearch}
            value={search}
          />
        </Box>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <IconTrash width="18" />
          </IconButton>
        </Tooltip>
      ) : null}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  handleSearch: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  handleRefreshpage: PropTypes.func.isRequired,
};

const TemplatesTableList = () => {
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('name');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [view, setView] = useState([]);
  const [dialogTitle, setDialogTitle] = useState('');
  const [currentId, setCurrentId] = useState(null);
  const [currentName, setCurrentName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);

  const handleClickOpen = (row) => {
    setOpen(true);
    setView(row.components || []);
    setDialogTitle(row.name);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getApiData();
  }, []);

  const getApiData = async () => {
    try {
      const metaAxiosClient = createMetaAxiosClient();
      const response = await metaAxiosClient.get('/message_templates');
      setRows(response.data.data);
    } catch (error) {
      console.error('Error fetching data from API:', error);
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  };

  const handleRefreshpage = async () => {
    setTableLoading(true);
    await getApiData();
  };

  const handleDelete = (id, templateName) => {
    setCurrentId(id);
    setCurrentName(templateName);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await handleDeleteApi(currentId, currentName);
    } finally {
      setLoading(false);
      setConfirmDelete(false);
    }
  };

  const handleDeleteApi = async (id, templateName) => {
    try {
      const metaAxiosClient = createMetaAxiosClient();
      await metaAxiosClient.delete('/message_templates', { params: { hsm_id: id, name: templateName } });
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  const handleSearch = (event) => {
    const filteredRows = rows.filter((row) => row.name.toLowerCase().includes(event.target.value.toLowerCase()));
    setSearch(event.target.value);
    setRows(filteredRows);
    if (!event.target.value) getApiData();
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    getApiData();
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} handleSearch={handleSearch} search={search} handleRefreshpage={handleRefreshpage} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
            <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
            <TableBody>
              {tableLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover role="checkbox" aria-checked={isItemSelected} tabIndex={-1} key={row.id} selected={isItemSelected}>
                      <TableCell component="th" id={labelId} scope="row">{row.name}</TableCell>
                      <TableCell align="left">{row.category}</TableCell>
                      <TableCell align="left">{row.language}</TableCell>
                      <TableCell align="left">
                        <Chip label={row.status} color={row.status === 'active' ? 'success' : 'error'} size="small" />
                      </TableCell>
                      <TableCell align="left">
                        <Tooltip title="View" placement="top">
                          <IconButton onClick={() => handleClickOpen(row)}>
                            <IconEye width="18" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" placement="top">
                          <IconButton onClick={() => handleDelete(row.id, row.name)}>
                            <DeleteOutline />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          {view.map((component, index) => (
            <Box key={index} sx={{ marginBottom: 2 }}>
              <CardMedia component="img" height="140" image={component.image} alt={component.name} />
              <DialogContentText>{component.text}</DialogContentText>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete the template named "{currentName}"?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)} color="primary">Cancel</Button>
          <LoadingButton onClick={handleConfirmDelete} color="primary" loading={loading} loadingIndicator="Deleting...">
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplatesTableList;

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
            //value={componentData.link}
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
            variant="outlined"
            fullWidth
            //value={componentData.link}
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

const TemplateModal = ({ open, handleClose, broadcastId }) => {
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [broadcastDetails, setBroadcastDetails] = useState({
    broadcast: broadcastId,
    template: null,
  });
  const [templateDetails, setTemplateDetails] = useState();
  const [previewLink, setPreviewLink] = useState(null);

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
    console.log(previewLink);
    // Create a copy of the previous data
    const newData = { ...templateDetails };

    // Find the HEADER component and update its header_handle
    newData.components = newData.components.map((component) => {
      if (component.type === 'HEADER' && component.format === 'VIDEO') {
        return {
          ...component,
          parameters: [
            {
              video: [previewLink],
              format: 'VIDEO',
              type: 'HEADER',
            },
          ],
        };
      }
      return component;
    });

    if (!broadcastDetails.template) {
      toast.error('Please select template!');
      return;
    }
    console.log(newData);
    try {
      const res = await apiClient.post('/api/send_template/', {
        broadcast: broadcastDetails.broadcast,
        template: newData,
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

  const updateHeaderLink = (e, format) => {
    setPreviewLink(e.target.value);

    // const newHeaderComponent = {
    //   type: 'HEADER',
    //   format,
    //   parameters: [
    //     {
    //       type: format.toLowerCase(),
    //       [format.toLowerCase()]: {
    //         link: e.target.value,
    //       },
    //     },
    //   ],
    // };

    // setTemplateDetails((prevDetails) => ({
    //   ...prevDetails,
    //   components: prevDetails.components.map((component) =>
    //     component.type === 'HEADER' ? newHeaderComponent : component,
    //   ),
    // }));
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
    <Dialog
      open={open}
      onClose={handleClose}
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
            <Grid container spacing={2}>
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
                          borderBottom: '1px solid #80808078',
                        }}
                      >
                        {templateDetails?.components.map((component) => {
                          switch (component.type) {
                            case 'HEADER': {
                              const headerHandle = component.example?.header_handle?.[0];
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
                                      sx={{ height: 200 }}
                                      autoPlay
                                    />
                                  );
                                } else if (isDocument) {
                                  return (
                                    <Box sx={{ mb: 2, overflow: 'hidden', height: '200px' }}>
                                      <iframe
                                        src={headerHandle}
                                        width="100%"
                                        height="200px"
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
                                      sx={{ height: 200 }}
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
                <Button variant="contained" color="error" onClick={handleClose}>
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
