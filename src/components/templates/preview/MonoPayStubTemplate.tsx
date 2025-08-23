import { DEFAULT_PAYMENT_TYPE } from '@/constants';
import { formatCurrency } from '@/lib/utils';
import { PayStubType } from '@/types';

export default function MonoPayStubTemplate(data: PayStubType) {
  const regularPay = data.payment.type === DEFAULT_PAYMENT_TYPE
    ? Number(data.payment.hourlyRate) * Number(data.payment.numOfHours)
    : Number(data.payment.annualSalary || 0);

  const benefitsTotal = data.benefits.reduce((p, c) => p + Number(c.value || 0), 0);
  const deductionsTotal = data.deductions.reduce((p, c) => p + Number(c.value || 0), 0);
  const payments = Number(regularPay) + benefitsTotal;
  const netPay = payments - deductionsTotal;

  const ytdPayments = Number(data.payment.ytd || 0) +
    data.benefits.reduce((p, c) => p + Number(c.ytd || 0), 0);
  const ytdDeductions = data.deductions.reduce((p, c) => p + Number(c.ytd || 0), 0);

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 shadow-sm rounded text-sm font-sans">
      {/* Header: logo + company info / earnings statement */}
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-4">
          {data.payer.logo ? (
            <img src={data.payer.logo} alt="logo" className="w-20 h-20 object-contain rounded" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold">
              {data.payer.name ? data.payer.name.slice(0, 2).toUpperCase() : 'FK'}
            </div>
          )}
          <div className="text-xs text-gray-700">
            <div className="font-semibold">{data.payer.name || 'Financial Kinesis Inc.'}</div>
            <div>{data.payer.address}</div>
            <div>
              {data.payer.city}, {data.payer.stateOrProvince} {data.payer.zipOrPostalCode}
            </div>
            <div>{data.payer.countryOrRegion}</div>
          </div>
        </div>

        <div className="text-right border p-3">
          <div className="text-lg font-semibold">Earnings Statement</div>
          <div className="text-xs text-gray-600 mt-2">
            {data.payment.periodEnd && (
              <div>Period Ending: {new Date(data.payment.periodEnd).toLocaleDateString('en-US')}</div>
            )}
            {data.payment.date && <div>Pay Date: {new Date(data.payment.date).toLocaleDateString('en-US')}</div>}
            {data.payment.chequeNumber && <div>Payroll Check Number: {data.payment.chequeNumber}</div>}
          </div>
        </div>
      </div>

      {/* SSN / Employee block */}
      <div className="mt-4 bg-gray-100 p-3 rounded-sm flex justify-between">
        <div className="text-xs">
          <div className="text-gray-700">{/* placeholder for SSN if available */}</div>
        </div>
        <div className="text-right text-xs">
          <div className="font-semibold">{data.payee.name || 'Employee Name'}</div>
          <div>{data.payee.address}</div>
          <div>{data.payee.city}, {data.payee.stateOrProvince} {data.payee.zipOrPostalCode}</div>
        </div>
      </div>

      {/* Main content: earnings then deductions (stacked vertically) */}
      <div className="mt-6 space-y-6">
        {/* Earnings section */}
        <div>
          <div className="text-sm font-medium mb-2">Earnings</div>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Type</th>
                <th className="text-right py-2">Rate</th>
                <th className="text-right py-2">Hours</th>
                <th className="text-right py-2">This Period</th>
                <th className="text-right py-2">Year to Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2">{data.payment.type === 'hourly' ? 'Regular' : 'Salary'}</td>
                <td className="text-right py-2">
                  {data.payment.type === DEFAULT_PAYMENT_TYPE && formatCurrency(Number(data.payment.hourlyRate))}
                </td>
                <td className="text-right py-2">{data.payment.type === DEFAULT_PAYMENT_TYPE && data.payment.numOfHours}</td>
                <td className="text-right py-2">{formatCurrency(regularPay)}</td>
                <td className="text-right py-2">{formatCurrency(Number(data.payment.ytd || 0))}</td>
              </tr>
              {data.benefits.map((b, i) => (
                <tr key={i} className="text-gray-700">
                  <td className="py-2">{b.label}</td>
                  <td className="text-right py-2"></td>
                  <td className="text-right py-2"></td>
                  <td className="text-right py-2">{b.value ? formatCurrency(Number(b.value)) : ''}</td>
                  <td className="text-right py-2">{b.ytd ? formatCurrency(Number(b.ytd)) : ''}</td>
                </tr>
              ))}
              <tr className="border-t font-semibold">
                <td className="py-2">Gross</td>
                <td></td>
                <td></td>
                <td className="text-right py-2">{formatCurrency(payments)}</td>
                <td className="text-right py-2">{formatCurrency(ytdPayments)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Deductions section */}
        <div>
          <div className="text-sm font-medium mb-2">Deductions</div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Type</th>
                <th className="text-right py-2">This Period</th>
                <th className="text-right py-2">Year to Date</th>
              </tr>
            </thead>
            <tbody>
              {data.deductions.map((d, i) => (
                <tr key={i}>
                  <td className="py-2">{d.label}</td>
                  <td className="text-right py-2">{d.value ? formatCurrency(Number(d.value)) : ''}</td>
                  <td className="text-right py-2">{d.ytd ? formatCurrency(Number(d.ytd)) : ''}</td>
                </tr>
              ))}
              <tr className="border-t font-semibold">
                <td className="py-2">Net Pay</td>
                <td></td>
                <td className="text-right py-2">{formatCurrency(netPay)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom YTD summary */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-gray-500">YTD Gross</div>
          <div className="font-semibold">{formatCurrency(ytdPayments)}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-gray-500">YTD Deductions</div>
          <div className="font-semibold">{formatCurrency(ytdDeductions)}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-gray-500">Year to Date Net Pay</div>
          <div className="font-semibold">{formatCurrency(ytdPayments - ytdDeductions)}</div>
        </div>
      </div>
    </div>
  );
}
