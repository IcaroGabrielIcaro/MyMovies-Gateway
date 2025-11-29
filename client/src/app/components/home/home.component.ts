import { Component } from "@angular/core";
import {  HeaderComponent } from "../header/header.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { BoasVindasDeslogadoComponent } from "../boas-vindas-deslogado/boas-vindas-deslogado.component";

@Component({
    selector: 'app-home',
    imports: [
        HeaderComponent,
        SidebarComponent,
        BoasVindasDeslogadoComponent,
    ],
    templateUrl: `home.component.html`
})
export class HomeComponent {
    isLogged = false;

    constructor() {
        this.isLogged = !!sessionStorage.getItem('token');
    }
}