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

import { Textarea } from "../components/ui/textarea";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Chip, GlobalStyles } from "@mui/material";

import { CustomButton } from "../components/ui/CustomButton";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import CustomToggle from "../components/reuseable/CustomToggle";

import CalenderView from "../components/reuseable/CalederView";
import { IconButton } from "@mui/material";
import { Input } from "../components/ui/input";

import SearchBarComponent from "../components/dropdowns/SearchBarComponent";
import CustomTextInput from "../components/reuseable/CustomTextInput";
import CustomModalDatePicker from "../components/reuseable/CustomModalDatePicker";
import { btnstyle } from "../constants/themeConstant";

const ApplyLeaveOption = [
  {
    value: "el",
    label: "Earned Leave",
  },
  {
    value: "sl",
    label: "Sick/Casual Leave",
  },
  {
    value: "wfh",
    label: "Work From Home",
  },
  {
    value: "onduty",
    label: "On Duty",
  },
  {
    value: "compensatory",
    label: "Compensatory Leave",
  },
];

const schema = z.object({
  wise: z.string().min(2, { message: "Select value is required" }),
  pan: z
    .string()
    .length(10, { message: "PAN Number must be exactly 10 characters" })
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
      message: "Please enter a valid PAN Number (format: ABCDE1234F)",
    }),
  message: z.string().optional(),
  paymentTerms: z.string().min(2, { message: "Payment Terms are required" }),
  fromDate: z.date({ required_error: "From Date is required" }),
  toDate: z.date({ required_error: "To Date is required" }),
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

const ApplyLeavePage = () => {
  const inputRef = useRef(null);
  const [searchText, setSearchText] = useState<string>("");
  const [isHalf, setIsHalf] = useState<boolean>(false);
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [isFirst, setIsFirst] = useState<boolean>(false);
  const [isLast, setIsLast] = useState<boolean>(false);
  const [addRecipient, setAddRecipient] = useState<boolean>(false);
  const [leaveDuration, setLeaveDuration] = useState<number | string>(0);
  const [recipient, setRecipient] = useState<any>([]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      fromDate: new Date(),
    },
  });

  const wise = form.watch("wise");
  const toDate = form.watch("toDate");
  const fromDate = form.watch("fromDate");

  useEffect(() => {
    if (fromDate && toDate) {
      const start = dayjs(fromDate);
      const end = dayjs(toDate);

      if (start.isValid() && end.isValid()) {
        const leaveDays = end.diff(start, "day") + 1;
        setLeaveDuration(leaveDays);
      }
    }
  }, [toDate]);

  const handleSetRecipient = (value: any) => {
    setRecipient((prev: any) => [...prev, value]);
    setSearchText("");
  };
  return (
    <div className=" flex flex-col items-center  ">
      <div className="w-full bg-white rounded-2xl  p-6 md:p-6 flex flex-col gap-6">
        <div className="flex flex-col items-end">
          <span
            onClick={() => setAddRecipient(!addRecipient)}
            className="text-sm font-semibold border-b-2 border-dashed border-[#2eacb3] transition-transform duration-200 hover:scale-105 mb-2 cursor-pointer px-2 py-1 hover:bg-[#e0f7fa] rounded-md"
          >
            {addRecipient ? "Hide Recipients" : "Add Recipients"}
          </span>
        </div>
        {addRecipient && (
          <div className="mb-2">
            <span className="text-[#2eacb3] font-semibold">Recipient</span>
            <Input
              ref={inputRef}
              className="w-full md:w-96 rounded-lg mt-1 border border-[#b2ebf2] focus:border-[#2eacb3] focus:ring-2 focus:ring-[#2eacb3] transition-all"
              placeholder="Add Recipients"
              onChange={(e) => {
                const value = e.target.value;
                setSearchText(value);
                setOpenSearch(value.trim().length > 0);
              }}
            />
            <div className="mt-3">
              {recipient.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {recipient.map((value: any, index: number) => (
                    <Chip
                      key={index}
                      label={value?.name}
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
                width="300px"
                onSelect={handleSetRecipient}
              />
            )}
          </div>
        )}
        {wise && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#2eacb3] mb-2">
              Leave Details
            </h2>

            <CustomToggle
              value={"Half Day"}
              state={isHalf}
              title={"Half Day"}
              setMethod={setIsHalf}
            />
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})}>
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
                      <FormMessage />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {toDate && (
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
                  <CustomToggle
                    value={"First day, Second half"}
                    state={isFirst}
                    title={"First day, Second half"}
                    setMethod={setIsFirst}
                  />
                  <CustomToggle
                    value={"Last day, First half"}
                    state={isLast}
                    title={"Last day, First half"}
                    setMethod={setIsLast}
                  />
                </div>
              )}
              {toDate && (
                <div className="flex items-center justify-between bg-[#e0f7fa] rounded-lg px-4 py-2 mt-2">
                  <span className="select-none text-[#2eacb3] font-medium">
                    Leave duration: {leaveDuration}
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
                    paid={leaveDuration}
                  />
                </div>
              )}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#2eacb3] font-semibold">
                      Reason
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="border border-[#b2ebf2] rounded-lg focus:border-[#2eacb3] focus:ring-2 focus:ring-[#2eacb3] transition-all min-h-[80px]"
                        placeholder="Enter Reason"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end mt-8">
              <CustomButton type="submit" className={btnstyle}>
                Submit
              </CustomButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ApplyLeavePage;
