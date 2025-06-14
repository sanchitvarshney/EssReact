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

import {  LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Textarea } from "../components/ui/textarea";


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

const WFHPage = () => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      fromDate: new Date(),
      toDate: new Date(),
    },
  });

  return (
    <div className="h-[calc(100vh-65px)]  flex justify-center items-center">
  <div className="p-4 max-h-[600px] ring ring-black/20 shadow-lg overflow-y-auto">
        <h1 className="text-xl text-center my-1 font-semibold">
          Update Work from home
        </h1>
        <div className="flex">
          <Form {...form}>
            <form onSubmit={() => {}}>
              <div className=" p-[20px] space-y-6 ">
                <FormField
                  control={form.control}
                  name="wise"
                  render={() => (
                    <FormItem>
                      <FormLabel className={LableStyle}>Request Id</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={() => {
                            // setWise(value);
                          }}
                          defaultValue={""}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Request Id" />
                          </SelectTrigger>

                          <SelectContent className="bg-[#fff]">
                            {[
                              { label: "Option 1", value: "option1" },
                              { label: "Option 2", value: "option2" },
                            ].map((data) => (
                              <SelectItem
                                className="bg-[#fff]"
                                key={data.value}
                                value={data.value}
                              >
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
                        <FormLabel className={LableStyle}>From Hours</FormLabel>
                        <FormControl>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                              className="border-none"
                              onChange={() => {
                                // Example: set value in form
                                // setInvoiceDate(newValue ? newValue.format("DD-MM-YYYY HH:mm") : undefined);
                              }}
                              format="HH:mm"
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  variant: "outlined",
                                  placeholder: "Select Time",
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
                    render={() => (
                      <FormItem>
                        <FormLabel className={LableStyle}>To Hours</FormLabel>
                        <FormControl>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                              className="border-none"
                              onChange={() => {
                                // Example: set value in form
                                // setInvoiceDate(newValue ? newValue.format("DD-MM-YYYY HH:mm") : undefined);
                              }}
                              format="HH:mm"
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  variant: "outlined",
                                  placeholder: "Select Date and Time",
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
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LableStyle}>Enter Work Details</FormLabel>
                      <FormControl>
                        <Textarea
                          className={InputStyle}
                          placeholder=" "
                          {...field}
                          maxLength={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className=" my-4 justify-end flex px-3 gap-3">
                   <CustomButton className="bg-gray-500 text-[#fff]">
                  Postpond
                </CustomButton>
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

export default WFHPage;
