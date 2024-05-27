import React, { Component } from 'react';
import { View, ImageBackground } from 'react-native';
import { Button, Input } from '@rneui/base';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            correo: "",
            password: "",
        };
    }

    entrar = () => {
        const { correo, password } = this.state;
        let _this = this;
        var http = new XMLHttpRequest();
        var url = 'http://148.202.152.33/cucei/autentificacion_siauu_temporal.php';
        var params = 'codigo=' + encodeURIComponent(correo) + '&nip=' + encodeURIComponent(password);
    
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
        http.onreadystatechange = async function() {
          if (http.readyState == 4 && http.status == 200) {
            if (http.responseText == '0') {
              alert('datos incorrectos');
            } else {
              let pc = http.responseText.split(',');
              let nc = pc[2];
              let cd = pc[1];
              _this.props.navigation.navigate("Usuario", {nombre: nc, codigo: cd});
            }
          }
        };
    
        http.send(params);
    }

    CorreoChange = (correo) => {
        this.setState({ correo });
    }
    
    PasswordChange = (password) => {
        this.setState({password});
    }

    render() {
        return (
            <View>
                <ImageBackground source={require('./Imagenes/fondo.jpg')}
                    style={{ width: 400, height: 800 }}>
                    <View style={{ marginTop: 200, paddingHorizontal: 20, }}>
                        <Input
                            placeholder='Codigo'
                            onChangeText={this.CorreoChange}
                            leftIcon={{ type: 'font-awesome', name: 'user', color: 'red' }}
                            inputStyle={{ color: 'white' }}
                        />
                        <Input
                            placeholder='NIP'
                            onChangeText={this.PasswordChange}
                            secureTextEntry={true}
                            leftIcon={{ type: 'font-awesome', name: 'lock', color: 'red' }}
                            inputStyle={{ color: 'white' }}
                        />
                        <Button
                            title="Entrar"
                            onPress={this.entrar}
                            icon={{
                                name: 'arrow-right',
                                type: 'font-awesome',
                                size: 15,
                                color: 'white',
                            }}
                            buttonStyle={{
                                backgroundColor: 'rgba(90, 154, 230, 1)',
                                borderRadius: 30,
                            }}
                            containerStyle={{
                                width: 200,
                                marginHorizontal: 'auto',
                                marginTop: 20,
                            }}
                        />
                    </View>
                </ImageBackground>
            </View>
        );
    }
}
