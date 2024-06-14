import { Component, ElementRef, Renderer2, AfterViewInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-skills-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule  // Ensure MatInputModule is imported
  ],
  templateUrl: './skills-info.component.html',
  styleUrls: ['./skills-info.component.scss']
})
export class SkillsInfoComponent implements AfterViewInit {
  searchQuery = '';
  private renderer = inject(Renderer2);
  private elementRef = inject(ElementRef);
  @ViewChild('searchInput') searchInput!: ElementRef;

  ngAfterViewInit() {
    this.simulateTyping("Java, Spring, Spring Boot, Hibernate, MySQL");
  }

  simulateTyping(text: string) {
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < text.length) {
        this.searchQuery += text[index];
        this.Spaces();
        index++;
      } else {
        clearInterval(intervalId);
        this.focusInput();
      }
    }, 100);
  }

  Spaces() {
      this.searchQuery = this.searchQuery.replace(/,\s*/g, ', ');
  }

  focusInput() {
    if (this.searchQuery.length > 0) {
      const textareaElement = this.searchInput.nativeElement;
      textareaElement.focus();
    }
  }
}
