import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

export default function ProjectCard({ img, title, technology, github, live }) {
  return (
    <div className="group relative w-full border border-teal-500 hover:border-2 h-[440px] overflow-hidden rounded-lg sm:w-[430px] transition-all">
      <img
        src={img}
        alt="post cover"
        className="h-[260px] w-full  object-cover group-hover:h-[200px] transition-all duration-300 z-20"
      />

      <div className="p-3 flex flex-col gap-2">
        <p className="text-lg font-semibold line-clamp-2">{title}</p>
        <span className="italic text-sm">{technology}</span>

        <Button
          gradientDuoTone="purpleToPink"
          className="rounded-tl-xl rounded-bl-none"
        >
          <a href={github} target="_blank" rel="noopener noreferrer">
            View On Github
          </a>
        </Button>
        {live && (
          <Button
            gradientDuoTone="purpleToPink"
            className="rounded-tl-xl rounded-bl-none"
            outline
          >
            <a href={live} target="_blank" rel="noopener noreferrer">
              View Live{" "}
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
