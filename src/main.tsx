import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {  BrowserRouter as Router, Route, Routes} from "react-router-dom";
import LandingPage from './routes/LandingPage'
import LoginPage from './routes/LoginPage'
import SignupPage from './routes/SignupPage'
import RedirectPage from './routes/RedirectPage';
import ProfilePage from './routes/app/ProfilePage'
import RidesFeed from './routes/app/RidesFeed'
import CreateRide from './routes/app/CreateRide'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { jwtDecode } from "jwt-decode";
import { AuthProvider } from "./context/auth";
import AuthRoute from "./util/AuthRoute";
import UserRoute from "./util/UserRoute";

function App() {

interface DecodedToken {
  username: string
}

let decodedToken: DecodedToken | null = null;

const token = localStorage.getItem("jwtToken");
if (token) {
  decodedToken = jwtDecode(token) as DecodedToken;
}

return (
  <Router>
    <AuthProvider>
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login"
              element={
                <AuthRoute>
                  <LoginPage/>
                </AuthRoute>}
            />
      <Route path="/signup"
              element={
                <AuthRoute>
                  <SignupPage />
                </AuthRoute>}
            />
      <Route path="/app/profile"
              element={
                <UserRoute>
                  <ProfilePage />
                </UserRoute>
              }
            />
      <Route path="/app/rides"
              element={
                <UserRoute>
                  <RidesFeed />
                </UserRoute>
              }
            />
      <Route path="/app/create"
              element={
                <UserRoute>
                  <CreateRide />
                </UserRoute>
              }
            />
      <Route path="/redirect"
              element={
                <UserRoute>
                  <RedirectPage />
                </UserRoute>
              }
            />
      </Routes>
    </AuthProvider>
  </Router>
)
}

const client = new ApolloClient({
  uri: import.meta.env.VITE_SERVER_URI,
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
  <App />
</ApolloProvider>,
)

export default App;