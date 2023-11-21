const { Client } = require('@elastic/elasticsearch');
const config = require('../util/config')

// Replace these values with your Elasticsearch host and port
const elasticSearchHost = config.elasticSearchHost;
const elasticSearchPort = config.elasticSearchPort;

const client = new Client({ node: `${elasticSearchHost}:${elasticSearchPort}` });

class Elasticsearch {
  async insertData(logMessageArray) {
    try {
        const body = logMessageArray.flatMap(logMessage => [
            { index: { _index: config.index } },
            logMessage,
        ]);
        
        await client.bulk({
            refresh: true,
            body
        });        
        console.log('Data Inserted');
    } catch (error) {
      console.error('Error indexing document:', error);
    }
  } 


  async searchData(filters) {
    try {
        const body  = await client.search({
            index: config.index, // Index name
            size: 100, // Set the desired number of records to retrieve
            body: {
              query: filters ? { // Check if filters are present
                bool: {
                  must: this.buildFilterClauses(filters),
                },
              } : { // If no filters, use match_all query
                match_all: {},
              },
            },
          });

          return body.hits.hits.map(hit => ({
            _id: hit._id,
            _source: hit._source,
          }));

    } catch (error) {
      console.error('Error searching documents:', error);
      throw error;
    }
  }


  buildFilterClauses(filters) {
    const clauses = [];
  
    const addNestedClauses = (obj, path = []) => {
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = [...path, key];
  
        if (value && typeof value === 'object') {
          // Recursively add nested clauses
          addNestedClauses(value, currentPath);
        } else {
          // Add clauses for non-object values
          clauses.push({ match: { [currentPath.join('.')]: value } });
        }
      });
    };
  
    // Add filters based on provided keys
    Object.entries(filters).forEach(([key, value]) => {
      if (value && typeof value === 'object') {
        // Handle nested fields
        addNestedClauses(value, [key]);
      } else {
        // Handle non-nested fields
        clauses.push({ match: { [key]: value } });
      }
    });
  
    return clauses;
  }
}  



const elasticsearchInstance = new Elasticsearch();

module.exports = {
  insertData: elasticsearchInstance.insertData.bind(elasticsearchInstance),
  searchData: elasticsearchInstance.searchData.bind(elasticsearchInstance),

};
