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
import { InputStyle, LableStyle } from "../constants/themeConstant";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Textarea } from "../components/ui/textarea";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
import { CustomButton } from "../components/ui/CustomButton";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import CustomToggle from "../components/reuseable/CustomToggle";

import CalenderView from "../components/reuseable/CalederView";
import { IconButton, MenuItem, Select } from "@mui/material";
import { Input } from "../components/ui/input";

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

const ApplyLeavePage = () => {
  const [isHalf, setIsHalf] = useState<boolean>(false);
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);
  const [isFirst, setIsFirst] = useState<boolean>(false);
  const [isLast, setIsLast] = useState<boolean>(false);
  const [addRecipient, setAddRecipient] = useState<boolean>(false);
  const [leaveDuration, setLeaveDuration] = useState<number | string>(0);

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
  return (
    <div className="bg-[#fff]  flex flex-col overflow-y-auto">
      <span
        onClick={() => setAddRecipient(!addRecipient)}
        className="text-sm font-semibold border-b-1 transition-transform duration-200  hover:scale-104 mb-4 cursor-pointer mr-1 self-end"
      >
        Add Recipients
      </span>
      {addRecipient && (
        <div className="mx-4">
          <Input placeholder="Add  Recipients" />
        </div>
      )}
      <div className="mx-4 mt-2 ">
        {wise && (
          <CustomToggle
            value={"Half Day"}
            state={isHalf}
            title={"Half Day"}
            setMethod={setIsHalf}
          />
        )}
      </div>

      <div>
        <div className="flex">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})}>
              <div className=" p-[20px] space-y-6 ">
                <FormField
                  control={form.control}
                  name="wise"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LableStyle}>
                        Select Leave Type
                      </FormLabel>
                      <FormControl>
                        <Select
                          popover="manual"
                          value={field.value}
                          onChange={field.onChange}
                          size="small"
                          sx={{
                            zIndex: 1300,
                            minWidth: 200,
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#000",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#2eacb3",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#2eacb3",
                            },
                          }}
                        >
                          {[
                            { label: "Option 1", value: "option1" },
                            { label: "Option 2", value: "option2" },
                          ].map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-[20px]">
                  <FormField
                    control={form.control}
                    name="fromDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={LableStyle}>From Date</FormLabel>
                        <FormControl className="">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              className="border-none"
                              value={field.value ? dayjs(field.value) : null}
                              onChange={(date) => {
                                if (date && date.isValid()) {
                                  // console.log(" valid date");
                                  field.onChange(date.toDate());
                                } else {
                                  // console.log("not valid date");
                                  field.onChange(null);
                                }
                              }}
                              format="DD-MM-YYYY"
                              slotProps={{
                                popper: {
                                  disablePortal: true,
                                },
                                textField: {
                                  fullWidth: true,
                                  variant: "outlined",
                                  placeholder: "Select Date",
                                  InputProps: {
                                    disableUnderline: true,
                                    className: InputStyle,
                                    sx: {
                                      "& .MuiInputBase-input::placeholder": {
                                        color: "#94a3b8",
                                        opacity: 1,
                                        margin: 0,
                                      },
                                      "& .MuiInputBase-input:focus::placeholder":
                                        {
                                          color: "#94a3b8",

                                          opacity: 1,
                                        },
                                    },
                                  },
                                  sx: {
                                    "& .MuiOutlinedInput-notchedOutline": {
                                      borderColor: "red",
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                      {
                                        borderColor: "transparent",
                                      },

                                    "&:hover .MuiOutlinedInput-notchedOutline":
                                      {
                                        borderColor: "red",
                                      },
                                  },
                                },
                              }}
                            />
                          </LocalizationProvider>
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
                        <FormLabel className={LableStyle}>To Date</FormLabel>
                        <FormControl>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              className="z-10"
                              value={field.value ? dayjs(field.value) : null}
                              onChange={(date) => {
                                field.onChange(date ? date.toDate() : null);
                                // console.log(date);
                              }}
                              format="DD-MM-YYYY"
                              slotProps={{
                                popper: {
                                  disablePortal: true,
                                },
                                textField: {
                                  fullWidth: true,
                                  // variant: "standard",

                                  placeholder: "Select Date",
                                  InputProps: {
                                    disableUnderline: true,
                                    className: InputStyle,
                                    sx: {
                                      "& .MuiInputBase-input::placeholder": {
                                        // color: "#94a3b8",
                                        opacity: 1,
                                      },
                                      "& .MuiInputBase-input:focus::placeholder":
                                        {
                                          // color: "#94a3b8",
                                          opacity: 1,
                                        },
                                    },
                                  },
                                },
                              }}
                            />
                          </LocalizationProvider>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  {toDate && (
                    <div className="flex gap-x-5 gap-y-2 flex-col sm:flex-row">
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
                    <div className="flex items-center justify-between">
                      <span className="select-none">
                        Leave duration: {leaveDuration}
                      </span>
                      <IconButton
                        onClick={() => setOpenCalendar(!openCalendar)}
                      >
                        <KeyboardArrowDownIcon />
                      </IconButton>
                    </div>
                  )}
                </div>
                {openCalendar && (
                  <CalenderView
                    startDate={fromDate}
                    endDate={toDate}
                    paid={leaveDuration}
                  />
                )}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LableStyle}>Reasion</FormLabel>
                      <FormControl>
                        <Textarea
                          className={InputStyle}
                          placeholder="Enter Reasion"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className=" my-4 justify-end flex px-3">
                <CustomButton
                  type="submit"
                  className="bg-green-600 text-[#fff]"
                >
                  Submit
                </CustomButton>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeavePage;
