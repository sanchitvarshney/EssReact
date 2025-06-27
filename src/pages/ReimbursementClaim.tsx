// import React, { useState } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
// import { Textarea } from '../components/ui/textarea';
import { CustomButton } from "../components/ui/CustomButton";
import { FiPlus, FiTrash2, FiUpload, FiDollarSign, FiCalendar, FiFileText } from "react-icons/fi";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const categories = [
  { value: "r", label: "--" },
  { value: "travel", label: "Travel" },
  { value: "food", label: "Food" },
  { value: "office", label: "Office" },
  { value: "other", label: "Other" },
];

const reimbursementSchema = z.object({
  expenseDate: z.string().min(1, "Expense date is required"),
  purpose: z.string().min(1, "Purpose is required"),
  items: z
    .array(
      z.object({
        category: z.string().min(1, "Select category"),
        description: z.string().min(1, "Description required"),
        amount: z
          .string()
          .min(1, "Amount required")
          .refine(
            (val) => !isNaN(Number(val)) && Number(val) > 0,
            "Enter valid amount"
          ),
      })
    )
    .min(1, "At least one item required"),
  receipt: z
    .any()
    .refine((file) => file && file.length > 0, "Receipt is required"),
});

type ReimbursementFormType = z.infer<typeof reimbursementSchema>;

const ReimbursementClaim = () => {
  const form = useForm<ReimbursementFormType>({
    resolver: zodResolver(reimbursementSchema),
    defaultValues: {
      expenseDate: "",
      purpose: "",
      items: [{ category: "", description: "", amount: "" }],
      receipt: undefined,
    },
    mode: "onTouched",
  });

  const { control, handleSubmit, setValue } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = (data: ReimbursementFormType) => {
    console.log(data)
    alert("Form submitted!");
  };

  return (
    <div className="w-full h-screen  ">
      <div className="p-6 max-w-6xl mx-auto ">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
         
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#2eacb3] to-[#1e8a8f] rounded-full mb-4 shadow-lg">
                <FiDollarSign className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-[#2eacb3] to-[#1e8a8f] bg-clip-text text-transparent">
                Reimbursement Claim
              </h2>
              {/* <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                Submit your expense details below to request a reimbursement. Please ensure all information is accurate and complete.
              </p> */}
            </div>

            {/* Basic Information Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <FiCalendar className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={control}
                  name="expenseDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                        Expense Date
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="date"
                            placeholder="dd-mm-yyyy"
                            {...field}
                            className="bg-gray-50 border-gray-200 focus:border-[#2eacb3] focus:ring-[#2eacb3] rounded-xl h-12 pl-4 transition-all duration-200 hover:bg-gray-100"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                        Purpose
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Purpose of expense"
                            {...field}
                            className="bg-gray-50 border-gray-200 focus:border-[#2eacb3] focus:ring-[#2eacb3] rounded-xl h-12 pl-4 transition-all duration-200 hover:bg-gray-100"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Items Table Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <FiFileText className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Expense Items
                  </h3>
                </div>
                <CustomButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    append({ category: "", description: "", amount: "" })
                  }
                  className="flex items-center gap-2 text-white bg-gradient-to-r from-[#2eacb3] to-[#1e8a8f] hover:from-[#1e8a8f] hover:to-[#2eacb3] rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <FiPlus className="w-4 h-4" /> Add Item
                </CustomButton>
              </div>

              <div className="overflow-hidden rounded-xl border border-gray-200">
                <TableContainer component={Paper} sx={{border:"none", boxShadow:"none", borderRadius: "12px"}}>
                  <Table
                    sx={{ minWidth: 650, border:"none" }}
                    size="small"
                    aria-label="expense items table"
                  >
                    <TableHead>
                      <TableRow className="bg-gradient-to-r from-[#2eacb3] to-[#1e8a8f]">
                        <TableCell className="text-white font-semibold border-none">Category</TableCell>
                        <TableCell className="text-white font-semibold border-none text-center">Description</TableCell>
                        <TableCell className="text-white font-semibold border-none text-center">Amount</TableCell>
                        <TableCell className="text-white font-semibold border-none text-center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fields.map((item, idx) => (
                        <TableRow
                          key={item.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                            "&:hover": { backgroundColor: "#f8fafc" },
                            transition: "background-color 0.2s ease"
                          }}
                          className="hover:bg-gray-50"
                        >
                          <TableCell component="th" scope="row" sx={{py: 3}}>
                            <FormField
                              control={control}
                              name={`items.${idx}.category`}
                              render={({ field }) => (
                                <FormItem className="mb-0">
                                  <FormControl>
                                    <Select
                                      value={field.value}
                                      onValueChange={field.onChange}
                                    >
                                      <SelectTrigger className="bg-gray-50 border-gray-200 focus:border-[#2eacb3] focus:ring-[#2eacb3] rounded-lg h-10 transition-all duration-200 hover:bg-gray-100">
                                        <SelectValue placeholder="Select category" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                                        {categories.map((cat) => (
                                          <SelectItem
                                            key={cat.value}
                                            value={cat.value}
                                            className="hover:bg-gray-50 cursor-pointer"
                                          >
                                            {cat.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <FormField
                              control={control}
                              name={`items.${idx}.description`}
                              render={({ field }) => (
                                <FormItem className="mb-0">
                                  <FormControl>
                                    <Input
                                      placeholder="Description"
                                      {...field}
                                      className="bg-gray-50 border-gray-200 focus:border-[#2eacb3] focus:ring-[#2eacb3] rounded-lg h-10 transition-all duration-200 hover:bg-gray-100"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <FormField
                              control={control}
                              name={`items.${idx}.amount`}
                              render={({ field }) => (
                                <FormItem className="mb-0">
                                  <FormControl>
                                    <div className="relative">
                                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                      <Input
                                        placeholder="0.00"
                                        {...field}
                                        className="bg-gray-50 border-gray-200 focus:border-[#2eacb3] focus:ring-[#2eacb3] rounded-lg h-10 pl-8 transition-all duration-200 hover:bg-gray-100"
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell align="center">
                            {fields.length > 1 && (
                              <CustomButton
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => remove(idx)}
                                className="mx-auto text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg p-2 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </CustomButton>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>

            {/* Receipt Upload Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FiUpload className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Receipt Upload</h3>
              </div>
              
              <FormField
                control={control}
                name="receipt"
                render={() => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                      Upload Receipt
                    </FormLabel>
                    <FormControl>
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-8 cursor-pointer hover:border-[#2eacb3] hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 text-center group">
                        <div className="w-16 h-16 bg-gradient-to-r from-[#2eacb3] to-[#1e8a8f] rounded-full flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200">
                          <FiUpload className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-gray-600 text-lg font-medium mb-2">
                          Choose files or drag & drop
                        </span>
                        <span className="text-gray-500 text-sm">
                          Supports: JPG, PNG, PDF (Max 10MB)
                        </span>
                        <Input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => setValue("receipt", e.target.files)}
                          className="hidden"
                        />
                      </label>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6 pb-4">
              <CustomButton
                type="submit"
                className="px-12 py-4 text-lg font-bold shadow-xl bg-gradient-to-r from-[#2eacb3] to-[#1e8a8f] hover:from-[#1e8a8f] hover:to-[#2eacb3] rounded-2xl transform hover:scale-105 transition-all duration-200 text-white"
              >
                Submit Reimbursement Request
              </CustomButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ReimbursementClaim;
