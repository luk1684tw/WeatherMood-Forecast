import React from 'react';
import {
	Card, Button, CardImg, CardTitle, CardText, CardGroup,
	 CardSubtitle, CardBlock,Container, Row, Col
} from 'reactstrap';

import './ForecastDisplay.css';

export default class WeatherDisplay extends React.Component {
    static propTypes = {
        masking: React.PropTypes.bool,
        group: React.PropTypes.array,
        description: React.PropTypes.array,
        temp: React.PropTypes.array,
        unit: React.PropTypes.string,
		lat:React.PropTypes.number,
		lng:React.PropTypes.number
    };

    constructor(props) {
        super(props);

    }

    render() {

        return (
            <div className={`weather-display ${this.props.masking
                ? 'masking'
                : ''}`}>
                <img src={`images/w-${this.props.group[0]}.png`}/>
                <p className='description'>{this.props.description[0]}</p>&nbsp;
                <h1 className='temp'>
                    <span className='display-3'>{this.props.temp[0].toFixed(0)}&ordm;</span>
                    &nbsp;{(this.props.unit === 'metric')
                        ? 'C'
                        : 'F'}
                </h1>
            </div>
        );
    }
}
