import { initializeIcons } from '@fluentui/react';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import './App.css';

// Initialize Fluent UI icons
initializeIcons();

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Account Registration Form</h1>
        <p>Complete all steps to create your account</p>
      </header>
      <main>
        {/* TODO: billgu: implement the registration form */}
        <RegistrationForm />
      </main>
    </div>
  );
}

export default App;
