import { Skeleton } from "@mui/material";

const HierarchyChartSkeleton = () => {
  return (
    <div className="h-[calc(100vh-90px)] flex flex-col overflow-hidden px-3 py-4 w-full">
      {/* Page header */}
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <Skeleton
          variant="rectangular"
          animation="wave"
          width={4}
          height={28}
          sx={{ borderRadius: 99 }}
        />
        <Skeleton variant="circular" animation="wave" width={20} height={20} />
        <Skeleton variant="text" animation="wave" width={180} height={28} />
      </div>

      {/* Toolbar card */}
      <div className="flex-shrink-0 mb-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Legend pills */}
        <div className="flex items-center gap-2">
          {[72, 80, 56].map((w, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              animation="wave"
              width={w}
              height={26}
              sx={{ borderRadius: 99 }}
            />
          ))}
        </div>
        {/* Zoom group */}
        <div className="flex items-center gap-1 bg-gray-50 rounded-xl border border-gray-200 p-1">
          <Skeleton
            variant="rectangular"
            animation="wave"
            width={32}
            height={32}
            sx={{ borderRadius: 8 }}
          />
          <Skeleton variant="text" animation="wave" width={40} height={20} />
          <Skeleton
            variant="rectangular"
            animation="wave"
            width={32}
            height={32}
            sx={{ borderRadius: 8 }}
          />
          <Skeleton
            variant="rectangular"
            animation="wave"
            width={32}
            height={32}
            sx={{ borderRadius: 8 }}
          />
        </div>
      </div>

      {/* Chart area */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col items-center pt-10 gap-8">
        {/* Root node */}
        <div
          style={{
            width: 250,
            borderRadius: 20,
            border: "2px solid #e2e8f0",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}
        >
          {/* Gradient header zone */}
          <div
            style={{
              background: "linear-gradient(135deg, #e0f7fa 0%, #f0fdfe 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              padding: "20px 20px 16px",
            }}
          >
            <Skeleton
              variant="circular"
              animation="wave"
              width={72}
              height={72}
            />
            <Skeleton variant="text" animation="wave" width={120} height={22} />
            <Skeleton variant="text" animation="wave" width={90} height={16} />
            <Skeleton
              variant="rectangular"
              animation="wave"
              width={110}
              height={22}
              sx={{ borderRadius: 99 }}
            />
          </div>
          {/* Footer zone */}
          <div
            style={{
              height: 36,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderTop: "1px solid #f1f5f9",
            }}
          >
            <Skeleton
              variant="circular"
              animation="wave"
              width={28}
              height={28}
            />
          </div>
        </div>

        {/* Connector line */}
        <div
          style={{
            width: 2,
            height: 24,
            backgroundColor: "#e2e8f0",
            marginTop: -24,
            marginBottom: -8,
          }}
        />

        {/* Horizontal bar */}
        <div style={{ position: "relative", display: "flex", gap: 32 }}>
          {/* Horizontal connector */}
          <div
            style={{
              position: "absolute",
              top: -16,
              left: "50%",
              transform: "translateX(-50%)",
              width: "calc(100% - 110px)",
              height: 2,
              backgroundColor: "#e2e8f0",
            }}
          />

          {/* Child nodes */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: 210,
                borderRadius: 16,
                border: "2px solid #e2e8f0",
                overflow: "hidden",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              }}
            >
              {/* Top accent bar */}
              <div
                style={{
                  height: 4,
                  background: "linear-gradient(90deg, #b2ebf2, #e0f7fa)",
                  borderRadius: "14px 14px 0 0",
                }}
              />
              {/* Body */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px 24px 14px",
                }}
              >
                <Skeleton
                  variant="circular"
                  animation="wave"
                  width={54}
                  height={54}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width="80%"
                    height={18}
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width="60%"
                    height={14}
                    sx={{ mt: 0.5 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    animation="wave"
                    width="70%"
                    height={18}
                    sx={{ borderRadius: 99, mt: 0.5 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HierarchyChartSkeleton;
