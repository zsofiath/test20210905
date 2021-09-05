import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import './styles.scss';
import Chip from '@material-ui/core/Chip';

const baseWikiUrl = 'https://en.wikipedia.org/w/api.php';


export default class FilmElement extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      details: [],
      imdbUrl: "",
      isLoading: false,
      isDetailsOpened: false
    }
  }
    
  search(){
    if(!this.state.isDetailsOpened){
      this.fetchWikiData();
      this.fetchImdbData();
    }
    else {
      this.setState({
        isDetailsOpened: false
      })
    }
  }

  fetchWikiData() {
    const url = baseWikiUrl+'?action=query&prop=info&titles=' + encodeURIComponent(this.props.filmData.name) + '&inprop=url&format=json&origin=*';
    const url2 = baseWikiUrl+'?action=query&prop=extracts&format=json&exintro=&titles=' + encodeURIComponent(this.props.filmData.name) + '&origin=*';
    this.setState({
      isLoading: true
    });
    Promise.all([
      fetch(url).then(res => res.json()),
      fetch(url2).then(res => res.json())
    ]).then((values) => {
      let pages = this.prepareWikiData(values);
      this.setState({
        details: pages,
        isLoading: false,
        isDetailsOpened: true
      });
    });
  }

  prepareWikiData(values) {
    let pages = [];
    Object.keys(values[0].query.pages).forEach(key => {
      pages.push({
        fullURL: values[0].query.pages[key].fullurl,
        summary: values[1].query.pages[key].extract
      });
    });
    return pages;
  }

  fetchImdbData() {
    const urlImdb = 'https://imdb-api.com/en/API/SearchMovie/k_9hl5hb80/' + encodeURIComponent(this.props.filmData.name);
    fetch(urlImdb).then(res => res.json()).then((value) => {
      this.setState({
        imdbUrl: `https://www.imdb.com/title/${value.results[0].id}/`
      });
    });
  }

  render() {
      return <div>
        <ListItem className="film-list-item" onClick={() => {this.search()}}>
          <ListItemText primary={this.props.filmData.name} secondary={'⭐ '+this.props.filmData.score} />
          {this.props.filmData.genres.map((genre, i) => <Chip key={i} color="primary" label={genre.name} />)}
        </ListItem>

        <div className="loader">
          {this.state.isLoading ? <CircularProgress /> : ''}
        </div>

        {this.state && this.state.isDetailsOpened && this.state.details && this.state.details.map((detail, i) => {return <Card key={i}>
          <CardContent>
            <div dangerouslySetInnerHTML={{ __html: detail.summary }} />
          </CardContent>
          <CardActions>
            <Button size="small" href={detail.fullURL} target="_blank">Wiki</Button>
            <Button size="small" href={this.state.imdbUrl} target="_blank">IMDB</Button>
            <Button onClick={()=>{this.props.getRelated(this.props.filmData.id)}}>Related</Button>
          </CardActions>
          </Card>
          })}
      </div>;
    }
    
  }