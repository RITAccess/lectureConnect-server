openssl genrsa -out ./certs/server.key 1024;
openssl req -new -key ./certs/server.key -out request.crt;
openssl x509 -req -in request.crt -signkey ./certs/server.key -out ./certs/server.crt;
rm request.crt;

