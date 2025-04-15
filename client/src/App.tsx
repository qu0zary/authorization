import './App.css';
import React, { FC, useContext, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import { Context } from '.';
import { observer } from 'mobx-react-lite'; // Используем mobx-react-lite вместо mobx-react

const App: FC = () => {
  const { store } = useContext(Context); // Правильно получаем store из контекста

  useEffect(() => {
    if (localStorage.getItem('token')) {
      // Предполагаем, что checkAuth будет добавлен в Store
      store.checkAuth?.(); // Добавляем опциональную цепочку, если метода нет
    }
  }, [store]); // Зависимость от store

  if (!store.isAuth) {
    return <LoginForm />;
  }

  return (
    <div>
      <h1>{store.isAuth ? `Пользователь авторизован ${store.user.email}` : 'АВТОРИЗУЙТЕСЬ'}</h1>
      <button onClick={() => store.logout()}>Выйти</button>
    </div>
  );
};

export default observer(App);
