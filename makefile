HOST = localhost
PORT = 3000
USERNAME = 7imbrook
PASSWORD = testpassword
DATABASE = development

all:
	$(error You need to specify a target)

db:
	echo "Make sure your mongo database is running and press [enter] to continue"
	read
	# mongo $(DATABASE) --eval "db.dropDatabase()"
	node ./tests/databaseSetup

# Creates 10000 instances on server
test-load: connect
	number=1 ; while [[ $$number -le 10000 ]] ; do \
        curl -c cookies.txt -b cookies.txt $(HOST):$(PORT)/create\?name=Test$$number\&desc=Test ; \
        ((number = number + 1)) ; \
    done

connect:
	curl -c cookies.txt -b cookies.txt -d "username=$(USERNAME)&password=$(PASSWORD)" $(HOST):$(PORT)/signin