// components/login.js

import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator, Image, TouchableOpacity, StatusBar } from 'react-native';
import firebase from '../database/firebase';


export default class Login extends Component {

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      isLoading: false
    }
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  userLogin = () => {
    if (this.state.email === '' && this.state.password === '') {
      Alert.alert('Enter details to signin!')
    } else {
      this.setState({
        isLoading: true,
      })
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((res) => {
          console.log(res)
          console.log('User logged-in successfully!')
          this.setState({
            isLoading: false,
            email: '',
            password: ''
          })
          this.props.navigation.navigate('MainPage')
        })
        .catch(error => this.setState({ errorMessage: error.message }))
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="black" />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <Image
          style={styles.logo}
          source={require('../assets/logo.png')}
        />
        <Text style={styles.logoText}>Universal Wallet</Text>
        <TextInput
          style={styles.inputStyle}
          placeholder="Email"
          value={this.state.email}
          onChangeText={(val) => this.updateInputVal(val, 'email')}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="Password"
          value={this.state.password}
          onChangeText={(val) => this.updateInputVal(val, 'password')}
          maxLength={15}
          secureTextEntry={true}
        />
        {/* <Button
          style={styles.loginBtn}
          title="Sign In"
          onPress={() => this.userLogin()}
        /> */}
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => this.userLogin()}>
          <Text style={styles.loginText}>Sign In</Text>
        </TouchableOpacity>

        <Text
          style={styles.signupText}
          onPress={() => this.props.navigation.navigate('Signup')}>
          Don't have account? Click here to signup
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: 'center',
    padding: 35,
    backgroundColor: '#fff'
  },
  inputStyle: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: "center",
    borderColor: "#ccc",
    borderBottomWidth: 1
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  logo: {
    height: 130,
    width: 140
  },
  logoText: {
    fontWeight: "bold",
    fontSize: 25,
    color: "black",
    marginBottom: 50
  },
  loginBtn: {
    width: "100%",
    backgroundColor: "#2382a8",
    borderRadius: 5,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 25,
  },
  loginText: {
    color: "white",
    fontSize: 20
  },
  signupText: {
    color: "#2382a8"
  }
});