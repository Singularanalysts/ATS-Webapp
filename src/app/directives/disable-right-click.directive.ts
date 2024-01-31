import { Directive } from '@angular/core';

@Directive({
  selector: '[appDisableRightClick]',
  standalone: true
})
export class DisableRightClickDirective {

  constructor() { }

}
