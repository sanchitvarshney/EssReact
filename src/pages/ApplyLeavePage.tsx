import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { CircularProgress, Chip } from "@mui/material";
import { Textarea } from "../components/ui/textarea";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SendIcon from "@mui/icons-material/Send";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { useEffect, useRef, useState } from "react";

import CalenderView from "../components/reuseable/CalederView";
import { Input } from "../components/ui/input";

import SearchBarComponent from "../components/dropdowns/SearchBarComponent";
import CustomTextInput from "../components/reuseable/CustomTextInput";
import CustomModalDatePicker from "../components/reuseable/CustomModalDatePicker";
import {
  useApplySLLeaveMutation,
  useGetLeaveBalanceMutation,
  useGetLeaveCalculateMutation,
} from "../services/Leave";
import moment from "moment";

import DotLoading from "../components/reuseable/DotLoading";
import { useToast } from "../hooks/useToast";
import ConfirmationModal from "../components/reuseable/ConfirmationModal";

const ApplyLeaveOption = [
  { value: "EL",  label: "Earned Leave" },
  { value: "SL",  label: "Sick / Casual" },
  { value: "WFH", label: "Work From Home" },
  { value: "OD",  label: "On Duty" },
  { value: "CL",  label: "Compensatory" },
  { value: "ACL", label: "Apply Comp. Leave" },
  { value: "LWP", label: "Leave Without Pay" },
];

const schema = z
  .object({
    wise: z.string().min(1, { message: "Select value is required" }),
    fromSession: z.number().optional(),
    toSession: z.number().optional(),
    message: z.string().min(15, { message: "Reason is required — write at least 15 characters" }),
    fromDate: z.date().optional(),
    toDate: z.date().optional(),
    compensatoryDate: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.wise === "ACL") return data.compensatoryDate && data.compensatoryDate.length > 0;
      return data.fromSession && data.toSession && data.fromDate && data.toDate;
    },
    { message: "Please fill all required fields based on leave type", path: ["root"] },
  );

const SectionLabel = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center gap-1.5 mb-2">
    {icon}
    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{label}</span>
  </div>
);

const ApplyLeavePage = ({ onClose }: { onClose: () => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const [searchText, setSearchText] = useState<string>("");
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [urlKey, setUrlKey] = useState<string>("");
  const [recipient, setRecipient] = useState<any[]>([]);
  const [isConfirm, setIsConfirm] = useState<boolean>(false);

  const [applySLLeave, { isLoading: applySLLeaveLoading }] = useApplySLLeaveMutation();
  const [getLeaveBalance, { isLoading: getLeaveBalanceLoading, data: getLeaveBalanceData }] =
    useGetLeaveBalanceMutation();
  const [getLeaveCalculate, { isLoading: getLeaveCalculateLoading, data: getLeaveCalculateData }] =
    useGetLeaveCalculateMutation();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const toDate = form.watch("toDate");
  const fromDate = form.watch("fromDate");
  const type = form.watch("wise");
  const startSession = form.watch("fromSession");
  const endSession = form.watch("toSession");
  const messageValue = form.watch("message") || "";

  const handleGetUrl = (value: string) => {
    const urlMap: Record<string, string> = {
      EL: "sendELLeaveRequest",
      SL: "sendSLLeaveRequest",
      WFH: "sendWFHRequest",
      OD: "sendODRequest",
      CL: "sendCLRequest",
      ACL: "sendACLLeaveRequest",
      LWP: "sendLWPRequest",
    };
    setUrlKey(urlMap[value] || "");
  };

  useEffect(() => {
    if (type) {
      handleGetUrl(type);
      getLeaveBalance({ type })
        .then((res) => {
          if (res?.data?.code === 500) showToast(res?.data?.message?.msg, "error");
        })
        .catch((err) => {
          showToast(err?.data?.message?.msg || err?.message || "An unexpected error occurred.", "error");
        });
    }
  }, [type]);

  const handleSetRecipient = (value: any) => {
    if (recipient.some((r: any) => r.id === value.id)) {
      showToast("Recipient already added", "error");
      return;
    }
    if (recipient.length >= 3) {
      showToast("Maximum 3 recipients allowed", "error");
      return;
    }
    setRecipient((prev) => [...prev, value]);
    setSearchText("");
    setOpenSearch(false);
  };

  useEffect(() => {
    if (toDate && startSession && endSession && type && fromDate) {
      getLeaveCalculate({
        endDate: moment(toDate).format("DD-MM-YYYY"),
        endSession,
        startDate: moment(fromDate).format("DD-MM-YYYY"),
        startSession,
        leaveType: type,
      })
        .then((res) => {
          if (res?.data?.code === 500) showToast(res?.data?.message?.msg, "error");
        })
        .catch((err) => {
          showToast(err?.data?.message?.msg || err?.message || "An unexpected error occurred.", "error");
        });
    }
  }, [toDate, startSession, endSession, type, fromDate]);

  const handleConfirmSubmit = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      showToast("Please fill all required fields correctly", "error");
      return;
    }
    setIsConfirm(true);
  };

  const onSubmit = async () => {
    setIsConfirm(false);
    const data = form.getValues();

    let payload;
    if (type === "ACL") {
      payload = {
        comp_date: data.compensatoryDate,
        email_cc: recipient.map((item: any) => item.id),
        type: data.wise,
        reason: data.message,
      };
    } else {
      payload = {
        comp_date: null,
        email_cc: recipient.map((item: any) => item.id),
        endDate: moment(data.toDate).format("DD-MM-YYYY"),
        endSession: data.toSession,
        startDate: moment(data.fromDate).format("DD-MM-YYYY"),
        startSession: data.fromSession,
        type: data.wise,
        reason: data.message,
      };
    }

    if (
      type !== "ACL" &&
      getLeaveCalculateData?.data?.currentBooking > getLeaveBalanceData?.leaveBalance?.balance
    ) {
      showToast("Insufficient leave balance", "error");
      return;
    }

    applySLLeave({ url: urlKey, body: payload })
      .then((res) => {
        if (res?.data?.status === "success") {
          form.reset();
          setRecipient([]);
          onClose();
          showToast(res?.data?.message, "success");
        }
        if (res?.data?.status === "error") {
          showToast(res?.data?.message?.msg, "error");
        }
      })
      .catch((err) => {
        showToast(err?.data?.message?.msg || err?.message || "An unexpected error occurred.", "error");
      });
  };

  const balance = getLeaveBalanceData?.leaveBalance?.balance ?? 0;
  const currentBooking = getLeaveCalculateData?.data?.currentBooking;

  return (
    <>
      <div className="flex flex-col h-full">

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto custom-scrollbar-for-menu px-5 py-4 flex flex-col gap-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">

              {/* ── Leave type chip grid ── */}
              <div>
                <SectionLabel
                  icon={<EventNoteIcon sx={{ fontSize: 14, color: "#94a3b8" }} />}
                  label="Leave Type"
                />
                <FormField
                  control={form.control}
                  name="wise"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {ApplyLeaveOption.map(({ value, label }, idx) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => field.onChange(value)}
                              className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all text-left ${
                                idx === ApplyLeaveOption.length - 1 &&
                                ApplyLeaveOption.length % 2 !== 0
                                  ? "col-span-2 sm:col-span-1"
                                  : ""
                              } ${
                                field.value === value
                                  ? "bg-[#2eacb3] text-white border-[#2eacb3] shadow-sm"
                                  : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#2eacb3]/50 hover:bg-[#f0fdfe]"
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 mt-1 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* ── Balance pill ── */}
              {type && (
                <div className="flex items-center gap-3 bg-gradient-to-r from-[#e0f7fa] to-[#f0fdfe] rounded-2xl px-5 py-3.5 border border-[#2eacb3]/20">
                  <div className="w-9 h-9 rounded-xl bg-[#2eacb3]/15 flex items-center justify-center flex-shrink-0">
                    <AccountBalanceWalletIcon sx={{ color: "#0097a7", fontSize: 20 }} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#0097a7] leading-none mb-0.5">
                      Available Balance
                    </p>
                    {getLeaveBalanceLoading ? (
                      <DotLoading />
                    ) : (
                      <p className="text-xl font-bold text-[#006064] leading-none">
                        {balance}
                        <span className="text-xs font-normal text-[#00838f] ml-1">days</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ── Dates & Sessions ── */}
              {type !== "ACL" ? (
                <>
                  <div>
                    <SectionLabel
                      icon={<CalendarMonthIcon sx={{ fontSize: 14, color: "#94a3b8" }} />}
                      label="Date Range"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name="fromDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <CustomModalDatePicker field={field} openTo="day" view={["year", "month", "day"]} label="From Date" />
                            </FormControl>
                            <FormMessage className="text-red-500 mt-1 text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="toDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <CustomModalDatePicker field={field} openTo="day" view={["year", "month", "day"]} label="To Date" />
                            </FormControl>
                            <FormMessage className="text-red-500 mt-1 text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {getLeaveBalanceLoading ? (
                    <DotLoading />
                  ) : (
                    getLeaveBalanceData && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="fromSession"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <CustomTextInput select field={field} label="From Session" options={getLeaveBalanceData?.leaveOptions?.options} />
                              </FormControl>
                              <FormMessage className="text-red-500 mt-1 text-xs" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="toSession"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <CustomTextInput select field={field} label="To Session" options={getLeaveBalanceData?.leaveOptions?.options} />
                              </FormControl>
                              <FormMessage className="text-red-500 mt-1 text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>
                    )
                  )}
                </>
              ) : (
                <FormField
                  control={form.control}
                  name="compensatoryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CustomTextInput select field={field} label="Select Compensatory Date" options={getLeaveBalanceData?.compensatoryDates ?? []} />
                      </FormControl>
                      <FormMessage className="text-red-500 mt-1 text-xs" />
                    </FormItem>
                  )}
                />
              )}

              {/* ── Duration preview ── */}
              {getLeaveCalculateLoading ? (
                <DotLoading />
              ) : (
                currentBooking && (
                  <div className="rounded-2xl border border-[#2eacb3]/20 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenCalendar(!openCalendar)}
                      className="w-full flex items-center justify-between bg-[#e0f7fa] px-4 py-3 hover:bg-[#c8f0f3] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <EventNoteIcon sx={{ color: "#0097a7", fontSize: 16 }} />
                        <span className="text-[#006064] font-semibold text-sm">
                          Duration:{" "}
                          <span className="text-[#2eacb3] font-bold">
                            {currentBooking} {currentBooking === 1 ? "day" : "days"}
                          </span>
                        </span>
                      </div>
                      {openCalendar
                        ? <KeyboardArrowUpIcon sx={{ color: "#0097a7", fontSize: 18 }} />
                        : <KeyboardArrowDownIcon sx={{ color: "#0097a7", fontSize: 18 }} />}
                    </button>
                    {openCalendar && (
                      <div className="bg-white p-3 border-t border-[#2eacb3]/20">
                        <CalenderView startDate={fromDate} endDate={toDate} paid={currentBooking} type={type} />
                      </div>
                    )}
                  </div>
                )
              )}

              {/* ── Reason ── */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                      Reason <span className="text-red-400 normal-case">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          maxLength={500}
                          minLength={15}
                          rows={4}
                          className="border resize-none border-gray-200 text-sm rounded-xl bg-gray-50 focus:border-[#2eacb3] focus:ring-2 focus:ring-[#2eacb3]/20 transition-all min-h-[90px]"
                          placeholder="Describe your reason (minimum 15 characters)…"
                          {...field}
                        />
                        <span className="absolute bottom-2.5 right-3 text-xs text-gray-300 pointer-events-none tabular-nums">
                          {messageValue.length}/500
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 mt-1 text-xs" />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          {/* ── CC Recipients — always visible, no accordion ── */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <PersonAddIcon
                sx={{ fontSize: 16, color: recipient.length > 0 ? "#2eacb3" : "#94a3b8" }}
              />
              <span
                className={`text-[11px] font-bold uppercase tracking-wide ${
                  recipient.length > 0 ? "text-[#2eacb3]" : "text-gray-400"
                }`}
              >
                CC Recipients
              </span>
              <span className="text-[11px] text-gray-400">(optional · max 3)</span>
              {recipient.length > 0 && (
                <Chip
                  label={`${recipient.length} / 3`}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: 10,
                    fontWeight: 700,
                    bgcolor: "#e0f7fa",
                    color: "#0097a7",
                    border: "1px solid rgba(46,172,179,0.25)",
                    "& .MuiChip-label": { px: 1 },
                  }}
                />
              )}
            </div>

            {/* Added recipient chips */}
            {recipient.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {recipient.map((value: any, index: number) => (
                  <Chip
                    key={index}
                    label={value?.text}
                    size="small"
                    sx={{
                      bgcolor: "#e0f7fa",
                      color: "#006064",
                      fontWeight: 600,
                      fontSize: 11,
                      border: "1px solid rgba(46,172,179,0.25)",
                      "& .MuiChip-deleteIcon": { color: "#0097a7", "&:hover": { color: "#006064" } },
                    }}
                    onDelete={() => setRecipient((prev) => prev.filter((_, i) => i !== index))}
                  />
                ))}
              </div>
            )}

            {/* Search input or max-reached message */}
            {recipient.length < 3 ? (
              <>
                <Input
                  ref={inputRef}
                  value={searchText}
                  className="w-full rounded-xl border-gray-200 bg-white focus:border-[#2eacb3] focus:ring focus:ring-[#2eacb3]/20 transition-all text-sm"
                  placeholder="Search by name or employee code…"
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setOpenSearch(true);
                  }}
                />
                {/* zIndex={1400} ensures results render above Dialog (z-index 1300) */}
                {searchText && (
                  <SearchBarComponent
                    open={openSearch}
                    close={() => { setOpenSearch(false); setSearchText(""); }}
                    searchQuary={searchText}
                    anchorRef={inputRef}
                    selectedIndex={-1}
                    setSelectedIndex={() => {}}
                    width={
                      inputRef.current?.offsetWidth
                        ? `${inputRef.current.offsetWidth}px`
                        : "460px"
                    }
                    onSelect={handleSetRecipient}
                    shouldNavigateOnSelect={false}
                    zIndex={1400}
                  />
                )}
              </>
            ) : (
              <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100 px-3 py-2 rounded-xl">
                Maximum 3 CC recipients reached. Remove one to add another.
              </div>
            )}
          </div>
        </div>

        {/* ── Sticky footer with Apply button ── */}
        <div className="flex-shrink-0 border-t border-gray-100 bg-white px-5 py-3.5 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-400 truncate">
            {type ? (
              <>
                Applying for:{" "}
                <span className="font-semibold text-gray-700">
                  {ApplyLeaveOption.find((o) => o.value === type)?.label}
                </span>
              </>
            ) : (
              "Select a leave type to continue"
            )}
          </p>
          <button
            type="button"
            onClick={handleConfirmSubmit}
            disabled={applySLLeaveLoading || !type}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#2eacb3] to-[#0097a7] hover:from-[#0097a7] hover:to-[#2eacb3] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm flex-shrink-0"
          >
            {applySLLeaveLoading ? (
              <>
                <CircularProgress size={14} sx={{ color: "#fff" }} />
                <span>Submitting…</span>
              </>
            ) : (
              <>
                <SendIcon sx={{ fontSize: 15 }} />
                <span>Apply Leave</span>
              </>
            )}
          </button>
        </div>
      </div>

      <ConfirmationModal
        open={isConfirm}
        close={() => setIsConfirm(false)}
        aggree={onSubmit}
        title={`Confirm ${ApplyLeaveOption.find((o) => o.value === type)?.label ?? type}`}
        description="Please confirm you want to submit this leave request."
      />
    </>
  );
};

export default ApplyLeavePage;
