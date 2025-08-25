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
import { Chip, GlobalStyles, Typography } from "@mui/material";

import { CustomButton } from "../components/ui/CustomButton";
import { useEffect, useRef, useState } from "react";

import CalenderView from "../components/reuseable/CalederView";
import { IconButton } from "@mui/material";
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
  {
    value: "EL",
    label: "Earned Leave",
  },
  {
    value: "SL",
    label: "Sick/Casual Leave",
  },
  {
    value: "WFH",
    label: "Work From Home",
  },
  {
    value: "OD",
    label: "On Duty",
  },
  {
    value: "CL",
    label: "Compensatory Availment",
  },
  {
    value: "ACL",
    label: "Apply for Compensatory Leave",
  },
  {
    value: "LWP",
    label: "Leave Without Pay",
  },
];

const schema = z.object({
  wise: z.string().min(1, { message: "Select value is required" }),
  fromSession: z.number().min(1, { message: "Session value is required" }),
  toSession: z.number().min(1, { message: "Session value is required" }),
  message: z
    .string()
    .min(15, { message: "Reason is required please write more" }),

  fromDate: z.date({ required_error: "From Date is required" }),
  toDate: z.date({ required_error: "To Date is required" }),

  compensatoryDate: z.string().min(1, { message: "Session value is required" }),
});

<GlobalStyles
  styles={{
    ".MuiPickersPopper-root .MuiPaper-root": {
      backgroundColor: "red",
      color: "green",
    },
    ".MuiPickersDay-root": {
      color: "green",
    },
    ".MuiPickersDay-root.Mui-selected": {
      backgroundColor: "red",
      color: "green",
    },
    ".MuiPickersDay-root:not(.Mui-selected):hover": {
      backgroundColor: "red",
    },
    ".MuiPickersCalendarHeader-root": {
      backgroundColor: "red",
      color: "green",
    },
  }}
/>;

const ApplyLeavePage = ({ onClose }: { onClose: () => void }) => {
  const inputRef = useRef(null);
  const { showToast } = useToast();
  const [searchText, setSearchText] = useState<string>("");

  const [openCalendar, setOpenCalendar] = useState<boolean>(false);
  const [openSearch, setOpenSearch] = useState<boolean>(false);

  const [addRecipient, setAddRecipient] = useState<boolean>(false);
  const [urlKey, setUrlKey] = useState<string>("");

  const [recipient, setRecipient] = useState<any>([]);
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
    mode: "onTouched",
  });

  const toDate = form.watch("toDate");
  const fromDate = form.watch("fromDate");
  const type = form.watch("wise");
  const startSession = form.watch("fromSession");
  const endSession = form.watch("toSession");

  const handleGetUrl = (value: string) => {
    switch (value) {
      case "EL":
        setUrlKey("sendELLeaveRequest");
        break;
      case "SL":
        setUrlKey("sendSLLeaveRequest");
        break;
      case "WFH":
        setUrlKey("sendWFHRequest");
        break;
      case "OD":
        setUrlKey("sendODRequest");
        break;
      case "CL":
        setUrlKey("sendCLRequest");
        break;
      case "ACL":
        setUrlKey("sendACLLeaveRequest");
        break;
      case "LWP":
        setUrlKey("sendLWPRequest");
        break;
      default:
        setUrlKey("");
    }
  };

  useEffect(() => {
    if (type) {
      handleGetUrl(type);
      getLeaveBalance({ type: type })
        .then((res) => {
          if (res?.data?.code === 500) {
            showToast(res?.data?.message?.msg, "error");
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
    }
  }, [type]);

  const handleSetRecipient = (value: any) => {
    const MAX_RECIPIENTS = 3;
    const alreadyExists = recipient.some((r: any) => r.id === value.id); // adjust `id` if needed
    if (alreadyExists) {
      showToast("Recipient already exists", "error");
      return;
    }
    if (recipient.length >= MAX_RECIPIENTS) {
      showToast("You can only add up to 3 recipients", "error");
      return;
    }

    setRecipient((prev: any) => [...prev, value]);
    setSearchText("");
  };

  useEffect(() => {
    if (toDate && startSession && endSession && type && fromDate) {
      const payload = {
        endDate: moment(toDate).format("DD-MM-YYYY"),
        endSession: endSession,
        startDate: moment(fromDate).format("DD-MM-YYYY"),
        startSession: startSession,
        leaveType: type,
      };
      getLeaveCalculate(payload)
        .then((res) => {
          if (res?.data?.code === 500) {
            showToast(res?.data?.message?.msg, "error");
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
    }
  }, [toDate, startSession, endSession, type, fromDate]);

  const handleConfirmSubmit = async () => {
    if (type === "ACL") {
      setIsConfirm(true);
      return;
    }
    const isValid = await form.trigger();

    if (!isValid) {
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
       comp_date:null,
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
      getLeaveCalculateData?.currentBooking >
      getLeaveBalanceData?.leaveBalance?.balance
    ) {
      showToast("You don't have enough leave balance", "error");
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
            "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.",
          "error"
        );
      });
  };

  return (
    <div className=" flex flex-col items-center  z-999 ">
      <div className="w-full bg-white rounded-2xl relative h-[65vh] overflow-y-auto p-6 will-change-transform md:p-6 flex flex-col gap-4">
        <div className="flex  justify-between items-center mb-2 ">
          <Typography>
            {`Available Balance :   ${
              getLeaveBalanceData?.leaveBalance?.balance
                ? getLeaveBalanceData?.leaveBalance?.balance
                : 0
            }`}
          </Typography>

          <div>
            <span
              onClick={() => setAddRecipient(!addRecipient)}
              className="text-sm font-semibold border-b-2 border-dashed border-[#2eacb3] transition-transform duration-200 hover:scale-105 mb-2 cursor-pointer px-2 py-1 hover:bg-[#e0f7fa] rounded-md"
            >
              {addRecipient ? "Hide Recipients" : "Add Recipients"}
            </span>
          </div>
        </div>
        {addRecipient && (
          <div className="mb-0">
            <span className=" font-semibold">Recipient</span>
            <Input
              ref={inputRef}
              className="w-full md:w-96 rounded-sm p-3  mt-1 border border-gray-500] focus:border-[#2eacb3] focus:ring-2 focus:ring-[#2eacb3] transition-all"
              placeholder="Add Recipients"
              onChange={(e) => {
                const value = e.target.value;
                setSearchText(value);
                setOpenSearch(true);
              }}
            />
            <div className="mt-3">
              {recipient.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {recipient.map((value: any, index: number) => (
                    <Chip
                      key={index}
                      label={value?.text}
                      sx={{
                        bgcolor: "rgba(46, 172, 179, 0.12)",
                        color: "#2eacb3",
                        fontWeight: 500,
                        borderRadius: 2,
                        px: 1.5,
                        py: 0.5,
                        fontSize: 14,
                        boxShadow: "0 1px 4px 0 rgba(46,172,179,0.08)",
                      }}
                      onDelete={() => {
                        setRecipient((prev: any) =>
                          prev.filter((_: any, i: number) => i !== index)
                        );
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="wise"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="w-full sm:w-97">
                        <CustomTextInput
                          select={true}
                          field={field}
                          label={"Select Leave Type"}
                          options={ApplyLeaveOption}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[red] mt-1" />
                  </FormItem>
                )}
              />
              {type !== "ACL" ? (
                <>
                  {" "}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fromDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <CustomModalDatePicker
                              field={field}
                              openTo={"day"}
                              view={["year", "month", "day"]}
                              label={"From Date"}
                            />
                          </FormControl>
                          <FormMessage className="text-[red] mt-1" />
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
                              openTo={"day"}
                              view={["year", "month", "day"]}
                              label={"To Date"}
                            />
                          </FormControl>
                          <FormMessage className="text-[red] mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>
                  {getLeaveBalanceLoading ? (
                    <DotLoading />
                  ) : (
                    <>
                      {getLeaveBalanceData && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="fromSession"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <CustomTextInput
                                    select={true}
                                    field={field}
                                    label={"From Session"}
                                    options={
                                      getLeaveBalanceData?.leaveOptions?.options
                                    }
                                  />
                                </FormControl>
                                <FormMessage className="text-[red] mt-1" />
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
                                    select={true}
                                    field={field}
                                    label={"To Session"}
                                    options={
                                      getLeaveBalanceData?.leaveOptions?.options
                                    }
                                  />
                                </FormControl>
                                <FormMessage className="text-[red] mt-1" />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </>
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
                          select={true}
                          field={field}
                          label={"Select Compensatory Date"}
                          options={getLeaveBalanceData?.balance}
                        />
                      </FormControl>
                      <FormMessage className="text-[red] mt-1" />
                    </FormItem>
                  )}
                />
              )}
              {getLeaveCalculateLoading ? (
                <DotLoading />
              ) : (
                <>
                  {getLeaveCalculateData?.data?.currentBooking && (
                    <div className="flex items-center justify-between bg-[#e0f7fa] rounded-lg px-4 py-2 mt-2">
                      <span className="select-none text-[#2eacb3] font-medium">
                        Leave duration:{" "}
                        {getLeaveCalculateData?.data?.currentBooking}
                      </span>
                      <IconButton
                        onClick={() => setOpenCalendar(!openCalendar)}
                        className="hover:bg-[#b2ebf2] transition-all"
                      >
                        <KeyboardArrowDownIcon />
                      </IconButton>
                    </div>
                  )}
                  {openCalendar && (
                    <div className="my-2">
                      <CalenderView
                        startDate={fromDate}
                        endDate={toDate}
                        paid={getLeaveCalculateData?.data?.currentBooking}
                        type={type}
                      />
                    </div>
                  )}
                </>
              )}

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" font-semibold">Reason</FormLabel>
                    <FormControl>
                      <Textarea
                        maxLength={500}
                        minLength={15}
                        rows={8}
                        className="border resize-none border-gray-500 text-md rounded-sm focus:border-[#2eacb3] focus:ring-2 focus:ring-[#2eacb3] transition-all  min-h-[80px]"
                        placeholder="Enter Reason"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[red] mt-1" />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>

      <div className="flex justify-center  absolute bottom-0 w-full z-10 border-t-1 py-3  border-gray-300 bg-[#444445]">
        <CustomButton
          onClick={handleConfirmSubmit}
          className={btnstyle}
          style={{ marginTop: "0px" }}
        >
          {applySLLeaveLoading ? (
            <CircularProgress sx={{ color: "#ffffff" }} size={"25px"} />
          ) : (
            "Apply Leave"
          )}
        </CustomButton>
      </div>
      <div className="w-full">
        <ConfirmationModal
          open={isConfirm}
          close={() => setIsConfirm(false)}
          aggree={onSubmit}
          title={`Confirm ${type} Application`}
          description={`Do you want to apply for ${type} request?`}
        />
      </div>
    </div>
  );
};

export default ApplyLeavePage;
