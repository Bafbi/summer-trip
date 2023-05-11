import { api } from "~/utils/api";

const ChatView = (props: { groupId: string }) => {
  const groupId = props.groupId;

  const { data: groupData, isLoading: groupLoading } =
    api.group.getById.useQuery({ id: groupId });

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          {groupLoading ? <div>a{groupId}a Loading...</div> : groupData.name}
        </h1>
      </div>
    </div>
  );
};

export default ChatView;