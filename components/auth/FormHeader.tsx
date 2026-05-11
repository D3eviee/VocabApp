import { Brain } from "lucide-react";

export const FormHeader = ({ title, description }: { title:string, description:string }) => {
    return (
        <div className="w-full flex flex-col items-center px-2 mb-8">
          <div className="bg-[#4F39F6] w-fit h-fit p-6 rounded-4xl shadow-xl">
            <Brain size={62} strokeWidth={2.5} color="white" />
          </div>
          <div className="flex flex-col mt-6 text-[#494949] ">
            <h1 className="font-bold text-3xl text-center mb-1">{title}</h1>
            <p className="text-base font-light text-center">{description}</p>
          </div>
        </div>
  );
}