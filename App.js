// App.js

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './components/login';
import Signup from './components/signup';
import MainPage from './components/dashboard';

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="Signup"
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ title: 'Signup' }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={
          { title: 'Login' },
          { headerLeft: null }
        }
      />
      <Stack.Screen
        name="MainPage"
        component={MainPage}
        options={
          { title: 'MainPage' },
          { headerLeft: null }
        }
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}