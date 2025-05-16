import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import  HomePage  from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
const App = ()=>{
  const [authUser, setAuthUser] = React.useState(false);
  return(
    <div className='flex flex-col items-center justify-start'>
      <Routes>
        <Route path = '/' element={authUser?<HomePage/>:<Navigate to = '/login' replace/>}/>
        <Route path = '/login' element={!authUser?<LoginPage setAuthUser={setAuthUser}/>:<Navigate to = '/' replace/>}/>
        <Route path = '/signup' element={<SignUpPage/>}/>

      </Routes>

  </div>
  )
}

export default App;