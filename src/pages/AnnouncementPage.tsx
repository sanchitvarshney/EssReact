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
// import PostAnniversaryCard from "../components/reuseable/PostAnniversaryCard";
import { useLeaveListMutation } from "../services/Leave";
import AbsenceListPage from "../components/AbsenceListPage";
import underprogress from "../assets/under-maintenance.png"

const AnnouncementPage = () => {
  const { showToast } = useToast();
  const [postFilter, setPostFilter] = useState<string>("announcement");
  const [expandedPanel, setExpandedPanel] = useState("birthdays");
  const [
    getDOBList,
    { data: dobData, isLoading: dobLoading, error: dobError },
  ] = useGetDOBListMutation();

  const [getWAList, { data: waList, isLoading: waLoading, error: waError }] =
    useGetWAListMutation();
  const [leaveList, { data: leaveData, isLoading: leaveLoading }] =
    useLeaveListMutation();
 
  const {
    data: hireData,
    isLoading: hireLoading,
    error: hireError,
  } = useGetHireListQuery();
  useEffect(() => {
    getDOBList({ type: "DOB" });
    getWAList({ type: "WA" });
    leaveList()
      .then((res) => {
        if (res?.data?.data?.success === false) {
          showToast(res?.data?.data?.message || res.data?.message.msg, "error");
        }
      })
      .catch((err) => {
        showToast(
          err?.data?.message?.msg ||
            err?.message ||
            "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.",
          "error"
        );
      });
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
          "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.",
        "error"
      );
    }
  }, [dobError, waError, hireError]);

  return (
    <>
      {dobLoading || waLoading || hireLoading || leaveLoading ? (
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
                    authorName="MsCorpres Development Team"
                    authorRole="Engineer"
                    description="Our brain has fridge, we are working on this and coming soon..."
                    images={[
                      underprogress
                    ]}
                    timeAgo="0 hours ago"
                  />
                </motion.div>
              );
            })}
            {/* <PostAnniversaryCard authorName={"test"} /> */}
          </div>
          {
            <div className="flex flex-col items-center  sm:gap-4  hidden sm:flex">
              <MilestonesAndEventsCard
                title="Current Month's Birthdays"
                data={dobData}
                expanded={expandedPanel === "birthdays"}
                onChange={() =>
                  setExpandedPanel(
                    expandedPanel === "birthdays" ? "" : "birthdays"
                  )
                }
              />

              <MilestonesAndEventsCard
                title="Anniversary"
                data={waList}
                expanded={expandedPanel === "anniversary"}
                onChange={() =>
                  setExpandedPanel(
                    expandedPanel === "anniversary" ? "" : "anniversary"
                  )
                }
              />

              <MilestonesAndEventsCard
                title="New Hire's"
                data={hireData}
                expanded={expandedPanel === "newhires"}
                onChange={() =>
                  setExpandedPanel(
                    expandedPanel === "newhires" ? "" : "newhires"
                  )
                }
              />
              <AbsenceListPage
                title="Today's On Office Absence"
                data={leaveData?.data}
                expanded={expandedPanel === "absence"}
                onChange={() =>
                  setExpandedPanel(expandedPanel === "absence" ? "" : "absence")
                }
              />
           
            </div>
          }{" "}
        </Box>
      )}
    </>
  );
};

export default AnnouncementPage;
