import axios from "axios";
import {showToast} from "./utils/index" ; 
type ListData = {
    clouds: { all: number },
    dt: number,
    dt_txt: string,
    pop: number,
    sys: { pod: string },
    visibility: number,
    weather: { id: number, main: string, description: string, icon: string }[],
    wind: { speed: number, deg: number, gust: number },
    main: { feels_like: number, grnd_level: string, humidity: string, pressure: string, sea_level: string, temp: number, temp_kf: string, temp_max: string, temp_min: string }
}

type City = {
    id: number,
    name: string,
    coord: { lat: number, lon: number },
    country: string,
    population: number,
    timezone: number,
    sinrise: number
}

const axiosClient = axios.create({
    baseURL: `https://api.openweathermap.org/data/2.5/forecast`,

    params: {
        "appid": "b39afe17e29959ddb7fe843a7ebbdff1"
    }
});

type Response = {
    cod: string,
    message: number,
    cnt: number,
    list: ListData[],
    city: City
}

export const getDatawithZipCode = (zipcode: string): Promise<Response[]> => {
    const celsius = axiosClient.get<Response>(`?zip=${zipcode + ",pk"}&units=metric`).then(res => res.data).catch(err => { throw err.response.status });
    const fahrenheit = axiosClient.get<Response>(`?zip=${zipcode + ",pk"}&units=imperial`).then(res => res.data).catch(err => { throw err.response.status });
    return Promise.all([celsius, fahrenheit])
        .then(values => values)
        .catch(err => { throw err })

}

export const getDatawithCityName = (city: string): Promise<Response[]> => {
    const celsius = axiosClient.get<Response>(`?q=${city}&units=metric`).then(res => res.data).catch(err => { throw err.response.status });;
    const fahrenheit = axiosClient.get<Response>(`?q=${city}&units=imperial`).then(res => res.data).catch(err => { throw err.response.status });
    return Promise.all([celsius, fahrenheit])
        .then(values => values)
        .catch(err => { throw err })
}