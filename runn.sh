flask run --host=0.0.0.0 --port=$PORT &


celery -A app:celery_app worker --loglevel=info &


celery -A app:celery_app beat --loglevel=info &