import { Component } from '@angular/core';
import { LangSelectComponent } from './lang-select.component';
import { TranslatePipe } from '../pipes/translate.pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LangSelectComponent, TranslatePipe],
  template: `
    <header class="app-header flex-between">
      <h1>
        {{ 'app.title' | t }}
        <span class="framework-badge">Angular</span>
      </h1>
      <app-lang-select />
    </header>
  `
})
export class AppHeaderComponent {}
