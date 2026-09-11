const ComingSoon = ({
  width,
  height,
  title = "Holiday List Coming Soon",
  subtitle = "We're preparing the holiday calendar for you. Please check back soon.",
}: {
  width?: string;
  height?: string;
  title?: string;
  subtitle?: string;
}) => (
  <div
    className={`
      ${width ?? "w-full"}
      ${height ?? "h-[70vh]"}
      flex items-center justify-center px-4
    `}
  >
    <div
      className="
        w-full max-w-md
      
        bg-transparent
        px-6 py-8 sm:px-10 sm:py-10
        text-center
        transition-all duration-300
       
      "
    >
      {/* Content */}
      <div className="flex flex-col items-center">
        <span
          className="
            mb-2
            text-lg sm:text-xl
            font-semibold
            tracking-tight
            text-gray-700
          "
        >
          {title}
        </span>

        <span
          className="
            max-w-sm
            text-sm
            leading-6
            text-gray-400
          "
        >
          {subtitle}
        </span>

        {/* Coming Soon Badge */}
        <span
          className="
            mt-5
            inline-flex items-center
            rounded-full
            bg-gray-100
            px-4 py-1.5
            text-xs font-medium
            text-gray-500
          "
        >
          ✨ Coming Soon
        </span>
      </div>
    </div>
  </div>
);

export default ComingSoon;
