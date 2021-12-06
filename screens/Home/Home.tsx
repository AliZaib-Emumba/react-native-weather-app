import React, { useState, useRef, useReducer, useEffect, useCallback } from "react";
import { FlatList, Text, Dimensions, ScrollView, TouchableOpacity, Switch, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Container, Heading, SwitchBox, SwitchLabel, Form, SelectBox, TextInput, FormikContainer, Label, SelectContainer, ErrorText, FormView, ButtonView, Button, CardView, ChartView, City, CityLabel, CityName } from "./Home.styles";
import { If, Then, Else } from "react-if";
import { Formik } from "formik";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getFormattedLineData, getAverageData, showToast } from "../../utils";
import { LineChart } from "react-native-chart-kit";
import { getDatawithCityName, getDatawithZipCode } from "../../actions";
import { reducer, initialState } from "../../Reducer";
import { getDefaultMiddleware } from "@reduxjs/toolkit";
import { zipCodeValdiationSchema, cityNameValdiationSchema } from "../../validationSchema/validation";
import { Options, FormValues, ListData, LineData } from "./types";
import RenderItem from "./components/ListCard";
import { Picker } from "@react-native-picker/picker";
import { debounce } from "lodash";
import { useDispatch , useSelector } from "react-redux";
import { selectData , setLoading, setResponse , changeTempUnit, setEnabled , fetchByZipCode ,fetchByCityName } from "../../redux/dataSlice";
const Home: React.FC = () => {
    const [value, setValue] = useState("zip")
    const [input, setInput] = useState("");
    const formikRef = useRef<any>();
    const dispatch = useDispatch() ;
    const selector = useSelector(selectData)

    useEffect(() => {
        formikRef.current?.resetForm();
    }, [value]);

    const toggleSwitch = () => {
        dispatch(setEnabled({enabled: !selector.isEnabled }));
    }

    const handleCityNameSubmit = (values: string) => {
        dispatch(fetchByCityName(values))
        /* dispatch(setLoading({loading: true }))
        getDatawithCityName(values)
            .then(res => {
                let celsiusList  = getAverageData(res[0].list) ;
                let fahrenheitList  = getAverageData(res[1].list) ;
                if (selector.isEnabled) {
                    dispatch(setResponse({data: celsiusList , lineData:getFormattedLineData(celsiusList), city: res[0].city.name, loading: false , celsius: celsiusList, fahrenheit: fahrenheitList, currentUnit: selector.isEnabled ? "metric" : "imperial" }))
                }
                else {
                    dispatch(setResponse({data: fahrenheitList , lineData:getFormattedLineData(fahrenheitList), city: res[0].city.name, loading: false , celsius: celsiusList, fahrenheit: fahrenheitList, currentUnit: selector.isEnabled ? "metric" : "imperial" }))
                }
            })
            .catch(err => {
                dispatch(setLoading({loading: false }))
                if (err.response?.status === 404) {
                    showToast("No such city name found");
                }
                else {
                    showToast("Something went wrong, try again");
                }
            }) */
    }

    const handleZipCodeSubmit = (values: FormValues) => {
        Keyboard.dismiss();
        dispatch(fetchByZipCode(values.input));
        /* getDatawithZipCode(values.input)
            .then(res => {
                let celsiusList  = getAverageData(res[0].list) ;
                let fahrenheitList  = getAverageData(res[1].list) ;
                if (selector.isEnabled) {
                    dispatch(setResponse({data: celsiusList , lineData:getFormattedLineData(celsiusList), city: res[0].city.name, loading: false , celsius: celsiusList, fahrenheit: fahrenheitList, currentUnit: selector.isEnabled ? "metric" : "imperial" }))
                }
                else {
                    dispatch(setResponse({data: fahrenheitList , lineData:getFormattedLineData(fahrenheitList), city: res[0].city.name, loading: false , celsius: celsiusList, fahrenheit: fahrenheitList, currentUnit: selector.isEnabled ? "metric" : "imperial" }))
                }
            })
            .catch(err => {
                dispatch(setLoading({loading: false }))
                if (err.response?.status === 404) {
                    showToast("No such Zip code exist");
                }
                else {
                    console.log(err)
                    showToast("Something went wrong, try again");
                }

            }) */
    }

    const changeUnit = (): void => {
        let listData: ListData[]
        if (selector.currentUnit === "imperial") {
            listData = selector.celsiusData;
            dispatch(changeTempUnit({data: listData, lineData: getFormattedLineData(listData), currentUnit: 'metric', enabled: true }))
        }
        else {
            listData = selector.fahrenheitData;
            dispatch(changeTempUnit({data: listData, lineData: getFormattedLineData(listData), currentUnit: 'imperial', enabled: false }))
        }
    }

    const delayedQuery = useCallback(debounce(handleCityNameSubmit, 500), [input])

    useEffect(() => {
        if (input) {
            delayedQuery(input);

            // Cancel previous debounce calls during useEffect cleanup.
            return delayedQuery.cancel;
        }
    }, [delayedQuery]);

    return (
        <Container>
            <Heading>Weather App</Heading>
            <SelectContainer>
                <If condition={value === null}>
                    <Then>
                        <Label>Select an option to search from</Label>
                    </Then>
                    <Else>
                        <If condition={value === "zip"}>
                            <Then>
                                <Label>Enter zip code</Label>
                            </Then>
                            <Else>
                                <Label>Enter your city name</Label>
                            </Else>
                        </If>
                        <SwitchBox>
                            <SwitchLabel>Fahrenheit</SwitchLabel>
                            <Switch
                                trackColor={{ false: "#889BB8", true: "#889BB8" }}
                                thumbColor={selector.isEnabled ? "#D0CFCF" : "#D0CFCF"}
                                ios_backgroundColor="#3e3e3e"
                                value={selector.isEnabled}
                                onValueChange={toggleSwitch}
                            />
                            <SwitchLabel>Celsius</SwitchLabel>
                        </SwitchBox>
                    </Else>
                </If>
                <Form>
                    <Formik
                        innerRef={formikRef}
                        validationSchema={value === "zip" ? zipCodeValdiationSchema : cityNameValdiationSchema}
                        initialValues={{ input: "" }}
                        onSubmit={(values) => {
                            handleZipCodeSubmit(values)
                        }}
                    >
                        {({ handleSubmit, handleChange, handleBlur, values, touched, isValid, errors, setFieldValue }) => (
                            <FormView>

                                <FormikContainer>
                                    <TextInput
                                        name="input"
                                        placeholder={value === "zip" ? "e.g. 46000" : "e.g. Rawalpindi"}
                                        /* onChangeText={handleChange('input')} */
                                        onChangeText={value === "zip" ? handleChange("input") : (text: string) => {
                                            setFieldValue('input', text);
                                            setInput(text)
                                        }}
                                        onBlur={handleBlur('input')}
                                        value={values.input}
                                        type={value === 'zip' ? 'zip' : 'city'}
                                    />
                                    <If condition={value === 'zip'}>
                                        <Then>
                                            <TouchableOpacity disabled={!isValid} activeOpacity={0.7} onPress={handleSubmit} ><Ionicons name={"search-circle"} size={40} color={"#889BB8"} /></TouchableOpacity>
                                        </Then>
                                    </If>
                                </FormikContainer>

                                <If condition={errors.input && touched.input}>
                                    <Then>
                                        <ErrorText>{errors.input}</ErrorText>
                                    </Then>
                                </If>
                            </FormView>
                        )}
                    </Formik>
                    <SelectBox>
                        <Picker
                            selectedValue={value}
                            onValueChange={(item) => setValue(item)}
                        >
                            <Picker.Item label="Zip code" value="zip" />
                            <Picker.Item label="City name" value="city" />

                        </Picker>
                    </SelectBox>
                </Form>
            </SelectContainer>
            <If condition={selector.isLoading}>
                <Then>
                    <ActivityIndicator size="large" animating={selector.isLoading} />
                </Then>
            </If>
            <If condition={selector.data.length > 0}>
                <Then>
                    <ScrollView>
                        <City>
                            <CityLabel>Area: <CityName>{selector.city}</CityName></CityLabel>
                        </City>
                        <ButtonView>
                            <Button activeOpacity={0.7} onPress={changeUnit}><Text style={{ color: "white" }}>Convert to {selector.currentUnit === "imperial" ? "Celsius" : "Fahrenheit"}</Text></Button>
                        </ButtonView>
                        <CardView>
                            <FlatList horizontal={true} data={selector.data} renderItem={({ item }) => <RenderItem item={item} currentUnit={selector.currentUnit} />} />
                        </CardView>
                        <ChartView>
                            <If condition={!!selector.lineData}>
                                <Then>
                                    <LineChart
                                        data={selector.lineData}
                                        width={Dimensions.get('window').width - 20} // from react-native
                                        height={220}
                                        yAxisSuffix={selector.currentUnit === "metric" ? " °C" : " °F"}
                                        chartConfig={{
                                            backgroundGradientFrom: '#889BB8',
                                            backgroundGradientTo: '#889BB8',
                                            decimalPlaces: 2, // optional, defaults to 2dp
                                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                            style: {
                                                borderRadius: 16
                                            }
                                        }}
                                        bezier
                                        style={{
                                            marginVertical: 8,
                                            borderRadius: 16.,

                                        }}
                                    />
                                </Then>
                            </If>
                        </ChartView>
                    </ScrollView>
                </Then>


            </If>

        </Container>
    )
}

export default Home;