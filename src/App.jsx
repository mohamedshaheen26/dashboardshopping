import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  });
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Layout />}>
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
