import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  transform(items: any[], property: string, filterValue: string): any {
    if (!items) return [];
    return items.filter(item => item[property].toLocaleLowerCase().includes(filterValue.toLocaleLowerCase()));
  }

}
