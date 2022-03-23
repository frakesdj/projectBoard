import logo from './logo.svg';
import './App.css';
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import _ from "lodash";
import {v4} from "uuid";
import React, {useState}  from "react";

const item = {
  id: v4(),
  name: "Clean the house",
  description: "dddd",
  editable: false
}

const item2 = {
  id: v4(),
  name: "Wash the car",
  description: "",
  editable: false
}

function App() {
  const [text, setText] = useState("")
  const [state, setState] = useState({
    "todo": {
      title: "Todo",
      items: [item, item2]
    },
    "inprogress": {
      title: "In Progress",
      items: []
    },
    "done": {
      title: "Completed",
      items: []
    }
  })

  const handleDragEnd = ({destination, source}) => {
    if (!destination) {
      return
    }

    if (destination.index === source.index && destination.droppableId === source.droppableId) {
      return
    }

    // Creating a copy of item before removing it from state
    const itemCopy = {...state[source.droppableId].items[source.index]}

    setState(prev => {
      prev = {...prev}
      // Remove from previous items array
      prev[source.droppableId].items.splice(source.index, 1)


      // Adding to new items array location
      prev[destination.droppableId].items.splice(destination.index, 0, itemCopy)

      return prev
    })
  }

  function deleteTask(index, key) {
    var array = {...state};
    array[key].items.splice(index, 1);
    setState(array);
  }

  function updateDes(des, index, key)  {

    console.log(state[key].items);
    const itemCopy = {...state[key].items[index]}

    setState(prev => {
        prev = {...prev}
        prev[key].items[index].description = des.target.value;
        return prev;
      })
  }

  function updateName(nam, index, key)  {

    console.log(state[key].items);
    const itemCopy = {...state[key].items[index]}

    setState(prev => {
        prev = {...prev}
        prev[key].items[index].name = nam.target.value;
        return prev;
      })
  }

  function toggleTask (el, key, index) {
    const itemCopy = {...state[key].items[index]}
    itemCopy.editable = !itemCopy.editable;
    setState(prev => {
      prev = {...prev}
      // Remove from previous items array
      prev[key].items.splice(index, 1)


      // Adding to new items array location
      prev[key].items.splice(index, 0, itemCopy)

      return prev;
    })
  }

  function addTask(key){
    if (key === "todo")
    {
      setState(prev => {
      return {
        ...prev,
        todo: {
          title: "Todo",
          items: [
            ...prev.todo.items,
            {
              id: v4(),
              name: "",
              description: "",
              editable: false
            }
          ]
        }
      }})
    }
    else if (key === "inprogress")
    {
      setState(prev => {
        return {
          ...prev,
          "inprogress": {
            title: "In Progress",
            items: [
              ...prev.inprogress.items,
              {
                id: v4(),
                name: "",
                description: "",
                editable: false
              }
            ]
          }
        }})
    }
    else
    {
      setState(prev => {
        return {
          ...prev,
          "done": {
            title: "Completed",
            items: [
              ...prev.done.items,
              {
                id: v4(),
                name: "",
                description: "",
                editable: false
              }
            ]
          }
        }})
    }
    }


 //comment for git tester
  return (
    <div className="App">
      <DragDropContext onDragEnd={handleDragEnd}>
        {_.map(state, (data, key) => {
          return(
            <div key={key} className={"column"}>
              <h3>{data.title}</h3>
              <Droppable droppableId={key}>
                {(provided, snapshot) => {
                  return(
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={"droppable-col"}
                    >
                      {data.items.map((el, index) => {
                        return(
                          <Draggable key={el.id} index={index} draggableId={el.id}>
                            {(provided, snapshot) => {
                              return(


                                <div
                                  className={`item ${snapshot.isDragging && "dragging"}`}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >

                                
                                  
                                  <button onClick={() => toggleTask(el, key, index)}>
                                  here
                                  </button>
                                  {el.editable !== true ? (
                                  <p>{el.name} <br></br>
                                     {el.description}</p>) : (
                                    <div>   
                                       <input
                                      type="text"
                                      id="namBar"
                                      value={el.name}
                                      onChange={(e) => updateName(e, index, key)}/>

                                       <input
                                       type="text"
                                       id="tagBar"
                                       value={el.description}
                                       onChange={(e) => updateDes(e, index, key)}/>

                                       <button onClick={() => deleteTask(index, key)}>
                                        delete
                                       </button>                                    
                                    </div>
                                  )}

                                </div>
                              
                              )
                            }}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}
                    </div>
                  )
                }}
              </Droppable>
              <button onClick={() => addTask(key)}>
              +
              </button>
            </div>
          )
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
