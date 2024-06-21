import { useRef, useState } from "react";
import Modal from "./Modal";

export default function DropZone({
  dropItems,
  onSubmit,
  handleConfigSubmit,
  onDelete,
}) {
  const ref = useRef();
  const [activeItem, setActiveItem] = useState();

  const handleSubmit = handleConfigSubmit;
  const handleDrop = function (e, name) {
    onSubmit(e, name);
  };

  const handleClick = function (item) {
    setActiveItem(item);
  };

  const handleKeyDown = function (e, item) {
    if (e.key === "Enter") {
      e.preventDefault();
      setActiveItem(item);
      ref.current.open();
    }
    if (e.key === "Delete") {
      onDelete(item);
    }
  };

  return (
    <>
      {activeItem && (
        <Modal ref={ref} dropItem={activeItem} onSubmit={handleSubmit} />
      )}
      {dropItems &&
        dropItems.map((item) =>
          item.dropped ? (
            <div
              key={item.name}
              tabIndex={0}
              onClick={() => handleClick(item)}
              draggable
              onDragEnd={(e) => handleDrop(e, item.name)}
              style={{
                position: "absolute",
                left: item.x + "px",
                top: item.y - 100 + "px",
                fontSize: `${item.fontSize}px`,
                fontWeight: item.fontWeight,
                zIndex: 1,
              }}
              onKeyDown={(e) => handleKeyDown(e, item)}
              className={
                activeItem && activeItem.name === item.name
                  ? "border border-[#D95409] border-[2px]"
                  : ""
              }
            >
              {item.text}
            </div>
          ) : null
        )}
    </>
  );
}
