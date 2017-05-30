import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { Card, CardBlock, CardColumns, CardHeader, Row } from 'reactstrap';
import { connect } from 'react-redux';
import MeasureGraph from './measuregraph.jsx';
import SubViewNav from './subviewnav.jsx';

const mapStateToProps = (state, ownProps) => {
  const channel = ownProps.match.params.channel;
  const platform = ownProps.match.params.platform;

  // if present, summarize crash data as being a single quantity
  if (state.crashData && state.crashData.channels &&
      state.crashData.channels[platform] &&
      state.crashData.channels[platform][channel] &&
      state.crashData.channels[platform][channel].data) {
    const aggregatedDataMap = {};
    _.forEach(state.crashData.channels[platform][channel].data, (version) => {
      version.forEach((d) => {
        if (!aggregatedDataMap[d.date]) {
          aggregatedDataMap[d.date] = {
            date: d.date,
            value: d.main_rate,
          };
        } else {
          aggregatedDataMap[d.date].value += d.main_rate;
        }
      });
    });

    return {
      summary: {
        crash: {
          main: {
            status: 'success',
            seriesList: [
              {
                name: 'aggregate',
                data: _.values(aggregatedDataMap).sort((a, b) => a.date > b.date),
              },
            ],
          },
        },
      },
    };
  }

  return { summary: {} };
};

export class SubViewComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filter: '',
      channel: props.match.params.channel,
      platform: props.match.params.platform,
      history: {},
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
            _.map(this.props.summary, (dimension, dimensionName) => (
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
                            seriesList={measure.seriesList}
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

const SubView = connect(mapStateToProps)(SubViewComponent);

export default SubView;
