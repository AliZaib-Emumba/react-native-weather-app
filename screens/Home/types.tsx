export type Options = {
    label: string,
    value: string
}

export type FormValues = {
    input: string,
}

export type ListData = {
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
export type LineData = {
    labels: string[],
    datasets: { data: number[], strokeWidth: number }[]
}

//reducer
export type InitialState = {
    open:boolean,
    data: ListData[],
    currentUnit: string,
    city:string,
    isEnabled:boolean
}
