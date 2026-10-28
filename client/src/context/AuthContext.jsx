import React from 'react';
import {createContext,useContext,useState} from 'react';
const AuthContext=createContext(null);
export function AuthProvider({children}){const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem('imovies_user'))}catch{return null}});function login(data){localStorage.setItem('imovies_token',data.token);localStorage.setItem('imovies_user',JSON.stringify(data.user));setUser(data.user)}function logout(){localStorage.removeItem('imovies_token');localStorage.removeItem('imovies_user');setUser(null)}return <AuthContext.Provider value={{user,login,logout}}>{children}</AuthContext.Provider>}
export const useAuth=()=>useContext(AuthContext);
