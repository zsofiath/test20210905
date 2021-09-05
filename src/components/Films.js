
import { useLazyQuery } from "@apollo/client";
import {useState} from 'react';
import FilmElement from './FilmElement';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import { FILMS_QUERY, RELATED_FILMS_QUERY } from '../graphql/query';
import './styles.scss';
import Box from '@material-ui/core/Box';


function Films() {
    let movieList = [];
    const [filmSearched, setFilmSearched] = useState("");
    const [filmViewed, setFilmViewed] = useState("");
    const [getFilms, req1] = useLazyQuery(FILMS_QUERY, {variables: {name: filmSearched}});
    const [getRelatedFilms, req2] = useLazyQuery(RELATED_FILMS_QUERY, {variables: {id: filmViewed}});

    const isLoading = () => {
      return req1.loading || req2.loading;
    }
    
    if(req1.data) {
      movieList = req1.data.searchMovies;
    }

    if(req2.data?.movie) {
      movieList = req2.data.movie.similar;
    }

    return ( <div>
      <form onSubmit={(e) => {
        e.preventDefault();
        if(filmSearched.length > 0) {
          getFilms();
        }
      }}>
        
        <Box display="flex" justifyContent="center" m={1} p={1} bgcolor="background.paper">
          <Box p={1} color="none">
            <TextField id="outlined-basic" label="Film title" variant="outlined"  size="small" onChange={(event) => {
              setFilmSearched(event.target.value)
            }}/>
          </Box>
          <Box p={1}>
            <Button disabled={filmSearched.length == 0} type="submit" variant="outlined" color="primary"  size="large">Search</Button>
          </Box>
        </Box>
      </form>
      <div className="film-list">
        <div className="loader">
          {req1.loading || req2.loading ? <CircularProgress /> : ''}
        </div>
        <List >{!isLoading() && movieList.map((c, i) => {return<div key={i}>
                  <FilmElement getRelated={(event) => {
                    setFilmViewed(event);
                    getRelatedFilms();
                    }} filmData={c}></FilmElement>
              </div>})
          }</List>
        </div>
    </div> );
}

export default Films;