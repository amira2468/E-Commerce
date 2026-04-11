import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoriesService } from '../../core/services/categories.service';
import { Categories } from '../../core/models/categories.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  imports: [RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit{
  private readonly categoriesService= inject(CategoriesService);

  categoriesList = signal<Categories[]>([])
  isLoading = signal<boolean>(false);
  ngOnInit(): void {
    this.getCategoriesData()
    this.getAllSub()
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

  getAllSub():void{
    this.categoriesService.getAllSubCategories().subscribe({
      next:(res)=>{
        console.log(res.data , 'Amira');  },
      error:(err)=>{
        console.log(err);
      }
    })
  }
}
