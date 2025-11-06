#!/bin/bash
# Script to load RDF data into Fuseki via HTTP API
# Run this from the catalog-mock directory with Fuseki running
#
# Usage: ./load-fuseki-data.sh [file1.ttl] [file2.ttl] ...
# Default: loads ../registry-data.ttl

set -e

DATASET="registry"
ADMIN_PASSWORD="admin123"
FUSEKI_URL="http://localhost:3030"

# If no files specified, use default
if [ $# -eq 0 ]; then
    FILES="../registry-data.ttl"
else
    FILES="$@"
fi

echo "Loading data into Fuseki dataset: $DATASET"
echo "Files to load: $FILES"
echo ""

# Wait for Fuseki to be ready
echo "Checking Fuseki availability..."
until curl -sf "$FUSEKI_URL/$/ping" > /dev/null 2>&1; do
    echo "Waiting for Fuseki to be ready..."
    sleep 2
done
echo "✓ Fuseki is ready"
echo ""

# Load each file via HTTP API
for FILE in $FILES; do
    if [ -f "$FILE" ]; then
        echo "Loading $FILE..."
        RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
            -u "admin:$ADMIN_PASSWORD" \
            -H "Content-Type: text/turtle" \
            --data-binary "@$FILE" \
            "$FUSEKI_URL/$DATASET/data?default")

        HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
        BODY=$(echo "$RESPONSE" | head -n -1)

        if [ "$HTTP_CODE" = "200" ]; then
            echo "✓ Loaded $FILE"
            echo "  $BODY"
        else
            echo "✗ Failed to load $FILE (HTTP $HTTP_CODE)"
            echo "  $BODY"
            exit 1
        fi
    else
        echo "✗ File not found: $FILE"
        exit 1
    fi
    echo ""
done

echo "All files loaded successfully!"
echo "Dataset '$DATASET' is ready at $FUSEKI_URL/$DATASET"
echo ""
echo "Test with: curl '$FUSEKI_URL/$DATASET/sparql?query=SELECT%20(COUNT(*)%20as%20?count)%20WHERE%20%7B%20?s%20?p%20?o%20%7D'"
