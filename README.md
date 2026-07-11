# 2026-1 MeasureSoftGram Frontend

Frontend repository of MeasureSoftGram application in 2026.1.

## Badges
<!--
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=fga-eps-mds_2023-1-MeasureSoftGram-Front&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=fga-eps-mds_2023-1-MeasureSoftGram-Front)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=fga-eps-mds_2023-1-MeasureSoftGram-Front&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=fga-eps-mds_2023-1-MeasureSoftGram-Front)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=fga-eps-mds_2023-1-MeasureSoftGram-Front&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=fga-eps-mds_2023-1-MeasureSoftGram-Front)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=fga-eps-mds_2023-1-MeasureSoftGram-Front&metric=bugs)](https://sonarcloud.io/summary/new_code?id=fga-eps-mds_2023-1-MeasureSoftGram-Front)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=fga-eps-mds_2023-1-MeasureSoftGram-Front&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=fga-eps-mds_2023-1-MeasureSoftGram-Front)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=fga-eps-mds_2023-1-MeasureSoftGram-Front&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=fga-eps-mds_2023-1-MeasureSoftGram-Front)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=fga-eps-mds_2023-1-MeasureSoftGram-Front&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=fga-eps-mds_2023-1-MeasureSoftGram-Front)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=fga-eps-mds_2023-1-MeasureSoftGram-Front&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=fga-eps-mds_2023-1-MeasureSoftGram-Front)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=fga-eps-mds_2023-1-MeasureSoftGram-Front&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=fga-eps-mds_2023-1-MeasureSoftGram-Front)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=fga-eps-mds_2023-1-MeasureSoftGram-Front&metric=coverage)](https://sonarcloud.io/summary/new_code?id=fga-eps-mds_2023-1-MeasureSoftGram-Front)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=fga-eps-mds_2023-1-MeasureSoftGram-Front&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=fga-eps-mds_2023-1-MeasureSoftGram-Front)
[![codecov](https://codecov.io/gh/fga-eps-mds/2023-1-MeasureSoftGram-Front/branch/develop/graph/badge.svg?token=A76GCxS118)](https://codecov.io/gh/fga-eps-mds/2023-1-MeasureSoftGram-Front)

<br>

<img src="https://codecov.io/gh/fga-eps-mds/2023-1-MeasureSoftGram-Front/branch/develop/graphs/sunburst.svg?token=A76GCxS118" width="128"/>
 -->
 🚧 Work in Progress 🚧

## Requirements
### Local development (without Docker)
- Node.js `20.x`
- `corepack` enabled
- `pnpm` `9.0.0` (pin unico em `package.json` `packageManager` e no `Dockerfile`)
### Development with Docker
- Docker
- Docker Compose v.2
---

## Environment configuration
Create the `.env` file at the root of the project:
```bash
cp .env.example .env
```

Make sure to set the URL for your backend API.

## Running with Docker (recommended)

> O compose do Front sobe **somente o serviço `front`**. Backend (Service + Postgres) é responsabilidade do compose do repositório [`2026.1-MeasureSoftGram-Service`](https://github.com/fga-eps-mds/2026.1-MeasureSoftGram-Service) — suba lá primeiro.

### 1) Subir o Service (em outro terminal, no repo do Service)

```bash
cd ../2026.1-MeasureSoftGram-Service
cp -R env-vars-example env-vars   # primeiro setup
docker compose up -d
```

API disponível em http://localhost:8080.

### 2) Subir o Front

```bash
docker compose up --build
```

Aplicação disponível em http://localhost:3000.

> No container do Front, `SERVICE_URL` aponta para `http://host.docker.internal:8080` para acessar o Service rodando no host. No browser, `NEXT_PUBLIC_API_URL` segue como `http://localhost:8080`.

### 3) Parar containers

```bash
docker compose down
```

### 4) Scripts Úteis

- Rodar linter:
```bash
make lint
```
- Rodar testes:
```bash
make test
```

- Rodar testes no modo CI:
```bash
make ci-test
```

- Build de Produção
```bash
make build
make start
```

- Comandos personalizados
```bash
make pnpm SCRIPT=<script> [ARGS="..."]
```
permite executar qualquer script do `package.json` dentro do container, passando argumentos adicionais se desejado.

Exemplo:
```bash
make pnpm SCRIPT=build
```
ou
```bash
make pnpm SCRIPT=test ARGS="src/pages"
```


## Rodar localmente (sem Docker)

Primeiramente garanta que está utilizando a versão 20 do Node. Ferramentas para gerenciamento de versões Node como `nvm` e `n` podem ser úteis.

### 1) Ativar pnpm

```bash
corepack enable
corepack prepare pnpm@9.0.0 --activate
pnpm -v
```

### 2) Instalar dependências

```bash
pnpm install
```

> **Atalho:** `make setup` faz os passos 1 e 2 de uma vez (ativa o pnpm via corepack, instala as dependências com `--frozen-lockfile` e cria o `.env` a partir do `.env.example`).

### 3) Subir o projeto

```bash
pnpm dev
```
Aplicação disponível em: http://localhost:3000

### 4) Scripts úteis

- Rodar linter:
```bash
pnpm lint
```
- Rodar testes (watch, so o que mudou - uso local):
```bash
pnpm test
```
- Rodar a suite completa deterministica (mesmo modo do CI, sem reescrever snapshot):
```bash
pnpm test:all
```
- Checar tipos (`tsc --noEmit`):
```bash
pnpm typecheck
```

> **Nota sobre o `typecheck`:** hoje o `tsc --noEmit` acusa erros de *parse* nos
> type defs da `react-i18next` 15.x, que o TypeScript 4.7.4 (pin do projeto) nao
> consegue ler; nao sao erros do codigo do projeto. Por isso o `typecheck` ainda
> **nao** e gate bloqueante no CI. Subir o TypeScript pra destravar isso esta
> rastreado numa issue de follow-up.

- Build de produção:
```bash
pnpm build
pnpm start
```


## Rodar com Docker (stack completa)

Para subir o Front junto com o **Service** (imagem publicada) e o **Postgres** num comando só, use o `docker-compose-dev.yml`. Há atalhos no `Makefile`:

```bash
make dev     # sobe front + Service + Postgres em foreground (com logs)
make up      # o mesmo, em background (-d)
make down    # derruba a stack
```

- Front em <http://localhost:3000>, Service em <http://localhost:8080>.
- As credenciais do Service/Postgres ficam em `env-vars/.service.env` e `env-vars/.postgres.env` (já versionados com defaults de dev).
- Para o login com GitHub funcionar, ajuste `GITHUB_CLIENT_ID`/`GITHUB_SECRET` (ver README do Service).


## Troubleshooting

### Erro de versão do Node com pnpm
Se aparecer algo como: This version of pnpm requires at least Node.js v18.12

Garanta que você está usando Node 20:
```bash
node -v
v20.20.2
```

### Erro de permissão no `.next` (`EACCES`)
Se aparecer erro ao rodar pnpm dev:
```bash
sudo chown -R $USER:$USER .next node_modules .pnpm-store
chmod -R u+rwX .next
rm -rf .next
pnpm dev
```
> Evite rodar comandos de node/pnpm com sudo dentro do projeto.

## Governança e contribuição

- **Licença:** este projeto é distribuído sob a [GNU AGPL-3.0](LICENSE).
- **Código de conduta:** consulte [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) antes de interagir com a comunidade.
- **Como contribuir:** veja [CONTRIBUTING.md](CONTRIBUTING.md) para padrões de branch, PR e revisão.
