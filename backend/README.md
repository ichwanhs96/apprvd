# Flask App Backend

This README provides instructions for setting up and running the Flask app using a virtual environment.

## Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS and Linux:
     ```
     source venv/bin/activate
     ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

## Running the App

1. Ensure you're in the backend directory and the virtual environment is activated.

2. Run the Flask app:
   ```
   flask run
   ```

3. The app should now be running on `http://127.0.0.1:5000/`

## Deactivating the Virtual Environment

When you're done, deactivate the virtual environment:
```
deactivate
```