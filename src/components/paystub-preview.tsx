import { PayStubType, TemplateType } from '@/types';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import NovaPayStubTemplate from './templates/preview/NovaPayStubTemplate';
import MonoPayStubTemplate from './templates/preview/MonoPayStubTemplate';
import { DEFAULT_TEMPLATE } from '@/constants';


const TEMPLATES: { templateId: number; templateName: string; type: TemplateType; Component: any }[] = [
  { templateId: 1, templateName: 'Nova Paystub Template', type: 'NOVA', Component: NovaPayStubTemplate },
  { templateId: 2, templateName: 'Mono Paystub Template', type: 'MONO', Component: MonoPayStubTemplate },
];

export default function PaystubPreview() {
  const { watch, setValue } = useFormContext<PayStubType>();
  const formValues = watch();

  const watchedTemplate = watch('template') as TemplateType | undefined;
  const template: TemplateType = watchedTemplate === 'NOVA' || watchedTemplate === 'MONO' ? watchedTemplate : DEFAULT_TEMPLATE;

  useEffect(() => {
    try {
      if (!watchedTemplate) {
        setValue('template' as any, DEFAULT_TEMPLATE as any, { shouldDirty: false });
      }
    } catch (err) {
      // ignore in non-form contexts
    }
  }, [watchedTemplate, setValue]);

  const selected = TEMPLATES.find((t) => t.type === template) || TEMPLATES[0];
  const TemplateComponent = selected.Component;

  return (
    <div className="sticky top-24">
      {/* Header row */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Live Preview</h2>
        <div className="w-56">
          <Select value={template} onValueChange={(v) => setValue('template' as any, v as any, { shouldDirty: true })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              {TEMPLATES.map((t) => (
                <SelectItem key={t.templateId} value={t.type}>
                  {t.templateName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Preview card */}
      <div className="bg-white w-full rounded-sm overflow-hidden p-4 md:p-6 min-h-[700px] border border-slate-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]">
        <TemplateComponent {...formValues} />
      </div>
    </div>
  );
}
