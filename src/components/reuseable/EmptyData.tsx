import emptyimg from "../../assets/img/empty.svg";

const EmptyData = () => {
  return (
    <div className="w-full h-[70vh] flex items-center justify-center ">
      <img
        src={emptyimg}
        alt="empty"
        style={{  objectFit: "fill" }}
        className="w-60 md:w-70"
      />
     </div>
  );
};

export default EmptyData;
