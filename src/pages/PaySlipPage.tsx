import { useState } from "react";
import moment from "moment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { useDownloadPaySlipMutation, useGetPaySlipMutation } from "../services/payslip";
import DotLoading from "../components/reuseable/DotLoading";
import { useApiErrorMessage } from "../hooks/useApiErrorMessage";
import { useToast } from "../hooks/useToast";
import MonthStrip from "../components/payslip/MonthStrip";
import NetPayHero from "../components/payslip/NetPayHero";
import LedgerCard from "../components/payslip/LedgerCard";
import { toNumber } from "../components/payslip/payslipUtils";

const PaySlipPage = () => {
  const { showToast } = useToast();
  const [selected, setSelected] = useState<moment.Moment | null>(null);
  const [year, setYear] = useState(moment().year());
  const [visible, setVisible] = useState(false);

  const [getPaySlip, { isLoading, data, error, isError, isSuccess }] = useGetPaySlipMutation();
  const [downloadPaySlip, { isLoading: isDownloadLoading }] = useDownloadPaySlipMutation();

  useApiErrorMessage({ error, errorMessage: data, isError, isSuccess });

  const handleSelect = (month: moment.Moment) => {
    setSelected(month);
    setVisible(false);
    getPaySlip({ period: month.format("YYYY-MM") })
      .then((res) => {
        if (res?.data?.status === "error") showToast(res?.data?.message, "error");
      })
      .catch((err) => {
        showToast(err?.data?.message?.msg || err?.message || "An unexpected error has occurred.", "error");
      });
  };

  const downloadPDF = (bufferData: any, filename = "document.pdf") => {
    const file = new Blob([new Uint8Array(bufferData)], { type: "application/pdf" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownload = () => {
    if (!selected) return;
    downloadPaySlip({ month: selected.format("YYYY-MM") }).then((res) => {
      if (res?.data?.status === "success") {
        downloadPDF(res?.data?.data?.buffer?.data, res?.data?.data?.filename);
      }
      if (res?.data?.status === "error") showToast(res?.data?.message, "error");
    });
  };

  const hasData = !!data?.earing && !!selected;
  const earnings = toNumber(data?.total?.[0]?.earnings);
  const deductions = toNumber(data?.total?.[0]?.deductions);

  return (
    <div className="h-full overflow-y-auto custom-scrollbar-for-menu px-3 py-4 flex flex-col gap-4">
      <MonthStrip
        selected={selected}
        year={year}
        onYearChange={setYear}
        onSelect={handleSelect}
        disabled={isLoading}
      />

      {isLoading ? (
        <div className="flex-1 min-h-[280px] flex justify-center items-center">
          <DotLoading />
        </div>
      ) : hasData ? (
        <>
          <NetPayHero
            periodLabel={selected!.format("MMMM YYYY")}
            earnings={earnings}
            deductions={deductions}
            visible={visible}
            onToggleVisible={() => setVisible((v) => !v)}
            onDownload={handleDownload}
            downloading={isDownloadLoading}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-2">
            <LedgerCard
              title="Earnings"
              icon={<TrendingUpIcon sx={{ fontSize: 20 }} />}
              items={data.earing}
              total={earnings}
              visible={visible}
              accent="#15803d"
              tint="#f0fdf4"
              barFrom="#22c55e"
              barTo="#86efac"
            />
            <LedgerCard
              title="Deductions"
              icon={<TrendingDownIcon sx={{ fontSize: 20 }} />}
              items={data.deduction ?? []}
              total={deductions}
              visible={visible}
              accent="#be123c"
              tint="#fff1f2"
              barFrom="#f43f5e"
              barTo="#fda4af"
            />
          </div>
        </>
      ) : (
        <div className="flex-1 min-h-[280px] bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 text-center px-6">
          <span className="w-16 h-16 rounded-full bg-[#e0f6f6] flex items-center justify-center">
            <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 30, color: "#00a0a0" }} />
          </span>
          <p className="text-sm font-semibold text-gray-700">No payslip open</p>
          <p className="text-xs text-gray-400 max-w-xs">
            Pick a month above to see your earnings, deductions and take-home pay.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaySlipPage;
