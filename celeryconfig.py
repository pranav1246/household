import os
redis_url=os.getenv("REDIS_URL", "redis://localhost:6379")

broker_url=f"{redis_url}/1"
result_backend=f"{redis_url}/2"
broker_connection_retry_on_startup=True
timezone='Asia/Kolkata'


