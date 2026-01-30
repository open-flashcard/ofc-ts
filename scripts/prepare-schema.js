const fs = require('fs');
const path = require('path');
const https = require('https');

const schemaUrl = 'https://raw.githubusercontent.com/open-flashcard/schema/refs/heads/main/v1.0.0/schema.json';
const outPath = path.resolve(__dirname, '../src/schema/schema.gen.json');

function downloadSchema(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', (err) => reject(err));
    });
}

async function main() {
    console.log(`Downloading schema from ${schemaUrl}...`);
    try {
        const schema = await downloadSchema(schemaUrl);

        // Modifying definitions for basic compatibility
        if (!schema.$defs) {
            console.error("No $defs found in schema");
            process.exit(1);
        }

        // Helper to recursively remove unsupported keywords
        function cleanSchema(node) {
            if (!node || typeof node !== 'object') return;

            if (Array.isArray(node)) {
                node.forEach(cleanSchema);
                return;
            }

            // Remove oneOf and anyOf as they cause "Unsupported keyword in subschema" errors
            if (node.oneOf) delete node.oneOf;
            if (node.anyOf) delete node.anyOf;

            for (const key in node) {
                cleanSchema(node[key]);
            }
        }

        // Apply strict cleaning
        cleanSchema(schema);

        // 1. Handle content definition
        // Since we stripped polymorphism, 'content' is just a generic object or empty interface by default.
        // We can explicitly set it to object to be safe.
        if (schema.$defs.content) {
            console.log("Simplifying content definition to generic object...");
            schema.$defs.content = {
                description: "Content item (polymorphic)",
                type: "object",
                additionalProperties: true
            };
        }

        // 2. Prevent orphan definitions error by explicitly referencing all definitions
        // checks for rule: orphan_definitions
        if (schema.$defs) {
            console.log("Injecting keep-alive references...");
            if (!schema.properties) schema.properties = {};

            const keepAliveProps = {};
            for (const key in schema.$defs) {
                keepAliveProps[key] = { $ref: `#/$defs/${key}` };
            }

            schema.properties._generated_keepalive = {
                type: "object",
                description: "Dummy property to ensure all definitions are generated",
                properties: keepAliveProps,
                additionalProperties: true
            }
        };

        // Ensure output directory exists
        const outDir = path.dirname(outPath);
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }

        fs.writeFileSync(outPath, JSON.stringify(schema, null, 2));
        console.log(`Generated patched schema at ${outPath}`);

    } catch (error) {
        console.error("Failed to download or patch schema:", error);
        process.exit(1);
    }
}

main();
