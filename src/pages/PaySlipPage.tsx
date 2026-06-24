import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
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
import {
  useDownloadPaySlipMutation,
  useGetPaySlipMutation,
} from "../services/payslip";
import moment from "moment";
import DotLoading from "../components/reuseable/DotLoading";
import { useApiErrorMessage } from "../hooks/useApiErrorMessage";
import { CircularProgress, Chip, Typography } from "@mui/material";
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

  const [getPaySlip, { isLoading, data, error, isError, isSuccess }] =
    useGetPaySlipMutation();
  const [downloadPaySlip, { isLoading: isDownloadLoading }] =
    useDownloadPaySlipMutation();

  useApiErrorMessage({ error, errorMessage: data, isError, isSuccess });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      //@ts-ignore
      toDate: new Date(),
    },
  });

  const onSubmit = async (values: any) => {
    const period = moment(values.toDate).format("YYYY-MM");
    getPaySlip({ period })
      .then((res) => {
        if (res?.data?.status === "error")
          showToast(res?.data?.message, "error");
      })
      .catch((err) => {
        showToast(
          err?.data?.message?.msg ||
            err?.message ||
            "An unexpected error has occurred.",
          "error",
        );
      });
  };

  useEffect(() => {
    if (data?.total) {
      setNetSalary(data.total[0]?.earnings - data.total[0]?.deductions);
    }
  }, [data?.total]);

  useEffect(() => {
    const t = setTimeout(() => setShowLoader(false), 1200);
    return () => clearTimeout(t);
  }, [showPayslip]);

  const downloadPDF = (bufferData: any, filename = "document.pdf") => {
    const byteArray = new Uint8Array(bufferData);
    const file = new Blob([byteArray], { type: "application/pdf" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadPayslip = () => {
    const d = form.watch("toDate");
    const period = moment(d).format("YYYY-MM");
    downloadPaySlip({ month: period }).then((res) => {
      if (res?.data?.status === "success") {
        downloadPDF(res?.data?.data?.buffer?.data, res?.data?.data?.filename);
      }
      if (res?.data?.status === "error") showToast(res?.data?.message, "error");
    });
  };

  const isBusy = isLoading || showLoader || isDownloadLoading;
  const period = moment(form.watch("toDate")).format("MMMM YYYY");

  return (
    <div className="h-[calc(100vh-90px)] flex flex-col overflow-hidden px-3  py-4 w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          style={{ backgroundColor: "#2eacb3" }}
          className="w-1 h-7 rounded-full"
        />
        <Typography
          sx={{
            fontSize: { xs: 16, sm: 19 },
            fontWeight: 700,
            color: "#232324",
          }}
        >
          Pay Slip
        </Typography>
        {data?.earing && (
          <Chip
            label={period}
            size="small"
            sx={{
              backgroundColor: "#e0f7f8",
              color: "#2eacb3",
              fontWeight: 600,
              fontSize: 11,
              height: 22,
              ml: 0.5,
            }}
          />
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Left: date + generate */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-center gap-3 flex-wrap"
            >
              <FormField
                control={form.control}
                name="toDate"
                render={({ field }) => (
                  <FormItem className="flex-shrink-0">
                    <FormControl>
                      <CustomModalDatePicker
                        field={field}
                        view={["year", "month"]}
                        openTo="month"
                        label="Select Month"
                        isDisabled={isBusy}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CustomButton
                className={btnstyle}
                type="submit"
                disabled={isBusy}
              >
                {isLoading && (
                  <CircularProgress color="inherit" size={14} sx={{ mr: 1 }} />
                )}
                Generate
              </CustomButton>
            </form>
          </Form>

          {/* Right: net salary + actions — visible only after data loads */}
          {data?.earing && !showLoader && (
            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0">
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-0.5">
                  Net Salary
                </p>
                <p className="text-base sm:text-lg font-bold text-green-600 leading-tight">
                  ₹ {showPayslip ? netSalary.toLocaleString("en-IN") : star}
                </p>
              </div>

              <div className="flex gap-2">
                <CustomButton
                  className={btnstyle}
                  onClick={() => {
                    setShowLoader(true);
                    setShowPayslip(!showPayslip);
                  }}
                  disabled={isBusy}
                >
                  {showPayslip ? (
                    <VisibilityOffIcon sx={{ fontSize: 17, mr: 0.5 }} />
                  ) : (
                    <VisibilityIcon sx={{ fontSize: 17, mr: 0.5 }} />
                  )}
                  <span className="hidden xs:inline">
                    {showPayslip ? "Hide" : "Show"}
                  </span>
                </CustomButton>

                <CustomButton
                  className={btnstyle}
                  onClick={downloadPayslip}
                  disabled={isBusy}
                >
                  {isDownloadLoading ? (
                    <CircularProgress
                      color="inherit"
                      size={14}
                      sx={{ mr: 0.5 }}
                    />
                  ) : (
                    <FileDownloadIcon sx={{ fontSize: 17, mr: 0.5 }} />
                  )}
                  <span className="hidden xs:inline">Download</span>
                </CustomButton>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className=" overflow-y-auto custom-scrollbar-for-menu">
        {showLoader || isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <DotLoading />
          </div>
        ) : data?.earing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 pb-2 max-h-[calc(100vh-170px)] ">
            {/* Earnings Card */}
            <div className="rounded-2xl border border-green-100 overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 px-4 py-3 bg-green-50">
                <TrendingUpIcon sx={{ color: "#16a34a", fontSize: 18 }} />
                <span className="font-bold text-green-700 text-sm tracking-wide">
                  Earnings
                </span>
              </div>
              <div className="bg-white">
                {data.earing.map(
                  (item: { label: string; value: string }, i: number) => (
                    <div
                      key={item.label}
                      className="flex justify-between items-center px-4 lg:px-6 py-2.5 lg:py-3 border-b border-gray-50"
                      style={{
                        backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa",
                      }}
                    >
                      <span className="text-sm lg:text-[15px] text-gray-500">
                        {item.label}
                      </span>
                      <span className="text-sm lg:text-[15px] font-semibold text-gray-800">
                        ₹ {showPayslip ? item.value : star}
                      </span>
                    </div>
                  ),
                )}
              </div>
              <div className="flex justify-between items-center px-4 lg:px-6 py-3 bg-green-50 border-t border-green-100">
                <span className="text-sm font-bold text-green-700">
                  Total Earnings
                </span>
                <span className="text-sm font-bold text-green-700">
                  ₹ {showPayslip ? data.total[0]?.earnings : star}
                </span>
              </div>
            </div>

            {/* Deductions Card */}
            <div className="rounded-2xl border border-red-100 overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 px-4 py-3 bg-red-50">
                <TrendingDownIcon sx={{ color: "#dc2626", fontSize: 18 }} />
                <span className="font-bold text-red-600 text-sm tracking-wide">
                  Deductions
                </span>
              </div>
              <div className="bg-white">
                {data.deduction.map(
                  (item: { label: string; value: string }, i: number) => (
                    <div
                      key={item.label}
                      className="flex justify-between items-center px-4 lg:px-6 py-2.5 lg:py-3 border-b border-gray-50"
                      style={{
                        backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa",
                      }}
                    >
                      <span className="text-sm lg:text-[15px] text-gray-500">
                        {item.label}
                      </span>
                      <span className="text-sm lg:text-[15px] font-semibold text-gray-800">
                        ₹ {showPayslip ? item.value : star}
                      </span>
                    </div>
                  ),
                )}
              </div>
              <div className="flex justify-between items-center px-4 lg:px-6 py-3 bg-red-50 border-t border-red-100">
                <span className="text-sm font-bold text-red-600">
                  Total Deductions
                </span>
                <span className="text-sm font-bold text-red-600">
                  ₹ {showPayslip ? data.total[0]?.deductions : star}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-[calc(100vh-300px)] flex flex-col items-center justify-center gap-3">
            <AccountBalanceWalletIcon
              sx={{ fontSize: { xs: 40, sm: 52 }, color: "#d1d5db" }}
            />
            <p className="text-sm text-gray-400 text-center px-4">
              Select a month and click Generate to view your payslip
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaySlipPage;
