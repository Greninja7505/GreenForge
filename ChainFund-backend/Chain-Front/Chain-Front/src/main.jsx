import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './styles/mobile-fixes.css'

// Polyfill for crypto.randomUUID
if (typeof crypto !== 'undefined' && !crypto.randomUUID) {
  crypto.randomUUID = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  };
}

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
