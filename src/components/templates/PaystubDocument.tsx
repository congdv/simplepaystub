import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { PayStubType } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { DEFAULT_PAYMENT_TYPE } from '@/constants';

// Create styles
const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 12, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  company: { fontWeight: 'bold', fontSize: 18 },
  section: { marginBottom: 8 },
  blueBar: {
    backgroundColor: '#7daafc',
    color: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: 1,
    borderColor: '#ccc',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tableRow: { flexDirection: 'row', marginBottom: 2 },
  cell: { flex: 1, padding: 2 },
  blueTable: { backgroundColor: '#7daafc', color: '#222', padding: 8, marginTop: 8 },
  blueCell: { flex: 1, padding: 2 },
  bold: { fontWeight: 'bold' },
  leftPadded: {
    paddingLeft: 8, // 16 points of left padding
  },
  xPadded: {
    paddingLeft: 8, // 8 points of left padding
    paddingRight: 8, // 8 points of right padding
  },
  tableCol: {
    width: '12.5%',
    padding: 4,
  },
  rightAligned: {
    textAlign: 'right',
  },
});

const PaystubDocument = (data: PayStubType) => {
  const maxRows = Math.max(data.deductions?.length || 0, data.benefits?.length || 0);
  const regularPay =
    data.payment.type === DEFAULT_PAYMENT_TYPE
      ? Number(data.payment.hourlyRate) * Number(data.payment.numOfHours)
      : Number(data.payment.annualSalary);
  const payments =
    regularPay + data.benefits.reduce((prev, curr) => Number(prev) + Number(curr.value), 0);
  const deductions = data.deductions.reduce((prev, curr) => Number(prev) + Number(curr.value), 0);
  const netPay = Number(payments) - Number(deductions);
  const ytdTotalPayment =
    Number(data.payment.ytd) +
    data.benefits.reduce((prev, curr) => Number(prev) + Number(curr.ytd), 0);
  const ytdTotalDeduction = data.deductions.reduce(
    (prev, curr) => Number(prev) + Number(curr.ytd),
    0
  );
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View>
          {data.payer.logo && <Image src={data.payer.logo} style={{ width: 64, height: 64 }} />}
        </View>
        <View style={styles.header}>
          <View>
            <Text style={styles.company}>{data.payer.name || 'Acme Corporation'}</Text>
            <Text>
              {data.payer.address || '123 Street st'}{' '}
              {data.payer.addressSecond ? '# ' + data.payer.addressSecond : ''}
            </Text>
            <Text>
              {data.payer.city ? data.payer.city + ', ' : 'ABC, '}
              {data.payer.stateOrProvince || 'YY'} {data.payer.zipOrPostalCode || 'XXX XXX'}
            </Text>
            <Text>{data.payer.countryOrRegion || 'ZZ'}</Text>
            <Text>
              {data.payer.phoneNumber || '(123) 456-7890'}
              {data.payer.extNo ? '# ' + data.payer.extNo : ''}
            </Text>
            <Text>{data.payer.email}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.company}>{data.payee.name || 'John Doe'}</Text>
            <Text>
              {data.payee.address || '123 Street st'}{' '}
              {data.payee.addressSecond ? '# ' + data.payee.addressSecond : ''}
            </Text>
            <Text>
              {data.payee.city ? data.payee.city + ', ' : 'ABC, '}
              {data.payee.stateOrProvince || 'YY'} {data.payee.zipOrPostalCode || 'XXX XXX'}
            </Text>
            <Text>{data.payee.countryOrRegion || 'ZZ'}</Text>
            <Text>
              {data.payee.phoneNumber || '(123) 456-7890'}{' '}
              {data.payee.extNo ? '# ' + data.payee.extNo : ''}
            </Text>
            <Text>{data.payee.email}</Text>
          </View>
        </View>

        {/* Cheque Number */}
        {data.payment.chequeNumber && (
          <View style={styles.section}>
            <Text>Check #: {data.payment.chequeNumber}</Text>
          </View>
        )}

        {/* Pay Period Bar */}
        <View style={styles.blueBar}>
          {data.payment.periodStart && data.payment.periodEnd && (
            <Text>
              Pay Period: {new Date(data.payment.periodStart).toLocaleDateString('en-US')} -{' '}
              {new Date(data.payment.periodEnd).toLocaleDateString('en-US')}
            </Text>
          )}
          {data.payment.date && (
            <Text>Pay Date: {new Date(data.payment.date).toLocaleDateString('en-US')}</Text>
          )}
        </View>

        {/* Table Header */}
        <View style={[styles.tableHeader, styles.xPadded]}>
          <Text style={[styles.tableCol, styles.bold]}>Earning Type</Text>
          <Text style={[styles.tableCol, styles.bold]}>Rate</Text>
          <Text style={[styles.tableCol, styles.bold]}>Hours</Text>
          <Text style={[styles.tableCol, styles.bold]}>Current Pay</Text>
          <Text style={[styles.tableCol, styles.bold]}>YTD Pay</Text>
          <Text style={[styles.tableCol, styles.bold]}>Deductions</Text>
          <Text style={[styles.tableCol, styles.bold]}>Current</Text>
          <Text style={[styles.tableCol, styles.bold]}>YTD</Text>
        </View>

        {/* Table Row */}
        <View style={[styles.tableRow, styles.xPadded]}>
          <Text style={[styles.tableCol]}>
            {data.payment.type === DEFAULT_PAYMENT_TYPE ? 'Hourly' : 'Regular Salary'}
          </Text>
          <Text style={styles.tableCol}>
            {data.payment.type === DEFAULT_PAYMENT_TYPE &&
              data.payment.hourlyRate &&
              formatCurrency(Number(data.payment.hourlyRate))}
          </Text>
          <Text style={styles.tableCol}>
            {data.payment.type === DEFAULT_PAYMENT_TYPE && data.payment.numOfHours}
          </Text>
          <Text style={styles.tableCol}>{formatCurrency(regularPay)}</Text>
          <Text style={styles.tableCol}>{formatCurrency(Number(data.payment.ytd))}</Text>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}></Text>
        </View>
        {Array(maxRows)
          .fill(0)
          .map((_, index) => (
            <View style={[styles.tableRow, styles.xPadded]} key={index}>
              <Text style={[styles.tableCol]}>{data.benefits[index]?.label || ''}</Text>
              <Text style={styles.tableCol}></Text>
              <Text style={styles.tableCol}></Text>
              <Text style={styles.tableCol}>
                {data.benefits[index]?.value && formatCurrency(Number(data.benefits[index]?.value))}
              </Text>
              <Text style={styles.tableCol}>
                {data.benefits[index]?.value && formatCurrency(Number(data.benefits[index]?.ytd))}
              </Text>
              <Text style={styles.tableCol}>{data.deductions[index]?.label || ''}</Text>
              <Text style={styles.tableCol}>
                {data.deductions[index]?.value &&
                  formatCurrency(Number(data.deductions[index]?.value))}
              </Text>
              <Text style={styles.tableCol}>
                {data.deductions[index]?.value &&
                  formatCurrency(Number(data.deductions[index]?.ytd))}
              </Text>
            </View>
          ))}

        {/* Table Footer */}
        <View style={styles.blueTable}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Payments</Text>
            <Text style={styles.tableCol}></Text>
            <Text style={styles.tableCol}></Text>
            <Text style={styles.tableCol}>{formatCurrency(payments)}</Text>
            <Text style={styles.tableCol}>{formatCurrency(ytdTotalPayment)}</Text>
            <Text style={styles.tableCol}>Deductions</Text>
            <Text style={styles.tableCol}>{formatCurrency(deductions)}</Text>
            <Text style={styles.tableCol}>{formatCurrency(ytdTotalDeduction)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Deductions</Text>
            <Text style={styles.tableCol}></Text>
            <Text style={styles.tableCol}></Text>
            <Text style={styles.tableCol}>{formatCurrency(deductions)}</Text>
            <Text style={styles.tableCol}>{formatCurrency(ytdTotalDeduction)}</Text>
            <Text style={styles.tableCol}></Text>
            <Text style={styles.tableCol}></Text>
            <Text style={styles.tableCol}></Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Net Pay</Text>
            <Text style={styles.tableCol}></Text>
            <Text style={styles.tableCol}></Text>
            <Text style={styles.tableCol}>{formatCurrency(netPay)}</Text>
            <Text style={styles.tableCol}>
              {formatCurrency(ytdTotalPayment - ytdTotalDeduction)}
            </Text>
            <Text style={styles.tableCol}></Text>
            <Text style={styles.tableCol}></Text>
            <Text style={styles.tableCol}></Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PaystubDocument;
