from django.contrib.auth.models import User
from rest_framework import serializers 

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        #fields = ['id', 'username', 'password', 'email']
        
        # write only pour ne pas renvoyer le mot de passe dans les réponses API
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user