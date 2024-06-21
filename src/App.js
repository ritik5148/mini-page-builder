import DropZone from "./DropZone";
import Modal from "./Modal";
import { useState, useEffect, useRef } from "react";

function App() {
  const initialItems = JSON.parse(localStorage.getItem("items")) || [
    { name: "Label", dropped: false, coordx: null, coordy: null },
    { name: "Input", dropped: false, coordx: null, coordy: null },
    { name: "Button", dropped: false, coordx: null, coordy: null },
  ];
  const [items, setItems] = useState(initialItems);
  const [currentDropItem, setCurrentDropItem] = useState(
    JSON.parse(localStorage.getItem("current")) || {}
  );
  const [dropItems, setDropItems] = useState(() => {
    const savedDropItem = localStorage.getItem("dropItem");
    try {
      return savedDropItem ? JSON.parse(savedDropItem) : [];
    } catch (e) {
      return [];
    }
  });
  const dialog = useRef();

  // Save items to local Storage
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);
  useEffect(() => {
    localStorage.setItem("current", JSON.stringify(currentDropItem));
  }, [currentDropItem]);
  useEffect(() => {
    localStorage.setItem("dropItem", JSON.stringify(dropItems));
  }, [dropItems]);

  // Drop
  const handleDrop = function (e, name) {
    let newItems = [...items];
    for (let item of newItems) {
      if (item.name === name) {
        item.text = "This is a " + item.name;
        item.coordx = e.clientX;
        item.coordy = e.clientY;
        setCurrentDropItem(item);
        setDropItems((prevItems) => {
          return [...prevItems.filter((i) => i != item), item];
        });
      }
    }
    dialog.current.open();
    setItems((prevItems) => (prevItems != newItems ? newItems : prevItems));
  };

  // Submit Modal
  const handleConfigSubmit = (config) => {
    const updatedItems = items.map((item) => {
      if (item.name === currentDropItem.name) {
        return {
          ...item,
          dropped: true,
          text: config.text,
          x: config.x,
          y: config.y,
          fontSize: config.fontSize,
          fontWeight: config.fontWeight,
        };
      }
      return item;
    });
    setItems(updatedItems);
    setCurrentDropItem(
      updatedItems.find((item) => item.name === currentDropItem.name)
    );
    setDropItems(updatedItems.filter((item) => item.dropped == true));
    dialog.current.close();
    console.log(dropItems);
  };

  // Delete item
  const handleDelete = function (deletedItem) {
    const updatedItems = items.map((item) => {
      if (item.name === deletedItem.name) {
        return {
          ...item,
          dropped: false,
        };
      }
      return item;
    });

    setItems(updatedItems);
    setDropItems(dropItems.filter((item) => item.name != deletedItem.name));
  };

  return (
    <>
      <Modal
        ref={dialog}
        dropItem={currentDropItem}
        onSubmit={handleConfigSubmit}
      />
      <div className="flex flex-row">
        <div className="w-4/5 bg-[#F3F3F3] h-screen">
          <DropZone
            dropItems={dropItems}
            onSubmit={handleDrop}
            handleConfigSubmit={handleConfigSubmit}
            onDelete={handleDelete}
          />
        </div>

        <div className="w-[326px] h-screen bg-[#2D2D2D]">
          {/* SideBar  */}
          <h2 className="m-5 text-white text-2xl">Blocks</h2>
          <div className=" grid justify-center gap-y-2">
            {items.map((item) => (
              <div
                key={item.name}
                className="bg-white w-[278px] h-[49px] rounded"
                draggable
                onDragEnd={(e) => handleDrop(e, item.name)}
              >
                <p className="inline-block align-middle">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
