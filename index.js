const core = require('@actions/core');
const fs = require('fs');
const path = require('path');
const Converter = require('openapi-to-postmanv2');

async function run() {
    try {
        const schemaPath = core.getInput('openapi_schema_path');
        const openapiSchema = fs.readFileSync(schemaPath, 'utf8');

        const outputFilePath = core.getInput('output_file') || './postman-collection.json';

        Converter.convert({ type: 'string', data: openapiSchema }, {}, (err, result) => {
            if (!result.result) {
                core.setFailed(`Conversion failed: ${result.reason}`);
            } else {
                const postmanCollection = result.output[0].data;
                const resolvedPath = path.resolve(outputFilePath);
                fs.writeFileSync(resolvedPath, JSON.stringify(postmanCollection, null, 2), 'utf8');
                console.log(`Postman collection written to ${resolvedPath}`);
                core.setOutput('postman_collection_file', resolvedPath);
            }
        });
    } catch (error) {
        core.setFailed(`Error reading or converting schema: ${error.message}`);
    }
}

run();