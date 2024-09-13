import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  Fade,
  Select,
  MenuItem,
  Typography,
  Stack,
  Input,
  CardMedia,
  Dialog,
  Grid,
  InputLabel,
  FormControl,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconMessage2Share, IconUpload } from '@tabler/icons';

import { useSelector } from 'react-redux';
import apiClient from 'src/api/axiosClient';
import toast from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';
import img from 'src/assets/images/backgrounds/Template_background.jpg';
import EventContext from 'src/BroadcastContext';
import EstimatedCost from 'src/components/analytics/EstimatedCost';
import Spinner from 'src/views/spinner/Spinner';

import { Upload } from '@mui/icons-material';

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

// const HeaderComponent = ({
//   componentData,
//   updateHeaderLink,
//   handleFileUpload,
//   handleFileChange,
//   previewLink,
//   isLoading,
//   mediaLink,
// }) => {
//   switch (componentData.format) {
//     case 'IMAGE':
//       return (
//         <>
//           <label>Link to image</label>
//           <Input
//             type="url"
//             placeholder="Add link to image here"
//             onChange={(e) => updateHeaderLink(e, 'IMAGE')}
//             variant="outlined"
//             // value={currentLink}
//             //value={componentData.parameters?.[0]?.image?.link || ''}
//             fullWidth

//             // required
//           />
//           <Typography variant="h6" textAlign={'center'}>
//             OR
//           </Typography>
//           <input type="file" onChange={handleFileChange} accept="image/*" />
//           <Button onClick={handleFileUpload} disabled={isLoading}>
//             {isLoading ? <CircularProgress size={24} /> : 'Upload Image'}
//           </Button>
//         </>
//       );
//     case 'VIDEO':
//       return (
//         <>
//           <label>Link to video</label>
//           <Input
//             type="url"
//             placeholder="Add link to video here"
//             onChange={(e) => updateHeaderLink(e, 'VIDEO')}
//             //value={componentData.parameters?.[0]?.video?.link || ''}
//             variant="outlined"
//             fullWidth
//             //value={currentLink}
//             //required
//           />
//           <input type="file" onChange={handleFileChange} accept="video/*" />
//           <Button onClick={handleFileUpload} disabled={isLoading}>
//             {isLoading ? <CircularProgress size={24} /> : 'Upload Video'}
//           </Button>
//         </>
//       );
//     case 'DOCUMENT':
//       return (
//         <>
//           <label>Link to document</label>
//           <Input
//             type="url"
//             placeholder="Add link to document here"
//             onChange={(e) => updateHeaderLink(e, 'DOCUMENT')}
//             variant="outlined"
//             fullWidth

//             //value={componentData.parameters?.[0]?.document?.link || ''}
//             //required
//           />
//           <Typography variant="h4">OR</Typography>
//           <input type="file" onChange={handleFileChange} accept="application/pdf" />
//           <Button onClick={handleFileUpload} disabled={isLoading}>
//             {isLoading ? <CircularProgress size={24} /> : 'Upload Document'}
//           </Button>
//         </>
//       );
//     default:
//       return <></>;
//   }
// };

const HeaderComponent = ({
  componentData,
  updateHeaderLink,
  handleFileUpload,
  handleFileChange,
  previewLink,
  isLoading,
  mediaLink,
}) => {
  const [isLinkEntered, setIsLinkEntered] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const FILE_SIZE_LIMITS = {
    image: 5 * 1024 * 1024, // 5MB
    video: 16 * 1024 * 1024, // 16MB
    document: 16 * 1024 * 1024, // 16MB
  };

  const getMediaType = (fileType) => {
    if (fileType.startsWith('image/')) return 'image';
    if (fileType.startsWith('video/')) return 'video';
    if (fileType === 'application/pdf' || fileType.startsWith('application/msword'))
      return 'document';
    return null;
  };

  const handleLinkChange = (e, format) => {
    const linkValue = e.target.value.trim();
    updateHeaderLink(e, format);

    const linkEntered = linkValue !== '';
    setIsLinkEntered(linkEntered);

    if (linkEntered) {
      setIsFileSelected(false);
      setSelectedFileName(''); // Reset file name when link is entered
      setSelectedFile(null);
    }
  };

  const handleFileSelection = (e) => {
    handleFileChange(e);

    const file = e.target.files[0];
    if (file) {
      const mediaType = getMediaType(file.type);

      if (!mediaType) {
        toast.error('Invalid file type. Only images, videos, and documents are allowed.');
        return;
      }

      if (file.size > FILE_SIZE_LIMITS[mediaType]) {
        const maxSizeMB = FILE_SIZE_LIMITS[mediaType] / (1024 * 1024); // Convert to MB
        toast.error(
          `File size exceeds the limit. Maximum allowed size for ${mediaType}s is ${maxSizeMB} MB.`,
        );
        return;
      }

      setSelectedFileName(file.name); // Update file name
      setSelectedFile(file);
      setIsFileSelected(true);
      setIsLinkEntered(false);
    } else {
      setSelectedFileName('');
      setIsFileSelected(false);
      setSelectedFile(null);
    }
  };

  switch (componentData.format) {
    case 'IMAGE':
      return (
        <>
          <label>Link to image</label>
          <Input
            type="url"
            placeholder="Add link to image here"
            onChange={(e) => handleLinkChange(e, 'IMAGE')}
            variant="outlined"
            fullWidth
            disabled={isFileSelected}
          />
          <Typography variant="h6" textAlign={'center'}>
            OR
          </Typography>
          <input
            type="file"
            onChange={handleFileSelection}
            accept="image/*"
            style={{ display: 'none' }} // Hide the file input
            id="image-upload"
          />
          <Button
            component="label"
            htmlFor="image-upload"
            disabled={isLinkEntered}
            sx={{
              backgroundColor: 'white',
              border: '1px solid #1A4D2E',
              borderStyle: 'dashed',
              '&:hover': { backgroundColor: 'white', color: '#1A4D2E' },
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Upload style={{ marginRight: '8px' }} />
              <span>Choose a File to Upload</span>
            </div>
            <span style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
              Maximum file size allowed: 5MB
            </span>
          </Button>

          {selectedFileName && (
            <Typography variant="body2" textAlign={'center'}>
              Selected File: {selectedFileName}
            </Typography>
          )}
          <Button
            onClick={() => handleFileUpload(selectedFile)}
            disabled={isLoading || isLinkEntered || !isFileSelected}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? 'Uploading' : 'Upload Image'}
          </Button>
        </>
      );
    case 'VIDEO':
      return (
        <>
          <label>Link to video</label>
          <Input
            type="url"
            placeholder="Add link to video here"
            onChange={(e) => handleLinkChange(e, 'VIDEO')}
            variant="outlined"
            fullWidth
            disabled={isFileSelected}
          />
          <Typography variant="h6" textAlign={'center'}>
            OR
          </Typography>
          <input
            type="file"
            onChange={handleFileSelection}
            accept="video/*"
            style={{ display: 'none' }} // Hide the file input
            id="video-upload"
          />
          {/* <Button
            component="label"
            htmlFor="video-upload"
            disabled={isLinkEntered}
            sx={{
              backgroundColor: 'white',
              border: '1px solid #1A4D2E',
              borderStyle: 'dashed',
              '&:hover': { backgroundColor: 'white', color: '#1A4D2E' },
            }}
          >
            <Upload />
            Choose File to Upload
          </Button> */}
          <Button
            component="label"
            htmlFor="video-upload"
            disabled={isLinkEntered}
            sx={{
              backgroundColor: 'white',
              border: '1px solid #1A4D2E',
              borderStyle: 'dashed',
              '&:hover': { backgroundColor: 'white', color: '#1A4D2E' },
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Upload style={{ marginRight: '8px' }} />
              <span>Choose a File to Upload</span>
            </div>
            <span style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
              Maximum file size allowed: 16MB
            </span>
          </Button>
          {selectedFileName && (
            <Typography variant="body2" textAlign={'center'}>
              Selected File: {selectedFileName}
            </Typography>
          )}
          <Button
            onClick={() => handleFileUpload(selectedFile)}
            disabled={isLoading || isLinkEntered || !isFileSelected}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? 'Uploading' : 'Upload Video'}
          </Button>
        </>
      );
    case 'DOCUMENT':
      return (
        <>
          <label>Link to document</label>
          <Input
            type="url"
            placeholder="Add link to document here"
            onChange={(e) => handleLinkChange(e, 'DOCUMENT')}
            variant="outlined"
            fullWidth
            disabled={isFileSelected}
          />
          <Typography variant="h6" textAlign={'center'}>
            OR
          </Typography>
          <input
            type="file"
            onChange={handleFileSelection}
            accept="application/pdf"
            style={{ display: 'none' }} // Hide the file input
            id="document-upload"
          />
          <Button
            component="label"
            htmlFor="document-upload"
            disabled={isLinkEntered}
            sx={{
              backgroundColor: 'white',
              border: '1px solid #1A4D2E',
              borderStyle: 'dashed',
              '&:hover': { backgroundColor: 'white', color: '#1A4D2E' },
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Upload style={{ marginRight: '8px' }} />
              <span>Choose a File to Upload</span>
            </div>
            <span style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
              Maximum file size allowed: 16MB
            </span>
          </Button>
          {selectedFileName && (
            <Typography variant="body2" textAlign={'center'}>
              Selected File: {selectedFileName}
            </Typography>
          )}
          <Button
            onClick={() => handleFileUpload(selectedFile)}
            disabled={isLoading || isLinkEntered || !isFileSelected}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? 'Uploading' : 'Upload Document'}
          </Button>
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

const TemplateModal = ({
  open,
  handleClose,
  broadcastId,
  checkBroadcastHistory,
  walletBalance,
}) => {
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const activeBroadcast = useSelector((state) => state.chatReducer.selectedBroadcast);
  const [templates, setTemplates] = useState([]);
  const [defaultHeaderHandles, setDefaultHeaderHandles] = useState({});
  const { toggleOnOff } = useContext(EventContext);
  const [mediaId, setMediaId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaLink, setMediaLink] = useState('');
  const [broadcastDetails, setBroadcastDetails] = useState({
    broadcast: broadcastId,
    template: null,
  });
  const [templateDetails, setTemplateDetails] = useState();
  //const [previewLink, setPreviewLink] = useState(null);
  const [sendBtn, setSendBtn] = useState(false);
  const [isUploadSuccessful, setIsUploadSuccessful] = useState(true);

  const [file, setFile] = useState(null);
  const [previewLink, setPreviewLink] = useState('');

  const location = useLocation(); // Get current location
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleClickSamePage = () => {
    navigate(location.pathname);
  };

  const handleFileUpload = async (file) => {
    if (!file) {
      toast.error('Please Select The Media!');
      return;
    }
    setIsLoading(true);
    setIsUploadSuccessful(false);
    const formData = new FormData();
    formData.append('file', file);
    const phoneId = localStorage.getItem('phone_id');
    if (phoneId) {
      formData.append('phone_id', phoneId);
    } else {
      toast.error('Phone ID not found!');
      return;
    }
    try {
      const res = await apiClient.post('/api/upload_media/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { id, preview_url } = res.data;
      setPreviewLink(process.env.REACT_APP_API_BASE_URL + preview_url);
      // setMediaLink(process.env.REACT_APP_API_BASE_URL + preview_url);
      // console.log('--preview', preview_url);

      setMediaId(id);
      toast.success('File Uploaded Successfully');
      setIsUploadSuccessful(true);
    } catch (error) {
      toast.error('File upload failed:', error);
      setIsUploadSuccessful(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      // const metaInstance = createMetaAxiosInstance();
      // const res = await metaInstance.get('message_templates?');
      const waba_id = localStorage.getItem('whatsapp_business_account_id');
      const rowsPerPage = 1000;
      const res = await apiClient.get(
        `/api/get_message_templates/?whatsapp_business_account_id=${waba_id}&rows_per_page=${rowsPerPage}`,
      );
      // console.log('respomse', res);

      if (res.status === 200) {
        // console.log('caled------');
        const approvedTemplates = res.data.data.results.filter(
          (template) => template.status === 'APPROVED',
        );
        setTemplates(approvedTemplates);
        // console.log(approvedTemplates, '------');
      }
    } catch (err) {
      console.warn(err, '++++++++++++++++++');
    }
  };

  // const fetchTemplates = async () => {
  //   try{
  //      const res = await apiClient.get(`api/get_template_detail`)
  //   }
  // }

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

  // const fetchTemplateById = async () => {
  //   try {
  //     if (broadcastDetails?.template) {
  //       const metaInstance = createMetaAxiosInstance({ addBAId: false });
  //       const res = await metaInstance.get(broadcastDetails.template);
  //       if (res.status === 200) {
  //         const updatedData = addBodyVariableEmptyArray(res.data);
  //         setTemplateDetails(updatedData);
  //         setPreviewLink(res?.data?.components[0]?.example?.header_handle[0]);
  //         // Store default values
  //         const defaultValues = {};
  //         updatedData.components.forEach((component) => {
  //           if (component.type === 'HEADER') {
  //             defaultValues[component.format] = component.example?.header_handle?.[0];
  //           }
  //         });
  //         setDefaultHeaderHandles(defaultValues);
  //         console.log('called');

  //       }
  //     }
  //   } catch (err) {
  //     toast.error('There was an error fetching the template details!');
  //   }
  // };
  const fetchTemplateById = async () => {
    try {
      if (broadcastDetails?.template) {
        setLoading(true); // Start loading
        const phoneId = localStorage.getItem('phone_id');

        const res = await apiClient.get(
          `/api/get_template_detail/${broadcastDetails.template}/?phone_id=${phoneId}`,
        );
        // console.log('-----', res);

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

          setMediaId(res.data.media_id);
          // console.log('Media ID:', mediaId);

          // console.log('called');
        }
      }
    } catch (err) {
      toast.error('There was an error fetching the template details!');
    } finally {
      setLoading(false); // Stop loading
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
    if (parseInt(walletBalance) >= parseInt(activeBroadcast?.members)) {
      // console.log('I am working');
      setSendBtn(true);
    }
    setBroadcastDetails({
      ...broadcastDetails,
      broadcast: broadcastId,
      [e.target.name]: e.target.value,
    });
  };

  // const sendBroadcastMsg = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   if (!broadcastDetails.template) {
  //     toast.error('Please select template!');
  //     return;
  //   }
  //   console.log(templateDetails, 'templateDetails =====');
  //   try {
  //     const res = await apiClient.post('/api/send_template/', {
  //       broadcast: broadcastDetails.broadcast,
  //       template: templateDetails,
  //     });
  //     if (res.status === 200 || res.status === 201) {
  //       toast.success('Broadcast scheduled successfully!');
  //       toggleOnOff();
  //       handleClose();
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //     toast.error(err?.response?.data?.message ?? 'There was an error! Please try again!');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const sendBroadcastMsg = async (e) => {
    e.preventDefault();
    setButtonLoading(true);

    if (!isUploadSuccessful) {
      toast.error('Please upload the file first!');
      setButtonLoading(false);
      return;
    }
    if (!broadcastDetails.template) {
      toast.error('Please select a template!');
      setButtonLoading(false);
      return;
    }

    const updatedTemplateDetails = {
      ...templateDetails,
      components: templateDetails.components.map((component) => {
        if (component.type === 'HEADER') {
          const format = component.format || 'IMAGE';
          return {
            type: 'HEADER',
            format,
            ...(format === 'TEXT'
              ? { text: component.text }
              : {
                  parameters: [
                    {
                      type: format.toLowerCase(),
                      [format.toLowerCase()]: {
                        id: mediaId,
                      },
                    },
                  ],
                }),
          };
        }
        if (component.type === 'BODY') {
          return {
            ...component,
            text: component.text,
          };
        }
        return component;
      }),
    };

    try {
      const res = await apiClient.post('/api/send_template/', {
        broadcast: broadcastDetails.broadcast,
        template: updatedTemplateDetails,
      });

      if (res.status === 200 || res.status === 201) {
        toast.success('Broadcast scheduled successfully!');
        toggleOnOff();
        handleClose();
        setSendBtn(false);
        setTemplateDetails(null);
        handleClickSamePage();
      }
    } catch (err) {
      console.warn(err);
      toast.error(err?.response?.data?.message ?? 'There was an error! Please try again!');
    } finally {
      setButtonLoading(false);
    }
  };

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
    setSendBtn(false);
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
            {loading ? (
              <Box
                minWidth={'650px'}
                maxWidth={'750px'}
                maxHeight={'200px !important'}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
              >
                <Spinner />
              </Box>
            ) : (
              <>
                <Grid container spacing={2} minWidth={'650px'} maxWidth={'750px'}>
                  <Grid item xs={12} sm={6}>
                    <Stack gap={2}>
                      {broadcastDetails?.template &&
                        (templateDetails?.components?.[0]?.type === 'HEADER' ? (
                          <>
                            {' '}
                            <HeaderComponent
                              componentData={templateDetails?.components?.[0]}
                              updateHeaderLink={updateHeaderLink}
                              handleFileChange={handleFileChange}
                              handleFileUpload={handleFileUpload}
                              isLoading={isLoading}
                              previewLink={previewLink}
                              mediaLink={mediaLink}
                            />
                            {/* <VisuallyHiddenInput
                          type="file"
                          accept="image/*,video/*,.pdf"
                          onChange={handleFileChange}
                          id="media-upload"
                        />
                        <label htmlFor="media-upload">
                          <IconButton color="primary" component="span">
                            <IconUpload />
                          </IconButton>
                          <Typography variant="body2">Upload Media</Typography>
                        </label> */}
                          </>
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
                                    component.parameters?.[0]?.[component.format.toLowerCase()]
                                      ?.link || previewLink;
                                  const headerHandle =
                                    headerLink || component.example?.header_handle?.[0];

                                  //const headerText = component.example?.header_text?.[0];
                                  const headerText = component?.text;
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
                                          <embed
                                            src={headerHandle}
                                            // width="100%"
                                            // height="400px"
                                            width="500"
                                            height="300"
                                            title="Document Preview"
                                            style={{ border: 'none', overflow: 'hidden' }}
                                          ></embed>
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
                                    // <Typography key={component.type} variant="body1">
                                    //   {component.text.split('\n').map((item, idx) => (
                                    //     <span key={idx}>
                                    //       {item}
                                    //       <br />
                                    //     </span>
                                    //   ))}
                                    // </Typography>
                                    <Typography
                                      key={component?.type}
                                      variant="body1"
                                      dangerouslySetInnerHTML={{
                                        __html: component.text
                                          .replace(/\*([^*]+)\*/g, '<b>$1</b>') // Convert bold to HTML
                                          .replace(/_([^_]+)_/g, '<i>$1</i>') // Convert italic to HTML
                                          .replace(/~([^~]+)~/g, '<s>$1</s>'), // Convert strikethrough to HTML
                                      }}
                                    />
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
                      loading={buttonLoading}
                      disabled={!sendBtn || !isUploadSuccessful}
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
              </>
            )}
            {templateDetails ? (
              <EstimatedCost members={activeBroadcast?.members} walletBalance={walletBalance} />
            ) : null}
          </Box>
        </form>
      </Fade>
    </Dialog>
  );
};

export default TemplateModal;
