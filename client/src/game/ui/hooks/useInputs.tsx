import { useEffect, useState } from "react";

const useInputs = () => {
  const [keys, _setKeys] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
  }, []);

  const onKeyDown = (event: KeyboardEvent) => {
    _setKeys((prev) => ({ ...prev, [event.key]: true }));
  };

  const onKeyUp = (event: KeyboardEvent) => {
    _setKeys((prev) => ({ ...prev, [event.key]: false }));
  };

  return { keys };
};

export default useInputs;
