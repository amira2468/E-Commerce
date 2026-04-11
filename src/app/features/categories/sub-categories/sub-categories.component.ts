import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoriesService } from '../../../core/services/categories.service';
import { Categories } from '../../../core/models/categories.interface';

@Component({
  selector: 'app-sub-categories',
  imports: [RouterLink],
  templateUrl: './sub-categories.component.html',
  styleUrl: './sub-categories.component.css',
})
export class SubCategoriesComponent implements OnInit {

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly categoriesService = inject(CategoriesService);

  categoryDetails = signal<Categories>({} as Categories);
  subCategoriesList = signal<Categories[]>([]);
    isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id')!;
      this.getCategoryDetails(id);
      this.getSubCategories(id);
    });
  }

  getCategoryDetails(id: string): void {
    this.isLoading.set(true);
    this.categoriesService.getSpecificCategory(id).subscribe({
      next: (res) => {this.categoryDetails.set(res.data);
        this.isLoading.set(false);
      },
    error: (err) => {
      console.log(err);
      this.isLoading.set(false); 
    }
    });
  }

  getSubCategories(id: string): void {
    this.categoriesService.getSubCategoriesByCategory(id).subscribe({
      next: (res) => this.subCategoriesList.set(res.data),
      error: (err) => console.log(err),
    });
  }
}
