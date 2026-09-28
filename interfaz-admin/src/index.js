import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './hooks/context/auth-context';
import { LanguageProvider } from './hooks/context/language-context';
import { TeacherProvider } from './hooks/context/teacher-context';
import { CourseNotStartedProvider } from './hooks/context/course-not-started-context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <LanguageProvider>
      <CourseNotStartedProvider>
        <TeacherProvider>
          {/* <React.StrictMode> */}
          <App />
        </TeacherProvider>
      </CourseNotStartedProvider>
    </LanguageProvider>
    {/* </React.StrictMode> */}
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
