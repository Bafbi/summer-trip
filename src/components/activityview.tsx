import { api } from "~/utils/api";

// const ActivityView = (props: { groupId: string}) => {
//   const { data: activityData, isLoading: activityLoading } =
//     api.activity.getById.useQuery({ id: props.activityId });

//   return (
//     <div>
//       <div className="flex flex-col items-center justify-center gap-12 px-4 py-16 ">
//         <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
//           {activityLoading ? (
//             <div>a{props.activityId}a Loading...</div>
//           ) : (
//             activityData.name
//           )}
//         </h1>
//       </div>
//     </div>
//   );
// };