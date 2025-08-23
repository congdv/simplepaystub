import { PayStubType, TemplateType } from '@/types';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
// template components
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

  // use the form's `template` field as the source of truth
  const watchedTemplate = watch('template') as TemplateType | undefined;
  const template: TemplateType = watchedTemplate === 'NOVA' || watchedTemplate === 'MONO' ? watchedTemplate : DEFAULT_TEMPLATE;

  // keep form value in sync if it's missing
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
    <div>
      <div className="mb-4 flex items-center justify-end md:h-[76px]">
        <div className="w-48">
          <Select value={template} onValueChange={(v) => setValue('template' as any, v as any, { shouldDirty: true })}>
            <SelectTrigger className="mt-1 w-full">
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

      <TemplateComponent {...formValues} />
    </div>
  );
}
