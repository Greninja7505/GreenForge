import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Context Providers
import { StellarProvider } from "./context/StellarContext";
import { EVMProvider } from "./context/EVMContext";
import { ProjectsProvider } from "./context/ProjectsContext";
import { UserProvider } from "./context/UserContext";

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <UserProvider>
        <ProjectsProvider>
          <StellarProvider>
            <EVMProvider>
              <App />
            </EVMProvider>
          </StellarProvider>
        </ProjectsProvider>
      </UserProvider>
    </React.StrictMode>
  );
}
