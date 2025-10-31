from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from concessions.views import ConcessionViewSet

router = routers.DefaultRouter()
router.register(r'concessions', ConcessionViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
