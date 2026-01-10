import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { BeanListScreen } from '../screens/BeanListScreen';
import { BeanEditScreen } from '../screens/BeanEditScreen';
import { ShotLogScreen } from '../screens/ShotLogScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { TroubleshootScreen } from '../screens/TroubleshootScreen';
import { GuidedDialInScreen } from '../screens/GuidedDialInScreen';
import { BrewMethodDetailScreen } from '../screens/BrewMethodDetailScreen';
import { GuidedBrewScreen } from '../screens/GuidedBrewScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { colors } from '../theme';
import { BrewMethodId } from '../types';

// Navigation types
export type RootStackParamList = {
  MainTabs: undefined;
  BeanEdit: { beanId?: string };
  ShotLog: { methodId?: BrewMethodId; recipeId?: string; brewTime?: number };
  Troubleshoot: undefined;
  GuidedDialIn: { beanId?: string };
  BrewMethodDetail: { methodId: BrewMethodId; recipeId?: string };
  GuidedBrew: { methodId: BrewMethodId; recipeId: string };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '700',
        },
        tabBarActiveTintColor: colors.primary, // Crema Orange
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.borderLight,
          paddingTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: 'Kaffiene',
          headerTitle: 'Kaffiene',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🏠</Text>,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Settings' as never)}
              style={{ marginRight: 16 }}
            >
              <Text style={{ fontSize: 24 }}>⚙️</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen
        name="Beans"
        component={BeanListScreen}
        options={{
          title: 'My Beans',
          tabBarLabel: 'Beans',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>☕</Text>,
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          title: 'Progress',
          tabBarLabel: 'Progress',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📊</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BeanEdit"
          component={BeanEditScreen}
          options={{ title: 'Bean Details' }}
        />
        <Stack.Screen
          name="ShotLog"
          component={ShotLogScreen}
          options={{ title: 'Log Brew' }}
        />
        <Stack.Screen
          name="Troubleshoot"
          component={TroubleshootScreen}
          options={{ title: 'Troubleshoot' }}
        />
        <Stack.Screen
          name="GuidedDialIn"
          component={GuidedDialInScreen}
          options={{ title: 'Dial In Guide' }}
        />
        <Stack.Screen
          name="BrewMethodDetail"
          component={BrewMethodDetailScreen}
          options={({ route }) => ({
            title: '',
            headerTransparent: true,
            headerTintColor: '#FFFFFF',
          })}
        />
        <Stack.Screen
          name="GuidedBrew"
          component={GuidedBrewScreen}
          options={{
            headerShown: false,
            presentation: 'fullScreenModal',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

