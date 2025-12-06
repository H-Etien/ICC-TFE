from django.contrib.auth.models import User
from rest_framework import serializers 
from rest_framework.validators import UniqueValidator

class UserSerializer(serializers.ModelSerializer):
    
    # Erreurs qui seront renvoyées au frontend en cas de doublon
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="Ce nom d'utilisateur existe déjà.")]
    )
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="Cet email est déjà utilisé.")]
    )
    
    class Meta:
        model = User
        #fields = '__all__'
        fields = ['id', 'username', 'password', 'email']
        
        # write only pour ne pas renvoyer le mot de passe dans les réponses API
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user