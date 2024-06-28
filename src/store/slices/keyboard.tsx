import {
  ActionCreatorWithPayload,
  createSlice,
  PayloadAction,
  Slice,
  SliceSelectors,
} from '@reduxjs/toolkit';
import {KeyboardEventName, KeyboardEvent} from 'react-native';

export type KeyboardEvents = {
  type: KeyboardEventName | null;
  event: KeyboardEvent | null;
  status: boolean;
  height: number;
};

const initialState: KeyboardEvents = {
  type: null,
  event: null,
  status: false,
  height: 0,
};

export const keyboardEventsSlice: Slice<
  KeyboardEvents,
  {
    KEYBOARD_EVENT_CHANGE: (
      state: KeyboardEvents,
      action: PayloadAction<KeyboardEvents>,
    ) => void;
  },
  'keyboardEvents',
  'keyboardEvents',
  SliceSelectors<KeyboardEvents>
> = createSlice({
  name: 'keyboardEvents',
  initialState,
  reducers: {
    KEYBOARD_EVENT_CHANGE: (
      state: KeyboardEvents,
      action: PayloadAction<KeyboardEvents>,
    ) => {
      const type: KeyboardEventName =
        action.payload?.type || 'keyboardWillChangeFrame';
      state.event = action.payload.event;
      state.type = type;
      if (type === 'keyboardDidHide' || type === 'keyboardWillHide') {
        state.status = false;
        state.height = 0;
      }
      if (type === 'keyboardDidShow' || type === 'keyboardWillShow') {
        state.status = true;
        state.height = action?.payload?.event?.endCoordinates?.height || 0;
      }
    },
  },
});

export const {
  KEYBOARD_EVENT_CHANGE,
}: {
  KEYBOARD_EVENT_CHANGE: ActionCreatorWithPayload<
    KeyboardEvents,
    'keyboardEvents/KEYBOARD_EVENT_CHANGE'
  >;
} = keyboardEventsSlice.actions;

export const getKeyboardEventsStore = (state: {
  keyboardEvents: KeyboardEvents;
}): KeyboardEvents => state.keyboardEvents;

export default keyboardEventsSlice.reducer;
