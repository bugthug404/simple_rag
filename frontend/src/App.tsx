import { useState } from "react";
import Button from "./button";
import Document from "./pages/document";
import Website from "./pages/website";
import { twMerge } from "tailwind-merge";

function App() {
  const [index, setIndex] = useState({
    title: "Website",
    component: Website,
  });

  const tabData = [
    {
      title: "Website",
      component: Website,
    },
    {
      title: "Document",
      component: Document,
    },
  ];



  return (
    <div>
      <div className="flex justify-center gap-4">
        {tabData.map((v) => (
          <Button
            onClick={() => setIndex(v)}
            className={twMerge("rounded-t-0 rounded-none rounded-b-lg px-3 py-1 text-xs", index.title === v.title && " bg-black text-blue-50 ")}
          >
            {v.title}
          </Button>
        ))}
      </div>
      <index.component />
    </div>
  );
}

export default App;
