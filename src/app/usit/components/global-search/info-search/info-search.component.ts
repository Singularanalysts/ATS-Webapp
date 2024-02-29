import { Component, ElementRef, EventEmitter, Output, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-info-search',
  standalone: true,
  imports: [CommonModule, MatDialogModule,MatFormFieldModule,FormsModule, MatDialogModule,
    MatInputModule,],
  templateUrl: './info-search.component.html',
  styleUrls: ['./info-search.component.scss']
})
export class InfoSearchComponent {
  searchQuery = '';

  constructor(
    public dialogRef: MatDialogRef<InfoSearchComponent>,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  ngAfterViewInit() {
    // Simulate typing "Job_title And Company"
    this.simulateTyping("Job title And Company");
  }

  simulateTyping(text: string) {
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < text.length) {
        this.searchQuery += text[index];
      
        index++;
        
      } else {
        clearInterval(intervalId);
      }
    }, 100); // Adjust the typing speed if needed
  }
  highlightSpaces() {
    this.searchQuery = this.searchQuery.replace(/\s/g, '');
    this.searchQuery = this.searchQuery.split('').join(' ');
    this.searchQuery = this.searchQuery.trim();

    // Focus on the input after it's automatically entered
    if (this.searchQuery.length > 0) {
      const inputElement = this.el.nativeElement.querySelector('input');
      this.renderer.setProperty(inputElement, 'selectionStart', this.searchQuery.length - 1);
      this.renderer.setProperty(inputElement, 'selectionEnd', this.searchQuery.length - 1);
      inputElement.focus();
    }
  }
}
