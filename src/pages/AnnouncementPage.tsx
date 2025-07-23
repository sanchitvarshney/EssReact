import { Box, CircularProgress } from "@mui/material";
import { useInView } from "react-intersection-observer";

import MilestonesAndEventsCard from "../components/MilestonesAndEventsCard";
import PostHeader from "../components/header/PostHeader";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import {
  useGetDOBListMutation,
  useGetHireListQuery,
  useGetWAListMutation,
} from "../services/events";
import AnnouncementPageSkeleton from "../skeleton/AnnouncementPageSkeleton";
import { useToast } from "../hooks/useToast";

import { useLeaveListMutation } from "../services/Leave";
import AbsenceListPage from "../components/AbsenceListPage";

import { useLazyGetVibeQuery } from "../services/vibe";

const AnnouncementList = lazy(() => import("../components/AnnouncementList"));

const AnnouncementPage = () => {
  const { showToast } = useToast();
  const [postFilter, setPostFilter] = useState<string>("all");
  const [expandedPanel, setExpandedPanel] = useState("birthdays");
  const [lastId, setLastId] = useState<string | null>(null);
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

  const [getVibe, { data: vibeData, isLoading: vibeLoading }] =
    useLazyGetVibeQuery();
  const [posts, setPosts] = useState<any>([]);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;
  const fetchInitialData = async () => {
    try {
      await Promise.all([
        getDOBList({ type: "DOB" }),
        getWAList({ type: "WA" }),
      ]);
    } catch (err) {
      showToast("Failed to load data", "error");
    }
  };
  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
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

  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  const loadMorePosts = async () => {
    if (!hasMore) return;

    try {
      const res = await getVibe({
        limit,
        last_id: lastId,
        tmln_type: postFilter,
      }).unwrap();

     

      if (res?.data?.success === false) {
        showToast(res?.data?.message || "Failed to load posts", "error");
        return;
      }

      

     
    } catch (err) {
      showToast(
        //@ts-ignore
        err?.data?.message?.msg ||
          // @ts-ignore
          err?.message ||
          "We're Sorry An unexpected error has occurred.",
        "error"
      );
    }
  };

  useEffect(() => {
    if (vibeData?.data) {
      

      const newPosts = vibeData?.data || [];
      const scrollInfo = vibeData?.scroll || {};

      setPosts((prev: any) => [...prev, ...newPosts]);
       // Update pagination
      setHasMore(scrollInfo?.hasMore ?? false);
      setLastId(scrollInfo?.nextLastId || null);
    }
  }, [vibeData?.data]);

  // Load first posts
  useEffect(() => {
    loadMorePosts();
  }, []);

  useEffect(() => {
    if (inView && hasMore) {
      loadMorePosts();
    }
  }, [inView, hasMore]);

  const handlePanelChange = useCallback((panel: string) => {
    setExpandedPanel((prev) => (prev === panel ? "" : panel));
  }, []);
  const handleSetFilter = useCallback((filter: string) => {
    setPostFilter((prev) => (prev === filter ? "" : filter));
  }, []);

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
      {dobLoading || waLoading || hireLoading || leaveLoading || vibeLoading ? (
        <AnnouncementPageSkeleton />
      ) : (
        <Box className=" h-[calc(100vh-90px)] overflow-auto p-4 gap-4 grid  sm:grid-cols-[2fr_1fr] grid-cols-1  md:grid-cols-[2fr_1fr] lg:grid-cols-[3fr_1fr] ">
          {" "}
          <div className="flex flex-col gap-4">
            <div className="sticky top-[-30px] z-10 ">
              <PostHeader setFilter={handleSetFilter} postFilter={postFilter} />
            </div>
            <div className="space-y-6">
              <Suspense fallback={<CircularProgress sx={{ color: "#2eacb3" }} />}>
                <AnnouncementList posts={posts} hasMore={hasMore} ref={ref} />
              </Suspense>
            </div>
          </div>
          {/* <PostAnniversaryCard authorName={"test"} /> */}
          {
            <div className="flex flex-col items-center  sm:gap-4  hidden sm:flex">
              <MilestonesAndEventsCard
                title="Current Month's Birthdays"
                data={dobData}
                expanded={expandedPanel === "birthdays"}
                onChange={() => handlePanelChange("birthdays")}
              />

              <MilestonesAndEventsCard
                title="Anniversary"
                data={waList}
                expanded={expandedPanel === "anniversary"}
                onChange={() => handlePanelChange("anniversary")}
              />

              <MilestonesAndEventsCard
                title="New Hire's"
                data={hireData}
                expanded={expandedPanel === "newhires"}
                onChange={() => handlePanelChange("newhires")}
              />
              <AbsenceListPage
                title="Today's On Office Absence"
                data={leaveData?.data}
                expanded={expandedPanel === "absence"}
                onChange={() => handlePanelChange("absence")}
              />
            </div>
          }{" "}
        </Box>
      )}
    </>
  );
};

export default AnnouncementPage;
