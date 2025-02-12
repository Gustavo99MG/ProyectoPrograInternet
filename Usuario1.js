import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default class Acumuladas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            registrosTiempo: [],
        };
    }

    componentDidMount() {
        this.obtenerRegistrosTiempo();
        // Establecer un intervalo para actualizar cada 10 segundos
        this.interval = setInterval(this.obtenerRegistrosTiempo, 10000); // 10000 ms = 10 segundos
    }

    componentWillUnmount() {
        // Limpiar el intervalo cuando el componente se desmonte para evitar fugas de memoria
        clearInterval(this.interval);
    }

    obtenerRegistrosTiempo = () => {
        var xhr = new XMLHttpRequest();
        var url = 'https://finalappbestmx.000webhostapp.com/leerHoras.php';
        xhr.open('GET', url, true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const registrosTiempo = JSON.parse(xhr.responseText);
                this.setState({ registrosTiempo });
            }
        };
        xhr.send();
    };

    renderItem = ({ item }) => (
        <View style={{
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
            padding: 10,
        }}>
            <Text style={{ color: 'black' }}>Código de Alumno: {item.codigoAlumno}</Text>
            <Text style={{ color: 'black' }}>Nombre: {item.nombreAlumno}</Text>
            <Text style={{ color: 'black' }}>
                Tiempo: {item.horas} horas, {item.minutos} minutos, {item.segundos} segundos
            </Text>
        </View>
    );

    render() {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#F5FCFF',
            }}>
                <Text style={{
                    fontSize: 20,
                    textAlign: 'center',
                    margin: 10,
                    color: 'black',
                }}>Registros de Tiempo Transcurrido</Text>
                <FlatList
                    data={this.state.registrosTiempo}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }
}