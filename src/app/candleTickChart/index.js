
import React from 'react';
import Chart from './chart';
import { getData,getOurData } from "./utils"

import { TypeChooser } from "react-stockcharts/lib/helper";

class ChartComponent extends React.Component {
	componentDidMount() {
        getOurData().then(data => {
            console.log(data);
        })
		getData().then(data => {
            this.setState({ data })
            console.log(data);
		})
	}
	render() {
		if (this.state == null) {
			return <div>Loading...</div>
		}
		return (
			<TypeChooser>
				{type => <Chart type={type} data={this.state.data} />}
			</TypeChooser>
		)
	}
}

export default ChartComponent
