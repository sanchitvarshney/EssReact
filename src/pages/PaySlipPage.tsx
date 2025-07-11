import { useEffect, useState } from "react";
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

import CustomModalDatePicker from "../components/reuseable/CustomModalDatePicker";
import { btnstyle } from "../constants/themeConstant";
import { useGetPaySlipMutation } from "../services/payslip";
import moment from "moment";

import DotLoading from "../components/reuseable/DotLoading";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PaySlipPageSkeleton from "../skeleton/PaySlipPageSkeleton";

import { useToast } from "../hooks/useToast";

const schema = z.object({
  toDate: z.date({ required_error: "Month is required" }),
});

type FormValues = z.infer<typeof schema>;

const PaySlipPage = () => {
const { showToast } = useToast();
  const [showPayslip, setShowPayslip] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [netSalary, setNetSalary] = useState(0);
  const star = "******";
  const [getPaySlip, { isLoading, data, error }] = useGetPaySlipMutation();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      //@ts-ignore
      toDate: new Date(),
    },
  });

  const onSubmit = (data: any) => {
    const period = moment(data.toDate).format("YYYY-MM");

    getPaySlip({ period: period });
  };

  useEffect(() => {
    if (data?.total) {
      const newSalary = data?.total[0]?.earnings - data?.total[0]?.deductions;
      setNetSalary(newSalary);
    }
  }, [data?.total]);

  useEffect(() => {
    setTimeout(() => {
      setShowLoader(false);
    }, 1200);
  }, [showPayslip]);

  useEffect(() => {
      if (!error) return;
  
      if (error) {
        //@ts-ignore
        const errData = error.data as { message?: string };
  
        showToast(errData?.message || "Something went wrong", "error");
      } else {
        //@ts-ignore
        showToast(error.message || "An unexpected error occurred", "error");
      }
    }, [error]);
  

  if (isLoading ) {
    return <PaySlipPageSkeleton />;
    
  }

  return (
    <div className="relative h-[calc(100vh-90px)] flex flex-col items-center overflow-hidden py-4 ">
      <div className=" w-full max-w-5xl  rounded-lg  h-full  p-4">
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
          Pay Slip
        </h2>

        <div className="w-[100%] mx-auto p-2 flex justify-center items-center  mb-4  rounded-lg">
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
                      <CustomModalDatePicker
                        field={field}
                        view={["year", "month"]}
                        openTo={"month"}
                        label={"Select Date"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CustomButton
                className={btnstyle}
                type="submit"
              >
                Generate
              </CustomButton>
            </form>
          </Form>
        </div>

        {showLoader ? (
          <div className="w-full h-[53vh] flex justify-center items-center">
            <DotLoading />{" "}
          </div>
        ) : (
          <div className="w-full h-[53vh] overflow-y-auto">
            {data?.earing && (
              <>
                <div className=" mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 ">
                  <div className="bg-green-50 p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4  text-green-700">
                      Earnings
                    </h3>
                    <div className="divide-y">
                      {data?.earing.map(
                        (item: { label: string; value: string }) => (
                          <div
                            key={item.label}
                            className="flex justify-between py-2 px-2 text-gray-800"
                          >
                            <span>{item.label}</span>
                            <span>₹ {showPayslip ? item.value : star}</span>
                          </div>
                        )
                      )}
                    </div>
                    <div className="flex justify-between mt-4 pt-4 border-t font-bold text-green-800">
                      <span>Total Earnings</span>
                      <span>
                        ₹ {showPayslip ? data?.total[0]?.earnings : star}
                      </span>
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-red-500">
                      Deductions
                    </h3>
                    <div className="divide-y">
                      {data?.deduction.map(
                        (item: { label: string; value: string }) => (
                          <div
                            key={item.label}
                            className="flex justify-between py-2 px-2 text-gray-800"
                          >
                            <span>{item.label}</span>
                            <span>₹ {showPayslip ? item.value : star}</span>
                          </div>
                        )
                      )}
                    </div>
                    <div className="flex justify-between mt-4 pt-4 border-t font-bold text-red-600">
                      <span>Total Deductions</span>
                      <span>
                        ₹ {showPayslip ? data?.total[0]?.deductions : star}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="sticky  w-full flex flex-row items-center justify-between space-x-10 px-8 py-1">
        <div>
          {data?.earing && (
            <>
              {showLoader ? null : (
                <>
                  <div className="text-lg font-semibold text-gray-700">
                    Net Salary
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-4">
                    ₹ {showPayslip ? netSalary : star}
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <div className="space-x-4">
          {data?.earing && (
            <CustomButton
              className={btnstyle}
              onClick={() => {
                setShowLoader(true);
                setShowPayslip(!showPayslip);
              }}
            >
              <VisibilityIcon sx={{ color: "#ffffff", fontSize: 20,mr:1 }} />
              {showPayslip ? "Hide Payslip" : "Show Payslip"}
            </CustomButton>
          )}
          <CustomButton
            className={btnstyle}
            disabled={data?.earing ? false : true}
          >
            <FileDownloadIcon sx={{ color: "#ffffff", fontSize: 20,mr:1 }} />
            <span className="text-white">Download</span>
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default PaySlipPage;
