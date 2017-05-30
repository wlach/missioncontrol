import React from 'react';
import { VictoryAxis, VictoryLine, VictoryChart, VictoryLegend, VictoryStack, VictoryTheme, VictoryTooltip, VictoryZoomContainer } from 'victory';

export default class MeasureGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      y: this.props.y || 'value',
      width: this.props.width,
      height: this.props.height,
    };
  }

  render() {
    return (
        <VictoryChart
          containerComponent={<VictoryZoomContainer/>}
        width={this.state.width}
        height={this.state.height}
        theme={VictoryTheme.material}>
        <VictoryAxis tickFormat={date => `${new Date(date).getHours()}h`}/>
          <VictoryAxis dependentAxis/>
          {
            this.props.seriesList.length > 1 &&
              <VictoryLegend
                  data={ this.props.seriesList.map(series => ({ name: series.name })) }
                  />
          }
        <VictoryStack>
          { this.props.seriesList.map(series => (
            <VictoryLine
              key={`${this.state.y}-${series.name}`}
              labelComponent={<VictoryTooltip/>}
              data={series.data}
              x="date"
              y={this.state.y}
              />
          ))
          }
        </VictoryStack>
      </VictoryChart>
    );
  }
}
