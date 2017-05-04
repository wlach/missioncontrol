import { VictoryAxis, VictoryArea, VictoryChart, VictoryStack, VictoryTheme, VictoryTooltip } from 'victory';
import MetricsGraphics from 'react-metrics-graphics';
import React from 'react';
import { timeFormat } from 'd3-time-format';
import { Card, Modal, ModalHeader, ModalBody } from 'reactstrap';

class MeasureGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      data: this.props.data,
      width: this.props.width,
      height: this.props.height,
    };
  }

  render() {
    return (
      <VictoryChart
        width={this.state.width}
        height={this.state.height}
        theme={VictoryTheme.material}>
        <VictoryAxis tickFormat={secs => `${new Date(secs).getHours()}h`} />
        <VictoryAxis dependentAxis/>
        <VictoryStack>
          {
            this.state.data.map(d => (
              <VictoryArea
                labels={v => v.main_rate}
                labelComponent={<VictoryTooltip/>}
                data={d}
                x="date"
                y="main_rate"
                />
            ))
          }
        </VictoryStack>
      </VictoryChart>
    );
  }
}

export default class DataCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      data: this.props.data,
      showDetail: false,
    };
  }

  componentWillMount() {
    // doing this here (instead of the constructor) due to:
    // https://github.com/mozilla-neutrino/neutrino-dev/issues/172
    this.toggleDetail = this.toggleDetail.bind(this);
  }

  toggleDetail() {
    this.setState({
      showDetail: !this.state.showDetail,
    });
  }

  render() {
    return (
      <Card block onClick={this.toggleDetail}>
        <center><h4>{this.state.name}</h4></center>
        <figure className="graph" id={this.state.name}>
          <MeasureGraph width={280} height={200} name={this.state.name} data={this.state.data}/>
        </figure>
        <Modal isOpen={this.state.showDetail} size="lg" toggle={this.toggleDetail}>
          <ModalHeader toggle={this.toggleDetail}>{this.state.name}</ModalHeader>
          <ModalBody>
            <div className="container">
              <div className="row">
                <div className="col">
                  <center><h5>Crash rate</h5></center>
                  <MeasureGraph
                    width={700} height={300} name={this.state.name}
                    data={this.state.data}/>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <center><h5>Usage khours</h5></center>
                  <MetricsGraphics
                    description="Cheezburger"
                    data={this.state.data}
                    width={700}
                    height={200}
                    x_accessor="date"
                    y_accessor="usage_khours"
                    xax_format={timeFormat('%Hh')}
                    show_secondary_x_label={false}
                    linked={true}
                    linked_format="%Y-%m-%d-%H-%M-%S"
                    />
                </div>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </Card>
    );
  }
}
