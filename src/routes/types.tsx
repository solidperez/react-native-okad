import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

export enum AppRouteEnum {
  MAIN = 'MAIN',
  NewContactModal = 'NewContactModal',
  SETTINGS = 'SETTINGS',
}

type ContactsStackParamList = {
  [AppRouteEnum.NewContactModal]: undefined;
};

type SettingsStackParamList = {};

type AppStackParamList = ContactsStackParamList & SettingsStackParamList;

export type ContactsNavProps = {
  navigation: StackNavigationProp<
    AppStackParamList,
    AppRouteEnum.NewContactModal
  >;
  route: RouteProp<AppStackParamList, AppRouteEnum.NewContactModal>;
};
