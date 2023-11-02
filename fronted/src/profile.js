import React, { Component } from 'react';

class ProfilePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
    };
  }
  render() {
    const { user } = this.state;

    return (
      <div>
        <h1>Профиль пользователя</h1>
        {user ? (
          <div>
            <p>Имя: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Дата регистрации: {user.registration_date}</p>
          </div>
        ) : (
          <p>Загрузка...</p>
        )}
      </div>
    );
  }
}

export default ProfilePage;