import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import USUARIO from './Usuario';
import USUARIO1 from './Usuario1';
import USUARIO2 from './Usuario2';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

export default class ManejoTabs extends Component {
    componentDidMount() {
        this.verificarDatosAlumno();
    }

    verificarDatosAlumno = async () => {
        await AsyncStorage.setItem('nombre', this.props.route.params.nombre);
        await AsyncStorage.setItem('codigo', this.props.route.params.codigo);
        try {
            const codigoAlumno = await AsyncStorage.getItem('codigo');
            if (codigoAlumno) {
                // Si se han guardado datos de código de alumno, navegar a Usuario1
                const nombreAlumno = await AsyncStorage.getItem('nombre');
                this.props.navigation.navigate('Usuario');
            } else {
                // Si no se han guardado datos de código de alumno, navegar a Login
                this.props.navigation.navigate('Login');
            }
        } catch (error) {
            console.error('Error al verificar datos del alumno:', error);
        }
    };

    render() {
        return (
            <Tab.Navigator
                initialRouteName="Home"
                activeColor="#f0edf6"
                inactiveColor="#3e2465"
                barStyle={{ backgroundColor: '#63e5ff' }}>

                <Tab.Screen name="Tiempo" component={USUARIO} 
                    options={{ tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="clock" color={'#ff9d5c'} size={26} />), }} />

                <Tab.Screen name="Total" component={USUARIO1}
                    options={{ tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="clock-check" color={'#ff9d5c'} size={26} />), }} />

                <Tab.Screen name="Avisos" component={USUARIO2}
                    options={{ tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="newspaper" color={'#ff9d5c'} size={26} />), }} />
            </Tab.Navigator>
        );
    }
}
