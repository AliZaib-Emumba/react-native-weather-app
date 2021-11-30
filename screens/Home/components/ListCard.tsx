import React , {useReducer} from "react"
import { ListData } from "../types";
import { Card, Image, CardDate, CardText, Description, Temperature } from "../Home.styles";
import { formatDate } from "../../../utils";
export default function RenderItem({ item , currentUnit }: { item: ListData , currentUnit: string }): JSX.Element {
    return (
        <Card>
            <Image source={{ uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png` }} />
            <CardDate>{formatDate(item.dt_txt)}</CardDate>
            <Temperature>{item.main.temp}°{currentUnit === "imperial" ? "F" : "C"}</Temperature>
            <Description>{item.weather[0].description}</Description>
            <CardText>Feels like: {item.main.feels_like}°F</CardText>
        </Card>
    )
}