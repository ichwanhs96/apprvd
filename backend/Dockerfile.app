# Use the official Python 3.11 image
FROM python:3.11

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file (if you have one) and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire application code into the container
COPY . .

# Install Uvicorn
RUN pip install gunicorn

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application using Uvicorn
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8000"]