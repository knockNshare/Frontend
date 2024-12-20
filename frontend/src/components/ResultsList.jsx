import "../styles/ResultsList.css";
import React from 'react';

const ResultsList = ({ results }) => {
  if (results.length === 0) {
    return <p className="results-list-empty">Aucun résultat trouvé.</p>;
  }

  return (
    <ul className="results-list">
      {results.map((result) => (
        <li key={result.id} className="results-list-item">
          <h3 className="results-list-title">{result.title}</h3>
          <p className="results-list-description">{result.description}</p>
          <p className="results-list-distance">Distance : {result.distance} km</p>
        </li>
      ))}
    </ul>
  );
};

export default ResultsList;