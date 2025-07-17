'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Building,
  Calendar,
  DollarSign,
  Download,
  Eye,
  Filter,
  MoreVertical,
  Search,
  User,
} from 'lucide-react';
import { useState } from 'react';

// Mock data - replace with your actual data
const mockPaystubs = [
  {
    id: '1',
    employeeName: 'John Doe',
    company: 'Acme Corp',
    payPeriod: '2024-01-01 to 2024-01-15',
    payDate: '2024-01-20',
    grossPay: 2500.00,
    netPay: 1875.50,
    status: 'completed',
    createdAt: '2024-01-20',
  },
  {
    id: '2',
    employeeName: 'Jane Smith',
    company: 'Tech Solutions',
    payPeriod: '2024-01-16 to 2024-01-31',
    payDate: '2024-02-05',
    grossPay: 3200.00,
    netPay: 2350.75,
    status: 'draft',
    createdAt: '2024-02-01',
  },
  {
    id: '3',
    employeeName: 'Mike Johnson',
    company: 'Design Studio',
    payPeriod: '2024-02-01 to 2024-02-15',
    payDate: '2024-02-20',
    grossPay: 2800.00,
    netPay: 2100.25,
    status: 'completed',
    createdAt: '2024-02-15',
  },
];

export default function PaystubFullHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPaystubs = mockPaystubs.filter((paystub) => {
    const matchesSearch =
      paystub.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paystub.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || paystub.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'draft':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Paystub History</h1>
          <p className="text-gray-600 mt-1">Manage and view all your generated paystubs</p>
        </div>
        <Button className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          Create New Paystub
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by employee name or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Status: {statusFilter === 'all' ? 'All' : statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter('all')}>
              All Statuses
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
              Completed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('draft')}>
              Draft
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
              Pending
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Date Filter */}
        <Button variant="outline" className="w-full sm:w-auto">
          <Calendar className="mr-2 h-4 w-4" />
          Date Range
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Paystubs</p>
              <p className="text-2xl font-semibold text-gray-900">{mockPaystubs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Building className="h-4 w-4 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Gross Pay</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(mockPaystubs.reduce((sum, p) => sum + p.grossPay, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <User className="h-4 w-4 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Net Pay</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(mockPaystubs.reduce((sum, p) => sum + p.netPay, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="h-4 w-4 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockPaystubs.filter(p => new Date(p.createdAt).getMonth() === new Date().getMonth()).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Pay Period</TableHead>
              <TableHead>Pay Date</TableHead>
              <TableHead className="text-right">Gross Pay</TableHead>
              <TableHead className="text-right">Net Pay</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPaystubs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="text-gray-500">
                    <p className="text-lg font-medium">No paystubs found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredPaystubs.map((paystub) => (
                <TableRow key={paystub.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{paystub.employeeName}</div>
                      <div className="text-sm text-gray-500">ID: {paystub.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-700">{paystub.company}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{paystub.payPeriod}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{formatDate(paystub.payDate)}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium text-gray-900">{formatCurrency(paystub.grossPay)}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium text-gray-900">{formatCurrency(paystub.netPay)}</div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(paystub.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPaystubs.length}</span> of{' '}
          <span className="font-medium">{mockPaystubs.length}</span> results
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}