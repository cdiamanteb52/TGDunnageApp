#!/usr/bin/env python3
"""
Seed PartCatalog into Firestore from data/partCatalog_seed.json.

Preconditions:
- pip install firebase-admin
- Set GOOGLE_APPLICATION_CREDENTIALS to a service account JSON with Firestore write access.
- Set APP_ID to your target environment (dev/prod).

Usage:
$ export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
$ python3 scripts/seed_firestore.py
"""
import json
import os
import firebase_admin
from firebase_admin import credentials, firestore

APP_ID = "dev"  # change to your appId or pass via env
SEED_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "partCatalog_seed.json")

def main():
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred)
    db = firestore.client()

    with open(SEED_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    base = f"artifacts/{{APP_ID}}/public/data/partCatalog"
    for partNumber, doc in data.items():
        doc_ref = db.document(f"{{base}}/{{partNumber}}")
        write_doc = dict(doc)
        # replace explicit nulls for createdAt/updatedAt with server timestamp
        write_doc['createdAt'] = firestore.SERVER_TIMESTAMP
        write_doc['updatedAt'] = firestore.SERVER_TIMESTAMP
        print(f"Writing {{partNumber}} to {{doc_ref.path}}")
        doc_ref.set(write_doc, merge=True)

    print("Seeding complete.")

if __name__ == "__main__":
    main()
