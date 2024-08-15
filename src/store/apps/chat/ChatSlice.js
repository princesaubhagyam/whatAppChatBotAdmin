import { createSlice } from '@reduxjs/toolkit';
import axios from '../../../utils/axios';
import { uniqueId } from 'lodash';
import apiClient from 'src/api/axiosClient';
import createMetaAxiosInstance from 'src/api/axiosClientMeta';

const CHAT_HISTORY_BY_PHONE_NO_URL = process.env.REACT_APP_API_BASE_URL + '/api/message';

const initialState = {
  broadcasts: [],
  chatContent: 1,
  chatSearch: '',
  chatHistory: null,
  selectedBroadcast: null,
  isHistory: false,
  activeBroadcastId: null,
  qualityRating: null,
};

export const ChatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setBroadcastList: (state, action) => {
      state.broadcasts = action.payload;
    },
    SearchChat: (state, action) => {
      state.chatSearch = action.payload;
    },
    setChatHistory: (state, action) => {
      state.chatHistory = action.payload;
    },
    selectBroadcast: (state, action) => {
      state.selectedBroadcast = action.payload;
      state.activeBroadcastId = action.payload.id;
    },
    sendMsg: (state, action) => {
      const { msg, phoneNo, chatId } = action.payload;

      sendMessage(msg, phoneNo);

      state.chats = state.chats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  phoneNo,
                  msg,
                  type: 'text',
                  attachments: [],
                  createdAt: new Date().toISOString(),
                  senderId: uniqueId(),
                },
              ],
            }
          : chat,
      );
    },
    setIsHistory: (state, action) => {
      state.isHistory = action.payload;
    },
    setQualityRating: (state, action) => {
      state.qualityRating = action.payload;
    },
  },
});

export const {
  SearchChat,
  setBroadcastList,
  sendMsg,
  selectBroadcast,
  setChatHistory,
  setIsHistory,
  setQualityRating,
} = ChatSlice.actions;

export const fetchBroadcasts = () => async () => {
  try {
    const response = await apiClient.get('/api/broadcasts/');
    if (response.data.success) {
      return response.data.data.results;
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const fetchSelectedBroadcasts = (broadcastId) => async (dispatch) => {
  try {
    const response = await apiClient.get(`/api/broadcasts/${broadcastId}`);
    console.log(response);
    if (response) {
      console.log('response.data', response.data);
      dispatch(selectBroadcast(response.data.data));
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const fetchIsHistoryStatus = (broadcastId) => async (dispatch) => {
  try {
    const res = await apiClient.get(`/broadcast-history_checker/${broadcastId}/`);
    if (res.status === 200) {
      dispatch(setIsHistory(res.data.is_history));
      // fetchSelectedBroadcasts(broadcastId)
    }
  } catch (error) {
    console.warn('Error fetching history status:', error);
  }
};

export const fetchChatHistoryByPhoneNo = (phoneNo) => async (dispatch) => {
  try {
    const res = await axios.get(CHAT_HISTORY_BY_PHONE_NO_URL, {
      params: {
        contact: phoneNo,
      },
    });
    if (res.status === 200) {
      console.log(res.data.data, '++++++');
      dispatch(setChatHistory(res.data.data));
    }
  } catch (error) {
    console.warn('Error fetching chat by phone number :', error);
  }
};

export const fetchQualityRating = () => async (dispatch) => {
  try {
    const metaClient = createMetaAxiosInstance({ addBAId: false });
    const phoneId = localStorage.getItem('phone_id');
    if (phoneId !== null) {
      const response = await metaClient.get(`${phoneId}`);
      const fetchedQualityRating = response?.data?.quality_rating;
      console.log('Redux - Fetched qualityRating:', fetchedQualityRating);
      dispatch(setQualityRating(fetchedQualityRating));
    }
  } catch (error) {
    console.error('Failed to fetch quality rating:', error);
  }
};

const sendMessage = async (msg, to) => {
  const META_MSG_SEND_URL = `${process.env.REACT_APP_WHAP_APP_MANAGE_API_BASE_URL}/${process.env.REACT_APP_MSG_PHONE_NUMBER_ID}/messages`;
  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: to,
    type: 'text',
    text: {
      preview_url: false,
      body: msg,
    },
  };
  try {
    const res = await axios.post(META_MSG_SEND_URL, payload, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_WA_AUTH_TOKEN}`,
      },
    });
    if (res.status === 200) {
      alert('Message sent!');
    }
  } catch (error) {
    console.warn('Message sending error :', error);
  }
};

// Selectors
export const selectChatId = (state) => state.chat.chatId;
export const selectChatPhoneNo = (state) => state.chat.chatPhoneNo;
export const selectChatHistory = (state) => state.chat.chatHistory;
export const selectIsHistory = (state) => state.chat.isHistory;
export const selectActiveBroadcastId = (state) => state.chat.activeBroadcastId;
export const selectQualityRating = (state) => state.chat.qualityRating;

export default ChatSlice.reducer;
