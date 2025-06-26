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
import { FiPlus, FiTrash2, FiUpload } from "react-icons/fi";
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
    <div className="w-full h-[calc(100vh-90px)] overflow-y-auto ">
      <div className=" p-4   ">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
         
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                Reimbursement Claim
              </h2>
              <p className="text-gray-500 text-sm md:text-base">
                Fill in the details below to request a reimbursement.
              </p>
            </div>

           
            <div className="bg-white rounded-xl  p-4 md:p-6  grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="expenseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Expense Date
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="dd-mm-yyyy"
                        {...field}
                        className="bg-gray-50"
                      />
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
                    <FormLabel className="font-semibold">Purpose</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Purpose of expense"
                        {...field}
                        className="bg-gray-50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Items Table */}
            <div className="bg-white   p-4 md:p-6 ">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Expense Items
                </h3>
                <CustomButton
                
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    append({ category: "", description: "", amount: "" })
                  }
                  className="flex items-center gap-1 text-white bg-[#2eacb3]"
                >
                  <FiPlus className="w-4 h-4" /> Add Item
                </CustomButton>
              </div>

              <TableContainer component={Paper} sx={{border:"none", boxShadow:"none"}}>
                <Table
                  sx={{ minWidth: 650,border:"none" }}
                  size="small"
                  aria-label="a dense table"
                >
                  <TableHead className=" bg-[#2eacb3]">
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell align="center">Description</TableCell>
                      <TableCell align="center">Amount</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fields.map(( item,idx) => (
                      
                      <TableRow
                      key={item.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          
                        }}
                      >
                        <TableCell component="th" scope="row" sx={{py:3}}>
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
                                    <SelectTrigger className="bg-gray-50">
                                      <SelectValue placeholder="--" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white w-full border-0">
                                      {categories.map((cat) => (
                                        <SelectItem
                                          key={cat.value}
                                          value={cat.value}
                                          className="bg-white w-full border-0"
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
                        <TableCell align="center" >
                          {" "}
                          <FormField
                            control={control}
                            name={`items.${idx}.description`}
                            render={({ field }) => (
                              <FormItem className="mb-0">
                                <FormControl>
                                  <Input
                                    placeholder="Description"
                                    {...field}
                                    className="bg-gray-50"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {" "}
                          <FormField
                            control={control}
                            name={`items.${idx}.amount`}
                            render={({ field }) => (
                              <FormItem className="mb-0">
                                <FormControl>
                                  <Input
                                    placeholder="Amount"
                                    {...field}
                                    className="bg-gray-50"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {" "}
                          {fields.length > 1 && (
                            <CustomButton
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => remove(idx)}
                              className="mx-auto text-white bg-[#2eacb3]"
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
            {/* </div> */}

            {/* Receipt Upload */}
            <div className="bg-white  p-4 md:p-6 ">
              <FormField
                control={control}
                name="receipt"
                render={() => (
                  <FormItem>
                    <FormLabel className="font-semibold">Receipt</FormLabel>
                    <FormControl>
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-[#2eacb3]   transition-colors text-center">
                        <FiUpload className="w-8 h-8 text-[#2eacb3] mb-2" />
                        <span className="text-gray-500 text-sm mb-1">
                          Choose files or drag & drop
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
            <div className="flex justify-end pt-4 pb-2">
              <CustomButton
                type="submit"
                className="px-8 py-2 text-base font-semibold shadow-md bg-[#2eacb3]"
              >
                Request
              </CustomButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ReimbursementClaim;
