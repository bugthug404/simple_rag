import React, { useRef, useState } from 'react'
import { QNAProps } from './App';
import { calling, llmList } from '../utils';
import toast from 'react-hot-toast';
import Button from '../button';
import Qna from '../qna';
import Input from '../input';

export default function Website() {
  const [qnaList, setQnaList] = useState<QNAProps[]>([]);
  const [model, setModel] = useState("gemma:2b");
  const inputRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);


  async function handleWebsiteUpload() {
    try {
      const data = urlRef.current?.value
      console.log("data", data)
      const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/;
      console.log(urlRegex.test(data ?? ""));

      if (!urlRegex.test(data ?? "")) {
        toast.error("invalid url! eg. http://google.com")
        return console.log("error bro");
      }

      const response = calling("web/add", "POST", { url: data });
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
      console.log("result === ", result);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleAsk() {
    try {
      const question = inputRef.current?.value;
      if (!question) return toast("Please enter your question!");
      let item: QNAProps = { question: question, llm: model };
      try {
        inputRef.current.value = "";
        setQnaList([item, ...qnaList]);
        if (!question) return;
        const response = await calling(
          `web/ask?query=${question}&model=${model}`, "POST", { domain: "http://weblianz.com" }
        );
        item = {
          ...item,
          answer: response ?? "something went wrong",
        };

        setQnaList([item, ...qnaList]);
      } catch (error: any) {
        item = {
          ...item,
          answer: "Something went wrong",
        };

        setQnaList([item, ...qnaList]);
        toast.error(
          error?.response?.data?.error ??
          error.message ??
          "Something went wrong"
        );
      }
    } catch (error: any) {
      console.log(error.message ?? "got error");
    }
  }

  return (
    <div className=" h-screen  flex flex-col gap-4 items-center p-4">
      <div className="p-4 bg-gray-100 rounded-3xl max-w-2xl w-full  gap-2">
        <div className="flex items-center justify-between gap-4">
          <Input inputRef={urlRef} onEnter={() => handleWebsiteUpload()} placeholder='Enter url' className='py-1.5' />
          <Button
            onClick={() => {
              handleWebsiteUpload();
            }}
            className=""
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
              <option key={v.label} value={v.value}>{v.label}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          <Input inputRef={inputRef} onEnter={handleAsk} placeholder='Ask a question from the book' />
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

