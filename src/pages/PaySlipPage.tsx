import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  
  FormMessage,
} from "../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { InputStyle } from "../constants/themeConstant";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {
  DatePicker,
  LocalizationProvider,

} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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

const PaySlipPage = () => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      fromDate: new Date(),
      toDate: new Date(),
    },
  });

  return (
    <div className="h-[calc(100vh-65px)] py-5 flex justify-center items-start">
      <div className="w-[90%] p-4 max-h-[600px] flex justify-between ring ring-black/20 shadow-lg overflow-y-auto">
        <Form {...form}>
          <form onSubmit={() => {}}>
            <div className="flex items-center gap-3">
              <FormField
                control={form.control}
                name="toDate"
                render={() => (
                  <FormItem>
                    {/* <FormLabel className={LableStyle}>From Hours</FormLabel> */}
                    <FormControl>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          className="border-none"
                          onChange={() => {
                            // Example: set value in form
                            // setInvoiceDate(newValue ? newValue.format("DD-MM-YYYY HH:mm") : undefined);
                          }}
                          format="DD-MM-YYYY"
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
                                  "& .MuiInputBase-input:focus::placeholder": {
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
                                "&:hover .MuiOutlinedInput-notchedOutline": {
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

              <CustomButton className="bg-green-600 text-[#fff]">
                Genrate
              </CustomButton>

              {/* <div className=" my-4 justify-end flex px-3 gap-3"> */}

              {/* </div> */}
            </div>
          </form>
        </Form>
        <CustomButton className="bg-gray-700">
<FileDownloadIcon sx={{color:"#ffffff"}} />
        </CustomButton>
      </div>
    </div>
  );
};

export default PaySlipPage;
