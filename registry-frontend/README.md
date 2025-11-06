# EDEN Registry Catalog - Proof of Concept

## Prerequisites

```bash
# Install pnpm 
curl -fsSL https://get.pnpm.io/install.sh | sh -
pnpm env use --global lts
```

## Quick Start

```bash
# Install Dependencies
pnpm install

# Start Fuseki and Load Data w/ Apache Jena Fuseki in Docker
docker compose up -d

# When prompted, select recommended version:
# ▸ docker.io/stain/jena-fuseki:latest

# Load the registry RDF data
./load-fuseki-data.sh

# Start Development Server
npm run dev

# To see the catalog interface, visit:
http://localhost:5173
```

## Overview

A web-based catalog interface for the EDEN Registry of Long-Term Preservation Services, demonstrating dynamic querying and filtering of RDF/DCAT-AP metadata via SPARQL.

This proof of concept demonstrates a modern approach to building a registry catalog interface that:

1. **Queries semantic data** stored as RDF in a SPARQL endpoint (Apache Jena Fuseki)
2. **Dynamically generates filters** based on the actual data properties
3. **Provides interactive browsing** with real-time filtering capabilities
4. **Renders metadata** in a user-friendly interface without hardcoding data structure

The PoC validates the feasibility of using SPARQL queries to power both faceted search and detailed data retrieval in a web application context.

## Proof of Concept Goals

This implementation demonstrates:

- **Semantic Web Standards**: Use of DCAT-AP vocabulary for describing data services, organizations, and contacts
- **Dynamic Query Generation**: SPARQL queries that adapt to user-selected filters without requiring backend code changes
- **Flexible Data Structure**: No hardcoded assumptions about properties - the UI adapts to what's in the data
- **Modern Web Stack**: SvelteKit + Comunica query engine for efficient client-server communication
- **Separation of Concerns**: Data, queries, and presentation logic are cleanly separated

## Architecture: Three Core Components

### 1. UI Visualization Layer

**Intent**: Provide an intuitive, responsive interface for browsing registry data without requiring users to understand RDF or SPARQL.

**Implementation**:

- SvelteKit components (`src/lib/components/`) render service cards with dynamic properties
- Filter sidebar displays available facets derived from the data itself
- Real-time interaction: selecting filters triggers immediate data re-querying
- Responsive design works on both desktop and mobile devices

**Key Principle**: The UI doesn't "know" what properties exist - it dynamically renders whatever comes back from the SPARQL queries. This means new properties added to the RDF data automatically appear in the interface.

### 2. Aggregator Query (Facet Generation)

**Intent**: Automatically discover what filters are available and relevant by analyzing the actual data in the registry.

**Location**: `src/lib/data/query-dataservice-facets.rq`

**How It Works**:

```sparql
# Conceptual flow:
1. Find all DataServices
2. For each property they have, count how many services have each value
3. Return: property name, value, and count
```

The aggregator query answers: "What can users filter by, and how many results would each filter produce?"

**Example Output**:

```
Publisher: DANS (1), EOSC (1), CERN (1)
Theme: TECH (3), EDUC (1)
Access Rights: PUBLIC (2), RESTRICTED (1)
```

**Key Innovation**: The facets aren't hardcoded - they emerge from the data. Add a new property to your RDF data, and it automatically becomes a filter option.

### 3. Details Query (Filtered Data Retrieval)

**Intent**: Retrieve complete information about data services, optionally filtered by user selections, while maintaining human-readable labels.

**Location**: `src/lib/data/query-dataservice-details.rq`

**How It Works**:

```sparql
# Conceptual flow:
1. Find all DataServices (or those matching filters)
2. Get ALL their properties and values
3. For each property and value, derive human-readable labels
4. Handle multiple values per property (e.g., multiple keywords)
```

**Dynamic Filtering**: The query includes a placeholder where filter clauses are injected based on user selections:

```sparql
# PLACEHOLDER: Dynamic filters will be injected here
```

When a user selects "Theme: TECH", the application injects:

```sparql
?service <http://www.w3.org/ns/dcat#theme> ?filterVal_theme .
FILTER(?filterVal_theme IN (<http://publications.europa.eu/resource/authority/data-theme/TECH>))
```

**Label Extraction Intelligence**: The query attempts multiple strategies to get human-readable labels:

1. Try `rdfs:label`, `foaf:name`, or `vcard:fn` depending on entity type
2. Fall back to extracting the local part of the URI
3. Format the result (replace hyphens, add spaces, capitalize)

**Result**: Users see "DANS Data Vault Catalog" instead of raw URIs, and properties appear as "Access Rights" instead of `dct:accessRights`.

## Data Flow

```
User opens page
    ↓
Server executes TWO parallel queries:
    1. Facet aggregator → "What filters are available?"
    2. Details query → "Show all services"
    ↓
UI renders service cards + filter sidebar
    ↓
User clicks filter (e.g., "Publisher: DANS")
    ↓
Form submission with filter selection
    ↓
Server re-executes BOTH queries with filter injected
    ↓
UI updates to show filtered results + updated facet counts
```

## Technical Implementation

### SPARQL Endpoint

The PoC uses Apache Jena Fuseki as the SPARQL endpoint, running in Docker:

- **Data**: RDF/Turtle file with DCAT-AP vocabulary
- **Queries**: Executed via Comunica query engine
- **Access**: HTTP API at `http://localhost:3030/registry/sparql`

### Query Engine

[Comunica](https://comunica.dev/) is used to execute SPARQL queries from Node.js:

- Handles SPARQL protocol communication
- Streams results efficiently
- Works with any SPARQL 1.1 endpoint

### Server-Side Processing

SvelteKit server load functions (`src/routes/+page.server.ts`):

- Execute SPARQL queries on page load and filter actions
- Transform flat query results into nested data structures for the UI
- Handle filter state and query injection

### Environment Configuration

```bash
# .env (optional)
SPARQL_ENDPOINT=http://localhost:3030/registry/sparql
```

The endpoint URL is configurable, allowing the same codebase to work with different data sources.

## Key Innovations Demonstrated

1. **No Backend Data Model**: The application has no hardcoded knowledge of what properties exist. Everything is derived from SPARQL queries.

2. **Dynamic Filter Generation**: Filters aren't configured - they emerge from analyzing the data. Add a new property type, it becomes filterable automatically.

3. **Multi-Value Property Handling**: The architecture gracefully handles properties with multiple values (keywords, themes) and single values (title, description).

4. **Label Resolution**: Sophisticated SPARQL patterns extract human-readable labels from RDF data, falling back gracefully when labels aren't present.

5. **Real-Time Filtering**: User interactions trigger server-side SPARQL queries with injected filters, demonstrating how semantic queries can power interactive UIs.

## Development Commands

```bash
# Format code
npm run format

# Lint code
npm run lint

# Type check
npm run check

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── lib/
│   ├── components/      # UI components
│   │   ├── card/        # Service card rendering
│   │   └── shell/       # Layout and filters
│   ├── context/         # Svelte context for state management
│   ├── data/            # SPARQL query files (.rq)
│   └── server/          # Server-side query execution
│       ├── rdf-file-query.ts      # Query local RDF files
│       └── rdf-endpoint-query.ts  # Query SPARQL endpoint
├── routes/
│   ├── +page.svelte        # Main catalog page
│   └── +page.server.ts     # Server load function
└── static/
    └── registry-data.ttl   # Sample RDF data
```

## Extending the Registry

### Adding New Data

Add new services or properties to `static/registry-data.ttl`:

```turtle
<https://example.com/my-service>
    rdf:type dcat:DataService ;
    dct:title "My New Service"@en ;
    myprefix:customProperty "Custom Value" .
```

Reload data: `./load-fuseki-data.sh`

The UI automatically displays the new service and makes `customProperty` filterable.

### Adding New Query Patterns

Create new `.rq` files in `src/lib/data/` and reference them in query functions.

### Switching Data Sources

Change `SPARQL_ENDPOINT` in `.env` to point to a different SPARQL endpoint - no code changes needed.

## Limitations and Future Directions

This PoC demonstrates core concepts but has intentional limitations:

- **Performance**: Not optimized for large datasets (thousands of services)
- **Pagination**: All results loaded at once
- **Query Optimization**: Some queries could be more efficient
- **Authentication**: No access control on SPARQL endpoint
- **Validation**: No data validation or error handling for malformed RDF

## Docker Setup

See `fuseki/README.md` for comprehensive Fuseki configuration and troubleshooting.
