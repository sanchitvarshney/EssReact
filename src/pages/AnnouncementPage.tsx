import { Typography } from "@mui/material";
import { useInView } from "react-intersection-observer";

import MilestonesAndEventsCard from "../components/MilestonesAndEventsCard";
import PostHeader from "../components/header/PostHeader";
import {  useCallback, useEffect, useState } from "react";
import {
  useGetDOBListMutation,
  useGetHireListQuery,
  useGetWAListMutation,
} from "../services/events";
import AnnouncementPageSkeleton from "../skeleton/AnnouncementPageSkeleton";
import { useToast } from "../hooks/useToast";

import { useLeaveListMutation } from "../services/Leave";
import AbsenceListPage from "../components/AbsenceListPage";

import { useLazyGetVibeQuery, useCreatePostMutation } from "../services/vibe";

import AnnouncementList from "../components/AnnouncementList";

const AnnouncementPage = () => {
  const { showToast } = useToast();
  const [postFilter, setPostFilter] = useState<string>("");
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

  const [posts, setPosts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [lastId, setLastId] = useState<string | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(5);

  

  const [getVibe, { isLoading: vibeLoading }] = useLazyGetVibeQuery();
  const [createPost] =
    useCreatePostMutation();

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
          return;
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

  useEffect(() => {
    setPosts([]);
    setLastId(null);
    setHasMore(true);
    setLimit(5); // <-- Use your default page size here
    setOffset(0);
    loadMorePosts(true);
  }, [postFilter]);

  const loadMorePosts = async (reset = false) => {
    if (loadingPosts || !hasMore) return;
    setLoadingPosts(true);

    try {
      const res = await getVibe({
        limit,
        offset: reset ? 0 : offset,
        last_id: reset ? null : lastId,
        tmln_type: postFilter,
      }).unwrap();

      if (res?.data?.success === false) {
        showToast(res?.data?.message || "Failed to load posts", "error");
        setLoadingPosts(false);
        return;
      }

      const newPosts = res?.data || [];
      const scrollInfo = res?.scroll || {};

      setPosts((prev) => (reset ? newPosts : [...prev, ...newPosts]));
      setHasMore(scrollInfo?.hasMore ?? false);
      setLastId(scrollInfo?.nextLastId || null);
      setOffset((prevOffset: any) =>
        reset ? limit : (prevOffset || 0) + limit
      );
    } catch (err) {
      showToast(
        //@ts-ignore
        err?.data?.message?.msg ||
          //@ts-ignore
          err?.message ||
          "We're Sorry An unexpected error has occurred.",
        "error"
      );
    } finally {
      setLoadingPosts(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadMorePosts(true);
  }, []);

  // Infinite scroll trigger
  useEffect(() => {
    if (inView && hasMore && !loadingPosts) {
      loadMorePosts();
    }
  }, [inView, hasMore, loadingPosts]);

  const handlePanelChange = useCallback((panel: string) => {
    setExpandedPanel((prev) => (prev === panel ? "" : panel));
  }, []);
  const handleSetFilter = useCallback((filter: string) => {
    setPostFilter((prev) => (prev === filter ? "" : filter));
  }, []);

  const handleCreatePost = async (payload: any) => {
    try {
      const res = await createPost(payload).unwrap();
      showToast(
        (res as any)?.data?.message || "Post created successfully",
        "success"
      );
      // Call vibe API with exact parameters after successful post creation
      loadMorePosts(true);

      return { success: true };
    } catch (err: any) {
      showToast(
        err?.data?.message?.msg ||
          err?.message ||
          "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.",
        "error"
      );
      return { success: false };
    }
  };

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
        <div className="h-[calc(100vh-78px)] flex flex-col overflow-hidden px-3 py-4 w-full">
          {/* Page header */}
          <div className="flex items-center gap-2 mb-4">
            <div
              style={{ backgroundColor: "#2eacb3" }}
              className="w-1 h-7 rounded-full"
            />
            <Typography
              sx={{
                fontSize: { xs: 16, sm: 19 },
                fontWeight: 700,
                color: "#232324",
              }}
            >
              Team Feed
            </Typography>
          </div>

          {/* Two-column grid */}
          <div className="flex-1 overflow-hidden grid grid-cols-1 sm:grid-cols-[2fr_1fr] lg:grid-cols-[3fr_1fr] gap-4">
            {/* Left: post feed */}
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex-shrink-0 mb-3">
                <PostHeader
                  setFilter={handleSetFilter}
                  postFilter={postFilter}
                  onCreatePost={handleCreatePost}
                />
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar-for-menu">
                <AnnouncementList posts={posts} hasMore={hasMore} ref={ref} />
              </div>
            </div>

            {/* Right: sidebar */}
            <div className="hidden sm:flex flex-col h-full overflow-y-auto custom-scrollbar-for-menu gap-3 pr-1">
              <MilestonesAndEventsCard
                title="Current Month's Birthdays"
                data={dobData}
                expanded={expandedPanel === "birthdays"}
                onChange={() => handlePanelChange("birthdays")}
              />
              <MilestonesAndEventsCard
                title="Anniversaries"
                data={waList}
                expanded={expandedPanel === "anniversary"}
                onChange={() => handlePanelChange("anniversary")}
              />
              <MilestonesAndEventsCard
                title="New Hires"
                data={hireData}
                expanded={expandedPanel === "newhires"}
                onChange={() => handlePanelChange("newhires")}
              />
              <AbsenceListPage
                title="Today's Absences"
                data={leaveData?.data}
                expanded={expandedPanel === "absence"}
                onChange={() => handlePanelChange("absence")}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AnnouncementPage;
