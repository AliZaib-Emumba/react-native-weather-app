import * as yup from "yup" ; 

export const zipCodeValdiationSchema = yup.object().shape({
    input: yup.string().required("Zip code is required").matches(/^(\d){5}$/, "Invalid Zip code")
}) ; 

export const cityNameValdiationSchema = yup.object().shape({
    input: yup.string().required("City name is required")
})