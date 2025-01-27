import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', '0c2396e061eb43d0bec8c0a193c5c885')    # This key should be in .env but this project is not meant for production
    SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'  # SQLite database
    SQLALCHEMY_TRACK_MODIFICATIONS = False
