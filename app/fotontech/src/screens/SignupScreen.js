import React, { useState } from "react";
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
import reducers from "../constants/reducers";
import { useDispatch } from "react-redux";

export default function SignUp({ navigation }) {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  async function handleSignUp() {
    try {
      setLoading(true);
      if (email.length > 3 && password.length >= 8 && name.length >= 2) {
        const response = await api.post("/register", { name, email, password });

        if (response.data.profile && response.data.token) {
          dispatch({
            type: reducers.user.signUp,
            user: response.data.profile,
            token: response.data.token
          });
          navigation.navigate("ProductList");
        }

        setLoading(false);
      } else {
        setSnackVisible(true);
        setSnackMessage(`Please, insert valid informations.`);
        setLoading(false);
      }
    } catch (e) {
      alert(e);
    }
  }

  return (
    <Card elevation={0}>
      <Card.Title
        title="SignUp"
        left={props => <Avatar.Icon {...props} icon="lock" />}
      />
      <Card.Content>
        <Title>Name</Title>
        <TextInput
          label="Name"
          value={name}
          mode="outlined"
          onChangeText={text => setName(text)}
        />
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
          secureTextEntry
          mode="outlined"
          onChangeText={text => setPassword(text)}
        />
      </Card.Content>

      <Card.Actions
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: 15
        }}
      >
        <Button
          dark
          mode="contained"
          loading={loading}
          icon="input"
          onPress={handleSignUp}
        >
          Cadastrar
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
