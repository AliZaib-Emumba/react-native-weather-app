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
            state.open = action.payload.open
        },
        setData: (state, action) => {
            state.data = action.payload.data
        },
        setTemperatureData: (state, action) => {
            state.fahrenheitData = action.payload.fahrenheit;
            state.celsiusData = action.payload.celsius
        },
        setUnit: (state, action) => {
            state.currentUnit = action.payload.currentUnit
        },
        setCity: (state, action) => {
            state.city = action.payload.city
        },
        setEnabled: (state, action) => {
            state.isEnabled = action.payload.enabled;
        },
        setLineData: (state, action) => {
            state.lineData = action.payload.data
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload.loading
        },
        setResponse: (state, action) => {
            state.data = action.payload.data;
            state.lineData = action.payload.lineData;
            state.city = action.payload.city;
            state.isLoading = action.payload.loading;
            state.fahrenheitData = action.payload.fahrenheit;
            state.celsiusData = action.payload.celsius;
            state.currentUnit = action.payload.currentUnit
        },
        changeTempUnit: (state, action) => {
            state.data = action.payload.data;
            state.lineData = action.payload.lineData;
            state.currentUnit = action.payload.currentUnit;
            state.isEnabled = action.payload.enabled
        }
    },
     // middleware 
    extraReducers: (builder) => {
        builder.addCase(fetchByZipCode.fulfilled, (state, action) => {
            let response = action.payload;
            let celsiusList = getAverageData(response[0].list);
            let fahrenheiList = getAverageData(response[1].list);
            if (state.isEnabled) {
                state.data = celsiusList;
                state.lineData = getFormattedLineData(celsiusList);
                state.city = response[0].city.name;
                state.isLoading = false;
                state.celsiusData = celsiusList;
                state.fahrenheitData = fahrenheiList;
                state.currentUnit = state.isEnabled ? "metric" : "imperial"
            }
            else {
                state.data = fahrenheiList;
                state.lineData = getFormattedLineData(fahrenheiList);
                state.city = response[0].city.name;
                state.isLoading = false;
                state.celsiusData = celsiusList;
                state.fahrenheitData = fahrenheiList;
                state.currentUnit = state.isEnabled ? "metric" : "imperial"
            }
        }),
            builder.addCase(fetchByZipCode.rejected, (state, action) => {
                if (action.error.message === "404") {
                    state.isLoading = false;
                    showToast("No such zipcode exist");
                }
                else {
                    state.isLoading = false;
                    showToast("Something went wrong, try agian")
                }
            }),
            builder.addCase(fetchByZipCode.pending, (state, action) => {
                state.isLoading = true;
            }),
            builder.addCase(fetchByCityName.pending, (state, action) => {
                state.isLoading = true;
            }),
            builder.addCase(fetchByCityName.fulfilled, (state, action) => {
                let response = action.payload;
                let celsiusList = getAverageData(response[0].list);
                let fahrenheiList = getAverageData(response[1].list);
                if (state.isEnabled) {
                    state.data = celsiusList;
                    state.lineData = getFormattedLineData(celsiusList);
                    state.city = response[0].city.name;
                    state.isLoading = false;
                    state.celsiusData = celsiusList;
                    state.fahrenheitData = fahrenheiList;
                    state.currentUnit = state.isEnabled ? "metric" : "imperial"
                }
                else {
                    state.data = fahrenheiList;
                    state.lineData = getFormattedLineData(fahrenheiList);
                    state.city = response[0].city.name;
                    state.isLoading = false;
                    state.celsiusData = celsiusList;
                    state.fahrenheitData = fahrenheiList;
                    state.currentUnit = state.isEnabled ? "metric" : "imperial"
                }
            }),
            builder.addCase(fetchByCityName.rejected, (state, action) => {
                if (action.error.message === "404") {
                    state.isLoading = false;
                    showToast("No such city name found");
                }
                else {
                    state.isLoading = false;
                    showToast("Something went wrong, try agian")
                }
            })
    }
});

export const { setOpen, setData, setTemperatureData, setUnit, setCity, setEnabled, setLineData, setLoading, setResponse, changeTempUnit } = dataSlice.actions;

export const selectData = (state: { data: InitialState }) => state.data;




export default dataSlice.reducer;