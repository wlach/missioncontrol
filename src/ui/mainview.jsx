import React from 'react';
import _ from 'lodash';
import { Card, CardBlock, CardDeck, CardHeader, CardFooter, CardText, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const mapStateToProps = state => ({ crashData: state.crashData });

export class MainViewComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      crashData: props.crashData,
      filter: '',
      summary: {
        windows: {
          esr: {
            status: 'success',
            passingMeasures: 1,
          },
          beta: {
            status: 'success',
            passingMeasures: 1,
          },
          release: {
            status: 'danger',
            errors: [
              { measure: 'crash-gpu',
                limit: 50,
                current: 80,
              },
            ],
          },
          nightly: {
            status: 'warning',
            insufficientData: [
              { measure: 'crash',
                minimum: 2,
                current: 0,
              },
            ],
          },
        },
      },
    };
  }

  render() {
    return (
      <div>
      <div className="container">
        <div className="input-group filter-group">
          <input id="filter-input" type="text" className="form-control" placeholder="Filter text" onChange={this.filterChanged}/>
        </div>
      </div>
      <div className="container center">
        {
          _.map(this.props.crashData.channels, (platform, platformName) => (
            <Row>
              <CardDeck>
                {
                  _.map(platform, (channel, channelName) => (
                    <Card>
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
                          <table className="table table-sm">
                            <thead>
                              <tr>
                                <th>Measure</th>
                                <th>Limit</th>
                                <th>Current</th>
                              </tr>
                            </thead>
                            {
                              channel.errors.map(e => (
                                <tr className="table-danger">
                                  <td>
                                    <Link to={`/${channelName}/${platformName}/${e.measure}`}>
                                      { e.measure }
                                    </Link>
                                  </td>
                                  <td>{ e.limit }</td>
                                  <td>{ e.current }</td>
                                </tr>
                              ))
                            }
                        </table>
                          </div>
                      )
                    }
                    {
                      (channel.insufficientData && channel.insufficientData.length) && (
                        <div>
                          <CardText>
                            { channel.insufficientData.length } measure(s)
                            with insufficient data:
                          </CardText>
                          <table className="table table-sm">
                            <thead>
                              <tr>
                                <th>Measure</th>
                                <th>Expected</th>
                                <th>Current</th>
                              </tr>
                            </thead>
                            {
                              channel.insufficientData.map(m => (
                                <tr className="table-warning">
                                  <td>
                                    <Link to={`/${channelName}/${platformName}/${m.measure}`}>
                                      { m.measure }
                                    </Link>
                                  </td>
                                  <td>{ m.expected }</td>
                                  <td>{ m.current }</td>
                                </tr>
                              ))
                            }
                        </table>
                          </div>
                      )
                    }
                    </CardBlock>
                      <CardFooter>
                      <Link to={`${channelName}/${platformName}`}>
                      More...
                      </Link>
                      </CardFooter>
                      </Card>
                  ))
                }
            </CardDeck>
              </Row>
          ))
        }
      </div>
        </div>
    );
  }
}

const MainView = connect(mapStateToProps)(MainViewComponent);

export default MainView;
