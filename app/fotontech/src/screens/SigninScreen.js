import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  Title,
  TextInput,
  Snackbar,
  Text
} from "react-native-paper";
import api from "../services/api";
import { useDispatch } from "react-redux";
import reducers from "../constants/reducers";
import { AsyncStorage } from "react-native";

export default function SignIn({ navigation }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  async function handleLogin() {
    setLoading(true);
    try {
      if (email.length > 3 && password.length >= 8) {
        const response = await api.post("/authenticate", { email, password });

        if (response.data.token && response.data.profile) {
          await AsyncStorage.setItem(
            "user",
            JSON.stringify({
              user: response.data.profile,
              token: response.data.token
            })
          );
          dispatch({
            type: reducers.user.signIn,
            user: response.data.profile,
            token: response.data.token
          });
          navigation.navigate("ProductList");
        }

        setLoading(false);
      } else {
        setSnackVisible(true);
        setSnackMessage(`Please, insert a valid email and password.`);
        setLoading(false);
      }
    } catch (e) {
      alert(e);
      setLoading(false);
    }
  }

  useEffect(() => {
    async function getSession() {
      const session = JSON.parse(await AsyncStorage.getItem("user"));
      if (session) {
        dispatch({
          type: reducers.user.signIn,
          user: session.user,
          token: session.token
        });
        navigation.navigate("ProductList");
      }
    }

    getSession();
  }, []);

  return (
    <Card elevation={0}>
      <Card.Title
        title="SignIn"
        left={props => <Avatar.Icon {...props} icon="lock" />}
      />
      <Card.Content>
        <Title>Email</Title>
        <TextInput
          label="Email"
          value={email}
          mode="outlined"
          onChangeText={text => setEmail(text)}
        />
        <Title>Password</Title>
        <TextInput
          label="Password"
          value={password}
          mode="outlined"
          secureTextEntry
          onChangeText={text => setPassword(text)}
        />
      </Card.Content>

      <Card.Actions
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 15
        }}
      >
        <Button
          dark
          mode="contained"
          icon="verified-user"
          color="gray"
          onPress={() => navigation.navigate("SignUp")}
        >
          Sign Up
        </Button>
        <Button
          dark
          mode="contained"
          loading={loading}
          icon="input"
          onPress={handleLogin}
        >
          Sign In
        </Button>
      </Card.Actions>
      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        duration={2000}
        style={{ backgroundColor: "#ab361c" }}
      >
        <Text style={{ color: "white" }}>{snackMessage}</Text>
      </Snackbar>
    </Card>
  );
}
