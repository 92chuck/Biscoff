import './App.css';
import React from 'react';
import Sidebar from './Sidebar';
import Chat from './Chat';
import Login from './Login';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useStateValue } from './StateProvider';
import Homepage from './Hompage';
import SidebarRight from './SidebarRight';

function App() {
  const [{ user }, dispatch] = useStateValue();
  return (
    <div className='app'>
      {!user ? (
        <Login />
      ) : (
        <div className='app__body'>
          <Router>
            <Sidebar />
            <Switch>
              <Route exact path='/rooms/:roomId'>
                <Chat />
              </Route>
              <Route exact path='/'>
                <Homepage />
              </Route>
            </Switch>
            <SidebarRight />
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
