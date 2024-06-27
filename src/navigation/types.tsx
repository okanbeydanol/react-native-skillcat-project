import {DrawerScreenProps} from '@react-navigation/drawer';
import type {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NetworkStore} from '../store/slices/network.tsx';
//Community
export type CommunityTabParamList = {
  CommunityScreen: {networkStore: NetworkStore};
};

export type CommunityTabScreenProps<T extends keyof CommunityTabParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<CommunityTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

//Learn
interface SectionsScreenProps {
  competencyid: number;
  fromLearnTab: boolean;
  fromSkillsTab: boolean;
}
export type LearnTabParamList = {
  LearnScreen: {networkStore: NetworkStore};
  sections: SectionsScreenProps;
};

export type LearnTabScreenProps<T extends keyof LearnTabParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<LearnTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

//Explore
export type ExploreTabParamList = {
  ExploreScreen: {networkStore: NetworkStore};
};

export type ExploreTabScreenProps<T extends keyof ExploreTabParamList> =
  CompositeScreenProps<
    DrawerScreenProps<ExploreTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type RootStackParamList = {
  Community: {networkStore: NetworkStore};
  Learn: {networkStore: NetworkStore};
  Explore: {networkStore: NetworkStore};
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
