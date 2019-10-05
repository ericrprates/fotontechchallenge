import React, { useEffect, useState } from "react";
import {
  Avatar,
  Card,
  List,
  ActivityIndicator,
  Button,
  Title
} from "react-native-paper";
import { View, FlatList, SafeAreaView } from "react-native";
import Constants from "expo-constants";

import { useSelector, useDispatch } from "react-redux";
import api from "../services/api";
import reducers from "../constants/reducers";

export default function ProductList({ navigation }) {
  const dispatch = useDispatch();
  const products = useSelector(state => state.products.data);
  const token = useSelector(state => state.user.token);
  const [page, setPage] = useState(0);
  const [totalProducts, setTotalProducts] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    if (navigation.getParam("update")) {
      setPage(0);
      setLoading(true);
      fetchProducts();
    }
  }, [navigation]);
  const _renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View
        style={{
          position: "relative",
          width: "100%",
          height: 50,
          paddingVertical: 20,
          borderTopWidth: 1,
          marginTop: 10,
          marginBottom: 10,
          borderColor: "gray"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  async function handleLoadMore() {
    if (totalProducts > itemsPerPage && itemsPerPage * page <= totalProducts) {
      setPage(page + 1);
      setLoadingMore(true);
    }
  }

  _handleRefresh = () => {
    setPage(0);
    setRefreshing(true);
    fetchProducts();
  };
  async function fetchProducts() {
    try {
      const response = await api.get("/products", {
        params: { page, itemsPerPage },
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data) {
        dispatch({
          type: reducers.products.list,
          products: response.data.products,
          page
        });
        setTotalProducts(response.data.totalProducts);
        setLoadingMore(false);
        setLoading(false);
        setRefreshing(false);
      }
    } catch (e) {
      alert(e);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [page]);

  return (
    <SafeAreaView style={{ flex: 1, marginTop: Constants.statusBarHeight }}>
      <Title style={{ marginLeft: 20 }}>Product List</Title>
      <Button onPress={() => navigation.navigate("ProductForm")}>
        New Product
      </Button>
      {!loading && (
        <FlatList
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          data={products}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <List.Item
              title={`${item.name} - $ ${item.price}`}
              description={item.description}
              onPress={() => navigation.navigate("ProductForm", { ...item })}
            />
          )}
          ListFooterComponent={_renderFooter}
          onRefresh={_handleRefresh}
          refreshing={refreshing}
        />
      )}
      {loading && <ActivityIndicator />}
    </SafeAreaView>
  );
}
