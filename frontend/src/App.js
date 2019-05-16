import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios";


class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: false,
      activeItem: {
        title: "",
        description: "",
        completed: false
      },
      portfolios: []
    };
  }
  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
      .get("http://localhost:8000/api/portfolio/")
      .then(res => this.setState({ portfolios: res.data }))
      .catch(err => console.log(err));
  };

  displayCompleted = status => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }
    return this.setState({ viewCompleted: false });
  };

  handleLogin = event => {
    console.log(event);
  };

  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.portfolios;

    return newItems.map(item => (
      <p key={item.id} onClick={this.handleClick.bind(this)} >{item.intro_text}</p>
    ));
    
  };

  loginInput = () => {
    return (
      <div>
        <h3>Login Here</h3>
        <input type="text" id="user" placeholder="Username"></input>
        <input type="text" id="pass" placeholder="Password"></input>
        <button onClick={this.handleLogin.bind(this)} type="button">Login</button>
      </div>
    );
  };

  handleSubmit = item => {
    this.toggle();
    if (item.id) {
      axios
        .put(`http://localhost:8000/api/portfolio/${item.id}/`, item)
        .then(res => this.refreshList());
      return;
    }
    axios
      .post("http://localhost:8000/api/portfolio/", item)
      .then(res => this.refreshList());
  };
  handleDelete = item => {
    axios
      .delete(`http://localhost:8000/api/portfolio/${item.id}`)
      .then(res => this.refreshList());
  };

  handleClick = event => {
    console.log("Clicked")
  };

  /*
  createItem = () => {
    const item = { title: "", description: "", completed: false };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };
  editItem = item => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };
  */
  render() {
    return (
      <main className="content">
        <h1 className="text-white text-uppercase text-center my-4">Testing React</h1>
        <div className="row ">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            {this.loginInput()}
              <ul className="list-group list-group-flush">
                {this.renderItems()}
              </ul>
          </div>
        </div>
      </main>
    );
  }
}

export default Main;
