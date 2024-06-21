import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const Modal = forwardRef(function Modal({ dropItem = {}, onSubmit }, ref) {
  // Refs to extract values from Modal
  const dialog = useRef();
  const textRef = useRef();
  const xRef = useRef();
  const yRef = useRef();
  const fontSizeRef = useRef();
  const fontWeightRef = useRef();

  //   States to set the initial values of the input fields
  const [text, setText] = useState("");
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [fontWeight, setFontWeight] = useState(400);

  useEffect(() => {
    // Set initial values when dropItem changes
    setText(dropItem.text || "");
    setX(dropItem.coordx || 0);
    setY(dropItem.coordy || 0);
    setFontSize(dropItem.fontSize || 16);
    setFontWeight(dropItem.fontWeight || 400);
  }, [dropItem]);

  useImperativeHandle(ref, () => ({
    open() {
      // Reset state when opening the modal
      setText(dropItem.text || "");
      setX(dropItem.coordx || 0);
      setY(dropItem.coordy || 0);
      setFontSize(dropItem.fontSize || 16);
      setFontWeight(dropItem.fontWeight || 400);
      dialog.current.showModal();
    },
    close() {
      dialog.current.close();
    },
  }));

  //   Save changes and set the state in the app component
  const handleSaveChange = function (e) {
    onSubmit({
      text: textRef.current.value,
      x: parseInt(xRef.current.value),
      y: parseInt(yRef.current.value),
      fontSize: parseInt(fontSizeRef.current.value),
      fontWeight: parseInt(fontWeightRef.current.value),
    });
  };

  return (
    <dialog ref={dialog} className="w-[424px] h-[661px]">
      <div className="m-4">
        <div className="h-[29px] w-[100px]">
          <p className="text-xl font-semibold">Edit {dropItem.name}</p>
        </div>
        <form method="dialog" className="grid gap-2">
          <label className="text-lg">Text</label>
          <input
            autoFocus
            type="text"
            value={text}
            className="w-[379px] h-[64px] border"
            ref={textRef}
            onChange={(e) => setText(e.target.value)}
          />
          <label className="text-lg">X</label>
          <input
            type="number"
            value={x}
            className=" border w-[379px] h-[64px]"
            ref={xRef}
            onChange={(e) => setX(parseInt(e.target.value))}
          />
          <label className="text-lg">Y</label>
          <input
            type="number"
            value={y}
            className=" border w-[379px] h-[64px]"
            ref={yRef}
            onChange={(e) => setY(parseInt(e.target.value))}
          />
          <label className="text-lg">Font Size</label>
          <input
            type="number"
            className="w-[379px] h-[64px] border"
            ref={fontSizeRef}
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
          />
          <label className="text-lg">Font Weight</label>
          <input
            type="number"
            className="w-[379px] h-[64px] border"
            ref={fontWeightRef}
            value={fontWeight}
            onChange={(e) => setFontWeight(parseInt(e.target.value))}
          />
          <button className="text-lg" onClick={handleSaveChange}>
            Save Changes
          </button>
        </form>
      </div>
    </dialog>
  );
});

export default Modal;
