import  { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { CustomButton } from "../components/ui/CustomButton";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "../components/ui/form";
import { InputStyle } from "../constants/themeConstant";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const earnings = [
  { label: "Basic", amount: 20000 },
  { label: "Dearness Allowance", amount: 5000 },
  { label: "House Rent Allowance", amount: 8000 },
  { label: "Conveyance Allowance", amount: 2000 },
  { label: "Education Allowance", amount: 1500 },
  { label: "Books & Periodicals", amount: 1000 },
  { label: "Mobile Reimbursement", amount: 1200 },
  { label: "Medical Allowance", amount: 2000 },
  { label: "LTA", amount: 3000 },
];

const deductions = [
  { label: "EPF", amount: 1800 },
  { label: "ESI", amount: 500 },
  { label: "Advance", amount: 1000 },
];

const totalEarnings = earnings.reduce((sum, item) => sum + item.amount, 0);
const totalDeductions = deductions.reduce((sum, item) => sum + item.amount, 0);
const netSalary = totalEarnings - totalDeductions;

const schema = z.object({
  toDate: z.date({ required_error: "Month is required" }),
});

type FormValues = z.infer<typeof schema>;

const PaySlipPage = () => {
  const [showPayslip, setShowPayslip] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      toDate: new Date(),
    },
  });

  const onSubmit = () => {
    setShowPayslip(true);
  };

  return (
    <div className="h-[calc(100vh-90px)] flex flex-col items-center bg-gray-50 overflow-y-auto py-4 ">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
          Pay Slip
        </h2>
   
        <div className="w-[90%] mx-auto p-2 flex justify-center items-center  mb-8 bg-white rounded-lg">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-center justify-center gap-3 w-full"
            >
              <FormField
                control={form.control}
                name="toDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          className="border-none"
                          views={["year", "month"]}
                          value={dayjs(field.value)}
                          onChange={(date) =>
                            field.onChange(date ? date.toDate() : null)
                          }
                          format="MMMM YYYY"
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              variant: "outlined",
                              placeholder: "Select Month",
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
              <CustomButton className="bg-green-600 text-[#fff]" type="submit">
                Generate
              </CustomButton>
            </form>
          </Form>
        </div>
      
        {showPayslip && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         
              <div className="bg-green-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-green-700">
                  Earnings
                </h3>
                <div className="divide-y">
                  {earnings.map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between py-2 px-2 text-gray-800"
                    >
                      <span>{item.label}</span>
                      <span>₹ {item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 pt-4 border-t font-bold text-green-800">
                  <span>Total Earnings</span>
                  <span>₹ {totalEarnings.toLocaleString()}</span>
                </div>
              </div>
          
              <div className="bg-red-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-red-500">
                  Deductions
                </h3>
                <div className="divide-y">
                  {deductions.map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between py-2 px-2 text-gray-800"
                    >
                      <span>{item.label}</span>
                      <span>₹ {item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 pt-4 border-t font-bold text-red-600">
                  <span>Total Deductions</span>
                  <span>₹ {totalDeductions.toLocaleString()}</span>
                </div>
              </div>
            </div>
        
            <div className="mt-10 flex flex-col items-center">
              <div className="text-lg font-semibold text-gray-700">
                Net Salary
              </div>
              <div className="text-3xl font-bold text-green-600 mb-4">
                ₹ {netSalary.toLocaleString()}
              </div>
              <CustomButton className="bg-gray-700 flex items-center gap-2">
                <FileDownloadIcon sx={{ color: "#ffffff" }} />
                <span className="text-white">Download Pay Slip</span>
              </CustomButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaySlipPage;
