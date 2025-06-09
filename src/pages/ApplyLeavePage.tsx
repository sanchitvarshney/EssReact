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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { CustomButton } from "../components/ui/CustomButton";

const schema = z.object({
  wise: z.string().min(2, { message: "Address label is required" }),
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
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      fromDate: new Date(),
      toDate: new Date(),
    },
  });

  return (
    <div className="bg-[#fff] overflow-y-auto">
      <div>
        <div className="flex">
          <Form {...form}>
            <form onSubmit={() => {}}>
              <div className=" p-[20px] space-y-6 ">
                <FormField
                  control={form.control}
                  name="wise"
                  render={() => (
                    <FormItem>
                      <FormLabel className={LableStyle}>
                        Select Leave Type
                      </FormLabel>
                      <FormControl >
                        <Select
                          onValueChange={() => {
                            // setWise(value);
                          }}
                          defaultValue={""}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Leave Type" />
                          </SelectTrigger>

                          <SelectContent>
                            {[
                              { label: "Option 1", value: "option1" },
                              { label: "Option 2", value: "option2" },
                            ].map((data) => (
                              <SelectItem key={data.value} value={data.value}>
                                {data.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-[20px]">
                  <FormField
                    control={form.control}
                    name="toDate"
                    render={() => (
                      <FormItem>
                        <FormLabel className={LableStyle}>To Date</FormLabel>
                        <FormControl className="">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              onChange={() =>
                                // setInvoiceDate(
                                //   newValue
                                //     ? newValue.format("DD-MM-YYYY")
                                //     : undefined
                                // )
                                {}
                              }
                              format="DD-MM-YYYY"
                              slotProps={{
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
                    render={() => (
                      <FormItem>
                        <FormLabel className={LableStyle}>To Date</FormLabel>
                        <FormControl>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              onChange={() =>
                                // setInvoiceDate(
                                //   newValue
                                //     ? newValue.format("DD-MM-YYYY")
                                //     : undefined
                                // )
                                {}
                              }
                              format="DD-MM-YYYY"
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  // variant: "standard",
                                  placeholder: "Select Date",
                                  InputProps: {
                                    disableUnderline: true,
                                    className: InputStyle,
                                    sx: {
                                      "& .MuiInputBase-input::placeholder": {
                                        color: "#94a3b8",
                                        opacity: 1,
                                      },
                                      "& .MuiInputBase-input:focus::placeholder":
                                        {
                                          color: "#94a3b8",
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

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LableStyle}>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          className={InputStyle}
                          placeholder="Enter Message"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className=" my-4 justify-end flex px-3">
             <CustomButton className="bg-green-600 text-[#fff]">
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
