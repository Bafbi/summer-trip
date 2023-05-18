import Link from "next/link";
import { type RouterOutputs } from "~/utils/api";

type Group = RouterOutputs["group"]["getAll"][0];

export const GroupComponent = (props: Group) => {
  return (
    <div className="rounded-lg bg-tertiary shadow h-24">
      <Link className="flex flex-col h-full p-2" href={`/g/${props.id}`}>
        <h2 className="flex-1 text-lg font-medium text-gray-300 text-center border-b-2 border-accent">
          {props.name}
        </h2>
        <div className="flex-2 mt-2 max-w-xl text-sm text-gray-200">
          <p>{props.description}</p>
        </div>
      </Link>
    </div>
  );
};
