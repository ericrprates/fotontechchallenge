import ProductList from "./screens/ProductList";
import ProductForm from "./screens/ProductForm";
import SignIn from "./screens/SigninScreen";
import SignUp from "./screens/SignupScreen";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

const AppNavigator = createStackNavigator(
  {
    SignIn: {
      screen: SignIn,
      navigationOptions: ({ navigation }) => ({
        headerLeft: null
      })
    },
    SignUp: {
      screen: SignUp
    },
    ProductList: {
      screen: ProductList
    },
    ProductForm: {
      screen: ProductForm
    }
  },
  {
    initialRouteName: "SignIn",
    defaultNavigationOptions: {
      title: "FotonTechChallenge"
    }
  }
);

export default createAppContainer(AppNavigator);
