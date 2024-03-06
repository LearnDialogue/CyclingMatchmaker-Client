import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {  BrowserRouter as Router, Route, Routes} from "react-router-dom";
import LandingPage from './routes/LandingPage'
import LoginPage from './routes/LoginPage'
import SignupPage from './routes/SignupPage'
import ProfilePage from './routes/app/ProfilePage'
import { useQuery, gql } from '@apollo/client';
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

const { data } = useQuery(FETCH_USER_QUERY, {
  variables: {
    username: decodedToken?.username || ''
  }
});

let permission = "";
const storedPermission = localStorage.getItem("permission");
if (storedPermission) {
  permission = storedPermission;
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
      </Routes>
    </AuthProvider>
  </Router>
)
}

const client = new ApolloClient({
  uri: ' http://localhost:5000/',
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
  <App />
</ApolloProvider>,
)

const FETCH_USER_QUERY = gql`
  query getUser($username: String!) {
    getUser(username: $username) {
      permission
    }
  }
`;

export default App;