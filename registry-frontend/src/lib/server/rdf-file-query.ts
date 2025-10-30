import { QueryEngine } from '@comunica/query-sparql-file';
import { readFile } from 'fs/promises';
import { join } from 'path';

const engine = new QueryEngine();

export interface QueryResult {
	bindings: Record<string, string>[];
	error?: string;
}

/**
 * Query a local RDF/Turtle file using SPARQL
 * @param ttlFilePath - Path to the .ttl file (relative to project root or absolute)
 * @param sparqlQuery - SPARQL query string or path to .rq file
 * @returns Query results as an array of bindings
 */
export async function queryRdfFile(ttlFilePath: string, sparqlQuery: string): Promise<QueryResult> {
	try {
		// Check if sparqlQuery is a file path (ends with .rq)
		let query = sparqlQuery;
		if (sparqlQuery.endsWith('.rq')) {
			query = await readFile(sparqlQuery, 'utf-8');
		}

		// Execute the query
		const bindingsStream = await engine.queryBindings(query, {
			sources: [ttlFilePath]
		});

		// Convert stream to array
		const bindings = await bindingsStream.toArray();

		// Transform bindings to plain objects
		const results = bindings.map((binding) => {
			const result: Record<string, string> = {};
			for (const [key, value] of binding) {
				result[key.value] = value.value;
			}
			return result;
		});

		return { bindings: results };
	} catch (error) {
		console.error('Error querying RDF file:', error);
		return {
			bindings: [],
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

/**
 * Example: Execute all three "file" queries against the local RDF file.
 * This demonstrates querying a local RDF file and even file-based queries.
 */
export async function queryAllDataFile() {
	const ttlPath = join(process.cwd(), 'static/registry-data.ttl');
	const queriesPath = join(process.cwd(), 'src/lib/data');

	const [dataServices, contacts, organizations] = await Promise.all([
		queryRdfFile(ttlPath, join(queriesPath, 'query01-dataservices.rq')),
		queryRdfFile(ttlPath, join(queriesPath, 'query02-contacts.rq')),
		queryRdfFile(ttlPath, join(queriesPath, 'query03-organizations.rq'))
	]);

	return {
		dataServices,
		contacts,
		organizations
	};
}

/**
 * Query DataService facets for filtering
 * Returns all available filter options with counts from DataService perspective
 */
export async function queryDataServiceFacets() {
	const ttlPath = join(process.cwd(), 'static/registry-data.ttl');
	const queriesPath = join(process.cwd(), 'src/lib/data');

	const facets = await queryRdfFile(ttlPath, join(queriesPath, 'query-dataservice-facets.rq'));

	return facets;
}

/**
 * Query detailed properties for all DataServices with filters
 * Returns all properties with labels for dynamic rendering
 */
export async function queryDataServiceDetails(
	filters?: Map<string, string[]>
): Promise<QueryResult> {
	const ttlPath = join(process.cwd(), 'static/registry-data.ttl');
	const queriesPath = join(process.cwd(), 'src/lib/data');

	// Read base query
	let query = await readFile(join(queriesPath, 'query-dataservice-details.rq'), 'utf-8');

	// If filters are provided, inject FILTER clauses
	if (filters && filters.size > 0) {
		const filterClauses: string[] = [];

		for (const [prop, values] of filters) {
			if (values.length > 0) {
				// Create a FILTER clause for this property
				const valuesClause = values.map((v) => `<${v}>`).join(', ');
				filterClauses.push(`
    # Filter by ${prop}
    ?service <${prop}> ?filterVal_${prop.replace(/[^a-zA-Z0-9]/g, '_')} .
    FILTER(?filterVal_${prop.replace(/[^a-zA-Z0-9]/g, '_')} IN (${valuesClause}))`);
			}
		}

		// Inject filter clauses into query
		query = query.replace(
			'# PLACEHOLDER: Dynamic filters will be injected here',
			filterClauses.join('\n')
		);
	}

	return queryRdfFile(ttlPath, query);
}
