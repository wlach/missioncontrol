import React from 'react';
import _ from 'lodash';
import DataCard from './card.jsx';

function getMajorVersion(verString) {
  return parseInt(verString.split('.')[0], 10);
}

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      filter: '',
    };
  }

  componentDidMount() {
    const that = this;
    fetch('https://product-details.mozilla.org/1.0/firefox_versions.json')
      .then(response => response.json())
      .then((versionData) => {
        const versionMatrix = {
          release: getMajorVersion(versionData.LATEST_FIREFOX_VERSION),
          beta: getMajorVersion(versionData.LATEST_FIREFOX_RELEASED_DEVEL_VERSION),
          nightly: getMajorVersion(versionData.FIREFOX_NIGHTLY),
        };

        fetch('https://sql.telemetry.mozilla.org/api/queries/4430/results.json?api_key=VafplWXVSOf9VvnUYbARJoJuLEQ3i8GgrABSbwTg').then(response => response.json()).then((data) => {
          const cardMap = {};
          data.query_result.data.rows.forEach((row) => {
            const osname = row.os_name;
            const channel = row.channel;
            const version = row.version;

            // ignore unless version is current one on channel
            if (getMajorVersion(version) < (versionMatrix[channel] - 1) ||
                getMajorVersion(version) > versionMatrix[channel]) {
              return;
            }

            if (!cardMap[osname]) {
              cardMap[osname] = {};
            }
            if (!cardMap[osname][channel]) {
              cardMap[osname][channel] = {
                name: `${osname}-${channel}`,
                data: {},
              };
            }
            if (!cardMap[osname][channel].data[version]) {
              cardMap[osname][channel].data[version] = [];
            }
            cardMap[osname][channel].data[version].push({
              main_rate: row.main_rate,
              usage_khours: row.usage_khours,
              date: new Date(row.date),
            });
          });
          const cards = _.flattenDeep(_.values(cardMap).map(channelMap => _.values(channelMap)));
          that.setState({ cards });
        });
      });

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
        <div className="container-fluid">
          <div className="container">
            <div className="input-group filter-group">
              <input id="filter-input" type="text" className="form-control" placeholder="Filter text" onChange={this.filterChanged}/>
            </div>
          </div>
          <div className="container" id="crash-cards">
            {
              _.chunk(this.state.cards.filter(
                c => c.name.toLowerCase().includes(this.state.filter.toLowerCase())),
                      3).map((cardRow, i) => (
                <div className="row" key={`row${i}`}>
                  {cardRow.map((card, j) => (
                    <div className="col" key={`row-${i}-col-${j}`}>
                      <DataCard name={card.name}
                                data={_.values(card.data)}
                                legend={_.keys(card.data)}
                                key={card.name}/>
                    </div>
                  ))}
                </div>
              ))}
      </div>
        </div>
        </div>
    );
  }
}
