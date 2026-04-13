import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'Home',
  },
{
  path: 'profile',
  loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
  children: [
        {
      path: '',
      redirectTo: 'addresses',
      pathMatch: 'full'
    },
    {
      path: 'addresses',
      loadComponent: () => import('./features/addresses/addresses.component').then(m => m.AddressesComponent)
    },
    {
      path: 'settings',
      loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
    }
  ]
},
{
  path: 'search',
  loadComponent: () =>
    import('./features/search-bar/search-bar.component').then(m => m.SearchComponent),
  title: 'Search',
},
  {
    path: 'shop',
    loadComponent: () =>
      import('./features/shop/shop.component').then((m) => m.ShopComponent),
    title: 'Shop',
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart.component').then((m) => m.CartComponent),
    title: 'Cart',
    canActivate:[authGuard]
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./features/wishlist/wishlist.component').then((m) => m.WishlistComponent),
    title: 'Wishlist',
    canActivate:[authGuard]
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./features/categories/categories.component').then((m) => m.CategoriesComponent),
    title: 'Categories',
  },
  {
    path: 'sub-categories/:id',
    loadComponent: () =>
      import('./features/categories/sub-categories/sub-categories.component').then((m) => m.SubCategoriesComponent),
    title: 'Categories',
  },
  {
    path: 'checkout/:id',
    loadComponent: () =>
      import('./features/checkout/checkout.component').then((m) => m.CheckoutComponent),
    title: 'Checkout',
    canActivate:[authGuard]
  },
  {
    path: 'brands',
    loadComponent: () =>
      import('./features/brands/brands.component').then((m) => m.BrandsComponent),
    title: 'Brands',
  },
{
    path: 'brand-prod/:id/:slug',
    loadComponent: () =>
      import('./features/brands/brand-prod/brand-prod.component').then((m) => m.BrandprodComponent),
    title: 'Brands',
  },
  {
    path: 'details/:id/:slug',
    loadComponent: () =>
      import('./features/details/details.component').then((m) => m.DetailsComponent),
    title: 'Details',
  },
  {
    path: 'allorders',
    loadComponent: () =>
      import('./features/orders/orders.component').then((m) => m.OrdersComponent),
    title: 'Orders',
    canActivate:[authGuard]
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent),
    title: 'Login',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/register/register.component').then((m) => m.RegisterComponent),
    title: 'Register',
  },
  {
    path: 'forgot',
    loadComponent: () =>
      import('./features/forgot/forgot.component').then((m) => m.ForgotComponent),
    title: 'Forgot Password',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/notfound/notfound.component').then((m) => m.NotfoundComponent),
    title: 'Not Found',
  },
];
