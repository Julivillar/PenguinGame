# Use a modern, slim Python image
FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create a working directory
WORKDIR /code

# Copy the dependency file first
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Now copy the application code
COPY . .

# Expose the port Django will use
EXPOSE 8000

# Start by migrating database and then running the development server
#CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
CMD ["sh","-c","python manage.py migrate && gunicorn --bind 0.0.0.0:${PORT:-8000} spades.wsgi:application"]
