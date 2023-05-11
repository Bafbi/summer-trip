const PageChooser = ({ props: { userId: string } }) => {
  return (
    // footer at bottom of page
    <div className="flex justify-center items-center h-16 bg-gray-200 text-black">
      <button className="" onClick={setSelectedPage("like")}>
        Like
      </button>
      <button className="" onClick={setSelectedPage("chat")}>
        Chat
      </button>
      <button className="" onClick={setSelectedPage("planning")}>
        Planning
      </button>
    </div>
  );
};
