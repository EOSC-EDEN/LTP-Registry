# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a proof-of-concept web application for the EDEN Registry Catalog - a registry for Long-Term Preservation Services. It's a SvelteKit application that queries RDF/Turtle data using SPARQL to display data services with dynamic filtering capabilities.

The application demonstrates DCAT-AP (Data Catalog Application Profile) vocabulary usage for cataloging data services, organizations, and contact information.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start dev server and open in browser
npm run dev -- --open

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run check
npm run check:watch

# Linting and formatting
npm run lint
npm run format
```

## Docker Setup (Fuseki SPARQL Endpoint)

The project includes a Docker Compose setup for Apache Jena Fuseki - a SPARQL server that can host the RDF data.

```bash
# Start Fuseki (creates 'registry' dataset automatically)
docker compose up -d

# Load RDF data into Fuseki
./load-fuseki-data.sh

# View logs
docker compose logs -f fuseki

# Stop Fuseki
docker compose down
```

Fuseki runs at `http://localhost:3030` with admin credentials `admin/admin123`.

See `fuseki/README.md` for detailed Docker setup instructions, data loading, and troubleshooting.

## Architecture

### Data Layer

**RDF Data**: The application queries a local Turtle (.ttl) file at `static/registry-data.ttl` containing DCAT-AP vocabulary-based data:

- `dcat:DataService` - core entity representing services
- `org:Organization` - publishers of services
- `vcard:Kind` - contact information

**SPARQL Queries**: Located in `src/lib/data/` directory:

- `query-dataservice-details.rq` - fetches all properties of DataServices with labels
- `query-dataservice-facets.rq` - fetches filter facets with counts
- `query01-dataservices.rq`, `query02-contacts.rq`, `query03-organizations.rq` - legacy queries

**Query Engine**: Uses Comunica (`@comunica/query-sparql-file`) to execute SPARQL queries:

- `src/lib/server/rdf-file-query.ts` - queries local RDF files (default mode)
- `src/lib/server/rdf-endpoint-query.ts` - queries remote SPARQL endpoints like Fuseki

**Switching to Fuseki**: To query the Docker Fuseki instance instead of local files, update `src/routes/+page.server.ts` to import from `rdf-endpoint-query.ts` and use endpoint URL `http://localhost:3030/registry/sparql`

### Server-Side Architecture

**SvelteKit Server Load**: `src/routes/+page.server.ts`

- Loads initial data using `queryDataServiceFacets()` and `queryDataServiceDetails()`
- Handles filter actions that re-query with dynamic SPARQL FILTER clauses
- Groups properties by service using `groupPropertiesByService()`

**Dynamic SPARQL Filtering**: When filters are applied, FILTER clauses are injected into the query at the placeholder comment in `query-dataservice-details.rq`:

```sparql
# PLACEHOLDER: Dynamic filters will be injected here
```

### Frontend Architecture

**Component Structure**:

- `src/routes/+page.svelte` - main page, handles filter change events
- `src/lib/components/shell/CatalogShell.svelte` - layout with header and filter panels
- `src/lib/components/shell/DesktopFilters.svelte` - desktop filter sidebar
- `src/lib/components/shell/MobileFilters.svelte` - mobile filter modal
- `src/lib/components/shell/FilterSection.svelte` - collapsible filter groups
- `src/lib/components/card/CatalogItem.svelte` - displays individual service cards
- `src/lib/components/card/PropertyList.svelte` - renders service properties

**State Management**: `src/lib/context/catalog-context.svelte.ts`

- Uses Svelte 5's context API with `createContext()`
- `createCatalogContextValue()` initializes filter state
- `SvelteMap` and `SvelteSet` for reactive filter selections
- `deriveFilterGroups()` transforms SPARQL facet results into UI filter groups

**Data Flow**:

1. Server queries RDF file and returns initial services + facets
2. Frontend creates catalog context with filter state
3. User selects filters → triggers `updateFilter()`
4. Filter change callback posts to `?/filter` action
5. Server re-queries with FILTER clauses
6. Response updates reactive `services` and `facets` state

### Data Transformation

**Property Grouping**: `groupPropertiesByService()` in `catalog-context.svelte.ts`

- Converts flat SPARQL results into hierarchical service objects
- Ensures all services have same properties in same order
- Uses "—" (em dash) for missing property values
- Extracts title and description for service cards

**Label Extraction**: SPARQL queries include sophisticated label extraction:

- Tries `rdfs:label`, `foaf:name`, or `vcard:fn` depending on entity type
- Falls back to extracting local name from URI
- Formats labels by replacing hyphens, inserting spaces in camelCase, capitalizing

## Key Patterns

**Svelte 5 Reactivity**: Uses runes (`$state`, `$props`, `$effect`) and reactive classes (`SvelteMap`, `SvelteSet`) instead of stores

**Server Actions**: Form actions handle filter submissions and return updated data without full page reload

**Type Safety**: TypeScript interfaces for query bindings, services, properties, and filters ensure type safety across server/client boundary

## Related Files in Parent Directory

The parent directory (`../`) contains:

- `registry-data.ttl` - main RDF data file (also copied to `static/`)
- `registry-schema.yaml` - LinkML schema definition
- `registry-query*.rq` - example SPARQL queries for CLI usage
- `README.md` - main project documentation with Fuseki setup instructions
