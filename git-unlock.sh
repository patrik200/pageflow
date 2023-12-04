base64 -d -i ./key-base64.txt > ./git-crypt-key
git-crypt unlock ./git-crypt-key
rm git-crypt-key