import emptyimg from "../../assets/img/empty.svg";

const EmptyData = ({
  width,
  height,
  title = "No Data Found",
  subtitle = "There's nothing to display here yet.",
}: {
  width?: string;
  height?: string;
  title?: string;
  subtitle?: string;
}) => (
  <div
    className={`${width ?? "w-full"} ${height ?? "h-[70vh]"} flex flex-col items-center justify-center gap-4 px-4`}
  >
    <img
      src={emptyimg}
      alt="No data"
      className="w-36 sm:w-48 md:w-56 lg:w-64 max-w-full"
      style={{ objectFit: "contain" }}
    />
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="text-sm font-bold text-gray-600">{title}</span>
      <span className="text-xs text-gray-400 max-w-xs">{subtitle}</span>
    </div>
  </div>
);

export default EmptyData;
