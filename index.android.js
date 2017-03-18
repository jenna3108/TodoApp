import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  TextInput,
  TouchableHighlight,
  ListView,
  Dimensions
} from 'react-native';
import { 
  Container, 
  Header, 
  Button,
  Body, 
  Left, 
  Right, 
  Title, 
  Content, 
  Footer, 
  Text, 
  Item, 
  Form, 
  Label, 
  Input, 
  H1,
  H2, 
  H3, 
  List,
  ListItem, 
  Radio,
  FooterTab
   } from 'native-base';
import styles from './style';
import Icon from 'react-native-vector-icons/FontAwesome';

var Firebase = require('firebase');
var green = '#1DA664';
var red = '#DE5347';

export default class demo extends React.Component{
  constructor(props) {
    super(props);
    var myFirebaseRef = new Firebase('https://reacttodoapp-197df.firebaseio.com');
    this.itemsRef = myFirebaseRef.child('items');

    this.state = {
      newTodo: '',
      refresh: false,
      todoSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 != row2})
    };

    this.items = [];    
  }

  componentDidMount() {

    //when a todo is added
    this.itemsRef.on('child_added', (dataSnapshot) => {
      this.items.push({
        id: dataSnapshot.key(), 
        text: dataSnapshot.val()
      });
      this.setState({
        todoSource: this.state.todoSource.cloneWithRows(this.items)
      });
    });

    //when a todo is removed
    this.itemsRef.on('child_removed', (dataSnapshot) => {
      this.items = this.items.filter((x) => x.id !== dataSnapshot.key());
      this.setState({
        todoSource: this.state.todoSource.cloneWithRows(this.items)
      });
    });

    // check if status of item is completed
    // this.itemsRef.on('value', (dataSnapshot) => {
    //   var getValue = dataSnapshot.val();
    //   this.items.forEach((child) => {
    //     if (getValue.status != null){
    //       this.setState({
    //         isCompleted: true
    //       })
    //     }else{
    //       this.setState({
    //         isCompleted: false
    //       })
    //     }
    //     this.setState({
    //       todoSource: this.state.todoSource.cloneWithRows(this.items)
    //     })
    //   })
    // })
  }

  addItem(){
    if (this.state.newTodo != ''){
      this.itemsRef.push({
        todo: this.state.newTodo,
        status: ''
      });
      this.setState({
        newTodo : ''
      });
      alert("Task added successfully");
    }
  }

  deleteItem(rowData){
    this.itemsRef.child(rowData.id).remove();
    alert("Task removed successfully");
  }

  handleOnpress(rowData){
    this.itemsRef.child(rowData.id).update({
      	status: 'completed'
      });
      this.setState({
        status: 'completed',
        refresh: true
      })
  }

  render() {
    return (
        <Container>
        <Header>
          <Body>
            <Title>React Todo App</Title>
          </Body>
        </Header>
        <Content padder>
          <ListItem itemHeader first><Text>All Tasks</Text></ListItem>
          <ListView
          dataSource={this.state.todoSource}
          renderRow={this.renderRow.bind(this)}
        />
        </Content>
        <Form>
          <Item floatingLabel>
            <Label>Task</Label>
            <Input onChangeText={(text) => this.setState({newTodo: text})} value={this.state.newTodo}/>
          </Item>
          <Button onPress={ () => this.addItem()} style={styles.addNewTaskBtn}>
              <Text>Add New Task</Text>
            </Button>
        </Form>
      </Container>
    );
  }

  renderRow(rowData) {
    return (
      <TouchableHighlight>
        <ListItem onPress={() => this.handleOnpress(rowData)}>
          <Body><Text>{rowData.text.todo}</Text></Body>
        <Right>
          {
            rowData.text.status == 'completed' &&
            <Icon name="check" size={20} color='#1DA664'/>
          }
        </Right>
        <Right>
          <Icon name="trash-o" size={20} color="#900"/>
        </Right>
      </ListItem>
      </TouchableHighlight>
    );
  }
}

AppRegistry.registerComponent('demo', () => demo);