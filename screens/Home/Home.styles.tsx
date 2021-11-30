import styled from "styled-components/native" ;

export const Container = styled.View({
    flex:1,
    alignItems: "center",
    paddingTop:10
}) ;

export const Heading = styled.Text({
    fontSize: 24,
    color: "#889BB8",
    fontWeight: "bold"

})

export const SwitchBox = styled.View({
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
})

export const SwitchLabel = styled.Text({
    color: "gray",
    fontSize: 14,
    fontWeight: "bold"
})

export const Form = styled.View({
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    position: "relative" , 

})
export const SelectBox = styled.View({
    width: "43%",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
})
export const Image = styled.Image({
    width: 55, height: 55,
})
type TextField = {
    name: string,
    placeholder: string,
    onChangeText: any,
    onBlur: any,
    value: string,
    keyboardType?: string
    type: string
    onChange?: any,
}
export const TextInput = styled.TextInput<TextField>(props => ({
    fontSize: 16,
    paddingLeft: 4,
    paddingVertical: 13
}))

export const FormikContainer = styled.View({

    backgroundColor: "white",
    paddingLeft: 8,
    marginRight: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 7,
    borderColor: "gray",
    borderWidth: 1,


})

export const Label = styled.Text({
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
})

export const SelectContainer = styled.View({
    marginTop: 24,
    padding: 8,

})
export const ErrorText = styled.Text({
    fontSize: 10,
    color: "red",
    marginTop: 8

})

export const FormView = styled.View({
    flex: 1,
})
export const ButtonView = styled.View({
    width: "100%",
    alignItems: "flex-start",
    padding: 12
})
export const Button = styled.TouchableOpacity({
    backgroundColor: "#889BB8",
    borderRadius: 5,
    padding: 4
})
export const Card = styled.View({
    elevation: '5',
    borderRadius: 12,
    width: 120,
    height: 150,
    backgroundColor: "#889BB8",
    margin: 12,
    justifyContent: "center",
    alignItems: "center",

})

export const Temperature = styled.Text({
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
})

export const Description = styled.Text({
    fontSize: 14,
    color: "white",
    fontWeight: "400"
})

export const CardText = styled.Text({
    marginTop: 4,
    fontSize: 12,
    color: "white",
    fontWeight: "400"
})
export const CardDate = styled.Text({
    marginTop: -8,
    fontSize: 12,
    color: "#E5DCD4",
    fontWeight: "bold"
})

export const CardView = styled.View({
    flexDirection: "row",
    paddingVertical: 24,
})
export const ChartView = styled.View({
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
})
export const City = styled.View({
    width: "100%",
    padding: 12
})
export const CityLabel = styled.Text({
    color: "gray"
})

export const CityName = styled.Text({
    color: "#889BB8",
    fontSize: 16,
    fontWeight: "bold",
})