import React from 'react';
import _ from 'lodash';
import { Row, Col } from 'reactstrap';
import MeasureGraph from './measuregraph.jsx';
import SubViewNav from './subviewnav.jsx';


function createValueRange(amountBefore, amountAfter, valueBefore, valueAfter, noise) {
  const noisyConstant = x => x + (Math.random() * noise);
  return _.concat(_.zip(_.range(0, amountBefore),
                           _.times(amountBefore, _.curry(noisyConstant, 2)(valueBefore))),
                   _.zip(_.range(amountBefore + 1, amountBefore + amountAfter + 1),
                         _.times(amountAfter, _.curry(noisyConstant, 2)(valueAfter))))
    .map(pair => ({ date: pair[0], value: pair[1] }));
}


export default class DetailView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channel: props.match.params.channel,
      platform: props.match.params.platform,
      measure: props.match.params.measure,
      data: {
        main: createValueRange(10, 10, 11, 14, 1),
        usage_khours: createValueRange(10, 0, 10, 0, 1),
      },
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
        <div className="container center">
          <Row>
            <Col>
              <div className="large-graph-container center">
                <h4>Rate</h4>
                <MeasureGraph
                  data={this.state.data.main}
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
                  data={this.state.data.usage_khours}
                  width={800}
                  height={200}/>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
