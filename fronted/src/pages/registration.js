import React, {Component} from 'react';
import {Navigate} from 'react-router-dom';

class Registration extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            successMessage: null,
            redirectTo: null,
        };
    }

    handleInputChange = (e) => {
        const {name, value} = e.target;
        this.setState({[name]: value});
    };

    handleSubmit = (e) => {
        e.preventDefault();

        // Отправка данных на сервер
        const {name, email, password} = this.state;
        fetch('https://127.0.0.1:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name, email, password}),
        })
            .then((response) => {
                if (response.ok) {
                    // Успешная регистрация, можно перенаправить пользователя на домашнюю страницу через 3 секунды
                    this.setState({successMessage: 'Регистрация успешна!'});
                    setTimeout(() => {
                        this.setState({redirectTo: '/'});
                    }, 3000);
                } else {
                    // Обработка ошибки регистрации
                }
            })
            .catch((error) => {
                // Обработка ошибки сети
            });
    };

    render() {
        const {redirectTo, successMessage} = this.state;
        if (redirectTo) {
            return <Navigate to={redirectTo}/>;
        }
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
                {successMessage &&
                    <div
                        className="fixed top-0 left-0 w-full flex items-center justify-center p-4 bg-green-500 text-white">
                        <span>{successMessage}</span>
                    </div>}
                <form className="bg-white p-8 rounded shadow-md w-96" onSubmit={this.handleSubmit}>
                    <h2 className="text-3xl font-bold mb-6 text-center">Регистрация</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="name">
                            Имя:
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={this.state.name}
                            onChange={this.handleInputChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="email">
                            Email:
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={this.state.email}
                            onChange={this.handleInputChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="password">
                            Пароль:
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={this.state.password}
                            onChange={this.handleInputChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-6 flex justify-center">
                        <button
                            type="submit"
                            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded shadow transform transition duration-500 ease-in-out hover:scale-105"
                        >
                            Зарегистрироваться
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Registration;
