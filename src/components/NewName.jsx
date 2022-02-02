import { useState } from "react";
import { PageTemplate } from "../pages/PageTemplate";

export function NewName({ setName }) {
  const [input, setInput] = useState("");

  const onFormSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("name", input);
    localStorage.setItem("rand", Math.random());
    setName(input);
  };

  return (
    <PageTemplate>
      <p className="mb-3 text-lg text-center text-white">
        Bitte Namen eingeben{" "}
      </p>
      <form className="flex flex-col" onSubmit={onFormSubmit}>
        <input
          className="px-3 py-1 mb-3 bg-opacity-50 rounded-lg"
          defaultValue={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <button
          type="submit"
          className="p-3 text-white bg-orange-600 rounded-lg cursor-pointer bg-opacity-80 min-w-[150px]"
        >
          Enter
        </button>
      </form>
    </PageTemplate>
  );
}
