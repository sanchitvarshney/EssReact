import PostAnnouncementCard from "../components/reuseable/PostAnnouncementCard";
import { Box } from "@mui/material";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import NoticeboardCard from "../components/NoticeboardCard";
import MilestonesAndEventsCard from "../components/MilestonesAndEventsCard";
import PostHeader from "../components/header/PostHeader";
import PostAnniversaryCard from "../components/reuseable/PostAnniversaryCard";

const AnnouncementPage = () => {
  return (
    <Box className=" h-[calc(100vh-90px)] overflow-auto p-4 gap-4 grid  sm:grid-cols-[2fr_1fr] grid-cols-[2fr]  md:grid-cols-[3fr_1fr] ">
      <div className="flex flex-col gap-4">
        <div className="sticky top-[-30px] z-10 ">
          <PostHeader />
        </div>
        {[...Array(6)].map((_, index) => {
          const { ref, inView } = useInView({
            triggerOnce: true,
            threshold: 0.2,
          });

          return (
            <motion.div
              key={index}
              ref={ref}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: 0.1 * index,
              }}
            >
              <PostAnnouncementCard
                postDate={new Date("2025-03-10T16:14:00")}
                authorName="John Doe"
                authorRole="Full Stack Developer"
                description="We are excited to announce the launch of our new product..."
                images={[
                  "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                ]}
                timeAgo="2 hours ago"
              />
            </motion.div>
          );
        })}
           <PostAnniversaryCard authorName={"test"} />
      </div>
      <div className="flex flex-col items-center gap-4">
        <NoticeboardCard />
        <MilestonesAndEventsCard />
      </div>
    </Box>
  );
};

export default AnnouncementPage;
