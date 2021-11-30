import Toast from "react-native-toast-message" ; 

export const showToast = (message:string):void => {
    console.log("Incoming message " + message );
        Toast.show({
        type: 'error',
        text1: '❌  Error',
        text2:  message,
        position: "bottom"
    })
}

//  return the date format
export function formatDate(date: string | undefined): string | undefined {
    if (date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate()

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month].join('-');
    }
}

// return day of the week
export function getDayofWeek(date: string): string {
    if (date) {
        var d = new Date(date),
            day = '' + d.getDay()
        switch (day) {
            case '0':
                return 'Sun';
            case '1':
                return 'Mon';
            case '2':
                return 'Tue';
            case '3':
                return 'Wed';
            case '4':
                return 'Thu';
            case '5':
                return 'Fri';
            case '6':
                return 'Sat';
            default:
                return "";
        }
    }
    return "";
}


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
type LineData = {
    labels: string[],
    datasets: { data: number[], strokeWidth: number }[]
}


export function getFormattedLineData(list: ListData[]): LineData {
    let labels: string[] = [];
    let data: number[] = [];
    list.forEach(item => {
        labels.push(getDayofWeek(item.dt_txt));
        data.push(+item.main.temp);
    })
    return {
        labels: labels,
        datasets: [{ data: data, strokeWidth: 2 }]
    }
}
const convertToCelsius = (temp: string):string => {
    let val =  (.5556)*(+temp-32);
    return (Math.round((val + Number.EPSILON) * 100) / 100)+"";
}
const convertToFahrenheit = (temp: string):string => {
    let val =  (+temp * 9/5) + 32;
    return (Math.round((val + Number.EPSILON) * 100) / 100)+"";
}

export function getListInCelsius(list: ListData[]) {
    let returnList = list;
    returnList.forEach((item , index) => {
        console.log("Index is here" , index)
        returnList[index].main.temp =  convertToCelsius(item.main.temp) ;
        returnList[index].main.feels_like = convertToCelsius(item.main.feels_like);
    });
    return  list ;
}
export function getListInFahrnheit(list: ListData[]) {
    let returnList = list;
    returnList.map((item , index) => {
        console.log("Index is here" , index)
        returnList[index].main.temp =  convertToFahrenheit(item.main.temp) ;
        returnList[index].main.feels_like = convertToFahrenheit(item.main.feels_like);
    })

    return  returnList ;
}


export const  getAverageData = (list: ListData[]): ListData[] => {
    let setsList: ListData[][] = [];
    let FinaList: ListData[] = [];
    let iterableList: ListData[] = list;
    for (let i = 0; i < iterableList.length; i++) {
        if (iterableList.length > 0) {
            let j = i + 1;
            while (j < iterableList.length && iterableList[i].dt_txt.substring(0, 10) === iterableList[j].dt_txt.substring(0, 10)) {
                j++;
            }
            setsList.push(iterableList.slice(i, j));
            iterableList = iterableList.filter((item: ListData, index: number) => index >= j);
            i = -1;

        }
        else {
            break;
        }
    }
    setsList.forEach(item => {
        let temperatureSum = 0, averageTemperature = 0, feelsLikeSum = 0, feelsLikeAverage = 0;
        let averageItem: ListData = item[0];
        for (let i = 0; i < item.length; i++) {
            // console.log("Temperature is ", +item[i].main.temp)
            temperatureSum = temperatureSum + +item[i].main.temp
            feelsLikeSum = feelsLikeSum + +item[i].main.feels_like
        }
        averageTemperature = temperatureSum / item.length;
        // console.log("Average temperature is", averageTemperature, "and temperature sum was", temperatureSum)
        feelsLikeAverage = feelsLikeSum / item.length
        // console.log("Average feels like is", feelsLikeAverage)
        averageItem.main.temp = "" + (Math.round((averageTemperature + Number.EPSILON) * 100) / 100);
        averageItem.main.feels_like = "" + (Math.round((feelsLikeAverage + Number.EPSILON) * 100) / 100)
        FinaList.push(averageItem);
    });
    // console.log("Final List is here", FinaList);
    return FinaList;

}