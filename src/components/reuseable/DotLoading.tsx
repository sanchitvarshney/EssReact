

const DotLoading = () => {
  return (
    <div className="flex space-x-1 justify-center items-center bg-white dark:invert mt-2  bg-tranparent">
   
      <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2   bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2   bg-gray-500 rounded-full animate-bounce"></div>
    </div>
  );
};

export default DotLoading;
