import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'

import _ from "lodash";

import {
	Card, Button, CardImg, CardTitle, CardText, CardGroup,
	 CardSubtitle, CardBlock,Container, Row, Col, Jumbotron
} from 'reactstrap';
import Helmet from "react-helmet";

import {
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";


import WeatherDisplay from 'components/ForecastDisplay.jsx';
import WeatherForm from 'components/WeatherForm.jsx';
import {getForecast} from 'api/open-weather-map.js';

import './weather.css';

const GettingStartedGoogleMap = withGoogleMap(props => (
  	<GoogleMap
    	ref={props.onMapLoad}
    	defaultZoom={3}
    	defaultCenter={{ lat: 25.0112183, lng: 121.52067570000001 }}
    	onClick={props.onMapClick}
  	>
    	{props.markers.map(marker => (
      	<Marker
        	{...marker}
        	onRightClick={() => props.onMarkerRightClick(marker)}
      	/>
    	))}
  	</GoogleMap>
));



export default class Forecast extends React.Component {
    static propTypes = {
        masking: React.PropTypes.bool,
        group: React.PropTypes.array,
        description: React.PropTypes.array,
        temp: React.PropTypes.array,
        unit: React.PropTypes.string,
		markers: React.PropTypes.array
    };

    static getInitWeatherState() {
        return {
            city: 'na',
            code: [-1,-1,-1,-1,-1],
            group: ['na','na','na','na','na'],
            description: ['N/A','N/A','N/A','N/A','N/A'],
            temp: [NaN,NaN,NaN,NaN,NaN],
			markers: [{
      			position: {
        		lat: -1,
        		lng: -1
      			},
      			key: `Taiwan`,
      			defaultAnimation: 2,
    			}],
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            ...Forecast.getInitWeatherState(),
            loading: true,
            masking: true
        };

        this.handleFormQuery = this.handleFormQuery.bind(this);

		this.handleMapLoad = this.handleMapLoad.bind(this);
  		this.handleMapClick = this.handleMapClick.bind(this);
  		this.handleMarkerRightClick = this.handleMarkerRightClick.bind(this);

        this.maskInterval = null;
    }

	handleMapLoad(map) {
    	this._mapComponent = map;
    	if (map) {
      		console.log(map.getZoom());
    	}
  	}

	handleMapClick(event) {
    	const nextMarkers = [
      		...this.state.markers, {
        		position: event.latLng,
        		defaultAnimation: 2,
        		key: Date.now(), // Add a key property for: http://fb.me/react-warning-keys
      		},
    	];
    	this.setState({
      		markers: nextMarkers,
    	});
		this.getForecast(0,event.latLng.lat(),event.latLng.lng(),'',this.state.unit)
    	if (nextMarkers.length === 3) {
      		this.props.toast(
        	`Right click on the marker to remove it`,
        	`Also check the code!`
      		);
    	}
  	}


  	handleMarkerRightClick(targetMarker) {
 /*
  * All you modify is data, and the view is driven by data.
  * This is so called data-driven-development. (And yes, it's now in
  * web front end and even with google maps API.)
  */
 		const nextMarkers = this.state.markers.filter(marker => marker !== targetMarker);
 		this.setState({
   			markers: nextMarkers,
 		});
	}

    componentDidMount() {
        this.getForecast(1,0,0,'Hsinchu', 'metric');
    }

    componentWillUnmount() {
        if (this.state.loading) {
            cancelForecast();
        }
    }

    render() {
		var day = new Date().getDay();
		// var Day_1 = (day == 1) ? 'Monday' : (day == 2) ? 'Tuesday' : (day == 3) ? 'Wednesday' : (day == 4) ? 'Thursday' : (day == 5) ? 'Friday'
		// 			: (day == 6) ? 'Satursday' : 'Sunday';
		var Day_2 = (day == 7) ? 'Monday' : (day == 1) ? 'Tuesday' : (day == 2) ? 'Wednesday' : (day == 3) ? 'Thursday' : (day == 4) ? 'Friday'
					: (day == 5) ? 'Satursday' : 'Sunday';
		var Day_3 = (day == 6) ? 'Monday' : (day == 7) ? 'Tuesday' : (day == 1) ? 'Wednesday' : (day == 2) ? 'Thursday' : (day == 3) ? 'Friday'
					: (day == 4) ? 'Satursday' : 'Sunday';
		var Day_4 = (day == 5) ? 'Monday' : (day == 6) ? 'Tuesday' : (day == 7) ? 'Wednesday' : (day == 1) ? 'Thursday' : (day == 2) ? 'Friday'
					: (day == 3) ? 'Satursday' : 'Sunday';
		var Day_5 = (day == 4) ? 'Monday' : (day == 5) ? 'Tuesday' : (day == 6) ? 'Wednesday' : (day == 7) ? 'Thursday' : (day == 1) ? 'Friday'
					: (day == 2) ? 'Satursday' : 'Sunday';


        return (
            <div className={`today weather-bg ${this.state.group[0]}`}>
                <div className={`mask ${this.state.masking ? 'masking' : ''}`}>
                    <WeatherDisplay {...this.state}/>
                    <WeatherForm city={this.state.city} unit={this.props.unit} onQuery={this.handleFormQuery}/>&nbsp;
					<container className='display-5'>
						<div className="cards">
							<Row>
								<Col>
									<Card>
										<CardTitle>{Day_2}</CardTitle>
										<CardSubtitle>{this.state.description[1]}</CardSubtitle>
											<CardText>
												<i className={`owf owf-${this.state.code[1]} owf-5x`}></i>
												<span>{this.state.temp[1].toFixed(0)}</span>
											</CardText>
									</Card>
								</Col>
								<Col>
									<Card>
										<CardTitle>{Day_3}</CardTitle>
										<CardSubtitle>{this.state.description[2]}</CardSubtitle>

											<CardText>
												<i className={`owf owf-${this.state.code[2]} owf-5x`}></i>
												<span>{this.state.temp[2].toFixed(0)}</span>
											</CardText>
									</Card>
								</Col>
								<Col className="responsive">
									<Card>
										<CardTitle>{Day_4}</CardTitle>
										<CardSubtitle>{this.state.description[3]}</CardSubtitle>
											<CardText>
												<i className={`owf owf-${this.state.code[3]} owf-5x`}></i>
												<span>{this.state.temp[3].toFixed(0)}</span>
											</CardText>
									</Card>
								</Col>
								<Col className="responsive">
									<Card>
										<CardTitle>{Day_5}</CardTitle>
										<CardSubtitle>{this.state.description[4]}</CardSubtitle>

											<CardText>
												<i className={`owf owf-${this.state.code[4]} owf-5x`}></i>
												<span>{this.state.temp[4].toFixed(0)}</span>
											</CardText>
									</Card>
								</Col>
							</Row>
						</div>
					</container>
                </div>
				<div style={{height: `100%`}}>
        			<Helmet title="Getting Started"/>
        				<GettingStartedGoogleMap containerElement={
							<div style={{ height: `100%` }} />
          				}
          				mapElement={
            				<div style={{ height: `100%` }} />
          				}
          				onMapLoad={this.handleMapLoad}
          				onMapClick={this.handleMapClick}
          				markers={this.state.markers}
          				onMarkerRightClick={this.handleMarkerRightClick}
        				/>
      			</div>
            </div>
        );
    }

    getForecast(f,lat,lng,city, unit) {

        this.setState({
            loading: true,
            masking: true,
            city: city // set city state immediately to prevent input text (in WeatherForm) from blinking;
        }, () => { // called back after setState completes
            getForecast(f,lat,lng,city, unit).then(weather => {
                this.setState({
                    ...weather,
                    loading: false
                }, () => this.notifyUnitChange(unit));
            }).catch(err => {
                console.error('Error getting weather', err);

                this.setState({
                    ...Forecast.getInitWeatherState(unit),
                    loading: false
                }, () => this.notifyUnitChange(unit));
            });
        });

        this.maskInterval = setInterval(() => {
            clearInterval(this.maskInterval);
            this.setState({
                masking: false
            });
        }, 600);
    }

    handleFormQuery(city, unit) {
        this.getForecast(1,0,0,city, unit);
    }

    notifyUnitChange(unit) {
        if (this.props.units !== unit) {
            this.props.onUnitChange(unit);
        }
    }


}
