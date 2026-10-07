import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AuthProvider } from './hooks/contexts/auth-context';
import { AssessmentProvider } from './hooks/contexts/assessment-context';
import { CourseProvider } from './hooks/contexts/course-context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <CourseProvider>
      <AssessmentProvider>
      {/* <React.StrictMode> */}
      <App />
      </AssessmentProvider>
    </CourseProvider>
    {/* </React.StrictMode> */}
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
