import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';

export default class Avisos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anuncios: [],
            expandedAnuncioId: null,
        };
    }

    componentDidMount() {
        this.fetchAnuncios(); // Realizar la primera carga al montar el componente
        // Programar la actualización automática cada 10 segundos (10000 milisegundos)
        this.interval = setInterval(this.fetchAnuncios, 10000);
    }

    componentWillUnmount() {
        // Limpiar el intervalo cuando el componente se desmonte para evitar fugas de memoria
        clearInterval(this.interval);
    }

    fetchAnuncios = async () => {
        try {
            const response = await fetch('https://finalappbestmx.000webhostapp.com/obtener_anuncios.php');
            const anuncios = await response.json();
            this.setState({ anuncios });
        } catch (error) {
            console.error('Error al obtener los anuncios:', error);
        }
    };

    toggleDescription = (id) => {
        this.setState((prevState) => ({
            expandedAnuncioId: prevState.expandedAnuncioId === id ? null : id,
        }));
    };

    renderDescription = (descripcion, id) => {
        const { expandedAnuncioId } = this.state;
        if (descripcion.length > 100) {
            if (expandedAnuncioId === id) {
                return (
                    <View>
                        <Text style={{ marginTop: 8 }}>{descripcion}</Text>
                        <TouchableOpacity onPress={() => this.toggleDescription(id)}>
                            <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>Leer menos</Text>
                        </TouchableOpacity>
                    </View>
                );
            } else {
                return (
                    <TouchableOpacity onPress={() => this.toggleDescription(id)}>
                        <Text style={{ marginTop: 8 }}>{descripcion.substring(0, 100)}...</Text>
                        <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>Leer más</Text>
                    </TouchableOpacity>
                );
            }
        } else {
            return (
                <Text style={{ marginTop: 8 }}>{descripcion}</Text>
            );
        }
    };

    renderItem = ({ item }) => (
        <View style={{
            marginBottom: 16,
            padding: 16,
            backgroundColor: '#f9f9f9',
            borderRadius: 8,
        }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.titulo}</Text>
            <Text style={{ marginTop: 8, fontStyle: 'italic', color: 'black' }}>{new Date(item.fecha).toLocaleString()}</Text>
            {this.renderDescription(item.descripcion, item.id)}
        </View>
    );

    render() {
        return (
            <View style={{
                flex: 1,
                padding: 16,
                opacity: 0.86
            }}>
                <Text style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    marginBottom: 16,
                    color: 'black'
                }}>Anuncios</Text>
                <FlatList
                    data={this.state.anuncios}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id.toString()}
                />
            </View>
        );
    }
}
