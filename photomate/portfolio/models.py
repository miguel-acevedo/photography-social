from django.db import models
from django.contrib.auth.models import User
# Usually when referencing a User model, you want to have a custom model built just for it.
# Instead of directly referencing it. But, in this project, it won't matter.


class Portfolio(models.Model):
    title = models.CharField(max_length=50)
    about = models.CharField(max_length=300, default="")
    pub_date = models.DateTimeField('date published')
    author = models.ForeignKey(User, on_delete=models.CASCADE, default='0000000')
    visible = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class Image(models.Model):
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
    url = models.CharField(max_length=300, default='')
    caption = models.CharField(max_length=100)
    order = models.IntegerField(default=0)
    visible = models.BooleanField(default=True)

    def __str__(self):
        return self.caption
    '''
    def save(self):
        # Do stuff here
        if self.portfolio is not None:
            self.image_order = Image.objects.filter(portfolio=self.portfolio).count()
        super(Image, self).save()
    '''