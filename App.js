import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, Text, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";
import axios from "axios";
export default function App() {
  const [data, setData] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // fetchData();
    // fetchJSONData();
    loadCachedData(ALL_TRANSACTIONS);
  }, []);

  let ALL_TRANSACTIONS = "ALL_TRANSACTIONS";
  let ALL_POSTS = "ALL_POSTS";

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://phindor.africa/live-server/phindor-api/public/api/transactions-list/12",
        {
          headers: {
            Authorization:
              "Bearer 2327|q7qkk54EPZUUENo9fW4yxDEArGu0tDWr3bqqe7LD",
          },
        }
      );
      setData(response.data.jsonData);

      // Save the API response data to FileSystem
      await saveDataToFileSystem(response.data.jsonData, ALL_TRANSACTIONS);
      // console.log("fetched response");
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchJSONData = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/todos/"
      );
      setPosts(response.data);
      // Save the API response data to FileSystem
      await saveDataToFileSystem(response.data, ALL_POSTS);
      console.log("fetched response");
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const saveDataToFileSystem = async (data, lisa_storage_key) => {
    const path = `${FileSystem.documentDirectory}/${lisa_storage_key}.json`;
    const content = JSON.stringify(data);
    try {
      await FileSystem.writeAsStringAsync(path, content);
      console.log("Data saved to FileSystem");
    } catch (error) {
      console.error("Error saving data to FileSystem:", error);
    }
  };
  const loadCachedData = async (lisa_storage_key) => {
    const path = `${FileSystem.documentDirectory}/${lisa_storage_key}.json`;
    try {
      const fileContent = await FileSystem.readAsStringAsync(path);
      const cachedData = JSON.parse(fileContent);
      setData(cachedData);
      console.log("cached response");
      console.log(cachedData);
    } catch (error) {
      console.error("Error loading cached data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item, index, separators }) => <Component item={item} />}
        keyExtractor={(item) => item.id}
      />
      <StatusBar style="auto" />
    </View>
  );
}

function Component({ item }) {
  // console.log(item);
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Text>Order {item.id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: 500,
    marginTop: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
