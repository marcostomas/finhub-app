import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeService } from '../home/home.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  public saldoTotal: any;

  constructor(private request: HomeService) {}

  ngOnInit() {}

  activeTab: string = 'home';

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  public getSaldoTotal(cpf: string): void {
    this.saldoTotal = [];

    this.request.getSaldoConta(cpf).subscribe((response) => {
      this.saldoTotal = response;
    });
  }
}
