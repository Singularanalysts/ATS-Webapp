import { Directive, ElementRef, HostListener } from '@angular/core';
import { MatRipple, RippleRef } from '@angular/material/core';

@Directive({
  selector: '[appRippleOnHover]',
  standalone: true,
  providers: [MatRipple],
})
export class RippleDirective {
  rippleRef!: RippleRef;
  constructor(private _elementRef: ElementRef, private ripple: MatRipple) {}
  @HostListener('mouseenter') onMouseEnter(): void {
    if (this._elementRef && this._elementRef.nativeElement) {
      this._elementRef.nativeElement.style.overflow = 'hidden';
    }

    if (this.ripple) {
      this.rippleRef = this.ripple.launch({ centered: true, persistent: true });
    }
  }
  @HostListener('mouseleave') onMouseLeave(): void {
    if (this.rippleRef) {
      this.rippleRef.fadeOut();
    }
  }
}
