type ListData = {
    clouds: { all: number },
    dt: number,
    dt_txt: string,
    pop: number,
    sys: { pod: string },
    visibility: number,
    weather: { id: number, main: string, description: string, icon: string }[],
    wind: { speed: number, deg: number, gust: number },
    main: { feels_like: string, grnd_level: string, humidity: string, pressure: string, sea_level: string, temp: string, temp_kf: string, temp_max: string, temp_min: string }
}
export type LineData = {
    labels: string[],
    datasets: { data: number[], strokeWidth: number }[]
}

type InitialState = {
    open:boolean,
    data: ListData[],
    celsiusData: ListData[],
    fahrenheitData: ListData[],
    currentUnit: string,
    city:string,
    isEnabled:boolean,
    lineData: LineData,
    isLoading: boolean,
}


export const initialState: InitialState = {
    open: false,
    data: [],
    celsiusData: [],
    fahrenheitData: [],
    currentUnit: "imperial",
    city: "",
    isEnabled: false,
    lineData: {labels: ['', '', '', '', '', ''],datasets: [{data: [0, 0, 0, 0, 0, 0],strokeWidth: 2, },],},
    isLoading: false

}

export function reducer(state: InitialState,action:any):InitialState{
    switch(action.type){
        case "setOpen":
            return {...state , open:action.open} ;
        case "setData":
            return {...state , data:action.data}
        case "setTemperatureData":
            return {...state , fahrenheitData:action.fahrenheit , celsiusData: action.celsius }
        case "setUnit":
            return {...state , currentUnit:action.currentUnit}
        case "setCity":
            return {...state , city:action.city}
        case "setEnabled":
            return {...state , isEnabled:action.enabled}
        case "setLineData":
            return {...state , lineData:action.data}
        case "setLoading":
            return {...state , isLoading:action.loading}
        case "setFilterData":
            return {...state , data:action.data , lineData: action.lineData}
        case "setResponse":
            return {...state , city:action.city , isLoading: action.loading , fahrenheitData:action.fahrenheit , celsiusData: action.celsius , currentUnit:action.currentUnit}
        case "changeUnit":
            return {...state , data:action.data , lineData: action.lineData, currentUnit: action.currentUnit, isEnabled: action.enabled}
        default: 
            throw new Error();
    }
}