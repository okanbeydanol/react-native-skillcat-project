import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {LearningPlan} from '../../constants/typescript/general-types.tsx';

const initialState: LearningPlan[] = [];

export const learningPlansSlice = createSlice({
  name: 'learningPlans',
  initialState,
  reducers: {
    learningPlansUpdated: (state, action: PayloadAction<LearningPlan[]>) => {
      return action.payload;
    },
  },
});

export const {learningPlansUpdated} = learningPlansSlice.actions;
export const getUserLearningPlans = (state: {learningPlans: LearningPlan[]}) =>
  state.learningPlans;
export const getUserLearningPlan = (
  state: {learningPlans: LearningPlan[]},
  id: number,
) => state.learningPlans.find(o => +o.planid === +id);
export const getUserDefaultLearningPlan = (state: {
  learningPlans: LearningPlan[];
}) => state.learningPlans.find(o => o.defaultLP) || null;

export default learningPlansSlice.reducer;
