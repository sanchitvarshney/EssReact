import PostAnnouncementCard from "../components/reuseable/PostAnnouncementCard";
import { Box } from "@mui/material";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
// import NoticeboardCard from "../components/NoticeboardCard";
import MilestonesAndEventsCard from "../components/MilestonesAndEventsCard";
import PostHeader from "../components/header/PostHeader";
import { useEffect, useState } from "react";
import {
  useGetDOBListMutation,
  useGetHireListQuery,
  useGetWAListMutation,
} from "../services/events";
import AnnouncementPageSkeleton from "../skeleton/AnnouncementPageSkeleton";
import { useToast } from "../hooks/useToast";

const AnnouncementPage = () => {
  const { showToast } = useToast();
  const [postFilter, setPostFilter] = useState<string>("announcement");
  const [
    getDOBList,
    { data: dobData, isLoading: dobLoading, error: dobError },
  ] = useGetDOBListMutation();

  const [getWAList, { data: waList, isLoading: waLoading, error: waError }] =
    useGetWAListMutation();
  const {
    data: hireData,
    isLoading: hireLoading,
    error: hireError,
  } = useGetHireListQuery();
  useEffect(() => {
    getDOBList({ type: "DOB" });
    getWAList({ type: "WA" });
  }, []);

  const views = Array.from({ length: 2 }, () =>
    useInView({ triggerOnce: true, threshold: 0.2 })
  );

  useEffect(() => {
    if (dobError || waError || hireError) {
      showToast(
        //@ts-ignore
        dobError?.error ||
          //@ts-ignore
          waError?.error ||
          //@ts-ignore
          hireError?.error ||
          //@ts-ignore
          dobError?.message ||
          //@ts-ignore
          waError?.message ||
          //@ts-ignore
          hireError?.message ||
          "Something went wrong",
        "error"
      );
    }
  }, [dobError, waError, hireError]);

  return (
    <>
      {dobLoading || waLoading || hireLoading ? (
        <AnnouncementPageSkeleton />
      ) : (
        <Box className=" h-[calc(100vh-90px)] overflow-auto p-4 gap-4 grid  sm:grid-cols-[2fr_1fr] grid-cols-1  md:grid-cols-[2fr_1fr] lg:grid-cols-[3fr_1fr] ">
          {" "}
          <div className="flex flex-col gap-4">
            <div className="sticky top-[-30px] z-10 ">
              <PostHeader setFilter={setPostFilter} postFilter={postFilter} />
            </div>
            {views.map(({ ref, inView }, index) => {
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
            {/* <PostAnniversaryCard authorName={"test"} /> */}
          </div>
          {
            <div className="flex flex-col items-center  sm:gap-4  hidden sm:flex">
              {/* <NoticeboardCard /> */}
              <MilestonesAndEventsCard
                title={" Current Month's Birthdays"}
                data={dobData}
                titleModal={" Current Month's List of Birthday's"}
              />
              <MilestonesAndEventsCard
                title={"Anniversary"}
                data={waList}
                titleModal={"List of Anniversary's"}
              />
              <MilestonesAndEventsCard
                title={"New Hire's"}
                data={hireData}
                titleModal={"List of hire's"}
              />
            </div>
          }{" "}
        </Box>
      )}
    </>
  );
};

export default AnnouncementPage;
