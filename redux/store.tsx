import { configureStore } from "@reduxjs/toolkit";
import {fetchByCityName , fetchByZipCode} from "./dataSlice" ;
import dataSlice from "./dataSlice"; 

export default configureStore({
    reducer:{data: dataSlice},
})