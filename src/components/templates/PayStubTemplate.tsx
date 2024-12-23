import { PayStubType } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table";
import { formatCurrency } from "@/lib/utils";
import { DEFAULT_PAYMENT_TYPE } from "@/constants";

export default function PayStubTemplate(data: PayStubType) {
  const maxRows = Math.max(
    data.deductions?.length || 0,
    data.benefits?.length || 0
  );
  const regularPay =
    data.payment.type === DEFAULT_PAYMENT_TYPE
      ? Number(data.payment.hourlyRate) * Number(data.payment.numOfHours)
      : Number(data.payment.annualSalary);
  const payments =
    regularPay +
    data.benefits.reduce((prev, curr) => Number(prev) + Number(curr.value), 0);
  const deductions = data.deductions.reduce(
    (prev, curr) => Number(prev) + Number(curr.value),
    0
  );
  const netPay = Number(payments) - Number(deductions);
  const ytdTotalPayment =
    Number(data.payment.ytd) +
    data.benefits.reduce((prev, curr) => Number(prev) + Number(curr.ytd), 0);
  const ytdTotalDeduction = data.deductions.reduce((prev, curr) => Number(prev) + Number(curr.ytd), 0)
  return (
    <div className="mx-8">
      <div className="flex justify-between">
        <div className="text-left text-sm">
          <h2 className="font-semibold text-xl">{data.payer.name || "Acme"}</h2>
          <p>
            {data.payer.address || "123 Street st"}{" "}
            {data.payer.addressSecond ? "# " + data.payer.addressSecond : ""}
            <br />
            {data.payer.city ? data.payer.city + ", " : "ABC, "}
            {data.payer.province || "YY"} {data.payer.postalCode || "XXX XXX"}
            <br />
            {data.payer.phoneNumber || "(123) 456-7890"}
            {data.payer.extNo ? "# " + data.payer.extNo : ""}
            <br />
            {data.payer.email}
          </p>
        </div>
        <div className="text-right text-sm">
          <h2 className="font-semibold text-xl">
            {data.payee.name || "John Doe"}
          </h2>
          <p>
            {data.payee.address || "123 Street st"}{" "}
            {data.payee.addressSecond ? "# " + data.payee.addressSecond : ""}
            <br /> {data.payee.city ? data.payee.city + ", " : "ABC, "}
            {data.payee.province || "YY"} {data.payee.postalCode || "XXX XXX"}
            <br />
            {data.payee.phoneNumber || "(123) 456-7890"}{" "}
            {data.payee.extNo ? "# " + data.payee.extNo : ""}
            <br />
            {data.payee.email}
          </p>
        </div>
      </div>
      <div className="mt-2">
        {data.payment.chequeNumber && (
          <p>Check #: {data.payment.chequeNumber}</p>
        )}
      </div>
      <div className="flex justify-between text-sm mt-2 bg-blue-400 p-2 text-white">
        {data.payment.periodStart && data.payment.periodEnd && (
          <p>
            Pay Period:{" "}
            {new Date(data.payment.periodStart).toLocaleDateString("en-US")} -{" "}
            {new Date(data.payment.periodEnd).toLocaleDateString("en-US")}
          </p>
        )}
        {data.payment.date && (
          <p>
            Pay Date: {new Date(data.payment.date).toLocaleDateString("en-US")}{" "}
          </p>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] font-semibold">Income</TableHead>
            <TableHead className="text-right font-semibold">Rate</TableHead>
            <TableHead className="text-right font-semibold">Hours</TableHead>
            <TableHead className="text-right font-semibold">
              This Period
            </TableHead>
            <TableHead className="text-right font-semibold">
              Year to Date
            </TableHead>
            <TableHead className="w-[100px] font-semibold">
              Deductions
            </TableHead>
            <TableHead className="text-right font-semibold">
              Current total
            </TableHead>
            <TableHead className="text-right font-semibold">
              Year to Date
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">{data.payment.name}</TableCell>
            <TableCell className="text-right">
              {data.payment.type === DEFAULT_PAYMENT_TYPE &&
                data.payment.hourlyRate &&
                formatCurrency(Number(data.payment.hourlyRate))}
            </TableCell>
            <TableCell className="text-right">
              {data.payment.type === DEFAULT_PAYMENT_TYPE &&
                data.payment.numOfHours}
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(regularPay)}
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(Number(data.payment.ytd))}
            </TableCell>
            <TableCell>{""}</TableCell>
            <TableCell className="text-right">{""}</TableCell>
            <TableCell className="text-right">{""}</TableCell>
          </TableRow>
          {Array(maxRows)
            .fill(0)
            .map((_, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {data.benefits[index]?.label}
                </TableCell>
                <TableCell className="text-right"></TableCell>
                <TableCell className="text-right"></TableCell>
                <TableCell className="text-right">
                  {data.benefits[index]?.value &&
                    formatCurrency(Number(data.benefits[index]?.value))}
                </TableCell>
                <TableCell className="text-right">
                  {data.benefits[index]?.value &&
                    formatCurrency(Number(data.benefits[index]?.ytd))}
                </TableCell>
                <TableCell>{data.deductions[index]?.label}</TableCell>
                <TableCell className="text-right">
                  {data.deductions[index]?.value &&
                    formatCurrency(Number(data.deductions[index]?.value))}
                </TableCell>
                <TableCell className="text-right">
                  {data.deductions[index]?.value &&
                    formatCurrency(Number(data.deductions[index]?.ytd))}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        <TableFooter className="bg-blue-300">
          <TableRow>
            <TableCell>Payments</TableCell>
            <TableCell className="text-right"></TableCell>
            <TableCell className="text-right"></TableCell>
            <TableCell className="text-right">
              {formatCurrency(payments)}
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(ytdTotalPayment)}
            </TableCell>
            <TableCell>Deductions</TableCell>
            <TableCell className="text-right">
              {formatCurrency(deductions)}
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(ytdTotalDeduction)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Deduction</TableCell>
            <TableCell className="text-right"></TableCell>
            <TableCell className="text-right">
              {formatCurrency(deductions)}
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(ytdTotalDeduction)}
            </TableCell>
            <TableCell className="text-right"></TableCell>
            <TableCell className="text-right"></TableCell>
            <TableCell className="text-right"></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Net Pay</TableCell>
            <TableCell className="text-right"></TableCell>
            <TableCell className="text-right"></TableCell>
            <TableCell className="text-right">
              {formatCurrency(netPay)}
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(ytdTotalPayment - ytdTotalDeduction)}
            </TableCell>
            <TableCell className="text-right"></TableCell>
            <TableCell className="text-right"></TableCell>
            <TableCell className="text-right"></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
