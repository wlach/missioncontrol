import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import MainView from './mainview.jsx';
import SubView from './subview.jsx';
import DetailView from './detailview.jsx';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      filter: '',
      dimensionFilter: 'Windows ESR',
    };
  }

  componentDidMount() {
    // doing this here (instead of the constructor) due to:
    // https://github.com/mozilla-neutrino/neutrino-dev/issues/172
    this.filterChanged = this.filterChanged.bind(this);
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
        <Router>
          <div>
            <Route exact path="/" component={MainView} />
            <Route exact path="/:channel/:platform" component={SubView}/>
            <Route exact name="measureDetail" path="/:channel/:platform/:measure" component={DetailView}/>
          </div>
        </Router>
      </div>
    );
  }
}
