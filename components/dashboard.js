// components/dashboard.js

import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Button, TouchableOpacity, FlatList,
  AsyncStorage,
  TextInput, ScrollView
} from 'react-native';
import firebase from '../database/firebase';

export default class MainPage extends Component {
  constructor() {
    super();
    this.state = {
      currencySymbol: '$',
      currency: 'usd',
      btnStyle: 'styles.btn',
      displayName: firebase.auth().currentUser.displayName,
      username: firebase.auth().currentUser.email,
      uid: firebase.auth().currentUser.uid,
      todos: {},
      text: "",
      text2: "",
      show: false,
      show2: false,
      totalExpense: 0,
      totalIncome: 0,
    }
  }

  signOut = () => {
    firebase.auth().signOut().then(() => {
      this.props.navigation.navigate('Login')
    })
      .catch(error => this.setState({ errorMessage: error.message }))
  }

  toUsd = () => {
    this.setState({
      currencySymbol: '$',
      currency: "usd",
    });
    console.log(this.state.btnStyle)
  }

  toBrl = () => {
    this.setState({
      currencySymbol: 'R$',
      currency: "brl"
    });
  }

  hideShow = () => {
    if (this.state.show == true) {
      this.setState({ show: false });
    } else {
      this.setState({ show: true });
    }
  }

  hideShow2 = () => {
    if (this.state.show2 == true) {
      this.setState({ show2: false });
    } else {
      this.setState({ show2: true });
    }
  }

  deleteTask = key => {
    let myPath = '/' + this.state.uid + '/incomes/' + key;
    if (firebase.database().ref(myPath).remove()) {
      this.state.totalIncome = parseInt(this.state.totalIncome) - parseInt(this.state.todos[key].amount);
    }

    let myPath2 = '/' + this.state.uid + '/expenses/' + key;
    firebase.database().ref(myPath2).remove();
  };

  componentDidMount() {
    let myPath = '/' + this.state.uid;
    firebase.database().ref(myPath).on('value', querySnapShot => {
      let data = querySnapShot.val() ? querySnapShot.val() : {};
      let todoItems = { ...data };
      let allItems = { ...todoItems.incomes, ...todoItems.expenses };
      let totalExpense = todoItems.totalExpense;
      let totalIncome = todoItems.totalIncome;
      this.setState({
        todos: allItems,
        totalExpense: parseInt(this.state.totalExpense) + parseInt(totalExpense),
        totalIncome: parseInt(this.state.totalIncome) + parseInt(totalIncome)
      });
    });
  }


  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  addIncomeToFirebase = () => {
    // Adding to Firebase
    let notEmpty = this.state.text.trim().length > 0;
    let notEmpty2 = this.state.text2.trim().length > 0;

    if (notEmpty && notEmpty2) {
      let myPath = '/' + this.state.uid + '/incomes'
      firebase.database().ref(myPath).push({
        name: this.state.text,
        amount: this.state.text2,
        type: "income"
      });

      let myPath2 = '/' + this.state.uid;
      var updates = {};
      updates['/totalIncome'] = this.state.totalIncome;
      firebase.database().ref(myPath2).update(updates);

      this.setState({
        show: false,
        text: "",
        text2: ""
      });
    }
  }

  addExpenseToFirebase = () => {
    // Adding to Firebase
    let notEmpty = this.state.text.trim().length > 0;
    let notEmpty2 = this.state.text2.trim().length > 0;

    if (notEmpty && notEmpty2) {
      let myPath = '/' + this.state.uid + '/expenses'
      firebase.database().ref(myPath).push({
        name: this.state.text,
        amount: this.state.text2,
        type: "expense"
      });

      let myPath2 = '/' + this.state.uid;
      var updates = {};
      updates['/totalExpense'] = this.state.totalExpense;
      firebase.database().ref(myPath2).update(updates);

      this.setState({
        show2: false,
        text: "",
        text2: "",
      });
    }
  }


  render() {
    let todosKeys = Object.keys(this.state.todos);
    return (
      <View style={styles.container}>
        <Text style={styles.total}>Total Monthly Expenses: {this.state.currencySymbol} {this.state.totalExpense}</Text>
        <Text style={styles.total}>Total Monthly Income: {this.state.currencySymbol} {this.state.totalIncome}</Text>
        <View style={styles.rows}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => this.toUsd()}>
            <Text style={styles.btnText}>USD</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => this.toBrl()}>
            <Text style={styles.btnText}>BRL</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rows}>
          <TouchableOpacity
            style={styles.btnGreen}
            onPress={() => this.hideShow()}>
            <Text style={styles.btnText}>Add Income</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnRed}
            onPress={() => this.hideShow2()}>
            <Text style={styles.btnText}>Add Expense</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          style={styles.list}
          data={todosKeys}
          renderItem={({ item, index }) =>
            < View >
              <View style={styles.listItemCont}>
                <Button title="X" onPress={() => this.deleteTask(item)} />
                {this.state.todos[item].type == "income" ? (
                  <Text style={styles.income}>
                    {this.state.todos[item].name}
                  </Text>
                ) : null}
                {this.state.todos[item].type == "income" ? (
                  <Text style={styles.income}>
                    {this.state.todos[item].amount}
                  </Text>
                ) : null}

                {this.state.todos[item].type == "expense" ? (
                  <Text style={styles.expense}>
                    {this.state.todos[item].name}
                  </Text>
                ) : null}
                {this.state.todos[item].type == "expense" ? (
                  <Text style={styles.expense}>
                    {this.state.todos[item].amount}
                  </Text>
                ) : null}
              </View>
              <View style={styles.hr} />
            </View>}
        />

        {
          this.state.show ? (
            <View style={styles.dialog}>
              {this.state.show ? (
                <TextInput
                  style={styles.textInput}
                  onSubmitEditing={this.addIncomeToFirebase}
                  value={this.state.text}
                  onChangeText={(val) => this.updateInputVal(val, 'text')}
                  placeholder="Income Name"
                />
              ) : null}
              {this.state.show ? (
                <TextInput
                  pattern="[0-9]*"
                  style={styles.textInput}
                  onChangeText={(val) => this.updateInputVal(val, 'text2')}
                  onSubmitEditing={this.addIncomeToFirebase}
                  value={this.state.text2}
                  placeholder="Income Amount"
                />
              ) : null}
              {this.state.show ? (
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => this.addIncomeToFirebase()}>
                  <Text style={styles.btnText}>Add</Text>
                </TouchableOpacity>
              ) : null}


            </View>
          ) : null
        }

        {
          this.state.show2 ? (
            <View style={styles.dialog}>
              {this.state.show2 ? (
                <TextInput
                  style={styles.textInput}
                  onSubmitEditing={this.addExpenseToFirebase}
                  value={this.state.text}
                  onChangeText={(val) => this.updateInputVal(val, 'text')}
                  placeholder="Expense Name"
                />
              ) : null}
              {this.state.show2 ? (
                <TextInput
                  pattern="[0-9]*"
                  style={styles.textInput}
                  onChangeText={(val) => this.updateInputVal(val, 'text2')}
                  onSubmitEditing={this.addExpenseToFirebase}
                  value={this.state.text2}
                  placeholder="Expense Amount"
                />
              ) : null}
              {this.state.show2 ? (
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => this.addExpenseToFirebase()}>
                  <Text style={styles.btnText}>Add</Text>
                </TouchableOpacity>
              ) : null}


            </View>
          ) : null
        }



        {/* <Button
          color="#3740FE"
          title="Logout"
          onPress={() => this.signOut()}
        /> */}
      </View >
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    padding: 10,
    backgroundColor: '#fff',
    alignContent: "center",

  },
  total: {
    color: "black",
    fontSize: 25
  },
  textStyle: {
    fontSize: 15,
    marginBottom: 20
  },
  nameStyle: {
    fontSize: 20
  },
  rows: {
    flexDirection: "row"
  },
  btn: {
    width: "50%",
    backgroundColor: "#2382a8",
    borderRadius: 0,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 25,
  },
  btnGreen: {
    width: "45%",
    backgroundColor: "green",
    borderRadius: 0,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 25,
    marginRight: 15,
    marginLeft: 10
  },
  btnRed: {
    width: "45%",
    backgroundColor: "red",
    borderRadius: 0,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 25,
  },
  btnText: {
    color: "white",
    fontSize: 20
  },
  unselected: {
    color: "black"
  },
  list: {
    width: "100%"
  },
  hr: {
    height: 1,
    backgroundColor: "gray"
  },
  listItemCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  textInput: {
    width: '50%',
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: "center",
    borderColor: "#ccc",
    borderBottomWidth: 1
  },
  dialog: {
    position: "absolute",
    top: 250,
    backgroundColor: "white",
    width: '100%',
    left: 10,
    height: 300,
    alignItems: "center",
    paddingTop: 30,
  },
  header: {
    color: "black",
    fontSize: 25,
    padding: 20
  },
  income: {
    paddingTop: 2,
    paddingBottom: 2,
    fontSize: 18,
    color: "green"
  },
  expense: {
    paddingTop: 2,
    paddingBottom: 2,
    fontSize: 18,
    color: "red"
  },
});