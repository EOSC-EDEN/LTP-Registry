# Fuseki Docker Setup

This directory contains configuration and scripts for running Apache Jena Fuseki in Docker.

## Quick Start

### 1. Start Fuseki

```bash
docker compose up -d
```

Fuseki will be available at: http://localhost:3030

- Username: `admin`
- Password: `admin123`

### 2. Load Data

The RDF data from `static/registry-data.ttl` needs to be loaded into the `registry` dataset.

**Option A: Using the load script (recommended)**

```bash
# From the catalog-mock directory
./load-fuseki-data.sh
```

**Option B: Using curl directly**

```bash
curl -X POST -u admin:admin123 \
  -H "Content-Type: text/turtle" \
  --data-binary @static/registry-data.ttl \
  "http://localhost:3030/registry/data?default"
```

### 3. Verify Data

Check that data was loaded:

```bash
curl "http://localhost:3030/registry/sparql?query=SELECT%20(COUNT(*)%20as%20?count)%20WHERE%20%7B%20?s%20?p%20?o%20%7D"
```

Or visit the Fuseki web UI at http://localhost:3030 and run queries interactively.

## Common Commands

### View Logs

```bash
docker compose logs -f fuseki
```

### Stop Fuseki

```bash
docker compose down
```

### Stop and Remove Data

```bash
docker compose down -v
```

### Load Additional Data

```bash
# Load additional files
./load-fuseki-data.sh static/your-file.ttl static/another-file.ttl
```

### Execute SPARQL Query from File

```bash
curl --data-urlencode "query=$(cat ../registry-query01-DataServices.rq)" \
  -H "Accept: application/sparql-results+json" \
  http://localhost:3030/registry/sparql
```

## Configuration

### Change Admin Password

Edit `docker compose.yml` and modify the `ADMIN_PASSWORD` environment variable.

### Adjust Memory

Edit `docker compose.yml` and modify the `JVM_ARGS` environment variable:

```yaml
JVM_ARGS: '-Xmx4g -Xms2g' # 4GB max, 2GB initial
```

### Create Additional Datasets

Add environment variables in `docker compose.yml`:

```yaml
FUSEKI_DATASET_1: registry
FUSEKI_DATASET_2: another-dataset
```

## Data Persistence

Data is stored in a Docker volume named `eden-registry-fuseki-data`. This ensures data persists between container restarts.

To backup data:

```bash
docker run --rm -v eden-registry-fuseki-data:/data -v $(pwd)/backup:/backup \
  alpine tar czf /backup/fuseki-backup.tar.gz /data
```

To restore data:

```bash
docker run --rm -v eden-registry-fuseki-data:/data -v $(pwd)/backup:/backup \
  alpine tar xzf /backup/fuseki-backup.tar.gz -C /
```

## Connecting from Application

To query Fuseki from the SvelteKit application, update the query functions in `src/lib/server/rdf-endpoint-query.ts` to use:

```
http://localhost:3030/registry/sparql
```

## Troubleshooting

### Container won't start

Check logs: `docker compose logs fuseki`

### Data not loading

Ensure Fuseki is stopped before loading data: `docker compose stop fuseki`

### Permission errors

Fix volume permissions:

```bash
docker compose run --rm --user 0 fuseki chown -R 100 /fuseki
```

### Port already in use

Change the port mapping in `docker compose.yml`:

```yaml
ports:
  - '8080:3030' # Access at http://localhost:8080
```

### Clear existing fuseki triplestore

* This can be useful if you want to completely reload the data

```bash
curl -X POST -u admin:admin123 \
--data-urlencode "update=CLEAR DEFAULT" \
"http://localhost:3030/registry/update"

# You should see:
# Update succeeded

# Then, reload the data
./load-fuseki-data.sh
```
