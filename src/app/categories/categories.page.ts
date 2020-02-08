import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: [
    './styles/categories.page.scss',
    './styles/categories.shell.scss',
    './styles/categories.responsive.scss'
  ]
})
export class CategoriesPage implements  OnInit {
  constructor(private router: Router) {
  }
  ngOnInit(): void {
    console.log(this.router.navigated);

  }


}
