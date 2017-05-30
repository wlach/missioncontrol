import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router, Route } from 'react-router-dom';
import MainView from './mainview.jsx';
import SubView from './subview.jsx';
import DetailView from './detailview.jsx';
import { fetchCrashData, fetchVersionData } from '../actions';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      filter: '',
      store: props.store,
    };
  }

  componentDidMount() {
    // doing this here (instead of the constructor) due to:
    // https://github.com/mozilla-neutrino/neutrino-dev/issues/172
    this.filterChanged = this.filterChanged.bind(this);
    const store = this.state.store;
    store.dispatch(fetchVersionData()).then(
      () => {
        store.dispatch(fetchCrashData(store.getState().versionInfo.matrix));
      });
  }

  filterChanged(ev) {
    this.setState({
      filter: ev.target.value,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state !== nextState;
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-inverse bg-inverse">
          <a className="navbar-brand" href="#">Mission Control</a>
        </nav>
        <Provider store={this.state.store}>
          <Router>
            <div>
              <Route exact path="/" component={MainView}/>
              <Route exact path="/:channel/:platform" component={SubView}/>
              <Route exact name="measureDetail" path="/:channel/:platform/:measure" component={DetailView}/>
            </div>
          </Router>
        </Provider>
      </div>
    );
  }
}
