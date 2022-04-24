import { useEffect, useState } from "react";

const useInputs = () => {
  const [keys, _setKeys] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const onKeyDown = (event: KeyboardEvent) => {
    _setKeys((prev) => ({ ...prev, [event.code]: true }));
  };

  const onKeyUp = (event: KeyboardEvent) => {
    _setKeys((prev) => ({ ...prev, [event.code]: false }));
  };

  return { keys };
};

export default useInputs;
