import React from 'react';
import _ from 'lodash';
import { Row, Col } from 'reactstrap';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import MeasureGraph from './measuregraph.jsx';
import SubViewNav from './subviewnav.jsx';


const mapStateToProps = (state, ownProps) => {
  const channel = ownProps.match.params.channel;
  const platform = ownProps.match.params.platform;
  // const measure = ownProps.match.params.measure;
  if (state.crashData && state.crashData.channels &&
      state.crashData.channels[platform] &&
      state.crashData.channels[platform][channel] &&
      state.crashData.channels[platform][channel] &&
      state.crashData.channels[platform][channel].data) {
    const seriesMap = state.crashData.channels[platform][channel].data;
    let seriesList;
    if (Object.keys(seriesMap).length > 3) {
      // show two most recent versions in graph as their own series, aggregate
      // out the rest
      const mostRecent = Object.keys(seriesMap).sort().slice(-2);
      const aggregated = _.reduce(
        _.filter(seriesMap, (series, version) => _.indexOf(mostRecent, version) === (-1)),
        (result, series) => {
          const newResult = _.clone(result);
          series.forEach((datum) => {
            if (!result[datum.date]) {
              newResult[datum.date] = datum;
            } else {
              Object.keys(result[datum.date]).forEach((k) => {
                if (k !== 'date') {
                  newResult[datum.date][k] += datum[k];
                }
              });
            }
          });
          return newResult;
        }, {});

      seriesList = [
        { name: mostRecent[1], data: seriesMap[mostRecent[1]] },
        { name: mostRecent[0], data: seriesMap[mostRecent[0]] },
        { name: 'Older', data: _.values(aggregated) },
      ];
    } else {
      seriesList = _.map(seriesMap, (data, version) => ({
        name: version,
        data: data.sort((a, b) => a.date > b.date),
      }));
    }
    return {
      status: 'success',
      isLoading: false,
      seriesList,
    };
  }

  return {
    status: 'loading',
    isLoading: true,
    seriesList: [],
  };
};

class DetailViewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channel: props.match.params.channel,
      platform: props.match.params.platform,
      measure: props.match.params.measure,
    };
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>
            { `${this.state.platform} ${this.state.channel} ${this.state.measure}` }
          </title>
        </Helmet>

        <SubViewNav
          breadcrumbs={[
            { name: 'Home', link: '/' },
            { name: `${this.state.platform} ${this.state.channel}`,
              link: `/${this.state.channel}/${this.state.platform}` },
            { name: this.state.measure,
              link: `/${this.state.channel}/${this.state.platform}/${this.state.measure}` },
          ]}
          />
        {
          !this.props.isLoading &&
            <div className="container center">
                <Row>
                    <Col>
                        <div className="large-graph-container center" id="measure-series">
                            <MeasureGraph
                                title="Crash Rate"
                                seriesList={this.props.seriesList}
                                y={`${this.props.match.params.measure}`}
                                linked={true}
                                linked_format="%Y-%m-%d-%H-%M-%S"
                                width={800}
                                height={200}/>
                          </div>
                      </Col>
                  </Row>
                  <Row>
                      <Col>
                          <div className="large-graph-container center" id="time-series">
                              <MeasureGraph
                                  title="Usage khours"
                                  seriesList={this.props.seriesList}
                                  y={'usage_khours'}
                                  linked={true}
                                  linked_format="%Y-%m-%d-%H-%M-%S"
                                  width={800}
                                  height={200}/>
                          </div>
                      </Col>
                  </Row>
              </div>
        }
      </div>
    );
  }
}

const DetailView = connect(mapStateToProps)(DetailViewComponent);

export default DetailView;
