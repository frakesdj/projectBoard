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
    "in-progress": {
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
    function updateDes(des, index, key)  {

    console.log(state[key].items);
    const itemCopy = {...state[key].items[index]}

    setState(prev => {
        prev = {...prev}
        prev[key].items[index].description = des.target.value;
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

                                  {el.name}
                                  
                                  <button onClick={() => toggleTask(el, key, index)}>
                                  here
                                  </button>
                                  {el.editable === true ? (<p>{el.description}</p>) : (                                  <input
                                    type="text"
                                    id="tagBar"
                                    value={el.description}
                                    onChange={(e) => updateDes(e, index, key)}
                                  />)}

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
            </div>
          )
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
