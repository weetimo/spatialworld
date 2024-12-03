TO REVIVE/UPDATE BACKEND:

in one terminal, cd to backend folder and run: 

python main.py

followed by:

uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4 --reload

