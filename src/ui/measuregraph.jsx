import React from 'react';
import { VictoryAxis, VictoryLine, VictoryChart, VictoryStack, VictoryTheme, VictoryTooltip } from 'victory';

export default class MeasureGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
        domainPadding={50}
        theme={VictoryTheme.material}>
        <VictoryAxis/>
        <VictoryAxis dependentAxis/>
        <VictoryStack>
          <VictoryLine
            labelComponent={<VictoryTooltip/>}
            data={this.state.data}
            x="date"
            y="value"
            />
        </VictoryStack>
      </VictoryChart>
    );
  }
}
