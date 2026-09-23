from django.db import migrations

def create_default_superuser(apps, schema_editor):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    else:
        u = User.objects.get(username='admin')
        u.set_password('admin123')
        u.is_superuser = True
        u.is_staff = True
        u.save()

def reverse_func(apps, schema_editor):
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_default_superuser, reverse_func),
    ]
