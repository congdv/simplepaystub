import { LucideIcon, FilePlus2, ListRestart, Save, DownloadCloud, Mail, Calculator, Layers } from 'lucide-react';
import { LOADING_STATES } from '@/constants';
import { Command } from './toolbar-commands';

export interface ToolbarButtonConfig {
  id: string;
  title: string;
  icon: LucideIcon;
  label: string;
  loadingState?: string;
  loadingIcon?: LucideIcon;
  loadingLabel?: string;
  isPro?: boolean;
}

export const TOOLBAR_BUTTONS: ToolbarButtonConfig[] = [
  {
    id: 'loadSample',
    title: 'Load sample data',
    icon: FilePlus2,
    label: 'Sample Data',
  },
  {
    id: 'reset',
    title: 'Reset paystub',
    icon: ListRestart,
    label: 'Reset',
  },
  {
    id: 'save',
    title: 'Save paystub',
    icon: Save,
    label: 'Save',
  },
  {
    id: 'download',
    title: 'Download paystub',
    icon: DownloadCloud,
    label: 'Download PDF',
    loadingState: LOADING_STATES.DOWNLOADING,
    loadingLabel: 'Generating...',
  },
  {
    id: 'sendEmail',
    title: 'Send PDF to email',
    icon: Mail,
    label: 'Send PDF to Email',
    loadingState: LOADING_STATES.SENDING_EMAIL,
    loadingLabel: 'Sending...',
  },
  {
    id: 'autoTax',
    title: 'Auto-calculate taxes (Pro)',
    icon: Calculator,
    label: 'Auto Tax',
    isPro: true,
  },
  {
    id: 'batchGenerate',
    title: 'Batch generate from CSV (Pro)',
    icon: Layers,
    label: 'Batch Generate',
    isPro: true,
  },
];
