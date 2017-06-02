import _ from 'lodash';
import React from 'react';
import { Card, CardBlock, CardColumns, CardHeader, CardFooter, CardText } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { CardErrorTable, ERROR_TYPE_OUTSIDE_RANGE, ERROR_TYPE_INSUFFICIENT_DATA } from './errortable.jsx';

const mapStateToProps = state => ({ crashData: state.crashData });

const stringMatchesFilter = (strs, filterStr) =>
  _.every(filterStr.split(' ').map(
    filterSubStr => _.some(strs.map(
      str => str.toLowerCase().indexOf(filterSubStr.toLowerCase()) >= 0))));

export class MainViewComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filter: '',
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

  render() {
    return (
      <div>
      <div className="container">
        <div className="input-group filter-group">
          <input id="filter-input" type="text" className="form-control" placeholder="Filter results" onChange={this.filterChanged}/>
        </div>
      </div>
      <div className="container center">
        {
          this.props.crashData.channels && (
            <CardColumns>
              {
                ['Windows', 'MacOS X', 'Linux'].map(platformName => ['release', 'beta', 'nightly', 'esr'].map(
                  (channelName) => {
                    const channel = this.props.crashData.channels[platformName][channelName];
                    return stringMatchesFilter([platformName, channelName],
                                               this.state.filter) && (
                      <Card key={`${platformName}-${channelName}`}>
                        <CardHeader className={`alert-${channel.status}`}>
                          { platformName } { channelName }
                        </CardHeader>
                        <CardBlock>
                          {
                            channel.passingMeasures && (
                              <CardText>
                                { channel.passingMeasures } measure(s)
                                within acceptable range
                              </CardText>
                            )
                          }
                          {
                            (channel.errors && channel.errors.length) && (
                              <div>
                                <CardText>
                                  { channel.errors.length } measure(s)
                                  outside of acceptable range:
                                </CardText>
                                <CardErrorTable
                                  platformName={platformName}
                                  channelName={channelName}
                                  errorType={ERROR_TYPE_OUTSIDE_RANGE}
                                  errors={channel.errors}/>
                              </div>)
                          }
                          {
                            (channel.insufficientData && channel.insufficientData.length) && (
                              <div>
                                <CardText>
                                  { channel.insufficientData.length } measure(s)
                                  with insufficient data:
                                </CardText>
                                <CardErrorTable
                                  platformName={platformName}
                                  channelName={channelName}
                                  errorType={ERROR_TYPE_INSUFFICIENT_DATA}
                                  errors={channel.insufficientData}/>
                              </div>)
                          }
                        </CardBlock>
                        <CardFooter>
                          <Link to={`${channelName}/${platformName}`}>
                          More...
                          </Link>
                        </CardFooter>
                      </Card>
                    );
                  }))
                }
              </CardColumns>
          )
        }
      </div>
    </div>);
  }
}

const MainView = connect(mapStateToProps)(MainViewComponent);

export default MainView;
