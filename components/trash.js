// components/dashboard.js

import React, { Component } from 'react';
import {
    StyleSheet, View, Text, Button, TouchableOpacity, FlatList,
    AsyncStorage,
    TextInput
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
            listItems: [],
            text: "",
            text2: "",
            show: false,
            totalIncome: 0
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

    deleteTask = i => {

        // var query = ref.orderByChild("name").equalTo();
        // query.once("value", function (snapshot) {
        //   snapshot.forEach(function (child) {
        //     child.ref.remove();
        //   })
        // });

        this.setState(
            prevState => {
                let tasks = prevState.tasks.slice();

                tasks.splice(i, 1);

                return { tasks: tasks };
            },
            () => Tasks.save(this.state.tasks)
        );
    };

    componentDidMount() {
        // Tasks.all(tasks => this.setState({ tasks: tasks || [] }));
        let myPath = '/' + this.state.uid + '/incomes'
        firebase.database().ref(myPath).on('value', querySnapShot => {
            let data = querySnapShot.val() ? querySnapShot.val() : {};
            let listItems = { ...data };
            this.setState({
                listItems: listItems,
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
            console.log(this.state.email)
            let myPath = '/' + this.state.uid + '/incomes'
            firebase.database().ref(myPath).push().set({
                name: this.state.text,
                amount: this.state.text2
            });
            // // Adding to FlatList
            // this.setState(
            //   prevState => {
            //     let { tasks, text, text2, totalIncome } = prevState;
            //     return {
            //       tasks: tasks.concat({ key: tasks.length, text: text2 + "-" + text }),
            //       text: "",
            //       text2: "",
            //       // totalIncome: parseInt(totalIncome) + parseInt(text2)
            //     };
            //   },
            //   () => Tasks.save(this.state.tasks)
            // );
            this.setState({
                show: false,
                text: "",
                text2: ""
            });
        }
    }

    //   updateList = () => {
    //     return firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
    //       var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    //       // ...
    //     });
    //     this.setState({
    //       listItems: 
    // })
    //   }


    render() {
        let listItems = Object.keys(this.state.listItems);
        return (
            <View style={styles.container}>
                {/* <Text style={styles.nameStyle}>
          Hello, {this.state.displayName}
        </Text> */}
                <Text style={styles.total}>Total Monthly Expenses: {this.state.currencySymbol}</Text>
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
                        style={styles.btnRed}>
                        <Text style={styles.btnText}>Add Expense</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    style={styles.list}
                    data={this.state.listItems}
                    renderItem={({ item, index }) =>
                        <View>
                            <View style={styles.listItemCont}>
                                <Text style={styles.listItem}>
                                    {item.text}
                                </Text>
                                {/* <Text style={styles.listItem}>
                  {item.amount}
                </Text> */}
                                <Button title="X" onPress={() => this.deleteTask(index)} />
                            </View>
                            <View style={styles.hr} />
                        </View>}
                />

                {this.state.show ? (
                    <View style={styles.dialog}>
                        {this.state.show ? (
                            <TextInput
                                style={styles.textInput}
                                onSubmitEditing={this.addIncomeToFirebase}
                                value={this.state.text}
                                onChangeText={(val) => this.updateInputVal(val, 'text')}
                                placeholder="Income Name"
                            // returnKeyType="done"
                            // returnKeyLabel="done"
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
                            // returnKeyType="done"
                            // returnKeyLabel="done"
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
                ) : null}
                <Button
                    color="#3740FE"
                    title="Logout"
                    onPress={() => this.signOut()}
                />
            </View >
        );
    }
}

// let Tasks = {
//   convertToArrayOfObject(tasks, callback) {
//     return callback(
//       tasks ? tasks.split("||").map((task, i) => ({ key: i, text: task })) : []
//     );
//   },
//   convertToStringWithSeparators(tasks) {
//     return tasks.map(task => task.text).join("||");
//   },
//   all(callback) {
//     return AsyncStorage.getItem("TASKS", (err, tasks) =>
//       this.convertToArrayOfObject(tasks, callback)
//     );
//   },
//   save(tasks) {
//     AsyncStorage.setItem("TASKS", this.convertToStringWithSeparators(tasks));
//   }
// };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        // padding: 35,
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
    listItem: {
        paddingTop: 2,
        paddingBottom: 2,
        fontSize: 18
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
});