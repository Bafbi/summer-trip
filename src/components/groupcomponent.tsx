import Link from "next/link";
import { type RouterOutputs } from "~/utils/api";

type Group = RouterOutputs["group"]["getAll"][0];

export const GroupComponent = (props: Group) => {
  return (
    <div className="rounded-lg bg-tertiary shadow h-32 border-[#E49A0A] border-2">
      <Link className="lien flex flex-col h-full p-2" href={`/g/${props.id}`}>
        <h2 className="nomGrp flex-1 text-lg font-medium text-gray-300 text-center border-b-2 border-accent">
          {props.name}
        </h2>
        <div className="description flex-2 mt-2 max-w-xl text-sm text-gray-200">
          <p>{props.description}</p>
        </div>
      </Link>
    </div>
  );
};


// export const GroupComponent = (props: Group) => {
//   return (
//     <div className="rounded-lg bg-tertiary shadow h-32 border-solid border-[#E49A0A] border-2 flex flex-col justify-between">
//       <Link className="flex flex-col p-2" href={`/g/${props.id}`}>
//         <p className="text-xl font-medium text-[#E49A0A] text-center border-b-2 border-[#E49A0A]">
//           {props.name}
//         </p>
//         <div className="mt-1 max-w-xl text-sm text-gray-300">
//           <p>Lieu : {props.destination}</p>
//           <p>Du 12/06 au 15/06</p>
//         </div>
//         <div className="max-w-xl text-sm text-gray-300 overflow-hidden whitespace-nowrap">
//           <p className="overflow-ellipsis">Description : {props.description}</p>
//         </div>
//       </Link>
//     </div>
//   );
// };

