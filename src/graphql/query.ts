import { gql } from "@apollo/client";

export const FILMS_QUERY = gql`
query searchMovies ($name: String!){
  searchMovies(query: $name) {
    id
    name
    score
    adult
    genres {name}
    overview
    releaseDate
    cast {
      id
      person {
        name
      }
      role {
        ... on Cast {
          character
        }
      }
    }
  }
}
`;

export const RELATED_FILMS_QUERY = gql`
query getMovie($id: ID!) {
  movie(id: $id) {
    similar {
      name
      id
      score
      genres {name}
    }
  }
}`;