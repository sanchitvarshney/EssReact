import { RouterProvider } from "react-router-dom";
import { route } from "../routes";
import { useState } from "react";
import SignInScreen from "./pages/SignInScreen";





function App() {
  const [user,setUser]=useState(
    "user"
  )
console.log(setUser)

  return (
    <>
    {user ? (  <RouterProvider router={route} />) : (<SignInScreen />)}
    
    </>
  );
}

export default App;
