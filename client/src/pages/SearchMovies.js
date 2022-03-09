import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';
import Auth from '../utils/auth';
import { saveMovieIds, getSavedMovieIds } from '../utils/localStorage';
import { useMutation } from '@apollo/client';
import { SAVE_MOVIE } from '../utils/mutations';


const API_KEY = process.env.REACT_APP_API_KEY;

const SearchMovies = () => {
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedMovieIds, setSavedMovieIds] = useState(getSavedMovieIds());

  const [saveMovie, { error }] = useMutation(SAVE_MOVIE);

  useEffect(() => {
    return () => saveMovieIds(savedMovieIds);
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchInput}&page=1`
        );

        if (!response.ok) {
          throw new Error('Something went wrong!');
        }
   
    const {results} = await response.json();
       
    const movieData = results.map((movie) => ({
        movieId: movie.id,
        title: movie.title,
        imageURL: movie.poster_path,
        type: movie.overview,
        year: movie.release_date,
        }));

      setSearchedMovies(movieData);        
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };
  

  const handleSaveMovie = async (movieId) => {
    const movieToSave = searchedMovies.find((movie) => movie.movieId === movieId);
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await saveMovie({
        variables: { newMovie: { ...movieToSave } },
      });
      console.log(saveMovie);

      setSavedMovieIds([...savedMovieIds, movieToSave.movieId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className='text-dark bg-info'>
        <Container>
          <h1>Search for Movies!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Type in a keyword to search for what to watch'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='warning' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedMovies.length
            ? `Viewing ${searchedMovies.length} results:`
            : 'Search a keyword to look-up what to watch!'}
        </h2>
        <CardColumns >
          {searchedMovies.map((movie) => {
            return (
              <Card key={movie.movieId} border='dark' className="card text-white bg-secondary mb-3">
                {movie.image ? (
                  <Card.Img src={movie.imageURL} alt={`The cover for ${movie.title}`} variant='top' />
                ) : null}
                <Card.Body >
                  <Card.Title>{movie.title}</Card.Title>
                  <p className='small'>Release Date: {movie.year}</p>
                  <Card.Text>{movie.type}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedMovieIds?.some((savedMovieId) => savedMovieId === movie.movieId)}
                      className='btn-block btn-info'
                      onClick={() => handleSaveMovie(movie.movieId)}>
                      {savedMovieIds?.some((savedMovieId) => savedMovieId === movie.movieId)
                        ? 'This movie has already been saved!'
                        : 'Save this Movie!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SearchMovies;