 #!/bin/bash
 curl -c cookies.txt -b cookies.txt -d "username=7imbrook&password=testpassword" localhost:3000/signin

# Start Tests
curl -c cookies.txt -b cookies.txt localhost:3000/create\?name=Test1\&desc=Test
