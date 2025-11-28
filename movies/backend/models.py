from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Movie(models.Model):
    nome = models.CharField("título", max_length=255)
    diretor = models.CharField("diretor", max_length=255, blank=True)
    review = models.TextField("review", blank=True)
    genero = models.CharField(
        "gênero",
        max_length=50,
        choices=[
            ("acao", "Ação"),
            ("aventura", "Aventura"),
            ("comedia", "Comédia"),
            ("drama", "Drama"),
            ("ficcao", "Ficção Científica"),
            ("terror", "Terror"),
            ("suspense", "Suspense"),
            ("animacao", "Animação"),
            ("documentario", "Documentário"),
            ("romance", "Romance"),
            ("fantasia", "Fantasia"),
        ],
        blank=True
    )
    nota = models.IntegerField("nota do usuário", validators=[MinValueValidator(0), MaxValueValidator(10)])
    data_assistida = models.DateField("data assistida")
    duracao = models.IntegerField("duração (minutos)", blank=True, null=True, validators=[MinValueValidator(1)])
    favorito = models.BooleanField("favorito", default=False)
    foto = models.URLField("foto (URL)", max_length=500, blank=True, null=True)
    poster = models.URLField("poster (URL)", max_length=500, blank=True, null=True)
    ano = models.IntegerField("ano", blank=True, null=True, validators=[MinValueValidator(1880), MaxValueValidator(2100)])
    nacionalidade = models.CharField("nacionalidade", max_length=255, blank=True)

    id_usuario = models.IntegerField("id do usuário", db_index=True)

    created_at = models.DateTimeField("criado em", auto_now_add=True)
    updated_at = models.DateTimeField("atualizado em", auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.nome} ({self.ano})" if self.ano else self.nome


class Like(models.Model):
    id_usuario = models.IntegerField("id do usuário", db_index=True)
    filme = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="likes")

    created_at = models.DateTimeField("criado em", auto_now_add=True)
    updated_at = models.DateTimeField("atualizado em", auto_now=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["id_usuario", "filme"], name="unique_user_movie_like")]
        ordering = ["-created_at"]

    def __str__(self):
        return f"Like: User {self.id_usuario} - Movie {self.filme.nome}"