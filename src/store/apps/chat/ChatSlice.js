import { createSlice } from '@reduxjs/toolkit';
import axios from '../../../utils/axios';
import { uniqueId } from 'lodash';
import apiClient from 'src/api/axiosClient';

// const CONTACTS_API_URL = 'http://192.168.1.47:8000/api/contacts/';
// const CONTACTS_API_URL = process.env.REACT_APP_API_BASE_URL + '/api/contacts/';
// const BROADCASTS_API_URL = process.env.REACT_APP_API_BASE_URL + '/api/broadcasts/';
const CHAT_HISTORY_BY_PHONE_NO_URL = process.env.REACT_APP_API_BASE_URL + '/api/message';
// const CHAT_HISTORY_BY_PHONE_NO_URL = 'http://192.168.1.47:8000/api/message';

const initialState = {
  broadcasts: [],
  chatContent: 1,
  chatSearch: '',
  chatHistory: null,
  selectedBroadcast: null,
  isHistory: false,
};

export const ChatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // broadcasts: (state, action) => {
    //   state.broadcasts = action.payload;
    // },
    setBroadcastList: (state, action) => {
      state.broadcasts = action.payload;
    },
    SearchChat: (state, action) => {
      state.chatSearch = action.payload;
    },
    
    setChatHistory: (state, action) => {
      console.log(action.payload);
      state.chatHistory = action.payload;
    },
    selectBroadcast: (state, action) => {
      state.selectedBroadcast = action.payload;
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
  },
});

export const { SearchChat, setBroadcastList, sendMsg, selectBroadcast, setChatHistory, setIsHistory } =
  ChatSlice.actions;

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

export const fetchIsHistoryStatus = (broadcastId) => async (dispatch) => {
  try {
    const res = await apiClient.get(`/broadcast-history_checker/${broadcastId}/`);
    if (res.status === 200) {
      dispatch(setIsHistory(res.data.is_history));
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

export default ChatSlice.reducer;
