import { useRef } from 'react';
import io from 'socket.io-client';
import './User.css';

export default function User({ setChatVisibility, setSocket }) {
  const userNameRef = useRef();

  const valueSubmit = async () => {
    const name = userNameRef.current.value;
    if (!name.trim()) return;

    const socket = await io.connect('http://localhost:6699');
    socket.emit('setName', name);
    setSocket(socket);
    setChatVisibility(true);
  };

  return (
    <div className="user-template">
      <h2 className="user-title">Usuário</h2>
      <form onSubmit={valueSubmit} className="user-form">
        <input
          type="text"
          ref={userNameRef}
          placeholder="Digite seu nome"
          className="user-input"
        />
        <button type="submit" className="send-button">
          Entrar
        </button>
      </form>
    </div>
  );
}