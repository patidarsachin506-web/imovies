
import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';import Navbar from './components/Navbar';import Home from './pages/Home';import MovieDetails from './pages/MovieDetails';import SeatSelection from './pages/SeatSelection';import Login from './pages/Login';import Bookings from './pages/Bookings';import {AuthProvider,useAuth} from './context/AuthContext';import {Navigate} from 'react-router-dom';
function Guard({children}){const {user}=useAuth();return user?children:<Navigate to="/login" replace/>}
function Layout(){return <><Navbar/><Routes><Route path="/" element={<Home/>}/><Route path="/movie/:id" element={<MovieDetails/>}/><Route path="/show/:id" element={<Guard><SeatSelection/></Guard>}/><Route path="/login" element={<Login/>}/><Route path="/bookings" element={<Guard><Bookings/></Guard>}/><Route path="*" element={<Home/>}/></Routes></>}
export default function App(){return <AuthProvider><BrowserRouter><Layout/></BrowserRouter></AuthProvider>}
