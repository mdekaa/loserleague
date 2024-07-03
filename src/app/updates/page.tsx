import { format } from "date-fns";
import { unstable_noStore } from "next/cache";
import Markdown from "react-markdown";

type Roadmap = {
  id: string;
  title: string;
  description: string;
  releaseDate: string;
  version?: string;
};

export default async function RoadmapPage() {
  

  return (
    <div className="container max-w-5xl mx-auto">
      <div className="flex flex-row justify-between mb-8">
        <h1 className="my-12 text-[28px] leading-[34px] tracking-[-0.416px] text-neutral-12 font-bold">
          Your Roadmap
        </h1>
      </div>

      

      <ul className="flex flex-col">
        
          <li
            
            className="relative flex w-full flex-col sm:flex-row"
          >
            <div className="flex w-full pb-4 sm:w-[200px] sm:pb-0">
              <p className="sans text-sm leading-[1.6] text-slate-11 font-normal">
                <div className="sticky top-24 text-xl" >
                  3rd July-2024
                </div>
              </p>
            </div>

            <div className="relative hidden sm:flex sm:w-[100px]">
              <div className="absolute left-0.5 top-0.5 h-full w-0.5 bg-slate-200"></div>
              <div className="sticky left-0 top-[102px] mt-1.5 h-1.5 w-1.5 rounded-full bg-white"></div>
            </div>

            <div className="w-full pb-16">
              <div className="space-y-4">
                <div className="flex flex-col gap-4">
                  <h2 className="text-4xl">Version 1.0</h2>

                  <Markdown className="prose text-white">
                    In this version you can create polls,
                    explore other polls, Vote on them and leave feedback,
                    and Follow people for their fun polls!
                  </Markdown>
                </div>
              </div>
            </div>
          </li>
          <li
            
            className="relative flex w-full flex-col sm:flex-row"
          >
            <div className="flex w-full pb-4 sm:w-[200px] sm:pb-0">
              <p className="sans text-sm leading-[1.6] text-slate-11 font-normal">
                <div className="sticky top-24 text-xl" >
                  3rd July-2024
                </div>
              </p>
            </div>

            <div className="relative hidden sm:flex sm:w-[100px]">
              <div className="absolute left-0.5 top-0.5 h-full w-0.5 bg-slate-200"></div>
              <div className="sticky left-0 top-[102px] mt-1.5 h-1.5 w-1.5 rounded-full bg-white"></div>
            </div>

            <div className="w-full pb-16">
              <div className="space-y-4">
                <div className="flex flex-col gap-4">
                  <h2 className="text-4xl">Version 1.1 ( under development ) </h2>

                  <Markdown className="prose text-white">
                    Will introduce categories for different kind of polls and 
                    smoothen the expolore polls option.
                  </Markdown>
                </div>
              </div>
            </div>
          </li>
        
      </ul>
    </div>
  );
}
