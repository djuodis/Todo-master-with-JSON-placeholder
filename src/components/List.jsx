import { useContext, useEffect, useState } from "react";
import ListItem from "./ListItem";
import { motion, AnimatePresence } from "framer-motion";
import TodosContext from "../contexts/TodosContext";
import axios from "axios";

const List = () => {
  const { listData, setListData } = useContext(TodosContext);
  const [isRenderList, setIsRenderList] = useState(false);

  const listAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.3,
      },
    },
  };

  const itemAnimation = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/todos/${itemId}`);
      const newListData = listData.filter((item) => item.id !== itemId);
      setListData(newListData);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  useEffect(() => {
    setIsRenderList(true);
  }, []);

  return (
    <motion.ul
      variants={listAnimation}
      initial="hidden"
      animate={isRenderList ? "visible" : "hidden"}
      id="todo"
    >
      <AnimatePresence>
        {listData.map((item) => (
          <ListItem
            item={item}
            key={item.id}
            itemAnimation={itemAnimation}
            motion={motion}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </AnimatePresence>
    </motion.ul>
  );
};

export default List;
