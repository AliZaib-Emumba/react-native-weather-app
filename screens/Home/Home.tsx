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
import { zipCodeValdiationSchema, cityNameValdiationSchema } from "../../validationSchema/validation";
import { Options, FormValues, ListData, LineData } from "./types";
import RenderItem from "./components/ListCard";
import { Picker } from "@react-native-picker/picker";
import { debounce } from "lodash";

const Home: React.FC = () => {
    const [value, setValue] = useState("zip")
    const [state, dispatch] = useReducer(reducer, initialState);
    const [input, setInput] = useState("");
    const formikRef = useRef<any>();
    
    useEffect(() => {
        formikRef.current?.resetForm();
    }, [value]);
    
    
    const toggleSwitch = () => {
        dispatch({ type: "setEnabled", enabled: !state.isEnabled });
    }

    const filterData = (list: ListData[]) => {
        let returnData = getAverageData(list) ;
        dispatch({type:"setFilterData" , data: returnData , lineData:getFormattedLineData(returnData)})
    }

    const handleCityNameSubmit = (values: string) => {
        dispatch({ type: "setLoading", loading: true })
        getDatawithCityName(values)
            .then(res => {
                dispatch({type:"setResponse" , city: res[0].city.name, loading: false , celsius: getAverageData(res[0].list), fahrenheit: getAverageData(res[1].list), currentUnit: state.isEnabled ? "metric" : "imperial" })
                if (state.isEnabled) {
                    filterData(res[0].list)
                }
                else {
                    filterData(res[1].list)
                }
            })
            .catch(err => {
                dispatch({ type: "setLoading", loading: false })
                if (err.response?.status === 404) {
                    showToast("No such city name found");
                }
                else {
                    showToast("Something went wrong, try again");
                }
            })
    }

    const handleZipCodeSubmit = (values: FormValues) => {
        Keyboard.dismiss();
        dispatch({ type: "setLoading", loading: true })
        getDatawithZipCode(values.input)
            .then(res => {
                formikRef.current?.resetForm({ input: "" });
                dispatch({type:"setResponse" , city: res[0].city.name, loading: false , celsius: getAverageData(res[0].list), fahrenheit: getAverageData(res[1].list), currentUnit: state.isEnabled ? "metric" : "imperial" })
                if (state.isEnabled) {
                    filterData(res[0].list)
                }
                else {
                    filterData(res[1].list)
                }
            })
            .catch(err => {
                dispatch({ type: "setLoading", loading: false })
                if (err.response?.status === 404) {
                    showToast("No such Zip code exist");
                }
                else {
                    showToast("Something went wrong, try again");
                }

            })
    }

    const changeUnit = (): void => {
        let listData: ListData[]
        if (state.currentUnit === "imperial") {
            listData = state.celsiusData;
            dispatch({ type: "changeUnit", data: listData, lineData: getFormattedLineData(listData), currentUnit: 'metric', enabled: true })
        }
        else {
            listData = state.fahrenheitData;
            dispatch({ type: "changeUnit", data: listData, lineData: getFormattedLineData(listData), currentUnit: 'imperial', enabled: false })
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
                                thumbColor={state.isEnabled ? "#D0CFCF" : "#D0CFCF"}
                                ios_backgroundColor="#3e3e3e"
                                value={state.isEnabled}
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
            <If condition={state.isLoading}>
                <Then>
                    <ActivityIndicator size="large" animating={state.isLoading} />
                </Then>
            </If>
            <If condition={state.data.length > 0}>
                <Then>
                    <ScrollView>
                        <City>
                            <CityLabel>Area: <CityName>{state.city}</CityName></CityLabel>
                        </City>
                        <ButtonView>
                            <Button activeOpacity={0.7} onPress={changeUnit}><Text style={{ color: "white" }}>Convert to {state.currentUnit === "imperial" ? "Celsius" : "Fahrenheit"}</Text></Button>
                        </ButtonView>
                        <CardView>
                            <FlatList horizontal={true} data={state.data} renderItem={({ item }) => <RenderItem item={item} currentUnit={state.currentUnit} />} />
                        </CardView>
                        <ChartView>
                            <If condition={!!state.lineData}>
                                <Then>
                                    <LineChart
                                        data={state.lineData}
                                        width={Dimensions.get('window').width - 20} // from react-native
                                        height={220}
                                        yAxisSuffix={state.currentUnit === "metric" ? " °C" : " °F"}
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