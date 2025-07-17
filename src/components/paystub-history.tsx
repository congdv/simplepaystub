'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { usePaystub } from '@/contexts/paystub-context';
import { formatDate, getTimeAgo } from '@/lib/utils';
import { PayStubType } from '@/types';
import {
  Clock,
  Download,
  Eye,
  Loader2,
  MoreVertical,
  Shield,
  Trash2
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { DeleteConfirmationDialog } from './delete-confirmation-dialog';


export default function PaystubHistory() {
  const { history, deletePaystub, getPaystub, isLoading } = usePaystub();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    paystubId: string;
    employeeName: string;
  }>({
    open: false,
    paystubId: '',
    employeeName: '',
  });

  const handleDeleteClick = useCallback((paystubId: string, employeeName: string) => {
    setDeleteDialog({
      open: true,
      paystubId,
      employeeName,
    });
  }, []);


  const handleDeleteConfirm = useCallback(async () => {
    try {
      setDeletingId(deleteDialog.paystubId);

      deletePaystub(deleteDialog.paystubId);

      toast.success(`Paystub for ${deleteDialog.employeeName} deleted successfully`);

      setDeleteDialog({ open: false, paystubId: '', employeeName: '' });
    } catch (error) {
      console.error('Error deleting paystub:', error);
      toast.error('Failed to delete paystub. Please try again.');
    } finally {
      setDeletingId(null);
    }
  }, [deleteDialog, deletePaystub]);

  const calculateNetPay = useCallback((data: PayStubType): number => {
    // Calculate gross pay
    const regularPay = Number(data.payment.numOfHours || 0) * Number(data.payment.hourlyRate || 0);


    // Calculate total deductions
    const deductions = data.deductions || {};
    const totalDeductions = Object.values(deductions).reduce((sum, amount) => {
      return sum + (Number(amount) || 0);
    }, 0);

    // Calculate benefits (if they're added to pay)
    const benefits = data.benefits || {};
    const totalBenefits = Object.values(benefits).reduce((sum, amount) => {
      return sum + (Number(amount) || 0);
    }, 0);

    // Net pay = Gross pay + Benefits - Deductions
    return regularPay + totalBenefits - totalDeductions;
  }, []);

  const getTimeAgoCallback = useCallback(getTimeAgo, []);

  const formatDateCallback = useCallback(formatDate, []);


  if (isLoading) {
    return (
      <div className="mt-8 w-full max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading paystub history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 w-full max-w-7xl mx-auto px-6">
      {/* Simple Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Recent Paystubs</h2>
          <span className="text-sm text-gray-500">({history.length})</span>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>



      {/* Compact Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="font-medium">Employee</TableHead>
              <TableHead className="font-medium">Pay Date</TableHead>
              <TableHead className="text-right font-medium">Net Pay</TableHead>
              <TableHead className="text-right font-medium">Created</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="text-gray-500">
                    <p className="text-sm">No paystubs created yet</p>
                    <p className="text-xs text-gray-400">Your generated paystubs will appear here</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              history.slice(0, 5).map((paystub) => ( // Show only 5 recent
                <TableRow key={paystub.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{paystub.data.payee.name}</div>
                      <div className="text-xs text-gray-500">{paystub.data.payer.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{formatDateCallback(paystub.data.payment.date)}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-semibold text-gray-900">{calculateNetPay(paystub.data)}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="text-xs text-gray-500">{getTimeAgoCallback(paystub.createdAt)}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem className="text-sm" disabled>
                          <Eye className="mr-2 h-3 w-3" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-sm" disabled>
                          <Download className="mr-2 h-3 w-3" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-sm" onClick={() => handleDeleteClick(paystub.id, paystub.data.payee.name || 'Unknown Employee')}
                          disabled={!!deletingId}>
                          <Trash2 className="mr-2 h-3 w-3 " />
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

      {/* Show more link if there are more than 5 items */}
      {history.length > 5 && (
        <div className="text-center mt-3">
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
            View {history.length - 5} more paystubs →
          </Button>
        </div>
      )}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="text-blue-700">
              These paystubs are stored on your device only. Clearing your browser's history will erase these records.
              We recommend downloading and saving a copy of each paystub you generate.
            </p>
          </div>
        </div>
      </div>
      <DeleteConfirmationDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, paystubId: '', employeeName: '' })}
        onConfirm={handleDeleteConfirm}
        employeeName={deleteDialog.employeeName}
        isDeleting={deletingId === deleteDialog.paystubId}
      />
    </div>
  );
}