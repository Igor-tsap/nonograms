FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
ENV PYTHONPATH=/app/src
RUN chmod +x entrypoint.sh
CMD ["./entrypoint.sh"]