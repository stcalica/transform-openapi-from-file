const core = require('@actions/core');
const fs = require('fs');
var Converter = require('openapi-to-postmanv2');

async function run() {
    try {
        const schemaPath = core.getInput('openapi_schema_path');
        const openapiSchema = fs.readFileSync(schemaPath, 'utf8');

        Converter.convert({ type: 'string', data: openapiSchema }, {}, (err, result) => {
            if (!result.result) {
                core.setFailed(`Conversion failed: ${result.reason}`);
            } else {
                core.setOutput('postman_collection', JSON.stringify(result.output[0].data));
            }
        });
    } catch (error) {
        core.setFailed(`Error reading or converting schema: ${error.message}`);
    }
}

run();
