import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound'
import Course from './pages/Course';
import Grades from './pages/Grades';
import Students from './pages/Students';
import RegistrationCourse from './pages/Registration_course';
import MyAccount from './pages/MyAccount';
import Calendar from './pages/Calendar';
import ChangePassword from './pages/ChangePassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/home' element={<Home />}>
          <Route index element={<Course />} />
          <Route path='/home/course/grades/:curso_id' element={<Grades />} />
          <Route path='/home/course/students/:curso_id' element={<Students />} />
          <Route path='/home/registration' element={<RegistrationCourse />} />
          <Route path='/home/myaccount' element={<MyAccount />} />
          <Route path='/home/myschedule' element={<Calendar />} />
        </Route>
        <Route path='/changepassword' element={<ChangePassword />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
