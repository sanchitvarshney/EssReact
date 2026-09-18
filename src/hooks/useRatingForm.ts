import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetRatingQuery, useSaveRatingMutation } from "../services/kraRating";
import {
  extractMessage,
  ratingKey,
  type KraPoint,
  type RatingEntry,
} from "../types/performance-types/kraRating";
import { useToast } from "./useToast";

interface CategoryGroup {
  id: number;
  title: string;
  points: KraPoint[];
}


export const useRatingForm = (empId: string | undefined, fy: string) => {
  const {
    data: envelope,
    isFetching,
    isError: isNetworkError,
    refetch,
  } = useGetRatingQuery({ empId: empId ?? "", fy }, { skip: !empId });
  const [saveRating, { isLoading: saving }] = useSaveRatingMutation();
  const { showToast } = useToast();

  const [entries, setEntries] = useState<Record<number, RatingEntry>>({});

 
  const isAuthorized = envelope?.status === "success";
  const data = isAuthorized ? envelope.data : undefined;


  const seedFromServer = useCallback(() => {
    if (!data) return;
    const targetMonth = data.window.targetMonth;
    const seeded: Record<number, RatingEntry> = {};
    data.points.forEach((point) => {
      const key = ratingKey(point.id, targetMonth, data.yourRole);
      seeded[point.id] = data.ratings[key] ?? { percentage: null, remarks: "" };
    });
    setEntries(seeded);
  }, [data]);

  
  useEffect(() => {
    seedFromServer();
  }, [seedFromServer]);

  const updateEntry = useCallback(
    (pointId: number, field: keyof RatingEntry, value: string) => {
      setEntries((prev) => {
        const current = prev[pointId] ?? { percentage: null, remarks: "" };
        const nextValue =
          field === "percentage"
            ? value === ""
              ? null
              : Math.max(0, Math.min(100, Number(value)))
            : value;
        return { ...prev, [pointId]: { ...current, [field]: nextValue } };
      });
    },
    []
  );

  const categories = useMemo<CategoryGroup[]>(() => {
    if (!data) return [];
    const map = new Map<number, CategoryGroup>();
    data.points.forEach((point) => {
      if (!map.has(point.category_id)) {
        map.set(point.category_id, {
          id: point.category_id,
          title: point.category_title,
          points: [],
        });
      }
      map.get(point.category_id)!.points.push(point);
    });
    return Array.from(map.values());
  }, [data]);

  // The other role's rating for this same point/month, shown read-only.
  const readOnlyValue = useCallback(
    (pointId: number): RatingEntry | null => {
      if (!data) return null;
      const otherRole = data.yourRole === "employee" ? "manager" : "employee";
      const key = ratingKey(pointId, data.window.targetMonth, otherRole);
      return data.ratings[key] ?? null;
    },
    [data]
  );

  const save = useCallback(async () => {
    if (!data || !empId) return false;
    const payload = {
      empId,
      fy,
      entries: data.points.map((point) => {
        const entry = entries[point.id] ?? { percentage: null, remarks: "" };
        return { pointId: point.id, percentage: entry.percentage ?? 0, remarks: entry.remarks };
      }),
    };
    try {
      const res = await saveRating(payload).unwrap();
      if (res.status === "error") {
        showToast(extractMessage(res.message, "Could not save rating"), "error");
        return false;
      }
      showToast(
        extractMessage(res.message, `Rating saved for ${res.data?.month ?? data.window.targetMonth}`),
        "success"
      );
      return true;
    } catch (err: any) {
      showToast(extractMessage(err?.data?.message, "Could not save rating"), "error");
      return false;
    }
  }, [data, empId, fy, entries, saveRating, showToast]);

  return {
    isFetching,
    isNetworkError,
    isAuthorized,
    envelope,
    data,
    categories,
    entries,
    updateEntry,
    readOnlyValue,
    save,
    saving,
    refetch,
    resetEntries: seedFromServer,
  };
};
