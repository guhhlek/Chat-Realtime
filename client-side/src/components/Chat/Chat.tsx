import { useRef, useState, useEffect } from 'react';
import Picker from 'emoji-picker-react';
import { BsEmojiSmile } from "react-icons/bs";
import './Chat.css';

export default function Chat({ socket }) {
  const [inputStr, setInputStr] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const dummy = useRef();
  const messageRef = useRef();

  useEffect(() => {
    // Ao montar o componente solicita mensagens armazenadas
    socket.emit('requestStoredMessages');

    socket.on('sendMessage', data => {
      setMessageList(prevMessages => [...prevMessages, data]);
    });

    // Lida com as mensagens armazenadas ao conectar
    socket.on('storedMessages', storedMessages => {
      setMessageList(storedMessages);
    });

    return () => socket.off('sendMessage');
  }, [socket]);

  useEffect(() => {
    scrollDown();
  }, [messageList]);

  const handleSubmit = () => {
    const message = messageRef.current.value.trim();
    if (!message) return;

    if (socket.emit('message', message)) {
      // Limpa o input
      messageRef.current.value = '';
      setInputStr('');
      // Volta o foco para o input depois que a mensagem é enviada
      messageRef.current.focus();
    } else {
      alert('Não foi possível enviar a mensagem');
    }
  };

  const getEnterKey = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const scrollDown = () => {
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  };

  const onEmojiClick = (emojiObject) => {
    const updatedInputStr = inputStr + emojiObject.emoji;
    setInputStr(updatedInputStr);
    setShowPicker(false);
  };

  return (
    <div className="chat-container">
      <h1 className="chat-title">Chat Realtime ⏱</h1>
      <div className="message-list">
        {messageList.map((message, index) => (
          <div key={index} className={message.id === socket.id ? "message right" : "message left"}>
            <span className="user">{message.user}:</span> {message.mensagem}
          </div>
        ))}
      </div>
      <div ref={dummy} />
      <div className="input-container">
        <input type="text" ref={messageRef} value={inputStr} className="message-input"
          onChange={e => setInputStr(e.target.value)}
          onKeyDown={(e) => getEnterKey(e)}
          placeholder="Digite sua mensagem..."
        />
        <BsEmojiSmile
          className="emoji-icon"
          onClick={() => setShowPicker(val => !val)}
        />
        {showPicker && (
          <div className="emoji-picker-container">
            <Picker
              onEmojiClick={onEmojiClick}
              height={500} width={400}
            />
          </div>
        )}
        <button onClick={handleSubmit} className="send-button">Enviar</button>
      </div>
    </div>
  );
}
