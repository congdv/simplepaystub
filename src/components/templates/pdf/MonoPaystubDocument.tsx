import { DEFAULT_PAYMENT_TYPE } from '@/constants';
import { formatCurrency } from '@/lib/utils';
import { PayStubType } from '@/types';
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 11, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'flex-start' },
  company: { fontWeight: 'bold', fontSize: 16 },
  statementBox: { borderWidth: 1, borderColor: '#e5e7eb', padding: 8, width: 180, alignItems: 'flex-start' },
  section: { marginBottom: 8 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 4, marginBottom: 4 },
  tableRow: { flexDirection: 'row', marginBottom: 2 },
  cell: { flex: 1, padding: 2 },
  labelCol: { flex: 2, padding: 2 },
  right: { textAlign: 'right' },
  small: { fontSize: 10 },
  ytdGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  ytdBox: { width: '32%', backgroundColor: '#f3f4f6', padding: 8, borderRadius: 4, alignItems: 'flex-start' },
});

const MonoPaystubDocument = (data: PayStubType) => {
  const regularPay = data.payment.type === DEFAULT_PAYMENT_TYPE
    ? Number(data.payment.hourlyRate) * Number(data.payment.numOfHours)
    : Number(data.payment.annualSalary || 0);

  const benefitsTotal = data.benefits.reduce((p, c) => p + Number(c.value || 0), 0);
  const deductionsTotal = data.deductions.reduce((p, c) => p + Number(c.value || 0), 0);
  const payments = Number(regularPay) + benefitsTotal;
  const netPay = payments - deductionsTotal;

  const ytdPayments = Number(data.payment.ytd || 0) + data.benefits.reduce((p, c) => p + Number(c.ytd || 0), 0);
  const ytdDeductions = data.deductions.reduce((p, c) => p + Number(c.ytd || 0), 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {data.payer.logo && <Image src={data.payer.logo} style={{ width: 56, height: 56, marginRight: 8 }} />}
            <View>
              <Text style={styles.company}>{data.payer.name || 'Acme Corporation'}</Text>
              <Text style={styles.small}>{data.payer.address || '123 Street st '}</Text>
              <Text style={styles.small}>{data.payer.addressSecond || ''}</Text>
              <Text style={styles.small}>
                {data.payer.city ? data.payer.city + ', ' : 'ABC, '} {data.payer.stateOrProvince || 'YY'} {data.payer.zipOrPostalCode || 'XXX XXX'}
              </Text>
              <Text style={styles.small}>{data.payer.countryOrRegion || 'ZZ'}</Text>
            </View>
          </View>

          <View style={styles.statementBox}>
            <Text style={{ fontWeight: 'bold' }}>Earnings Statement</Text>
            <Text style={styles.small}>
              {data.payment.periodStart && data.payment.periodEnd && (
                <>Pay Period: {new Date(data.payment.periodStart).toLocaleDateString('en-US')} - {new Date(data.payment.periodEnd).toLocaleDateString('en-US')}</>
              )}
            </Text>
            <Text style={styles.small}>{data.payment.date && `Pay Date: ${new Date(data.payment.date).toLocaleDateString('en-US')}`}</Text>
            {data.payment.chequeNumber && <Text style={styles.small}>Check #: {data.payment.chequeNumber}</Text>}
          </View>
        </View>

        {/* Earnings Statement box placed at header right visually */}

        {/* Employee info bar */}
        <View style={{ backgroundColor: '#f3f4f6', padding: 10, marginTop: 8, borderRadius: 2 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View />
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontWeight: 'bold' }}>{data.payee.name || 'Employee Name'}</Text>
              <Text style={styles.small}>{data.payee.address}</Text>
              {data.payee.addressSecond ? <Text style={styles.small}>{data.payee.addressSecond}</Text> : null}
              <Text style={styles.small}>{data.payee.city}, {data.payee.stateOrProvince} {data.payee.zipOrPostalCode}</Text>
            </View>
          </View>
        </View>

        {/* Earnings table */}
        <View>
          <View style={styles.tableHeader}>
            <Text style={[styles.labelCol, { fontWeight: 'bold', width: '40%' }]}>Earnings</Text>
            <Text style={[styles.cell, styles.right, { fontWeight: 'bold', width: '10%' }]}>Rate</Text>
            <Text style={[styles.cell, styles.right, { fontWeight: 'bold', width: '10%' }]}>Hours</Text>
            <Text style={[styles.cell, styles.right, { fontWeight: 'bold', width: '20%' }]}>This Period</Text>
            <Text style={[styles.cell, styles.right, { fontWeight: 'bold', width: '20%' }]}>Year to Date</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.labelCol, { width: '40%' }]}>{data.payment.type === DEFAULT_PAYMENT_TYPE ? 'Regular' : 'Salary'}</Text>
            <Text style={[styles.cell, styles.right, { width: '10%' }]}>
              {data.payment.type === DEFAULT_PAYMENT_TYPE && data.payment.hourlyRate ? formatCurrency(Number(data.payment.hourlyRate)) : ''}
            </Text>
            <Text style={[styles.cell, styles.right, { width: '10%' }]}>{data.payment.type === DEFAULT_PAYMENT_TYPE ? data.payment.numOfHours : ''}</Text>
            <Text style={[styles.cell, styles.right, { width: '20%' }]}>{formatCurrency(regularPay)}</Text>
            <Text style={[styles.cell, styles.right, { width: '20%' }]}>{formatCurrency(Number(data.payment.ytd || 0))}</Text>
          </View>

          {data.benefits.map((b, i) => (
            <View style={styles.tableRow} key={i}>
              <Text style={[styles.labelCol, { width: '40%' }]}>{b.label}</Text>
              <Text style={[styles.cell, styles.right, { width: '10%' }]}></Text>
              <Text style={[styles.cell, styles.right, { width: '10%' }]}></Text>
              <Text style={[styles.cell, styles.right, { width: '20%' }]}>{b.value ? formatCurrency(Number(b.value)) : ''}</Text>
              <Text style={[styles.cell, styles.right, { width: '20%' }]}>{b.ytd ? formatCurrency(Number(b.ytd)) : ''}</Text>
            </View>
          ))}

          <View style={[styles.tableRow, { marginTop: 6, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 6 }]}>
            <Text style={[styles.labelCol, { fontWeight: 'bold', width: '40%' }]}></Text>
            <Text style={[styles.cell, { width: '10%' }]}></Text>
            <Text style={[styles.cell, { width: '10%' }]}></Text>
            <Text style={[styles.cell, styles.right, { fontWeight: 'bold', width: '20%' }]}>{formatCurrency(payments)}</Text>
            <Text style={[styles.cell, styles.right, { fontWeight: 'bold', width: '20%' }]}>{formatCurrency(ytdPayments)}</Text>
          </View>
        </View>

        {/* Deductions table */}
        <View style={{ marginTop: 12 }}>
          <View style={[styles.tableHeader]}>
            <Text style={[styles.labelCol, { fontWeight: 'bold', width: '40%' }]}>Deductions</Text>
            <Text style={[styles.cell, { width: '10%' }]}></Text>
            <Text style={[styles.cell, { width: '10%' }]}></Text>
            <Text style={[styles.cell, styles.right, { fontWeight: 'bold', width: '20%' }]}>This Period</Text>
            <Text style={[styles.cell, styles.right, { fontWeight: 'bold', width: '20%' }]}>Year to Date</Text>
          </View>
          {data.deductions.map((d, i) => (
            <View style={styles.tableRow} key={i}>
              <Text style={[styles.labelCol, { width: '40%' }]}>{d.label}</Text>
              <Text style={[styles.cell, { width: '10%' }]}></Text>
              <Text style={[styles.cell, { width: '10%' }]}></Text>
              <Text style={[styles.cell, styles.right, { width: '20%' }]}>{d.value ? formatCurrency(Number(d.value)) : ''}</Text>
              <Text style={[styles.cell, styles.right, { width: '20%' }]}>{d.ytd ? formatCurrency(Number(d.ytd)) : ''}</Text>
            </View>
          ))}

          <View style={[styles.tableRow, { marginTop: 6, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 6 }]}>
            <Text style={[styles.labelCol, { fontWeight: 'bold', width: '40%' }]}></Text>
            <Text style={[styles.cell, { width: '10%' }]}></Text>
            <Text style={[styles.cell, { width: '10%' }]}></Text>
            <Text style={[styles.cell, styles.right, { fontWeight: 'bold', width: '20%' }]}>{formatCurrency(deductionsTotal)}</Text>
            <Text style={[styles.cell, styles.right, { fontWeight: 'bold', width: '20%' }]}>{formatCurrency(ytdDeductions)}</Text>
          </View>
          <View style={[styles.tableRow, { marginTop: 6, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 6 }]}>
            <Text style={[styles.labelCol, { fontWeight: 'bold', width: '40%' }]}>Net pay</Text>
            <Text style={[styles.cell, { width: '10%' }]}></Text>
            <Text style={[styles.cell, { width: '10%' }]}></Text>
            <Text style={[styles.cell, styles.right, { fontWeight: 'bold', width: '20%' }]}>{formatCurrency(netPay)}</Text>
            <Text style={[styles.cell, { width: '20%' }]}></Text>
          </View>
        </View>

        {/* YTD summary */}
        <View style={styles.ytdGrid}>
          <View style={styles.ytdBox}>
            <Text style={styles.small}>Year to Date Gross</Text>
            <Text style={{ fontWeight: 'bold' }}>{formatCurrency(ytdPayments)}</Text>
          </View>
          <View style={styles.ytdBox}>
            <Text style={styles.small}>Year to Date Deductions</Text>
            <Text style={{ fontWeight: 'bold' }}>{formatCurrency(ytdDeductions)}</Text>
          </View>
          <View style={styles.ytdBox}>
            <Text style={styles.small}>Year to Date Net Pay</Text>
            <Text style={{ fontWeight: 'bold' }}>{formatCurrency(ytdPayments - ytdDeductions)}</Text>
          </View>
        </View>
      </Page>
    </Document >
  );
};

export default MonoPaystubDocument;
