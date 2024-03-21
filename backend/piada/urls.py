from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/piada/<int:joke_id>/', views.api_joke),
    path('api/favoritas/', views.api_favoritas),
    path('api/remove/<int:joke_id>/', views.api_remove),
    path('api/token/', views.api_get_token), #autenticacao
    path('api/users/', views.api_user),
    path('api/board/', views.api_board),
]