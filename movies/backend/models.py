from django.db import models

class Movie(models.Model):
    nome = models.CharField(max_length=255)
    review = models.TextField()
    nota = models.IntegerField()
    dataAssistida = models.DateField()
    favorito = models.BooleanField(default=False)
    foto = models.URLField(max_length=500, blank=True, null=True)
    temas = models.CharField(max_length=255)
    ano = models.IntegerField()
    poster = models.URLField(max_length=500, blank=True, null=True)
    nacionalidade = models.CharField(max_length=255)
    id_usuario = models.IntegerField()

    def __str__(self):
        return self.nome
