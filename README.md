## Start the app

### Prerequisites
- Node.js
- NPM (with NPX)
- Docker

Configure env variables:
```bash
cp .env.sample
```

Setup docker containers
```bash
docker compose up -d
```

Run application
```bash
npm install

npm run build

npm run start:prod
```

## Docs
Postman collection with request examples available at [docs/postman_collection.json](./docs/postman_collection.json)


## Tests

### Unit tests
```bash
npm run test
```

### E2E tests

```bash
npm run start:prod
case/bin/{OS}/{ARCH}/loyalty --target=http://localhost:{PORT}/webhook --concurrency=1 --delay=500ms
```


