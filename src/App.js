import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';
import AuthPage from './Pages/Auth_page';
import HomePage from './Pages/Home_page';
import AdminPage from './Pages/Admin_page';
import LobbyPage from './Pages/Lobby_page';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
            <Route path='/' element={<AuthPage/>}/>
            <Route path='/Lobby' element={<LobbyPage/>}/>
            <Route path='/Home' element={<HomePage/>}/>
            <Route path='/Admin' element={<AdminPage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
