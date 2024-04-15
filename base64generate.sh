#!/bin/bash

# Define the key size
KEY_SIZE=512

# Define the output filenames
PRIVATE_KEY="private_key.pem"
PUBLIC_KEY="public_key.pem"
PRIVATE_KEY_BASE64="private_key_base64.pem"
PUBLIC_KEY_BASE64="public_key_base64.pem"

# Generate RSA private key
openssl genrsa -out $PRIVATE_KEY $KEY_SIZE

# Extract the public key from the private key
openssl rsa -in $PRIVATE_KEY -pubout -out $PUBLIC_KEY

# Encode the private key with Base64
base64 < $PRIVATE_KEY > $PRIVATE_KEY_BASE64

# Encode the public key with Base64
base64 < $PUBLIC_KEY > $PUBLIC_KEY_BASE64
