import bcrypt
from flask import Blueprint, jsonify, request, redirect, session
import base64
from datetime import datetime
from backend.models.models import User, db,CurrentStat
import requests
from sqlalchemy.exc import IntegrityError
from flask_login import login_user, login_required, logout_user, current_user

app = Blueprint('routes_app', __name__)