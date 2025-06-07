import React from 'react';
import Container from 'react-bootstrap/Container';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import ComponentErrorHandler from './components/ErrorManagement/ComponentErrorHandler';
import ErrorList from './components/ErrorManagement/ErrorList';
import NavBar from './components/NavBar/NavBar';
import ToDoList from './components/ToDoList/ToDoList';
import Welcome from './components/Welcome';
import Footer from './components/Footer/Footer';
import RootStore from './RootStore';
import STORE from './store';

/**
 * Intérêt pédagogique : encapsultation par un gestionnaire d'erreur ; Routage.
 */
function App() {
  return (
    <BrowserRouter basename={APP_ENV.APP_PUBLIC_PATH}>
      <RootStore.Provider value={STORE}>
        <ComponentErrorHandler>
          <ErrorList />
          {/* <header>
            <NavBar />
          </header> */}
          <main role="main">
            <Container>
              <Routes>
                <Route path="/" element={<Welcome />} />
                {/* <Route path="/sql" element={<ToDoList listName="sqlList" />} /> */}
              </Routes>
            </Container>
          </main>
          <Footer />
        </ComponentErrorHandler>
      </RootStore.Provider>
    </BrowserRouter>
  );
}

export default App;
