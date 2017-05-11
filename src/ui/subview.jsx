import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { Card, CardBlock, CardColumns, CardHeader, Row } from 'reactstrap';
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

export default class SubView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filter: '',
      channel: props.match.params.channel,
      platform: props.match.params.platform,
      history: {},
      summary: {
        crash: {
          main: {
            status: 'success',
            data: createValueRange(10, 10, 10, 14, 1),
          },
          gpu: {
            status: 'danger',
            data: createValueRange(10, 10, 10, 80, 1),
          },
        },
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
          ]}
          />
        <div className="container center">
          {
            _.map(this.state.summary, (dimension, dimensionName) => (
              <Row key={dimensionName}>
                <CardColumns>
                  {
                    _.map(dimension, (measure, dimension2Name) => (
                      <Card key={`${dimensionName}-${dimension2Name}`}>
                        <CardHeader className={`alert-${measure.status}`}>
                          { _.capitalize(dimensionName) } { dimension2Name }
                        </CardHeader>
                        <CardBlock>
                          <MeasureGraph
                            data={measure.data}
                            width={320}
                            height={200}/>
                        </CardBlock>
                        <CardBlock>
                          <Link to={`/${this.state.channel}/${this.state.platform}/${dimensionName}-${dimension2Name}`}>
                            More...
                          </Link>
                        </CardBlock>
                      </Card>
                    ))
                  }
                </CardColumns>
              </Row>
            ))
          }
      </div>
    </div>
    );
  }
}
