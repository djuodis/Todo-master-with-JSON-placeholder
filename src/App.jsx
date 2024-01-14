import { useEffect, useRef, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Input from "./components/Input";
import List from "./components/List";
import TodosContext from "./contexts/TodosContext";
import axios from "axios";
import uuid from "react-uuid";

const API_URL = "https://jsonplaceholder.typicode.com/todos";

function App() {
  const [listData, setListData] = useState([]);
  const firstRender = useRef(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        const formattedData = response.data.slice(0, 5).map(item => ({ id: uuid(), title: item.title, completed: item.completed }));
        setListData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const saveData = async () => {
      try {
        await axios.post(API_URL, listData);
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };

    saveData();
  }, [listData]);

  return (
    <TodosContext.Provider value={{ listData, setListData }}>
      <Header />
      <Input />
      <List />
    </TodosContext.Provider>
  );
}

export default App;
