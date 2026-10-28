
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Clapperboard,
  Ticket,
  LogOut,
  UserRound,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark nav-glass">
      <div className="container">
        <Link className="navbar-brand brand" to="/">
          <span className="brand-icon">
            <Clapperboard size={21} />
          </span>
          <span className="brand-name">
            i<span>MOVIES</span>
          </span>
          <span className="brand-edition">CINEMA CLUB</span>
        </Link>

        <div className="d-flex align-items-center gap-3 ms-auto">
          <NavLink
            className="nav-link nav-movies"
            to="/"
          >
            Discover
          </NavLink>

          {user && (
            <NavLink className="nav-link nav-movies" to="/bookings">
              <Ticket size={16} />
              My tickets
            </NavLink>
          )}

          {user ? (
            <>
              <span className="user-pill">
                <UserRound size={15} />
                {user.name}
              </span>

              <button
                className="btn btn-outline-light btn-sm nav-logout"
                onClick={logout}
              >
                <LogOut size={15} />
                <span className="d-none d-sm-inline">Logout</span>
              </button>
            </>
          ) : (
            <Link className="btn btn-accent nav-signin" to="/login">
              Sign in <ArrowUpRight size={15} />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
