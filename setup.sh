#!/bin/bash

echo "Activating virtual environment..."
source proj.env/bin/activate

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Running database migrations..."
flask db upgrade

echo "Seeding the database..."
python seed.py

echo "Setup completed successfully!"