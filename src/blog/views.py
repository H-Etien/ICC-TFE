from django.shortcuts import render

# Create your views here.
def index(request):
    return render(
        request,
        'blog/index.html',
    )

def article(request, num_article):
    return render(
        request,
        f"article/article-{num_article}.html"
    )
