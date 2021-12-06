import Toast from "react-native-toast-message";

export const showToast = (message: string): void => {
    Toast.show({
        type: 'error',
        text1: '❌  Error',
        text2: message,
        position: "bottom"
    })
}

//  return the date format
export function formatDate(date: string | undefined): string | undefined {
    if (date) {
        let d = new Date(date.substring(0,10)),
         month = (d.getMonth() + 1)+'',
         day = d.getDate()+''
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
    main: { feels_like: number, grnd_level: string, humidity: string, pressure: string, sea_level: string, temp: number, temp_kf: string, temp_max: string, temp_min: string }
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
const convertToCelsius = (temp: number): number => {
    let val = (.5556) * (+temp - 32);
    return (Math.round((val + Number.EPSILON) * 100) / 100);
}
const convertToFahrenheit = (temp: number): number => {
    let val = (+temp * 9 / 5) + 32;
    return (Math.round((val + Number.EPSILON) * 100) / 100);
}

export function getListInCelsius(list: ListData[]) {
    let returnList = list;
    returnList.forEach((item, index) => {
        returnList[index].main.temp = convertToCelsius(item.main.temp);
        returnList[index].main.feels_like = convertToCelsius(item.main.feels_like);
    });
    return list;
}
export function getListInFahrnheit(list: ListData[]) {
    let returnList = list;
    returnList.map((item, index) => {
        returnList[index].main.temp = convertToFahrenheit(item.main.temp);
        returnList[index].main.feels_like = convertToFahrenheit(item.main.feels_like);
    })

    return returnList;
}

export const getAverageData = (list: ListData[]) => {
    let returnArray: ListData[] = [];
    let startIndex = 0;
    list.map((item, index) => {
        if (list[startIndex].dt_txt.substring(0, 10) !== item.dt_txt.substring(0, 10)) {
            let sum: ListData = list.slice(startIndex, index).reduce(function (prev, current): any {
                let returnItem = prev;
                returnItem.main.temp = prev.main.temp + current.main.temp;
                returnItem.main.feels_like = prev.main.feels_like + current.main.feels_like;
                return returnItem;
            });
            let length = list.slice(startIndex, index).length
            sum.main.temp = Math.round(((sum.main.temp / length) + Number.EPSILON) * 100) / 100;
            sum.main.feels_like = Math.round(((sum.main.feels_like / length) + Number.EPSILON) * 100) / 100;
            startIndex = index;
            returnArray.push(sum);
        }
    }) ; 
    return returnArray
}

/* export const getNewAverage = (list: ListData[]) => {
    let setsList: ListData[][] = [];
    let index = 0 ; 
    let item = list.reduce((prev,curr ,ind)=>{
        console.log("Prev is" , prev ) ;
        console.log("And current is " , curr) ;
        if(prev.dt_txt.substring(0,10) !== curr.dt_txt.substring(0,10)){
            console.log("first array closed at index" , index  + "to" , ind) ;
            setsList.push(list.slice(index,ind)) ;
            index = ind
        }
        else if ((prev.dt_txt.substring(0,10) === curr.dt_txt.substring(0,10)) && ind===list.length-1){
            console.log("first array closed at index" , index  + "to" , ind) ;
            setsList.push(list.slice(index,list.length)) ;
            index = ind
        }
        return curr ;
    });

    console.log("Sets List is here" ,setsList) ;
    console.log("Original list is here" , list) ;
    
    
} */

/* export const getAverageData = (list: ListData[]) => {
    getNewAverage(JSON.parse(JSON.stringify(list))) ;
    let setsList: ListData[][] = [];
    let count = 1
    list.map((item, index) => {
        if (count < list.length && item.dt_txt.substring(0, 10) === list[count].dt_txt.substring(0, 10)) {
            count++;
        }
        else {
            setsList.push(list.slice(0, count));
            list = list.filter((item, i: number) => i >= count);
            count = 1;
        }
    })
    return setsList.map(item => {
        let sum: ListData;
        sum = item.reduce(function (prev: ListData, current: ListData) {
            let returnItem = prev;
            returnItem.main.temp = prev.main.temp + current.main.temp;
            returnItem.main.feels_like = prev.main.feels_like + current.main.feels_like;
            return returnItem;
        })
        sum.main.temp = Math.round(((sum.main.temp / item.length) + Number.EPSILON) * 100) / 100;
        sum.main.feels_like = Math.round(((sum.main.feels_like / item.length) + Number.EPSILON) * 100) / 100;
        let average = sum;
        return average;
    })
} */

/* export const  getAverageData = (list: ListData[]): ListData[] => {
    console.log("Original list is here", list) ;
    getAverageCheck(list) ;
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

}  */