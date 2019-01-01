import React from 'react';
import axios from 'axios';
import { Columns } from 'react-bulma-components/full';
import { Notification } from 'react-bulma-components/full';
import { Section } from 'react-bulma-components/full';
import { Hero } from 'react-bulma-components/full';
import { Heading } from 'react-bulma-components/full';
import { Container } from 'react-bulma-components/full';
import { Message } from 'react-bulma-components/full';
import {
  Field,
  Control,
  Input
} from 'react-bulma-components/lib/components/form';
import Card from 'react-bulma-components/lib/components/card';
import Media from 'react-bulma-components/lib/components/media';
import Tile from 'react-bulma-components/lib/components/tile';

const unsplashurl = 'https://api.unsplash.com/search/photos?page=1&query=';
const API_KEY_UNSPLASH = '';

const SearchBar = props => {
  console.log('searchbar');
  return (
    <Field>
      <Control>
        <Input
          onKeyPress={props.onSubmit}
          onChange={props.onChange}
          color="success"
          type="text"
          placeholder="Search Photos"
          value={props.st}
        />
      </Control>
    </Field>
  );
};

const EachPhoto = props => {
  console.log('EachPhoto ', props.url);
  return (
    <div>
      <Card>
        <Card.Image src={props.url} />
        <Card.Content>
          <Media>
            <Media.Item>
              Photo By <a href={props.user}>{props.name}</a>
            </Media.Item>
          </Media>
        </Card.Content>
      </Card>
    </div>
  );
};

const GetList = props => {
  const photoItems = props.photos.slice(props.start, props.end).map(img => {
    return (
      <EachPhoto
        key={img.id}
        url={img.urls.small}
        user={img.user.links.html}
        link={img.links.html}
        name={img.user.name}
      />
    );
  });

  return <ul>{photoItems}</ul>;
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      start: 0,
      end: 0,
      errorstring: '',
      searchterm: '',
      loading: false
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.fetchPhotosWithAxios('pop');
  }

  fetchPhotosWithAxios = x => {
    axios
      .get(unsplashurl + x + '&client_id=' + API_KEY_UNSPLASH)
      .then(responsedata => {
        const unsplashphotodata = responsedata.data.results;
        this.setState({ photos: unsplashphotodata, loading: false });
      })
      .catch(error => {
        if (error.response) {
          this.setState({
            errorstring: error.response.data.errors,
            loading: false
          });
        } else if (error.request) {
          this.setState({ errorstring: error.request, loading: false });
        }
      });
  };

  fetchPhotos = x => {
    fetch(unsplashurl + x + '&client_id=' + API_KEY_UNSPLASH)
      .then(resp => {
        if (resp.ok) return resp.json();
        else {
          throw new Error('Something went wrong');
        }
      })
      .then(data => {
        this.setState({
          photos: data.results
        });
      });
  };

  handleChange = event => {
    event.persist();
    this.setState({
      searchterm: event.target.value
    });
  };

  handleSubmit = event => {
    event.persist();
    this.setState(
      {
        searchterm: event.target.value
      },
      () => {
        if (event.key === 'Enter') {
          this.state.searchterm === ''
            ? this.fetchPhotosWithAxios('pop')
            : this.fetchPhotosWithAxios(this.state.searchterm);
        }
      }
    );
  };

  render() {
    if (this.state.loading) {
      return (
        <Section>
          <Notification color="info" className="has-text-centered">
            <strong>Loading images</strong>
          </Notification>
        </Section>
      );
    } else if (this.state.errorstring) {
      const err = this.state.errorstring;
      return (
        <Section>
          <Notification color="danger" className="has-text-centered">
            <strong>
              Something went wrong, the API request returned an error
            </strong>
            <p>{err}</p>
          </Notification>
        </Section>
      );
    } else
      return (
        <div>
          <Hero color="white" size="large">
            <Hero.Head renderAs="header">
              <Container>
                <Message>
                  <Heading
                    size={3}
                    className="has-text-black has-text-centered has-text-weight-semibold"
                  >
                    <p>UNSPLASH IMAGE SEARCH</p>
                  </Heading>
                </Message>
              </Container>
            </Hero.Head>
          </Hero>
          <Hero.Body>
            <Columns>
              <Columns.Column size="one-quarter" className="is=vcentered" />
              <Columns.Column size="half" className="is=vcentered">
                <SearchBar
                  onSubmit={this.handleSubmit}
                  st={this.state.searchterm}
                  onChange={this.handleChange}
                />
                <Tile kind="ancestor">
                  <Tile size={6}>
                    <Tile>
                      <Tile kind="parent">
                        <Tile
                          renderAs="article"
                          kind="child"
                          notification
                          color="primary"
                        >
                          <GetList
                            photos={this.state.photos}
                            start={0}
                            end={4}
                          />
                        </Tile>
                      </Tile>
                    </Tile>
                  </Tile>
                  <Tile>
                    <Tile kind="parent">
                      <Tile
                        renderAs="article"
                        kind="child"
                        notification
                        color="primary"
                      >
                        <GetList
                          photos={this.state.photos}
                          start={5}
                          end={10}
                        />
                      </Tile>
                    </Tile>
                  </Tile>
                </Tile>
              </Columns.Column>
              <Columns.Column size="one-quarter" className="is=vcentered" />
            </Columns>
          </Hero.Body>
        </div>
      );
  }
}

export default App;
