
import { Route, Routes } from 'react-router-dom';
import './App.css'
import HomePage from './pages/HomePage';
import Login from './pages/Login-SignupPages/Login';
import SignUp from './pages/Login-SignupPages/SignUp';
import PhoneLoginPageComponent from './components/Auth-Component/LoginWithPhone';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/loginwithphone" element={<PhoneLoginPageComponent />} />
      </Routes>
    </>
  );
}

export default App
