import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root',
})
export class PaginatorIntlService extends MatPaginatorIntl {
  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    return length === 0 || pageSize === 0 ? `0 of ${length}` : `Page ${page+1} of ${Math.ceil(length/pageSize)}`;
  };
}
