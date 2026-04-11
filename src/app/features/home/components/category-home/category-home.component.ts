import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoriesService } from '../../../../core/services/categories.service';
import { Categories } from '../../../../core/models/categories.interface';
import { RouterLink } from "@angular/router";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-category-home',
  imports: [RouterLink , TranslateModule],
  templateUrl: './category-home.component.html',
  styleUrl: './category-home.component.css',
})
export class CategoryHomeComponent implements OnInit {
  private readonly categoriesService= inject(CategoriesService);

    isLoading = signal<boolean>(false);

  categoriesList = signal<Categories[]>([])
  ngOnInit(): void {
    this.getCategoriesData()
  }

  getCategoriesData():void{
    this.isLoading.set(true);
    this.categoriesService.getAllCategories().subscribe({
      next:(res)=>{
        console.log(res.data , 'cat');
        this.categoriesList.set(res.data )
        this.isLoading.set(false);
  },
      error:(err)=>{
        console.log(err);
        this.isLoading.set(false); 
      }
    })
  }
}
