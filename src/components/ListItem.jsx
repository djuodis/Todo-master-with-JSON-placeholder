// ListItem.jsx

import { useContext, useEffect, useRef, useState } from "react";
import TodosContext from "../contexts/TodosContext";
import axios from "axios";

const ListItem = ({ item, itemAnimation, motion }) => {
  const [editMode, setEditMode] = useState(false);
  const [itemText, setItemText] = useState(item.title);
  const inputRef = useRef(null);
  const { listData, setListData } = useContext(TodosContext);

  const handleRemove = async () => {
    const confirmDelete = window.confirm("Ar tikrai norite ištrinti šį elementą?");
    if (confirmDelete) {
      const newListData = listData.filter((data) => data.id !== item.id);
      setListData(newListData);

      try {
        await axios({
          method: 'delete',
          url: `https://jsonplaceholder.typicode.com/todos/${item.id}`,
        });
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    setItemText(e.target.value);
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      const newListData = listData.map((data) =>
        data.id === item.id ? { ...data, title: itemText } : data
      );
      setListData(newListData);
      setEditMode(false);

      try {
        await axios.put(`https://jsonplaceholder.typicode.com/todos/${item.id}`, {
          title: itemText,
          completed: item.completed,
        });
      } catch (error) {
        console.error("Error updating data:", error);
      }
    }
  };

  useEffect(() => {
    if (editMode) {
      inputRef.current.focus();
    }
  }, [editMode]);

  return (
    <motion.li className="list-item" variants={itemAnimation} layout="position">
      <div className={editMode ? "text hidden" : "text"}>{itemText}</div>
      <textarea
        ref={inputRef}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={editMode ? "" : "hidden"}
        type="text"
        value={itemText}
      />
      <div className="buttons">
        <button className="edit" onClick={handleEdit}>
          <i className="fa-solid fa-edit"></i>
        </button>
        <button className="remove" onClick={handleRemove}>
          <i className="fa-solid fa-trash"></i>
        </button>
      </div>
    </motion.li>
  );
};

export default ListItem;
