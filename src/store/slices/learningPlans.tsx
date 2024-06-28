import {
  ActionCreatorWithPayload,
  createSlice,
  PayloadAction,
  Slice,
  SliceSelectors,
} from '@reduxjs/toolkit';
import {LearningPlan} from '../../constants/typescript/general-types.tsx';

const initialState: LearningPlan[] = [];

export const learningPlansSlice: Slice<
  LearningPlan[],
  {
    learningPlansUpdated: (
      state: LearningPlan[],
      action: PayloadAction<LearningPlan[]>,
    ) => LearningPlan[];
  },
  'learningPlans',
  'learningPlans',
  SliceSelectors<LearningPlan[]>
> = createSlice({
  name: 'learningPlans',
  initialState,
  reducers: {
    learningPlansUpdated: (
      state: LearningPlan[],
      action: PayloadAction<LearningPlan[]>,
    ) => {
      console.log('learningPlansUpdated', action.payload);
      return action.payload;
    },
  },
});

export const {
  learningPlansUpdated,
}: {
  learningPlansUpdated: ActionCreatorWithPayload<
    LearningPlan[],
    'learningPlans/learningPlansUpdated'
  >;
} = learningPlansSlice.actions;
export const getUserLearningPlans = (state: {
  learningPlans: LearningPlan[];
}): LearningPlan[] => state.learningPlans;
export const getUserLearningPlan = (
  state: {learningPlans: LearningPlan[]},
  id: number,
): LearningPlan | undefined =>
  state.learningPlans.find((o: LearningPlan): boolean => +o.planid === +id);
export const getUserDefaultLearningPlan = (state: {
  learningPlans: LearningPlan[];
}): LearningPlan | undefined =>
  state.learningPlans.find((o: LearningPlan) => o.defaultLP) || undefined;

export default learningPlansSlice.reducer;
