import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { FilmeBackgroundDeslogadoComponent } from "./filme-background-deslogado.component";
import { FilmePosterDeslogadoComponent } from "./filme-poster-deslogado.component";

@Component({
    selector: 'app-boas-vindas-deslogado',
    imports: [
        RouterLink,
        FilmeBackgroundDeslogadoComponent,
        FilmePosterDeslogadoComponent
    ],
    templateUrl: `boas-vindas-deslogado.component.html`
})
export class BoasVindasDeslogadoComponent {
    imagens_fundo: string[] = [
        "https://image.tmdb.org/t/p/w500_and_h282_face/bvipOp3DFp3WR9qpCgaihScefrW.jpg",
        "https://th.bing.com/th/id/R.40f9366ff0a3f01ba04e7321315aebd0?rik=l2zysLkgnBgYNQ&pid=ImgRaw&r=0_SY679_.jpg",
        "https://image.tmdb.org/t/p/w500_and_h282_face/yQXfTbb5T4zVdZShGuPaZersiJc.jpg",

        "https://image.tmdb.org/t/p/w500_and_h282_face/iKZmROQbFvYQrY750r1Ccf2Ron0.jpg",
        "https://tse2.mm.bing.net/th/id/OIP.QZWxEW332b42hH-mhC8hBAHaLH?rs=1&pid=ImgDetMain&o=7&rm=3",
        "https://tse1.mm.bing.net/th/id/OIP.QDJYAo7c_Q_EHYcv8mjQvAHaEK?w=1080&h=608&rs=1&pid=ImgDetMain&o=7&rm=3",

        "https://image.tmdb.org/t/p/w500_and_h282_face/j1CqN4ypo3lFJJA5C7mYJzBaXoL.jpg",
        "https://image.tmdb.org/t/p/w500_and_h282_face/2ZMf97yWCR2QFoZpdbPyEGJsUzY.jpg",
        "https://media.themoviedb.org/t/p/w500_and_h282_face/eAJnHNKKLVLv3ARor9fxUWTyWrS.jpg"
    ]

    posters_filmes: string[] = [
        "https://image.tmdb.org/t/p/w220_and_h330_face/2knV8wAuKmgkGGUTuU5BTPnneL4.jpg",
        "https://image.tmdb.org/t/p/w220_and_h330_face/iGsUIunFvkOJT5S3xHapfCpxck7.jpg",
        "https://image.tmdb.org/t/p/w220_and_h330_face/oGLFi7D8PlPYKXzbPtp8qCseJFn.jpg"
    ]
}