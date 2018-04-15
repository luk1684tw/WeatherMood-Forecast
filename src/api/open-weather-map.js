import axios from 'axios';

// TODO replace the key with yours
const key = 'd339a814bfbda02d623873001b7b39c4';
const baseUrl = `http://api.openweathermap.org/data/2.5/weather?appid=${key}`;
const foreUrl = `http://api.openweathermap.org/data/2.5/forecast?appid=${key}`;


export function getWeatherGroup(code) {
    let group = 'na';
    if (200 <= code && code < 300) {
        group = 'thunderstorm';
    } else if (300 <= code && code < 400) {
        group = 'drizzle';
    } else if (500 <= code && code < 600) {
        group = 'rain';
    } else if (600 <= code && code < 700) {
        group = 'snow';
    } else if (700 <= code && code < 800) {
        group = 'atmosphere';
    } else if (800 === code) {
        group = 'clear';
    } else if (801 <= code && code < 900) {
        group = 'clouds';
    }
    return group;
}

export function capitalize(string) {
    return string.replace(/\b\w/g, l => l.toUpperCase());
}

let weatherSource = axios.CancelToken.source();

export function getWeather(city, unit) {
    var url = `${baseUrl}&q=${encodeURIComponent(city)}&units=${unit}`;

    console.log(`Making request to: ${url}`);

    return axios.get(url, {cancelToken: weatherSource.token}).then(function(res) {
        if (res.data.cod && res.data.message) {
            throw new Error(res.data.message);
        } else {
            return {
                city: capitalize(city),
                code: res.data.weather[0].id,
                group: getWeatherGroup(res.data.weather[0].id),
                description: res.data.weather[0].description,
                temp: res.data.main.temp,
                unit: unit // or 'imperial'
            };
        }
    }).catch(function(err) {
        if (axios.isCancel(err)) {
            console.error(err.message, err);
        } else {
            throw err;
        }
    });
}

export function cancelWeather() {
    weatherSource.cancel('Request canceled');
}

export function getForecast(f,lat,lng,city, unit) {
	var url = (f == 1) ? `${foreUrl}&q=${encodeURIComponent(city)}&units=${unit}`
				: `${foreUrl}&lat=${lat}&lon=${lng}&units=${unit}`;
	console.log(lat);
	console.log(lng);
    console.log(`Making request to: ${url}`);
    return axios.get(url, {cancelToken: weatherSource.token}).then(function(res) {
        if (!res.data.cod && res.data.message) {
			console.log('Didnt get');
            throw new Error(res.data.message);
        } else {
            return {
                city: capitalize(city),
                code: [
					res.data.list[0].weather[0].id,
					res.data.list[8].weather[0].id,
					res.data.list[16].weather[0].id,
					res.data.list[24].weather[0].id,
					res.data.list[32].weather[0].id
				],
                group: [
					getWeatherGroup(res.data.list[0].weather[0].id),
					getWeatherGroup(res.data.list[8].weather[0].id),
					getWeatherGroup(res.data.list[16].weather[0].id),
					getWeatherGroup(res.data.list[24].weather[0].id),
					getWeatherGroup(res.data.list[32].weather[0].id),
				],
                description: [
					res.data.list[0].weather[0].description,
					res.data.list[8].weather[0].description,
					res.data.list[16].weather[0].description,
					res.data.list[24].weather[0].description,
					res.data.list[32].weather[0].description
				],
                temp: [
					res.data.list[0].main.temp,
					res.data.list[8].main.temp,
					res.data.list[16].main.temp,
					res.data.list[24].main.temp,
					res.data.list[32].main.temp
				],
                unit: unit, // or 'imperial'
				markers: [{
					position: {
						lat: res.data.city.coord.lat,
						lng: res.data.city.coord.lon
					}
				}]
            };
        }
    }).catch(function(err) {
        if (axios.isCancel(err)) {
            console.error(err.message, err);
        } else {
            throw err;
        }
    });
}

export function cancelForecast() {
    weatherSource.cancel('Request canceled');
}
