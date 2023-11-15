class Config:
    DEBUG = False
    TESTING = False
    SECRET_KEY = 'ldgjsdlfksdgkljhsdfjgkhjsdfjgcm,vbnshguirjsgsxlkj'
    SQLALCHEMY_DATABASE_URI = 'postgresql://s4bject:sdds234432@localhost/fitnesstracker'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_SAMESITE = "None"
    CORS_ORIGINS = ['http://localhost:3000']
    CORS_SUPPORTS_CREDENTIALS = True
