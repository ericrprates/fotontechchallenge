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
import { useDispatch, useSelector } from "react-redux";

export default function ProductForm({ navigation }) {
  const dispatch = useDispatch();
  const token = useSelector(state => state.user.token);
  const [name, setName] = useState(
    navigation.getParam("name") ? navigation.getParam("name") : ""
  );
  const [description, setDescription] = useState(
    navigation.getParam("description") ? navigation.getParam("description") : ""
  );
  const [price, setPrice] = useState(
    navigation.getParam("price") ? navigation.getParam("price").toString() : ""
  );

  const [loading, setLoading] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  async function handleProductDelete() {
    try {
      setLoading(true);
      const response = await api.delete(
        `/products/${navigation.getParam("_id")}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (response.data.success) {
        setSnackVisible(true);
        setSnackMessage(`Product deleted`);
        dispatch({
          type: reducers.products.delete,
          product: { _id: navigation.getParam("_id") }
        });
        navigation.navigate("ProductList", { update: true });
      }
    } catch (e) {
      alert(e);
    }
  }
  async function handleProduct() {
    try {
      setLoading(true);
      if (description.length >= 4 && price.length > 0 && name.length >= 4) {
        const response = navigation.getParam("_id")
          ? await api.patch(
              `/products/${navigation.getParam("_id")}`,
              {
                name,
                description,
                price
              },
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            )
          : await api.post(
              "/products",
              {
                name,
                description,
                price
              },
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );

        if (response.data) {
          setSnackVisible(true);
          setSnackMessage(`Product created`);
          dispatch({
            type: navigation.getParam("_id")
              ? reducers.products.update
              : reducers.products.create,
            product: response.data
          });
          navigation.navigate("ProductList", { update: true });
        }

        setLoading(false);
      } else {
        setSnackVisible(true);
        setSnackMessage(`Please, insert valid informations.`);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      alert(e);
    }
  }

  return (
    <Card elevation={0}>
      <Card.Title
        title={navigation.getParam("_id") ? "Update product" : "New product"}
        left={props => <Avatar.Icon {...props} icon="gamepad" />}
      />
      <Card.Content>
        <Title>Name</Title>
        <TextInput
          label="Name"
          value={name}
          mode="outlined"
          onChangeText={text => setName(text)}
        />
        <Title>Description</Title>
        <TextInput
          label="Description"
          value={description}
          mode="outlined"
          multiline
          rows={4}
          onChangeText={text => setDescription(text)}
        />
        <Title>Price</Title>
        <TextInput
          label="Price"
          value={price}
          keyboardType="numeric"
          mode="outlined"
          onChangeText={text => setPrice(text)}
        />
      </Card.Content>

      <Card.Actions
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 15
        }}
      >
        {navigation.getParam("_id") && (
          <Button
            dark
            mode="contained"
            loading={loading}
            icon="input"
            color="red"
            onPress={handleProductDelete}
          >
            Delete
          </Button>
        )}
        <Button
          dark
          mode="contained"
          loading={loading}
          icon="input"
          onPress={handleProduct}
        >
          {navigation.getParam("_id") ? "Update" : "Create"}
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
