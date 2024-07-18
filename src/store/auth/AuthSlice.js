import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wallet_balance: 0,
};

export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setWalletBalance: (state, action) => {
      state.wallet_balance = action.payload;
    },
  },
});

export const { setWalletBalance } = AuthSlice.actions;

export default AuthSlice.reducer;
