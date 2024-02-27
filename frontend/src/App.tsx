import { useRef, useState } from "react";
import FileSelect from "./file-select";
import Button from "./button";
import { calling, llmList } from "./utils";
import toast from "react-hot-toast";
import Qna from "./qna";

export interface QNAProps {
  question: string;
  llm: string;
  answer?: string;
}

function App() {
  const [file, setFile] = useState<FileList | null>(null);
  const [qnaList, setQnaList] = useState<QNAProps[]>([]);
  const [model, setModel] = useState("gemma:2b");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUploadPdf(data: BinaryData) {
    try {
      const response = calling("rag/add-book", "POST", data);
      const result = await toast.promise(
        response,
        {
          loading: "Processing your pdf 📇 ",
          success: `Your PDF ready to serve 🎉🎊🥳`,
          error: (err) => `This just happened: ${err.toString()}`,
        },
        {
          style: {
            minWidth: "250px",
          },
          success: {
            duration: 10000,
            icon: "🔥",
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function handleAsk() {
    const question = inputRef.current?.value;
    if (!question) return toast("Please enter your question!");
    let item: QNAProps = { question: question, llm: model };
    try {
      inputRef.current.value = "";
      setQnaList([item, ...qnaList]);
      if (!question) return;
      const response = await calling(
        `rag/ask-book?query=${question}&model=${model}`
      );
      item = {
        ...item,
        answer: response,
      };

      setQnaList([item, ...qnaList]);
    } catch (error: any) {
      item = {
        ...item,
        answer: "Something went wrong",
      };

      setQnaList([item, ...qnaList]);
      toast.error(
        error?.response?.data?.error ?? error.message ?? "Something went wrong"
      );
    }
  }

  return (
    <div className=" h-screen  flex flex-col gap-4 items-center p-4">
      <div className="p-4 bg-gray-100 rounded-3xl max-w-2xl w-full  gap-2">
        <div className="flex items-center justify-between gap-4">
          <FileSelect setFile={setFile} />
          <Button
            onClick={() => {
              if (file?.[0]) {
                const reader = new FileReader();
                reader.readAsDataURL(file?.[0] as any);

                reader.onload = (event) => {
                  const fileData = event.target?.result;
                  handleUploadPdf(fileData as any);
                };
              } else {
                console.log("no file");
              }
            }}
            className="mt-5"
          >
            Upload
          </Button>
        </div>
      </div>
      <div className="p-4 bg-gray-100 rounded-3xl max-w-2xl w-full  gap-2">
        <div className="pb-2">
          <label htmlFor="selectllm">Select your model : </label>
          <select
            name="selectllm"
            id=""
            onChange={(e) => setModel(e.target.value)}
            value={model}
            className="px-2 py-1 rounded-lg outline-none"
          >
            {llmList.map((v) => (
              <option value={v.value}>{v.label}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            ref={inputRef}
            placeholder="Ask a question from the book"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAsk();
              }
            }}
            className=" w-full rounded-lg px-2 outline-none focus-visible:shadow-md"
          />
          <Button onClick={() => handleAsk()}>Ask</Button>
        </div>
        {qnaList.length ? (
          <Qna list={qnaList} />
        ) : (
          <div className="p-4 bg-white mt-4 rounded-lg h-52 text-center pt-24">
            Ask your first question
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
