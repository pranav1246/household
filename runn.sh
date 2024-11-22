flask run --host=0.0.0.0 --port=10000 &


celery -A app:celery_app worker --loglevel=info &


celery -A app:celery_app beat --loglevel=info &