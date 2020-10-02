import React from 'react';

import NotFoundPage from './404';
import SearchForm from '../components/SearchForm';
import SearchResult from '../components/SearchResult';


export async function getServerSideProps({ query }) {
  const param = query.q
  const url = `http://localhost:8080/search?q=${param}`;
  const response = await fetch(
    url,
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    }
  );
  const statusCode = response.status;
  const data = await response.json();

  return {
    props: {
      data,
      param,
      statusCode
    }
  };
}


class Search extends React.Component {
  constructor(props) {
    super(props);
    const { data, param, statusCode } = props;
    this.state = {
      query: param,
      total: data.total,
      news: data.news,
      statusCode: statusCode
    };
  }

  render() {
    if (this.state.statusCode == 404) {
      return <NotFoundPage />
    }

    return (
      <div>
        <SearchForm query={ this.state.query } />
        <SearchResult news={ this.state.news } total={ this.state.total } />
      </div>
    );
  }
}

export default Search;
