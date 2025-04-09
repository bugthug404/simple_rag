import React from "react";
import Skeleton from "./skeleton";
import { QNAProps } from "./pages/App";

export default function Qna({ list }: { list: QNAProps[] }) {
  return (
    <div className="bg-white mt-4 py-4 rounded-lg min-h-52 flex flex-col gap-4">
      {list.map((v, i) => (
        <div className={`px-4 ${i !== 0 && "border-t-2"} pt-2`}>
          <div>
            <span className="font-bold">{v.question}</span>{" "}
            <span className="italic text-sm">{v.llm}</span>
          </div>
          <div>{v.answer ? <div>{v.answer}</div> : <Skeleton />}</div>
        </div>
      ))}
    </div>
  );
}
