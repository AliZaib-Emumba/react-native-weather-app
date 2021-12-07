import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showToast, getAverageData, getFormattedLineData } from "../utils";
import { getDatawithZipCode, getDatawithCityName } from "../actions";
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
export type LineData = {
    labels: string[],
    datasets: { data: number[], strokeWidth: number }[]
}

type InitialState = {
    open: boolean,
    data: ListData[],
    celsiusData: ListData[],
    fahrenheitData: ListData[],
    currentUnit: string,
    city: string,
    isEnabled: boolean,
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
    lineData: { labels: ['', '', '', '', '', ''], datasets: [{ data: [0, 0, 0, 0, 0, 0], strokeWidth: 2, },], },
    isLoading: false

}

export const fetchByZipCode = createAsyncThunk(
    'data/fetchUsingZipCode',
    async (zipCode: string) => {
        try {
            const response = await getDatawithZipCode(zipCode)
            return response;
        }
        catch (err) {
            throw err;
        }
    }
);

export const fetchByCityName = createAsyncThunk(
    'data/fetchUsingCityName',
    async (cityName: string) => {
        try {
            const response = await getDatawithCityName(cityName);
            return response;
        }
        catch (err) {
            throw err;
        }
    }
);

export const dataSlice = createSlice({
    name: "data",
    initialState,
    reducers: {
        setOpen: (state, action) => {
            return { ...state, open: action.payload.open }
        },
        setData: (state, action) => {
            return { ...state, data: action.payload.data }
        },
        setTemperatureData: (state, action) => {
            return { ...state, fahrenheitData: action.payload.fahrenheit, celsiusData: action.payload.celsius };
        },
        setUnit: (state, action) => {
            return { ...state, currentUnit: action.payload.currentUnit }
        },
        setCity: (state, action) => {
            return { ...state, city: action.payload.city }
        },
        setEnabled: (state, action) => {
            return { ...state, isEnabled: action.payload.enabled }
        },
        setLineData: (state, action) => {
            return { ...state, lineData: action.payload.data }
        },
        setLoading: (state, action) => {
            return { ...state, isLoading: action.payload.loading }
        },
        setResponse: (state, action) => {
            return {
                ...state,
                data: action.payload.data,
                lineData: action.payload.lineData,
                city: action.payload.city,
                isLoading: action.payload.loading,
                fahrenheitData: action.payload.fahrenheit,
                celsiusData: action.payload.celsius,
                currentUnit: action.payload.currentUnit
            }
        },
        changeTempUnit: (state, action) => {
            return {
                ...state,
                data: action.payload.data,
                lineData: action.payload.lineData,
                currentUnit: action.payload.currentUnit,
                isEnabled: action.payload.enabled
            }
        }
    },
    // middleware 
    extraReducers: (builder) => {
        builder.addCase(fetchByZipCode.fulfilled, (state, action) => {
            let response = action.payload;
            let celsiusList = getAverageData(response[0].list);
            let fahrenheiList = getAverageData(response[1].list);
            if (state.isEnabled) {
                return {
                    ...state, data: celsiusList,
                    lineData: getFormattedLineData(celsiusList),
                    city: response[0].city.name,
                    isLoading: false,
                    celsiusData: celsiusList,
                    fahrenheitData: fahrenheiList,
                    currentUnit: state.isEnabled ? "metric" : "imperial"
                }
            }
            else {
                return {
                    ...state,
                    data: fahrenheiList,
                    lineData: getFormattedLineData(fahrenheiList),
                    city: response[0].city.name,
                    isLoading: false,
                    celsiusData: celsiusList,
                    fahrenheitData: fahrenheiList,
                    currentUnit: state.isEnabled ? "metric" : "imperial"
                }
            }
        }),
            builder.addCase(fetchByZipCode.rejected, (state, action) => {
                if (action.error.message === "404") {
                    showToast("No such zipcode exist");
                }
                else {
                    showToast("Something went wrong, try agian")
                }
                return { ...state, isLoading: false }
            }),
            builder.addCase(fetchByZipCode.pending, (state, action) => {
                return { ...state, isLoading: true }

            }),
            builder.addCase(fetchByCityName.pending, (state, action) => {
                return { ...state, isLoading: true }
            }),
            builder.addCase(fetchByCityName.fulfilled, (state, action) => {
                let response = action.payload;
                let celsiusList = getAverageData(response[0].list);
                let fahrenheiList = getAverageData(response[1].list);
                if (state.isEnabled) {
                    return {
                        ...state, data: celsiusList
                        , lineData: getFormattedLineData(celsiusList),
                        city: response[0].city.name,
                        isLoading: false,
                        celsiusData: celsiusList,
                        fahrenheitData: fahrenheiList,
                        currentUnit: state.isEnabled ? "metric" : "imperial"
                    }
                }
                else {
                    return {
                        ...state,
                        data: fahrenheiList,
                        lineData: getFormattedLineData(fahrenheiList),
                        city: response[0].city.name,
                        isLoading: false,
                        celsiusData: celsiusList,
                        fahrenheitData: fahrenheiList,
                        currentUnit: state.isEnabled ? "metric" : "imperial"
                    }
                }
            }),
            builder.addCase(fetchByCityName.rejected, (state, action) => {
                if (action.error.message === "404") {
                    showToast("No such city name found");
                }
                else {
                    showToast("Something went wrong, try agian")
                }
                return { ...state, isLoading: false }
            })
    }
});

export const { setOpen, setData, setTemperatureData, setUnit, setCity, setEnabled, setLineData, setLoading, setResponse, changeTempUnit } = dataSlice.actions;

export const selectData = (state: { data: InitialState }) => state.data;




export default dataSlice.reducer;