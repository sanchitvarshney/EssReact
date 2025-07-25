import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import React, { lazy, Suspense, type FC } from "react";

const PostAnnouncementCard = lazy(
  () => import("./reuseable/PostAnnouncementCard")
);
interface AnnouncementListProps {
  posts: any[];
  hasMore: boolean;
  ref: any;
}

const AnnouncementList: FC<AnnouncementListProps> = React.memo(
  ({ posts, hasMore, ref }) => (
    <div className="space-y-6">
      {posts.map((post: any, index: number) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
            delay: 0.05 * index,
          }}
        >
          <Suspense fallback={null}>
            <PostAnnouncementCard post={post} />
          </Suspense>
        </motion.div>
      ))}

      {hasMore && (
        <div ref={ref} className="h-10 w-full flex justify-center items-center">
          <CircularProgress sx={{ color: "#2eacb3" }} />
        </div>
      )}
    </div>
  )
);

export default AnnouncementList;
