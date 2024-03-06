import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './routes/LandingPage'
import LoginPage from './routes/LoginPage'
import SignupPage from './routes/SignupPage'
import ProfilePage from './routes/app/ProfilePage'
import { useQuery, gql } from '@apollo/client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';


function App() {
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/signup",
    element: <SignupPage />
  },
  {
    path: "/app/profile",
    element: <ProfilePage />
  }
])

return (
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
}
console.log(import.meta.env.VITE_SERVER_URI)
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