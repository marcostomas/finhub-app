import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  activeTab: string = 'home';
  underlinePosition: string = '0px';

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.updateUnderlinePosition(tab);
  }

  updateUnderlinePosition(tab: string): void {
    switch (tab) {
      case 'home':
        this.underlinePosition = '0px';
        break;
      case 'extrato':
        this.underlinePosition = '100px';
        break;
      case 'gastos':
        this.underlinePosition = '200px';
        break;
    }
  }
}
