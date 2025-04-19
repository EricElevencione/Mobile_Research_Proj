import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Index from './index';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
const Stack = createNativeStackNavigator();

export default function Layout() {
  const { user } = useAuth();

  if (user) {
    return (
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' options={{ headerShown: false }} component={LoginScreen} />
        <Stack.Screen name='Home' options={{ headerShown: false }} component={HomeScreen} />
        <Stack.Screen name='Announcement' options={{ headerShown: false }} component={AnnouncementScreen} />
        <Stack.Screen name='Emergency' options={{ headerShown: false }} component={EmergencyScreen} />
        <Stack.Screen name='Account' options={{ headerShown: false }} component={AccountScreen} />
      </Stack.Navigator>
    );
  } else {
    return (
      <Stack.Navigator initialRouteName='Index'>
        <Stack.Screen name='Index' options={{ headerShown: false }} component={Index} />
        <Stack.Screen name='Login' options={{ headerShown: false }} component={LoginScreen} />
        <Stack.Screen name='SignUp' options={{ headerShown: false }} component={SignUpScreen} />
      </Stack.Navigator>
    );
  }
}