import React from 'react';
import _ from 'lodash';
import { Card, CardBlock, CardDeck, CardHeader, CardFooter, CardText, Row } from 'reactstrap';
import { Link } from 'react-router-dom';

export default class MainView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
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
      <div className="container center">
        {
          _.map(this.state.summary, (platform, platformName) => (
            <Row>
              <CardDeck>
                {
                  _.map(platform, (channel, channelName) => (
                    <Card>
                      <CardHeader className={`alert-${channel.status}`}>
                        { _.capitalize(platformName) } { channelName }
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
                                <th>Minimum</th>
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
                                  <td>{ m.minimum }</td>
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
    );
  }
}
