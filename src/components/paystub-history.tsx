'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePaystub } from '@/contexts/paystub-context';
import { useToolbar } from '@/contexts/toolbar-context';
import { formatDate, getTimeAgo } from '@/lib/utils';
import { PayStubType } from '@/types';
import {
  Clock,
  Eye,
  Loader2,
  MoreVertical,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { DeleteConfirmationDialog } from './delete-confirmation-dialog';


export default function PaystubHistory() {
  const { history, deletePaystub, isLoading } = usePaystub();
  const { onViewPaystub } = useToolbar();
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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const paginatedPaystubs = useMemo(() => {
    const sortedHistory = [...history].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    const start = (currentPage - 1) * pageSize;
    return sortedHistory.slice(start, start + pageSize);
  }, [history, currentPage, pageSize]);

  const totalPages = Math.ceil(history.length / pageSize);

  const handleDeleteClick = useCallback((paystubId: string, employeeName: string) => {
    setDeleteDialog({ open: true, paystubId, employeeName });
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
    const regularPay = Number(data.payment.numOfHours || 0) * Number(data.payment.hourlyRate || 0);
    const totalDeductions = data.deductions.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
    const totalBenefits = data.benefits.reduce((sum, b) => sum + (Number(b.value) || 0), 0);
    return regularPay + totalBenefits - totalDeductions;
  }, []);

  if (isLoading) {
    return (
      <div className="mt-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          <span className="ml-2 text-sm text-slate-500">Loading paystub history...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="mt-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-slate-400" />
        <h2 className="text-lg font-bold text-slate-800">
          Recent Paystubs{' '}
          <span className="text-slate-400 font-normal">({history.length})</span>
        </h2>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm mb-4">
        {/* Table header */}
        <div className="grid grid-cols-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <div>Employee</div>
          <div>Pay Date</div>
          <div>Net Pay</div>
          <div className="flex justify-between">
            <span>Created</span>
            <div className="w-4" />
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100">
          {history.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-slate-500">No paystubs created yet</p>
              <p className="text-xs text-slate-400 mt-1">Your generated paystubs will appear here</p>
            </div>
          ) : (
            paginatedPaystubs.map((paystub) => (
              <div
                key={paystub.id}
                className="grid grid-cols-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => onViewPaystub(paystub.id)}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900">
                    {paystub.data.payee.name || '—'}
                  </span>
                  <span className="text-xs text-slate-500">{paystub.data.payer.name}</span>
                </div>
                <div className="text-sm text-slate-600 font-medium">
                  {formatDate(paystub.data.payment.date)}
                </div>
                <div className="text-sm font-bold text-slate-900">
                  ${calculateNetPay(paystub.data).toLocaleString()}
                </div>
                <div
                  className="flex justify-between items-center text-xs text-slate-500"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>{getTimeAgo(paystub.createdAt)}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem
                        className="text-sm"
                        onClick={() => onViewPaystub(paystub.id)}
                      >
                        <Eye className="mr-2 h-3 w-3" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-sm"
                        onClick={() =>
                          handleDeleteClick(paystub.id, paystub.data.payee.name || 'Unknown Employee')
                        }
                        disabled={!!deletingId}
                      >
                        <Trash2 className="mr-2 h-3 w-3" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-slate-700">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
        <p className="text-xs text-blue-800 leading-relaxed">
          These paystubs are stored on your device only. Clearing your browser&apos;s history will
          erase these records. We recommend downloading and saving a copy of each paystub you
          generate.
        </p>
      </div>

      <DeleteConfirmationDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, paystubId: '', employeeName: '' })}
        onConfirm={handleDeleteConfirm}
        employeeName={deleteDialog.employeeName}
        isDeleting={deletingId === deleteDialog.paystubId}
      />
    </section>
  );
}
