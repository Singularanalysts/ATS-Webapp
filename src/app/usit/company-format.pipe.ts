import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'companyFormat',
  standalone: true // <--- important
})
export class CompanyFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    if (value === value.toUpperCase()) return value; // keep abbreviations
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}
