import {
  ActionCreatorWithPayload,
  createSlice,
  PayloadAction,
  Slice,
  SliceSelectors,
} from '@reduxjs/toolkit';
import {USER} from '../../constants/typescript/general-types';

const initialState: USER = {
  id: undefined,
};

export const userSlice: Slice<
  USER,
  {USER_CHANGE: (state: USER, action: PayloadAction<USER>) => USER},
  'user',
  'user',
  SliceSelectors<USER>
> = createSlice({
  name: 'user',
  initialState,
  reducers: {
    USER_CHANGE: (state: USER, action: PayloadAction<USER>) => {
      return action.payload;
    },
  },
});
export const {
  USER_CHANGE,
}: {USER_CHANGE: ActionCreatorWithPayload<USER, 'user/USER_CHANGE'>} =
  userSlice.actions;

export const getUserStore = (state: {user: USER}) => state.user;

export default userSlice.reducer;
