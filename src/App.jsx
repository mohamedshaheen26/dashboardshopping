import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Offers from "./pages/Offers";
import Questions from "./pages/Questions";
import Customers from "./pages/Customers";
import { useEffect, useState } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path='/login'
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path='/' element={isAuthenticated && <Layout />}>
          <Route index element={<Home />} />
          <Route path='categories' element={<Categories />} />
          <Route path='products' element={<Products />} />
          <Route path='orders' element={<Orders />} />
          <Route path='offers' element={<Offers />} />
          <Route path='questions' element={<Questions />} />
          <Route path='customers' element={<Customers />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
