import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  public dadosUsuario: any;
  constructor(private service: HomeService) {}

  ngOnInit() {
    this.getData();
  }

  private getData(): void {
    this.dadosUsuario = [];

    this.service.getDados().subscribe((response) => {
      this.dadosUsuario = response;
    });
  }
}
