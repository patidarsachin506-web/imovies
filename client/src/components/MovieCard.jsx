
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, ArrowUpRight } from 'lucide-react';

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie._id}`} className="movie-card">
      <div className="poster-wrap">
        <img
          src={
            movie.poster ||
            'https://placehold.co/400x600/171717/D9B779?text=IMOVIES'
          }
          alt={movie.title}
          loading="lazy"
        />

        <span className="poster-rating">
          <Star size={13} fill="currentColor" />
          {movie.rating || 'New'}
        </span>

        <span className="poster-index">IM · CINEMA</span>

        <span className="poster-cta">
          Explore film <ArrowUpRight size={15} />
        </span>
      </div>

      <div className="movie-meta">
        <div className="movie-title-row">
          <h3>{movie.title}</h3>
          <ArrowUpRight className="movie-arrow" size={17} />
        </div>

        <p>
          {movie.genre?.join(' / ') || 'Cinema'}
          <span> · </span>
          {movie.language || 'Language TBA'}
        </p>

        <div className="movie-runtime">
          <Clock size={14} />
          {movie.duration ? `${movie.duration} min` : 'Runtime TBA'}
          <span className="certificate">
            {movie.certificate || 'UA'}
          </span>
        </div>
      </div>
    </Link>
  );
}
