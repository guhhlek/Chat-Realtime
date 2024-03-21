import { useState } from 'react'
import Chat from './components/Chat/Chat'
import User from './components/User/User'
import './App.css'

function App() {
  const [chatVisibility, setChatVisibility] = useState(false)
  const [socket, setSocket] = useState(null)

  return (
    <div className="App">
      {
        chatVisibility ? <Chat socket={socket} /> : <User setSocket={setSocket} setChatVisibility={setChatVisibility} />
      }
    </div>
  )
}

export default App
