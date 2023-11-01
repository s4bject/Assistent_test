// Registration.js
import React, { Component } from 'react';

class Registration extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    // Отправка данных на сервер
    const { name, email, password } = this.state;
    fetch('https://127.0.0.1:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    })
      .then((response) => {
        if (response.ok) {
          // Успешная регистрация, можно перенаправить пользователя на страницу авторизации
        } else {
          // Обработка ошибки регистрации
        }
      })
      .catch((error) => {
        // Обработка ошибки сети
      });
  }

  render() {
    return (
      <div>
        <h2>Регистрация</h2>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>
              Имя:
              <input
                type="text"
                name="name"
                value={this.state.name}
                onChange={this.handleInputChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={this.state.email}
                onChange={this.handleInputChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Пароль:
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleInputChange}
                required
              />
            </label>
          </div>
          <div>
            <button type="submit">Зарегистрироваться</button>
          </div>
        </form>
      </div>
    );
  }
}

export default Registration;
