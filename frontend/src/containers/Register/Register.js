import React, { Component } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "../Login/Login.css";
import axios from "axios";

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      email: "",
    };
  }

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0 && this.state.email.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  saveToken = (token) => {
    localStorage.setItem('token', token);
  }

  handleSubmit = event => {
    event.preventDefault();

    axios.post("/api/auth/login/", {
      'username': this.state.username,
      'password': this.state.password,
    })
    .then(res => {
      console.log(res.data);
      this.saveToken(res.data.token);

      this.props.history.push({
        pathname: '/dashboard',
      })
    }, error => {
      if (error.response.status === 401) {
        console.log("Wrong login, please try again.");
      }
      console.log(error);
    });

  }

  render() {
    return (
      <div className="Login">
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="username" bssize="large">
            <FormLabel>Username</FormLabel>
            <FormControl
              autoFocus
              type="text"
              value={this.state.username}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="email" bssize="large">
            <FormLabel>Email</FormLabel>
            <FormControl
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bssize="large">
            <FormLabel>Password</FormLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button
            block
            bssize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Register
          </Button>
          <br></br>
          <p>Already have an account?</p>
          <Button block onClick={() => this.props.handler("login")}>Login</Button>
        </form>
      </div>
    );
  }
}
