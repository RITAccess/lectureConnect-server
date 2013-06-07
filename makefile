HOST = localhost
PORT = 3000
USERNAME = 7imbrook
PASSWORD = testpassword

test: connect
	number=1 ; while [[ $$number -le 10000 ]] ; do \
        curl -c cookies.txt -b cookies.txt localhost:3000/create\?name=Test$$number\&desc=Test ; \
        ((number = number + 1)) ; \
    done

connect:
	curl -c cookies.txt -b cookies.txt -d "username=$(USERNAME)&password=$(PASSWORD)" $(HOST):$(PORT)/signin