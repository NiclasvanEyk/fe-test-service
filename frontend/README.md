# Frontend

Install using

```shell
bun install
```

generate the OpenAPI types using

```shell
bunx openapi-typescript ../openapiv3/openapi.yaml -o ./src/lib/api/v1.d.ts
```

finally run the dev-server via

```shell
bun run dev
```

Run the tests using

```shell
bunx vitest
```
