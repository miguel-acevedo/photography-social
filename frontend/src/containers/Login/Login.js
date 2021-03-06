import React, { Component } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "./Login.css";
import axios from "axios";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: ""
    };
  }

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
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
      this.props.redirect("/dashboard");
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
        <h1>Login</h1>
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
            Login
          </Button>
          <br>
          </br>
          <p>Don't have an account?</p>
          <Button id="register" block onClick={() => this.props.handler("register")}>Register</Button>
        </form>
      </div>
    );
  }
}