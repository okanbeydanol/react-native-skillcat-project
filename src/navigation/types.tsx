import {DrawerScreenProps} from '@react-navigation/drawer';
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
//Community
export type CommunityTabParamList = {
  CommunityScreen: undefined;
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
  LearnScreen: undefined;
  sections: SectionsScreenProps;
};

export type LearnTabScreenProps<T extends keyof LearnTabParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<LearnTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

//Explore
export type ExploreTabParamList = {
  ExploreScreen: undefined;
};

export type ExploreTabScreenProps<T extends keyof ExploreTabParamList> =
  CompositeScreenProps<
    DrawerScreenProps<ExploreTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

//Route
export type RootStackParamList = {
  Community: undefined;
  Learn: undefined;
  Explore: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
