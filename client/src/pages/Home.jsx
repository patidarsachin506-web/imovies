
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowUpRight, Popcorn } from 'lucide-react';
import api from '../api';
import MovieCard from '../components/MovieCard';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load(q = '') {
    setLoading(true);

    try {
      const response = await api.get('/movies', {
        params: q ? { search: q } : {},
      });

      setMovies(response.data);
      setError('');
    } catch (e) {
      setError(
        e.response?.data?.message ||
          'Cannot connect to the server. Please start the backend.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="live-dot" />
            THE BIG SCREEN, MADE SIMPLE
          </div>

          <h1>
            Your next
            <br />
            <span>movie moment.</span>
          </h1>

          <p>
            Discover stories worth watching. Pick your seats, book in seconds,
            and let the show begin.
          </p>

          <a className="btn btn-accent btn-lg" href="#now-showing">
            Explore movies <ArrowUpRight size={18} />
          </a>

          <div className="hero-stats">
            <div>
              <strong>Easy</strong>
              <span>seat selection</span>
            </div>
            <div>
              <strong>Secure</strong>
              <span>checkout</span>
            </div>
            <div>
              <strong>Instant</strong>
              <span>confirmation</span>
            </div>
          </div>
        </div>

        <div className="hero-art">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />

          <div className="ticket-art">
            <Popcorn size={54} />
            <div className="ticket-lines">
              <b>YOUR SEAT</b>
              <span>IS WAITING</span>
              <small>IMOVIES · CINEMA</small>
            </div>
          </div>

          <div className="floating-chip chip-top">
            ✦ YOUR NIGHT OUT
          </div>
          <div className="floating-chip chip-bottom">
            01 / GOOD STORIES
          </div>
        </div>
      </section>

      <section id="now-showing" className="container movie-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">CURATED FOR YOU</div>
            <h2>
              Now showing<span>.</span>
            </h2>
          </div>

          <div className="search-box">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                load(e.target.value);
              }}
              placeholder="Find a movie..."
              aria-label="Search movies"
            />
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading the lineup…</div>
        ) : error ? (
          <div className="alert alert-danger">
            {error}
            <button
              className="btn btn-sm btn-outline-danger ms-3"
              onClick={() => load(search)}
            >
              Retry
            </button>
          </div>
        ) : movies.length ? (
          <div className="movie-grid">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            No movies found. Try another title.
          </div>
        )}
      </section>

      <footer className="container site-footer">
        <Link className="brand" to="/">
          <span className="brand-icon">
            <Popcorn size={18} />
          </span>
          i<span>MOVIES</span>
        </Link>

        <span>
          Made for movie lovers · © {new Date().getFullYear()} IMovies
        </span>
      </footer>
    </>
  );
}
