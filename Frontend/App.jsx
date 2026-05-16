import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./layout/Layout";
import Dashboard_Layout from "./layout/Dashboard_Layout";

import Home from "./pages/website/Home/Home";
import About from "./pages/website/About/About";
import Services from "./pages/website/Services/Services";
import Contact from "./pages/website/Contact/Contact";
import ReservationPage from "./pages/website/Reservation/page";
import Rates from "./pages/website/Rates/Rates";
import Blogs from "./pages/website/Blogs/Blogs";
import BlogDetails from "./pages/website/Blogs/components/BlogDetails";

import HourlyRates from "./pages/website/Rates/components/HourlyRates";
import DailyRates from "./pages/website/Rates/components/DailyRates";

import Dashboard from "./pages/Admin/Dashboard";
import Cars from "./pages/Admin/Cars";
import Prices from "./pages/Admin/Prices";
import Auth from "./pages/Auth/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import Service from "./pages/Admin/Services/Service";
import Article from "./pages/Admin/Blogs/Article";
import Blog from "./pages/Admin/Blogs/Blog";
import Users from "./pages/Admin/Users/Users";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />

          {/* Fixed Blog Routes */}
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetails />} />

          <Route path="/contact" element={<Contact />} />
          <Route path="/reservation" element={<ReservationPage />} />

          {/* Rates */}
          <Route path="/rates" element={<Rates />}>
            <Route index element={<HourlyRates />} />
            <Route path="daily" element={<DailyRates />} />
          </Route>
        </Route>

        {/* Auth Route */}
        <Route path="/auth" element={<Auth />} />

        {/* Protected Admin Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Dashboard_Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="cars" element={<Cars />} />
          <Route path="pricing" element={<Prices />} />
          <Route path="service" element={<Service />} />
          <Route path="users" element={<Users />} />
          
          {/* Fixed Blog Admin Routes */}
          <Route path="blog">
            <Route index element={<Blog />} />
            <Route path="article/:id" element={<Article />} />
          </Route>
        </Route>

        {/* Redirect old route */}
        <Route
          path="/daily-rates"
          element={<Navigate to="/rates/daily" replace />}
        />

        {/* 404 */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}