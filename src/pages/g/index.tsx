import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Header from "~/components/layout/header";
import { NewGroupView } from "~/components/newgroupview";
import { api } from "~/utils/api";

const GroupsPage: NextPage = () => {
  useSession({ required: true });

  const [isOpen, setIsOpen] = useState(false);


  const { data: groupsData, isLoading: groupsLoading } = api.group.getAll.useQuery();

  if (groupsLoading) return <div>Loading...</div>;

  if (!groupsData) return <div>Something went wrong</div>;


  // const onSubmit = (data: any) => {
  //   console.log(data);
  //   setIsOpen(false);
  // };

  return (
    <>
      <Head>
        <title>Groups</title>
      </Head>
      {/* <Header/> */}
      <main>
        <div className="min-h-screen bg-primary-900 p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groupsData.map((group) => (
              <Link
                key={group.id}
                href={`/g/${group.id}`}
                className="overflow-hidden rounded-lg bg-white shadow"
              >
                {/* <Image
                  className="h-48 w-full object-cover"
                  src={group.name}
                  alt={group.name}
                  width={40}
                  height={40}
                /> */}
                <div className="p-4">
                  <h2 className="text-xl font-bold">{group.name}</h2>
                  <p className="text-gray-500">{group.description}</p>
                </div>
              </Link>
            ))}
            {isOpen && (
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <CreateGroupWizard />
                </div>
                )}
            <button
              onClick={() => setIsOpen(true)}
              className="flex h-48 w-full items-center justify-center rounded-lg bg-gray-200 shadow"
            >
              <svg
                className="h-10 w-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default GroupsPage;

const CreateGroupWizard = () => {
  const user = useSession().data?.user;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const { mutate, isLoading: isCreatingPost } = api.group.create.useMutation({
    onSuccess: () => {
      setName("");
      setDescription("");
      setLocation("");
    },
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutate({ name, description, location });
        }}
      >
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          onChange={(e) => {
            setLocation(e.target.value);
          }}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
