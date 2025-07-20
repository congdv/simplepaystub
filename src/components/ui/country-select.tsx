import { Country } from '@/types';
import { FormControl } from './form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

export default function CountrySelect({ field, countries }: { field: any; countries: Country[] }) {
  return (
    <Select
      onValueChange={(value: string) => {
        field.onChange(value);
      }}
      value={field.value}
    >
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder="" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {countries.map((c: Country) => (
          <SelectItem value={c.name} key={c.slug}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
