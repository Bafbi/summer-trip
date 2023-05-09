// import type { RouterOutputs } from "~/utils/api";

// import Link from "next/link";


// type PostWithUser = RouterOutputs["group"]["getAll"];
// export const PostView = (props: PostWithUser) => {
//   const { group } = props;
//   return (
//     <div key={group.id} className="flex gap-3 border-b border-slate-400 p-4">
    
//       <div className="flex flex-col">
//         <div className="flex gap-1 text-slate-300">
//           <Link href={`/@${author.username}`}>
//             <span>{`@${author.username} `}</span>
//           </Link>
//           <Link href={`/post/${post.id}`}>
//             <span className="font-thin">{` · ${dayjs(
//               post.createdAt
//             ).fromNow()}`}</span>
//           </Link>
//         </div>
//         <span className="text-2xl">{post.content}</span>
//       </div>
//     </div>
//   );
// };