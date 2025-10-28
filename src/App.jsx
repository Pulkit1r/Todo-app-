import { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [showFinished, setshowFinished] = useState(true);

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const toggleFinished = () => {
    setshowFinished(!showFinished);
  };

  const handleEdit = (e, id) => {
    let todo = todos.filter((item) => item.id === id);
    setTodo(todo[0].todo);
    const newTodos = todos.filter((item) => item.id !== id);
    setTodos(newTodos);
  };

  const handleDelete = (e, id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this todo?"
    );
    if (!confirmDelete) return;

    const newTodos = todos.filter((item) => item.id !== id);
    setTodos(newTodos);
  };

  const handleAdd = () => {
    if (!todo.trim()) {
      setError("Todo cannot be empty");
      return;
    }
    setError("");
    setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }]);
    setTodo("");
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
    if (error) setError("");
  };

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex((item) => item.id === id);
    if (index === -1) return;

    const newTodos = [...todos];
    newTodos[index] = {
      ...newTodos[index],
      isCompleted: !newTodos[index].isCompleted,
    };
    setTodos(newTodos);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-[#a1c4fd] via-[#c2e9fb] to-[#fbc2eb] py-10">
        <div className="mx-3 md:container md:mx-auto rounded-2xl p-8 bg-white/60 backdrop-blur-md border border-white/30 shadow-2xl min-h-[80vh] md:w-1/2">
          <h1 className="font-bold text-center text-2xl text-purple-800 mb-6">
            iTask - Manage your todos at one place
          </h1>

          <div className="addTodo my-5 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-gray-700">Add a Todo</h2>
            <input
              onChange={handleChange}
              value={todo}
              type="text"
              placeholder="Enter your task..."
              className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400 shadow-sm"
            />
            <button
              onClick={handleAdd}
              className="bg-violet-700 hover:bg-violet-900 p-3 py-2 text-sm font-semibold text-white rounded-md transition-all duration-200 shadow-sm"
            >
              Save
            </button>
            {error && (
              <p className="text-red-500 mt-1 text-sm font-semibold">{error}</p>
            )}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <input
              onChange={toggleFinished}
              type="checkbox"
              checked={showFinished}
              className="h-4 w-4 accent-violet-700"
            />
            <span className="text-gray-700 font-medium">Show Finished</span>
          </div>

          <h2 className="text-lg font-bold my-4 text-gray-700">Your Todos</h2>
          <div className="todos">
            {todos.length === 0 && (
              <div className="m-5 text-gray-500 text-sm italic">
                No todos to display
              </div>
            )}
            {todos.map(
              (item) =>
                (showFinished || !item.isCompleted) && (
                  <div
                    key={item.id}
                    className="todo flex md:w-3/4 my-3 justify-between items-center bg-white/70 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex gap-4 items-center">
                      <input
                        name={item.id}
                        onChange={handleCheckbox}
                        type="checkbox"
                        checked={item.isCompleted}
                        className="h-4 w-4 accent-violet-700"
                      />
                      <div className={`${item.isCompleted? "line-through text-gray-500": "text-gray-800"}`}>
                        {item.todo}
                      </div>
                    </div>  
                    <div className="buttons flex gap-2">
                      <button
                        onClick={(e) => handleEdit(e, item.id)}
                        className="bg-violet-700 hover:bg-violet-900 p-2 text-white rounded-md text-sm"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, item.id)}
                        className="bg-red-600 hover:bg-red-700 p-2 text-white rounded-md text-sm"
                      >
                        <AiFillDelete />
                      </button>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
