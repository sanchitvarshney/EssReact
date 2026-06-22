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
import { CircularProgress } from "@mui/material";
import { Textarea } from "../components/ui/textarea";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Chip } from "@mui/material";

import { CustomButton } from "../components/ui/CustomButton";
import { useEffect, useRef, useState } from "react";

import CalenderView from "../components/reuseable/CalederView";
import { Input } from "../components/ui/input";

import SearchBarComponent from "../components/dropdowns/SearchBarComponent";
import CustomTextInput from "../components/reuseable/CustomTextInput";
import CustomModalDatePicker from "../components/reuseable/CustomModalDatePicker";
import { btnstyle } from "../constants/themeConstant";
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
  { value: "EL", label: "Earned Leave" },
  { value: "SL", label: "Sick/Casual Leave" },
  { value: "WFH", label: "Work From Home" },
  { value: "OD", label: "On Duty" },
  { value: "CL", label: "Compensatory Availment" },
  { value: "ACL", label: "Apply for Compensatory Leave" },
  { value: "LWP", label: "Leave Without Pay" },
];

const schema = z
  .object({
    wise: z.string().min(1, { message: "Select value is required" }),
    fromSession: z.number().optional(),
    toSession: z.number().optional(),
    message: z
      .string()
      .min(15, { message: "Reason is required please write more" }),
    fromDate: z.date().optional(),
    toDate: z.date().optional(),
    compensatoryDate: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.wise === "ACL") {
        return data.compensatoryDate && data.compensatoryDate.length > 0;
      }
      return data.fromSession && data.toSession && data.fromDate && data.toDate;
    },
    {
      message: "Please fill all required fields based on leave type",
      path: ["root"],
    },
  );

const ApplyLeavePage = ({ onClose }: { onClose: () => void }) => {
  const inputRef = useRef(null);
  const { showToast } = useToast();
  const [searchText, setSearchText] = useState<string>("");
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [addRecipient, setAddRecipient] = useState<boolean>(false);
  const [urlKey, setUrlKey] = useState<string>("");
  const [recipient, setRecipient] = useState<any[]>([]);
  const [isConfirm, setIsConfirm] = useState<boolean>(false);

  const [applySLLeave, { isLoading: applySLLeaveLoading }] =
    useApplySLLeaveMutation();
  const [
    getLeaveBalance,
    { isLoading: getLeaveBalanceLoading, data: getLeaveBalanceData },
  ] = useGetLeaveBalanceMutation();
  const [
    getLeaveCalculate,
    { isLoading: getLeaveCalculateLoading, data: getLeaveCalculateData },
  ] = useGetLeaveCalculateMutation();

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
          if (res?.data?.code === 500)
            showToast(res?.data?.message?.msg, "error");
        })
        .catch((err) => {
          showToast(
            err?.data?.message?.msg ||
              err?.message ||
              "An unexpected error occurred.",
            "error",
          );
        });
    }
  }, [type]);

  const handleSetRecipient = (value: any) => {
    if (recipient.some((r: any) => r.id === value.id)) {
      showToast("Recipient already exists", "error");
      return;
    }
    if (recipient.length >= 3) {
      showToast("You can only add up to 3 recipients", "error");
      return;
    }
    setRecipient((prev) => [...prev, value]);
    setSearchText("");
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
          if (res?.data?.code === 500)
            showToast(res?.data?.message?.msg, "error");
        })
        .catch((err) => {
          showToast(
            err?.data?.message?.msg ||
              err?.message ||
              "An unexpected error occurred.",
            "error",
          );
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
      getLeaveCalculateData?.data?.currentBooking >
        getLeaveBalanceData?.leaveBalance?.balance
    ) {
      showToast("You don't have enough leave balance", "error");
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
        showToast(
          err?.data?.message?.msg ||
            err?.message ||
            "An unexpected error occurred.",
          "error",
        );
      });
  };

  const balance = getLeaveBalanceData?.leaveBalance?.balance ?? 0;
  const currentBooking = getLeaveCalculateData?.data?.currentBooking;

  return (
    <>
      {/* DialogContent is now overflow:hidden flex-col, so h-full works here */}
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto flex flex-col gap-5 p-4 md:p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              {/* Leave type */}
              <FormField
                control={form.control}
                name="wise"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CustomTextInput
                        select
                        field={field}
                        label="Select Leave Type"
                        options={ApplyLeaveOption}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 mt-1 text-xs" />
                  </FormItem>
                )}
              />

              {/* Balance card — centered below the dropdown */}
              {type && (
                <div className="flex justify-center">
                  <div className="flex items-center gap-3 bg-gradient-to-br from-[#e0f7fa] to-[#b2ebf2] rounded-xl px-6 py-3 border border-[#80deea] shadow-sm">
                    <AccountBalanceWalletIcon
                      sx={{ color: "#0097a7", fontSize: 24 }}
                    />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#0097a7] leading-none mb-0.5">
                        Available Balance
                      </p>
                      {getLeaveBalanceLoading ? (
                        <DotLoading />
                      ) : (
                        <p className="text-xl font-bold text-[#006064] leading-none">
                          {balance}
                          <span className="text-xs font-normal text-[#00838f] ml-1">
                            days
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Date / session fields */}
              {type !== "ACL" ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fromDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <CustomModalDatePicker
                              field={field}
                              openTo="day"
                              view={["year", "month", "day"]}
                              label="From Date"
                            />
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
                            <CustomModalDatePicker
                              field={field}
                              openTo="day"
                              view={["year", "month", "day"]}
                              label="To Date"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 mt-1 text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {getLeaveBalanceLoading ? (
                    <DotLoading />
                  ) : (
                    getLeaveBalanceData && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="fromSession"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <CustomTextInput
                                  select
                                  field={field}
                                  label="From Session"
                                  options={
                                    getLeaveBalanceData?.leaveOptions?.options
                                  }
                                />
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
                                <CustomTextInput
                                  select
                                  field={field}
                                  label="To Session"
                                  options={
                                    getLeaveBalanceData?.leaveOptions?.options
                                  }
                                />
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
                        <CustomTextInput
                          select
                          field={field}
                          label="Select Compensatory Date"
                          options={getLeaveBalanceData?.leaveBalance?.balance}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 mt-1 text-xs" />
                    </FormItem>
                  )}
                />
              )}

              {/* Leave duration card */}
              {getLeaveCalculateLoading ? (
                <DotLoading />
              ) : (
                currentBooking && (
                  <div className="rounded-xl border border-[#b2ebf2] overflow-hidden shadow-sm">
                    <button
                      type="button"
                      onClick={() => setOpenCalendar(!openCalendar)}
                      className="w-full flex items-center justify-between bg-[#e0f7fa] px-4 py-2.5 hover:bg-[#c8f0f3] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <EventNoteIcon
                          sx={{ color: "#0097a7", fontSize: 18 }}
                        />
                        <span className="text-[#006064] font-semibold text-sm">
                          Leave duration:{" "}
                          <span className="text-[#2eacb3] font-bold">
                            {currentBooking}{" "}
                            {currentBooking === 1 ? "day" : "days"}
                          </span>
                        </span>
                      </div>
                      {openCalendar ? (
                        <KeyboardArrowUpIcon
                          sx={{ color: "#0097a7", fontSize: 20 }}
                        />
                      ) : (
                        <KeyboardArrowDownIcon
                          sx={{ color: "#0097a7", fontSize: 20 }}
                        />
                      )}
                    </button>
                    {openCalendar && (
                      <div className="bg-white p-3 border-t border-[#b2ebf2]">
                        <CalenderView
                          startDate={fromDate}
                          endDate={toDate}
                          paid={currentBooking}
                          type={type}
                        />
                      </div>
                    )}
                  </div>
                )
              )}

              {/* Reason */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-sm text-gray-700">
                      Reason <span className="text-red-400">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          maxLength={500}
                          minLength={15}
                          rows={4}
                          className="border resize-none border-gray-300 text-sm rounded-lg focus:border-[#2eacb3] focus:ring-2 focus:ring-[#2eacb3]/20 transition-all min-h-[90px]"
                          placeholder="Describe your reason (minimum 15 characters)"
                          {...field}
                        />
                        <span className="absolute bottom-2 right-3 text-xs text-gray-400 pointer-events-none">
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

          {/* CC Recipients — outside form, state-managed */}
          <div className="border border-gray-200 rounded-xl ">
            <button
              type="button"
              onClick={() => setAddRecipient(!addRecipient)}
              className="w-full flex items-center rounded-xl justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <PersonAddIcon sx={{ fontSize: 17, color: "#6b7280" }} />
                <span className="text-sm font-semibold text-gray-600">
                  CC Recipients
                </span>
                {recipient.length > 0 && (
                  <Chip
                    label={recipient.length}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: 11,
                      bgcolor: "#2eacb3",
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  />
                )}
              </div>
              {addRecipient ? (
                <KeyboardArrowUpIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
              ) : (
                <KeyboardArrowDownIcon
                  sx={{ fontSize: 18, color: "#9ca3af" }}
                />
              )}
            </button>

            {addRecipient && (
              <div className="px-4 py-3 space-y-3 bg-white border-b border-gray-100 rounded-xl">
                <Input
                  ref={inputRef}
                  value={searchText}
                  className="w-full rounded-lg border-gray-300 focus:border-[#2eacb3] focus:ring focus:ring-[#2eacb3]/20 transition-all text-sm"
                  placeholder="Search and add recipients..."
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setOpenSearch(true);
                  }}
                />
                {recipient.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {recipient.map((value: any, index: number) => (
                      <Chip
                        key={index}
                        label={value?.text}
                        sx={{
                          bgcolor: "rgba(46, 172, 179, 0.1)",
                          color: "#006064",
                          fontWeight: 500,
                          borderRadius: 2,
                          fontSize: 13,
                          border: "1px solid rgba(46,172,179,0.25)",
                        }}
                        onDelete={() =>
                          setRecipient((prev) =>
                            prev.filter((_, i) => i !== index),
                          )
                        }
                      />
                    ))}
                  </div>
                )}
                {searchText && (
                  <SearchBarComponent
                    open={openSearch}
                    close={() => setOpenSearch(false)}
                    searchQuary={searchText}
                    anchorRef={inputRef}
                    selectedIndex={-1}
                    setSelectedIndex={() => {}}
                    width="300px"
                    onSelect={handleSetRecipient}
                    shouldNavigateOnSelect={false}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Button always at the bottom — flex-shrink-0 prevents it from being squeezed */}
        <div className="bg-[#444445] border-t border-gray-600 py-3 flex justify-center flex-shrink-0">
          <CustomButton
            onClick={handleConfirmSubmit}
            className={btnstyle}
            style={{ marginTop: "0px" }}
          >
            {applySLLeaveLoading ? (
              <CircularProgress sx={{ color: "#ffffff" }} size={22} />
            ) : (
              "Apply Leave"
            )}
          </CustomButton>
        </div>
      </div>

      <ConfirmationModal
        open={isConfirm}
        close={() => setIsConfirm(false)}
        aggree={onSubmit}
        title={`Confirm ${type} Application`}
        description={`Do you want to apply for ${type} request?`}
      />
    </>
  );
};

export default ApplyLeavePage;
