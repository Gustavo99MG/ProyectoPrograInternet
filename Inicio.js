import React, {Component} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import LOGIN from './Login';
import USUARIO from "./ManejoTabs";

export default class Inicio extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const Stack = createNativeStackNavigator();
    return (
      <NavigationContainer>
        <Stack.Navigator>
                <Stack.Screen name="Login" component={LOGIN} options={{ headerShown: false }} />
                <Stack.Screen name="Usuario" component={USUARIO} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
