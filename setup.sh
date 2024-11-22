#!/bin/bash

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Running database migrations..."
flask db init
flask db migrate -m "Migration message"
flask db upgrade

echo "Seeding the database..."
python seed.py

echo "Setup completed successfully!"
