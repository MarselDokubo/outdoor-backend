#!/usr/bin/env bash

set -e

# List of files to generate
files=(
  "01-VISION.md"
  "02-DOMAIN-GLOSSARY.md"
  "03-DOMAIN-MODEL.md"
  "04-USE-CASES.md"
  "05-BUSINESS-RULES.md"
  "06-NON-FUNCTIONAL-REQUIREMENTS.md"
  "07-DOMAIN-DECISIONS.md"
)

for file in "${files[@]}"; do
  if [ ! -f "$file" ]; then
    title=$(echo "$file" | sed 's/^[0-9]\+-//' | sed 's/.md$//' | tr '-' ' ')
    {
      echo "# $title"
      echo ""
      echo "_Created on $(date +%Y-%m-%d)_"
      echo ""
      echo "## Overview"
      echo ""
      echo "Add content here..."
    } > "$file"

    echo "Created $file"
  else
    echo "Skipped $file (already exists)"
  fi
done

echo "Done."