import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import RecordList from './components/RecordList';
import RecordForm from './components/RecordForm';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Здесь вы можете добавить проверку токена
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Главная</Link></li>
            {!isAuthenticated && (
              <>
                <li><Link to="/login">Вход</Link></li>
                <li><Link to="/register">Регистрация</Link></li>
              </>
            )}
            {isAuthenticated && (
              <>
                <li><Link to="/records">Записи</Link></li>
                <li><Link to="/add-record">Добавить запись</Link></li>
                <li><button onClick={handleLogout}>Выход</button></li>
              </>
            )}
          </ul>
        </nav>

        <Switch>
          <Route exact path="/" render={() => <h1>Добро пожаловать в AsylBala</h1>} />
          <Route path="/login" render={(props) => <Login {...props} setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
          <Route path="/register" render={(props) => <Register {...props} setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
          <Route path="/records" render={(props) => <RecordList {...props} user={user} />} />
          <Route path="/add-record" render={(props) => <RecordForm {...props} user={user} />} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;