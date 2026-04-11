import { Component } from '@angular/core';
import { AddressesComponent } from "../addresses/addresses.component";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-profile',
  imports: [AddressesComponent, RouterOutlet , RouterLinkActive , RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {

}
