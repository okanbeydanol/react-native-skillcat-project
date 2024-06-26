import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {USER} from '../../constants/typescript/general-types';

const initialState: USER = {
  id: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    USER_CHANGE: (state: USER, action: PayloadAction<USER>) => {
      return action.payload;
    },
  },
});
export const {USER_CHANGE} = userSlice.actions;

export const getUserStore = (state: {user: USER}) => state.user;

export default userSlice.reducer;
