import React from 'react';
import _ from 'lodash';
import { Row, Col } from 'reactstrap';
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
      state.crashData.channels[platform][channel].data) {
    return {
      status: 'success',
      isLoading: false,
      seriesList: _.map(state.crashData.channels[platform][channel].data, (data, version) => ({
        name: version,
        data,
      })),
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
          !this.state.isLoading &&
            <div className="container center">
                <Row>
                    <Col>
                        <div className="large-graph-container center">
                            <h4>Rate</h4>
                              <MeasureGraph
                                  seriesList={this.props.seriesList}
                                  y={'main_rate'}
                                  width={800}
                                  height={200}/>
                          </div>
                      </Col>
                  </Row>
                  <Row>
                      <Col>
                          <div className="large-graph-container center">
                              <h4>Usage khours</h4>
                              <MeasureGraph
                                  seriesList={this.props.seriesList}
                                  y={'usage_khours'}
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
