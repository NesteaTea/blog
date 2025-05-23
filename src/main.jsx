import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux";
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom'
import store from "./redux/store";
import './index.css'

import MainPage from './MainPage/App'
import CurrentPost from './CurrentPost/CurrentPost';
import SignUp from './SignUp/SignUp';
import SignIn from './SignIn/SignIn';
import EditProfile from './EditProfile/EditProfile';
import ProtectedRoute from './HOC/ProtectedRoute';
import CreatePost from './CreatePost/CreatePost';
import EditPost from './EditPost/EditPost';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/articles" element={<MainPage />} />
        <Route path="/articles/:slug" element={<CurrentPost />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/edit-profile" element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }/>
        <Route path="/new-article" element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        }/>
        <Route path="/articles/:slug/edit" element={
          <ProtectedRoute>
            <EditPost />
          </ProtectedRoute>
        }/>
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  </Provider>,
)
