import React, { Component } from 'react';
import { View, Text, TouchableOpacity, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundTimer from 'react-native-background-timer';

export default class Horas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            horas: 0,
            minutos: 0,
            segundos: 0,
            corriendo: false,
            nombreAlumno: '',
            codigoAlumno: '',
            appState: AppState.currentState,
        };
        this.intervalo = null;
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('focus', this.obtenerNombreAlumno);
        this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);
        this.cargarEstadoContador();
        this.iniciarContador(); // Iniciar el contador cuando el componente se monta
    }

    componentWillUnmount() {
        if (this.focusListener) {
            this.focusListener();
        }
        if (this.appStateSubscription) {
            this.appStateSubscription.remove();
        }
        this.detenerContador();
        this.guardarEstadoContador();
    }

    handleAppStateChange = async (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            this.obtenerNombreAlumno();
            await this.cargarEstadoContador();
        }
        this.setState({ appState: nextAppState });
    };

    cargarEstadoContador = async () => {
        try {
            const estado = await AsyncStorage.getItem('estadoContador');
            if (estado !== null) {
                const { corriendo, horas, minutos, segundos } = JSON.parse(estado);
                this.setState({ corriendo, horas, minutos, segundos });
                if (corriendo) {
                    this.iniciarContador();
                }
            }
        } catch (error) {
            console.error('Error al cargar el estado del contador:', error);
        }
    };

    guardarEstadoContador = async () => {
        try {
            const { corriendo, horas, minutos, segundos } = this.state;
            await AsyncStorage.setItem('estadoContador', JSON.stringify({ corriendo, horas, minutos, segundos }));
        } catch (error) {
            console.error('Error al guardar el estado del contador:', error);
        }
    };

    obtenerNombreAlumno = async () => {
        try {
            const nombreAlumno = await AsyncStorage.getItem('nombre');
            const codigoAlumno = await AsyncStorage.getItem('codigo');
            if (nombreAlumno !== null && codigoAlumno !== null) {
                this.setState({ nombreAlumno, codigoAlumno });
            }
        } catch (error) {
            console.error('Error al obtener el nombre y código del alumno:', error);
        }
    };

    iniciarContador = () => {
        if (!this.state.corriendo) {
            this.setState({ corriendo: true });
            this.intervalo = BackgroundTimer.setInterval(this.actualizarTiempo, 1000);
        }
    };

    detenerContador = () => {
        BackgroundTimer.clearInterval(this.intervalo);
        this.setState({ corriendo: false });
    };

    reiniciarContador = () => {
        BackgroundTimer.clearInterval(this.intervalo);
        this.setState({ horas: 0, minutos: 0, segundos: 0, corriendo: false });
    };

    actualizarTiempo = () => {
        this.setState(prevState => {
            let { horas, minutos, segundos } = prevState;
            segundos += 1;
            if (segundos === 60) {
                segundos = 0;
                minutos += 1;
            }
            if (minutos === 60) {
                minutos = 0;
                horas += 1;
            }
            return { horas, minutos, segundos };
        });
    };

    enviarTiempo = async () => {
        const { nombreAlumno, codigoAlumno, horas, minutos, segundos } = this.state;

        try {
            const response = await fetch('https://finalappbestmx.000webhostapp.com/enviarTiempo.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `codigoAlumno=${encodeURIComponent(codigoAlumno)}&nombreAlumno=${encodeURIComponent(nombreAlumno)}&horas=${encodeURIComponent(horas)}&minutos=${encodeURIComponent(minutos)}&segundos=${encodeURIComponent(segundos)}`,
            });
            const data = await response.text();
            console.log(data);
        } catch (error) {
            console.error('Error al enviar tiempo:', error);
        }
    };

    cerrarSesion = async () => {
        // Enviar el tiempo
        await this.enviarTiempo();
        // Guardar el estado del contador
        await this.guardarEstadoContador();
        // Reiniciar el contador
        this.reiniciarContador();
        // Cerrar sesión
        try {
            await AsyncStorage.removeItem('codigoAlumno');
            await AsyncStorage.removeItem('nombreAlumno');
            this.props.navigation.navigate('Login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    render() {
        const { horas, minutos, segundos, nombreAlumno, codigoAlumno } = this.state;
        return (
            <>
                <View style={{ marginTop: 15 }}>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 25, color: 'black' }}> Sesión actual </Text>
                </View>

                <View style={{ marginTop: 50 }}>
                    <Text style={{ color: 'black', marginLeft: '5%' }}>Bienvenido {nombreAlumno}</Text>
                    <Text style={{ color: 'black', marginLeft: '5%' }}>Código Alumno: {codigoAlumno}</Text>
                </View>
                <View style={{ marginTop: 100 }}></View>
                <Text style={{ fontSize: 45, marginLeft: '5%', color: 'black' }}>
                    Tiempo: {horas.toString().padStart(2, '0')}:{minutos.toString().padStart(2, '0')}:{segundos.toString().padStart(2, '0')}
                </Text>
                <TouchableOpacity style={{
                    backgroundColor: 'red',
                    padding: 10,
                    borderRadius: 5,
                    marginTop: 10,
                    alignItems: 'center',
                    width: 300,
                    marginLeft: '10%',
                }} onPress={this.cerrarSesion}>
                    <Text style={{ color: 'white', fontSize: 16, }}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </>
        );
    }
}
