
export default [
  {
    "title": "API Reference",
    "description": "Complete API reference for notpadd-core including all functions, types, and utilities",
    "content": "# API Reference\n\nComplete API reference for Notpadd Core.\n\n## Configuration\n\n### `defineConfig(config)`\n\nDefines the configuration for your content collections.\n\n**Parameters:**\n\n- `config`: Configuration object\n  - `collections`: Array of collection definitions\n  - `cache?`: `\"memory\"` | `\"file\"` | `\"none\"` (default: `\"file\"`)\n  - `notpadd?`: Notpadd configuration object\n\n**Returns:** Typed configuration object\n\n**Example:**\n\n```typescript\nimport { defineConfig } from \"notpadd-core\";\n\nexport default defineConfig({\n  collections: [\n    /* ... */\n  ],\n  cache: \"file\",\n});\n```\n\n### `defineCollection(collection)`\n\nDefines a content collection.\n\n**Parameters:**\n\n- `collection`: Collection definition object\n  - `name`: Collection name (string)\n  - `directory`: Directory path (string)\n  - `schema`: Zod schema\n  - `parser?`: Parser name or custom parser\n  - `include`: Glob pattern(s) for files to include\n  - `exclude?`: Glob pattern(s) for files to exclude\n  - `transform?`: Transform function\n  - `onSuccess?`: Success callback\n\n**Returns:** Typed collection object\n\n**Example:**\n\n```typescript\nimport { defineCollection } from \"notpadd-core\";\nimport { z } from \"zod\";\n\nconst posts = defineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  schema: z.object({\n    title: z.string(),\n  }),\n});\n```\n\n## Builder\n\n### `createBuilder(configPath, options?)`\n\nCreates a builder instance.\n\n**Parameters:**\n\n- `configPath`: Path to configuration file (string)\n- `options?`: Builder options\n  - `outputDir?`: Output directory path (string)\n  - `configName?`: Configuration file name (string, default: `\"content-collections.ts\"`)\n\n**Returns:** Promise resolving to Builder instance\n\n**Example:**\n\n```typescript\nimport { createBuilder } from \"notpadd-core\";\n\nconst builder = await createBuilder(\"./content-collections.ts\");\n```\n\n### `Builder.build()`\n\nBuilds all collections.\n\n**Returns:** `Promise<void>`\n\n**Example:**\n\n```typescript\nawait builder.build();\n```\n\n### `Builder.watch()`\n\nStarts watching for file changes.\n\n**Returns:** Promise resolving to Watcher object with `unsubscribe()` method\n\n**Example:**\n\n```typescript\nconst watcher = await builder.watch();\n// Later...\nawait watcher.unsubscribe();\n```\n\n### `Builder.sync(modification, filePath)`\n\nManually sync a file change.\n\n**Parameters:**\n\n- `modification`: `\"create\"` | `\"update\"` | `\"delete\"`\n- `filePath`: Path to file (string)\n\n**Returns:** `Promise<boolean>`\n\n**Example:**\n\n```typescript\nawait builder.sync(\"update\", \"./content/posts/post.mdx\");\n```\n\n### `Builder.on(event, handler)`\n\nSubscribe to builder events.\n\n**Parameters:**\n\n- `event`: Event name (string)\n- `handler`: Event handler function\n\n**Returns:** Unsubscribe function\n\n**Example:**\n\n```typescript\nbuilder.on(\"build:end\", ({ stats }) => {\n  console.log(`Built ${stats.documents} documents`);\n});\n```\n\n## Parsers\n\n### `defineParser(parser)`\n\nDefines a custom parser.\n\n**Parameters:**\n\n- `parser`: Parser object or parse function\n  - If object: `{ hasContent: boolean, parse: ParseFn }`\n  - If function: Treated as parse function with `hasContent: false`\n\n**Returns:** Parser object\n\n**Example:**\n\n```typescript\nimport { defineParser } from \"notpadd-core\";\n\nconst customParser = defineParser({\n  hasContent: true,\n  parse: (content) => {\n    return { data: parseContent(content), content: getBody(content) };\n  },\n});\n```\n\n## Schemas\n\n### `notpaddSchema`\n\nFull Notpadd schema with all fields.\n\n**Type:** `ZodObject`\n\n**Example:**\n\n```typescript\nimport { notpaddSchema } from \"notpadd-core\";\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchema,\n});\n```\n\n### `notpaddSchemaOptional`\n\nNotpadd schema with optional fields.\n\n**Type:** `ZodObject`\n\n### `notpaddSchemaMinimal`\n\nMinimal Notpadd schema (slug, title only).\n\n**Type:** `ZodObject`\n\n### `notpaddSchemaExtended`\n\nExtended Notpadd schema with additional fields.\n\n**Type:** `ZodObject`\n\n### `notpaddSchemaPublished`\n\nNotpadd schema that only accepts published articles.\n\n**Type:** `ZodObject`\n\n### `createNotpaddSchema(additionalFields)`\n\nCreates a Notpadd schema extended with additional fields.\n\n**Parameters:**\n\n- `additionalFields`: Zod object shape with additional fields\n\n**Returns:** Extended Zod schema\n\n**Example:**\n\n```typescript\nimport { createNotpaddSchema } from \"notpadd-core\";\nimport { z } from \"zod\";\n\nconst schema = createNotpaddSchema({\n  category: z.string(),\n  featured: z.boolean(),\n});\n```\n\n### `createNotpaddSchemaPick(fields)`\n\nCreates a Notpadd schema with only selected fields.\n\n**Parameters:**\n\n- `fields`: Array of field names to pick\n\n**Returns:** Zod schema with picked fields\n\n**Example:**\n\n```typescript\nimport { createNotpaddSchemaPick } from \"notpadd-core\";\n\nconst schema = createNotpaddSchemaPick([\"slug\", \"title\", \"description\"]);\n```\n\n### `createNotpaddSchemaOmit(fields)`\n\nCreates a Notpadd schema with specified fields omitted.\n\n**Parameters:**\n\n- `fields`: Array of field names to omit\n\n**Returns:** Zod schema with omitted fields\n\n**Example:**\n\n```typescript\nimport { createNotpaddSchemaOmit } from \"notpadd-core\";\n\nconst schema = createNotpaddSchemaOmit([\"markdown\"]);\n```\n\n## Notpadd API\n\n### `processNotpaddData(config, baseDirectory)`\n\nProcesses Notpadd data and generates MDX files.\n\n**Parameters:**\n\n- `config`: Notpadd configuration object\n- `baseDirectory`: Base directory path (string)\n\n**Returns:** `Promise<void>`\n\n**Example:**\n\n```typescript\nimport { processNotpaddData } from \"notpadd-core\";\n\nawait processNotpaddData(\n  {\n    sk: \"secret-key\",\n    pk: \"public-key\",\n    orgID: \"org-id\",\n    directory: \"notpadd\",\n    query: \"all\",\n  },\n  process.cwd()\n);\n```\n\n### `validateNotpaddConfig(config)`\n\nValidates Notpadd configuration.\n\n**Parameters:**\n\n- `config`: Notpadd configuration object\n\n**Throws:** `NotpaddError` if configuration is invalid\n\n**Example:**\n\n```typescript\nimport { validateNotpaddConfig } from \"notpadd-core\";\n\ntry {\n  validateNotpaddConfig(config);\n} catch (error) {\n  console.error(\"Invalid config:\", error.message);\n}\n```\n\n## Imports\n\n### `createDefaultImport(path)`\n\nCreates a default import reference.\n\n**Parameters:**\n\n- `path`: Import path (string)\n\n**Returns:** Import object\n\n**Example:**\n\n```typescript\nimport { createDefaultImport } from \"notpadd-core\";\n\nreturn {\n  component: createDefaultImport(\"./components/Post.tsx\"),\n};\n```\n\n### `createNamedImport(name, path)`\n\nCreates a named import reference.\n\n**Parameters:**\n\n- `name`: Export name (string)\n- `path`: Import path (string)\n\n**Returns:** Import object\n\n**Example:**\n\n```typescript\nimport { createNamedImport } from \"notpadd-core\";\n\nreturn {\n  formatDate: createNamedImport(\"formatDate\", \"./utils.ts\"),\n};\n```\n\n## Types\n\n### `GetTypeByName<Config, Name>`\n\nGets the document type for a collection by name.\n\n**Type Parameters:**\n\n- `Config`: Configuration type\n- `Name`: Collection name (string literal)\n\n**Example:**\n\n```typescript\nimport type { GetTypeByName } from \"notpadd-core\";\nimport config from \"./content-collections\";\n\ntype Post = GetTypeByName<typeof config, \"posts\">;\n```\n\n### `Document`\n\nBase document type with `_meta` property.\n\n### `Meta`\n\nMetadata type for documents:\n\n- `filePath`: Full file path\n- `fileName`: File name\n- `directory`: Directory path\n- `path`: URL-friendly path\n- `extension`: File extension\n\n### `Modification`\n\nFile modification type: `\"create\"` | `\"update\"` | `\"delete\"`\n\n## Errors\n\n### `NotpaddError`\n\nError class for Notpadd-related errors.\n\n**Properties:**\n\n- `message`: Error message\n- `statusCode?`: HTTP status code (if applicable)\n\n**Example:**\n\n```typescript\nimport { NotpaddError } from \"notpadd-core\";\n\nthrow new NotpaddError(\"Failed to fetch data\", 500);\n```\n\n### `ConfigurationError`\n\nError class for configuration errors.\n\n### `CollectError`\n\nError class for collection errors.\n\n**Properties:**\n\n- `type`: `\"Parse\"` | `\"Read\"`\n- `message`: Error message\n\n### `TransformError`\n\nError class for transform errors.\n\n**Properties:**\n\n- `type`: `\"Validation\"` | `\"Configuration\"` | `\"Transform\"` | `\"Result\"`\n- `message`: Error message\n\n## Utilities\n\n### `suppressDeprecatedWarnings()`\n\nSuppresses deprecation warnings.\n\n**Example:**\n\n```typescript\nimport { suppressDeprecatedWarnings } from \"notpadd-core\";\n\nsuppressDeprecatedWarnings();\n```",
    "_meta": {
      "filePath": "core/core-api.mdx",
      "fileName": "core-api.mdx",
      "directory": "core",
      "extension": "mdx",
      "path": "core/core-api"
    },
    "headings": [
      {
        "level": 1,
        "text": "API Reference",
        "slug": "api-reference"
      },
      {
        "level": 2,
        "text": "Configuration",
        "slug": "configuration"
      },
      {
        "level": 3,
        "text": "`defineConfig(config)`",
        "slug": "defineconfigconfig"
      },
      {
        "level": 3,
        "text": "`defineCollection(collection)`",
        "slug": "definecollectioncollection"
      },
      {
        "level": 2,
        "text": "Builder",
        "slug": "builder"
      },
      {
        "level": 3,
        "text": "`createBuilder(configPath, options?)`",
        "slug": "createbuilderconfigpath-options"
      },
      {
        "level": 3,
        "text": "`Builder.build()`",
        "slug": "builderbuild"
      },
      {
        "level": 3,
        "text": "`Builder.watch()`",
        "slug": "builderwatch"
      },
      {
        "level": 3,
        "text": "`Builder.sync(modification, filePath)`",
        "slug": "buildersyncmodification-filepath"
      },
      {
        "level": 3,
        "text": "`Builder.on(event, handler)`",
        "slug": "builderonevent-handler"
      },
      {
        "level": 2,
        "text": "Parsers",
        "slug": "parsers"
      },
      {
        "level": 3,
        "text": "`defineParser(parser)`",
        "slug": "defineparserparser"
      },
      {
        "level": 2,
        "text": "Schemas",
        "slug": "schemas"
      },
      {
        "level": 3,
        "text": "`notpaddSchema`",
        "slug": "notpaddschema"
      },
      {
        "level": 3,
        "text": "`notpaddSchemaOptional`",
        "slug": "notpaddschemaoptional"
      },
      {
        "level": 3,
        "text": "`notpaddSchemaMinimal`",
        "slug": "notpaddschemaminimal"
      },
      {
        "level": 3,
        "text": "`notpaddSchemaExtended`",
        "slug": "notpaddschemaextended"
      },
      {
        "level": 3,
        "text": "`notpaddSchemaPublished`",
        "slug": "notpaddschemapublished"
      },
      {
        "level": 3,
        "text": "`createNotpaddSchema(additionalFields)`",
        "slug": "createnotpaddschemaadditionalfields"
      },
      {
        "level": 3,
        "text": "`createNotpaddSchemaPick(fields)`",
        "slug": "createnotpaddschemapickfields"
      },
      {
        "level": 3,
        "text": "`createNotpaddSchemaOmit(fields)`",
        "slug": "createnotpaddschemaomitfields"
      },
      {
        "level": 2,
        "text": "Notpadd API",
        "slug": "notpadd-api"
      },
      {
        "level": 3,
        "text": "`processNotpaddData(config, baseDirectory)`",
        "slug": "processnotpadddataconfig-basedirectory"
      },
      {
        "level": 3,
        "text": "`validateNotpaddConfig(config)`",
        "slug": "validatenotpaddconfigconfig"
      },
      {
        "level": 2,
        "text": "Imports",
        "slug": "imports"
      },
      {
        "level": 3,
        "text": "`createDefaultImport(path)`",
        "slug": "createdefaultimportpath"
      },
      {
        "level": 3,
        "text": "`createNamedImport(name, path)`",
        "slug": "createnamedimportname-path"
      },
      {
        "level": 2,
        "text": "Types",
        "slug": "types"
      },
      {
        "level": 3,
        "text": "`GetTypeByName<Config, Name>`",
        "slug": "gettypebynameconfig-name"
      },
      {
        "level": 3,
        "text": "`Document`",
        "slug": "document"
      },
      {
        "level": 3,
        "text": "`Meta`",
        "slug": "meta"
      },
      {
        "level": 3,
        "text": "`Modification`",
        "slug": "modification"
      },
      {
        "level": 2,
        "text": "Errors",
        "slug": "errors"
      },
      {
        "level": 3,
        "text": "`NotpaddError`",
        "slug": "notpadderror"
      },
      {
        "level": 3,
        "text": "`ConfigurationError`",
        "slug": "configurationerror"
      },
      {
        "level": 3,
        "text": "`CollectError`",
        "slug": "collecterror"
      },
      {
        "level": 3,
        "text": "`TransformError`",
        "slug": "transformerror"
      },
      {
        "level": 2,
        "text": "Utilities",
        "slug": "utilities"
      },
      {
        "level": 3,
        "text": "`suppressDeprecatedWarnings()`",
        "slug": "suppressdeprecatedwarnings"
      }
    ],
    "mdx": "var Component=(()=>{var p=Object.create;var i=Object.defineProperty;var m=Object.getOwnPropertyDescriptor;var g=Object.getOwnPropertyNames;var u=Object.getPrototypeOf,f=Object.prototype.hasOwnProperty;var y=(r,e)=>()=>(e||r((e={exports:{}}).exports,e),e.exports),N=(r,e)=>{for(var c in e)i(r,c,{get:e[c],enumerable:!0})},o=(r,e,c,t)=>{if(e&&typeof e==\"object\"||typeof e==\"function\")for(let d of g(e))!f.call(r,d)&&d!==c&&i(r,d,{get:()=>e[d],enumerable:!(t=m(e,d))||t.enumerable});return r};var b=(r,e,c)=>(c=r!=null?p(u(r)):{},o(e||!r||!r.__esModule?i(c,\"default\",{value:r,enumerable:!0}):c,r)),P=r=>o(i({},\"__esModule\",{value:!0}),r);var a=y((x,l)=>{l.exports=_jsx_runtime});var C={};N(C,{default:()=>s});var n=b(a());function h(r){let e={code:\"code\",h1:\"h1\",h2:\"h2\",h3:\"h3\",li:\"li\",p:\"p\",pre:\"pre\",strong:\"strong\",ul:\"ul\",...r.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(e.h1,{children:\"API Reference\"}),`\n`,(0,n.jsx)(e.p,{children:\"Complete API reference for Notpadd Core.\"}),`\n`,(0,n.jsx)(e.h2,{children:\"Configuration\"}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"defineConfig(config)\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Defines the configuration for your content collections.\"}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Parameters:\"})}),`\n`,(0,n.jsxs)(e.ul,{children:[`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"config\"}),\": Configuration object\",`\n`,(0,n.jsxs)(e.ul,{children:[`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"collections\"}),\": Array of collection definitions\"]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"cache?\"}),\": \",(0,n.jsx)(e.code,{children:'\"memory\"'}),\" | \",(0,n.jsx)(e.code,{children:'\"file\"'}),\" | \",(0,n.jsx)(e.code,{children:'\"none\"'}),\" (default: \",(0,n.jsx)(e.code,{children:'\"file\"'}),\")\"]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"notpadd?\"}),\": Notpadd configuration object\"]}),`\n`]}),`\n`]}),`\n`]}),`\n`,(0,n.jsxs)(e.p,{children:[(0,n.jsx)(e.strong,{children:\"Returns:\"}),\" Typed configuration object\"]}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Example:\"})}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { defineConfig } from \"notpadd-core\";\n\nexport default defineConfig({\n  collections: [\n    /* ... */\n  ],\n  cache: \"file\",\n});\n\\`\\`\\``,children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`import { defineConfig } from \"notpadd-core\";\n\nexport default defineConfig({\n  collections: [\n    /* ... */\n  ],\n  cache: \"file\",\n});\n`})}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"defineCollection(collection)\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Defines a content collection.\"}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Parameters:\"})}),`\n`,(0,n.jsxs)(e.ul,{children:[`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"collection\"}),\": Collection definition object\",`\n`,(0,n.jsxs)(e.ul,{children:[`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"name\"}),\": Collection name (string)\"]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"directory\"}),\": Directory path (string)\"]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"schema\"}),\": Zod schema\"]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"parser?\"}),\": Parser name or custom parser\"]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"include\"}),\": Glob pattern(s) for files to include\"]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"exclude?\"}),\": Glob pattern(s) for files to exclude\"]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"transform?\"}),\": Transform function\"]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"onSuccess?\"}),\": Success callback\"]}),`\n`]}),`\n`]}),`\n`]}),`\n`,(0,n.jsxs)(e.p,{children:[(0,n.jsx)(e.strong,{children:\"Returns:\"}),\" Typed collection object\"]}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Example:\"})}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { defineCollection } from \"notpadd-core\";\nimport { z } from \"zod\";\n\nconst posts = defineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  schema: z.object({\n    title: z.string(),\n  }),\n});\n\\`\\`\\``,children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`import { defineCollection } from \"notpadd-core\";\nimport { z } from \"zod\";\n\nconst posts = defineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  schema: z.object({\n    title: z.string(),\n  }),\n});\n`})}),`\n`,(0,n.jsx)(e.h2,{children:\"Builder\"}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"createBuilder(configPath, options?)\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Creates a builder instance.\"}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Parameters:\"})}),`\n`,(0,n.jsxs)(e.ul,{children:[`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"configPath\"}),\": Path to configuration file (string)\"]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"options?\"}),\": Builder options\",`\n`,(0,n.jsxs)(e.ul,{children:[`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"outputDir?\"}),\": Output directory path (string)\"]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"configName?\"}),\": Configuration file name (string, default: \",(0,n.jsx)(e.code,{children:'\"content-collections.ts\"'}),\")\"]}),`\n`]}),`\n`]}),`\n`]}),`\n`,(0,n.jsxs)(e.p,{children:[(0,n.jsx)(e.strong,{children:\"Returns:\"}),\" Promise resolving to Builder instance\"]}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Example:\"})}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:'```typescript\\nimport { createBuilder } from \"notpadd-core\";\\n\\nconst builder = await createBuilder(\"./content-collections.ts\");\\n```',children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`import { createBuilder } from \"notpadd-core\";\n\nconst builder = await createBuilder(\"./content-collections.ts\");\n`})}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"Builder.build()\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Builds all collections.\"}),`\n`,(0,n.jsxs)(e.p,{children:[(0,n.jsx)(e.strong,{children:\"Returns:\"}),\" \",(0,n.jsx)(e.code,{children:\"Promise<void>\"})]}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Example:\"})}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:\"```typescript\\nawait builder.build();\\n```\",children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`await builder.build();\n`})}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"Builder.watch()\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Starts watching for file changes.\"}),`\n`,(0,n.jsxs)(e.p,{children:[(0,n.jsx)(e.strong,{children:\"Returns:\"}),\" Promise resolving to Watcher object with \",(0,n.jsx)(e.code,{children:\"unsubscribe()\"}),\" method\"]}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Example:\"})}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:\"```typescript\\nconst watcher = await builder.watch();\\n// Later...\\nawait watcher.unsubscribe();\\n```\",children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`const watcher = await builder.watch();\n// Later...\nawait watcher.unsubscribe();\n`})}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"Builder.sync(modification, filePath)\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Manually sync a file change.\"}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Parameters:\"})}),`\n`,(0,n.jsxs)(e.ul,{children:[`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"modification\"}),\": \",(0,n.jsx)(e.code,{children:'\"create\"'}),\" | \",(0,n.jsx)(e.code,{children:'\"update\"'}),\" | \",(0,n.jsx)(e.code,{children:'\"delete\"'})]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"filePath\"}),\": Path to file (string)\"]}),`\n`]}),`\n`,(0,n.jsxs)(e.p,{children:[(0,n.jsx)(e.strong,{children:\"Returns:\"}),\" \",(0,n.jsx)(e.code,{children:\"Promise<boolean>\"})]}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Example:\"})}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:'```typescript\\nawait builder.sync(\"update\", \"./content/posts/post.mdx\");\\n```',children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`await builder.sync(\"update\", \"./content/posts/post.mdx\");\n`})}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"Builder.on(event, handler)\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Subscribe to builder events.\"}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Parameters:\"})}),`\n`,(0,n.jsxs)(e.ul,{children:[`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"event\"}),\": Event name (string)\"]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"handler\"}),\": Event handler function\"]}),`\n`]}),`\n`,(0,n.jsxs)(e.p,{children:[(0,n.jsx)(e.strong,{children:\"Returns:\"}),\" Unsubscribe function\"]}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Example:\"})}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:'```typescript\\nbuilder.on(\"build:end\", ({ stats }) => {\\n  console.log(`Built ${stats.documents} documents`);\\n});\\n```',children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:'builder.on(\"build:end\", ({ stats }) => {\\n  console.log(`Built ${stats.documents} documents`);\\n});\\n'})}),`\n`,(0,n.jsx)(e.h2,{children:\"Parsers\"}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"defineParser(parser)\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Defines a custom parser.\"}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Parameters:\"})}),`\n`,(0,n.jsxs)(e.ul,{children:[`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"parser\"}),\": Parser object or parse function\",`\n`,(0,n.jsxs)(e.ul,{children:[`\n`,(0,n.jsxs)(e.li,{children:[\"If object: \",(0,n.jsx)(e.code,{children:\"{ hasContent: boolean, parse: ParseFn }\"})]}),`\n`,(0,n.jsxs)(e.li,{children:[\"If function: Treated as parse function with \",(0,n.jsx)(e.code,{children:\"hasContent: false\"})]}),`\n`]}),`\n`]}),`\n`]}),`\n`,(0,n.jsxs)(e.p,{children:[(0,n.jsx)(e.strong,{children:\"Returns:\"}),\" Parser object\"]}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Example:\"})}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { defineParser } from \"notpadd-core\";\n\nconst customParser = defineParser({\n  hasContent: true,\n  parse: (content) => {\n    return { data: parseContent(content), content: getBody(content) };\n  },\n});\n\\`\\`\\``,children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`import { defineParser } from \"notpadd-core\";\n\nconst customParser = defineParser({\n  hasContent: true,\n  parse: (content) => {\n    return { data: parseContent(content), content: getBody(content) };\n  },\n});\n`})}),`\n`,(0,n.jsx)(e.h2,{children:\"Schemas\"}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"notpaddSchema\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Full Notpadd schema with all fields.\"}),`\n`,(0,n.jsxs)(e.p,{children:[(0,n.jsx)(e.strong,{children:\"Type:\"}),\" \",(0,n.jsx)(e.code,{children:\"ZodObject\"})]}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Example:\"})}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { notpaddSchema } from \"notpadd-core\";\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchema,\n});\n\\`\\`\\``,children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`import { notpaddSchema } from \"notpadd-core\";\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchema,\n});\n`})}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"notpaddSchemaOptional\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Notpadd schema with optional fields.\"}),`\n`,(0,n.jsxs)(e.p,{children:[(0,n.jsx)(e.strong,{children:\"Type:\"}),\" \",(0,n.jsx)(e.code,{children:\"ZodObject\"})]}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"notpaddSchemaMinimal\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Minimal Notpadd schema (slug, title only).\"}),`\n`,(0,n.jsxs)(e.p,{children:[(0,n.jsx)(e.strong,{children:\"Type:\"}),\" \",(0,n.jsx)(e.code,{children:\"ZodObject\"})]}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"notpaddSchemaExtended\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Extended Notpadd schema with additional fields.\"}),`\n`,(0,n.jsxs)(e.p,{children:[(0,n.jsx)(e.strong,{children:\"Type:\"}),\" \",(0,n.jsx)(e.code,{children:\"ZodObject\"})]}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"notpaddSchemaPublished\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Notpadd schema that only accepts published articles.\"}),`\n`,(0,n.jsxs)(e.p,{children:[(0,n.jsx)(e.strong,{children:\"Type:\"}),\" \",(0,n.jsx)(e.code,{children:\"ZodObject\"})]}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"createNotpaddSchema(additionalFields)\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Creates a Notpadd schema extended with additional fields.\"}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Parameters:\"})}),`\n`,(0,n.jsxs)(e.ul,{children:[`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"additionalFields\"}),\": Zod object shape with additional fields\"]}),`\n`]}),`\n`,(0,n.jsxs)(e.p,{children:[(0,n.jsx)(e.strong,{children:\"Returns:\"}),\" Extended Zod schema\"]}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Example:\"})}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { createNotpaddSchema } from \"notpadd-core\";\nimport { z } from \"zod\";\n\nconst schema = createNotpaddSchema({\n  category: z.string(),\n  featured: z.boolean(),\n});\n\\`\\`\\``,children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`import { createNotpaddSchema } from \"notpadd-core\";\nimport { z } from \"zod\";\n\nconst schema = createNotpaddSchema({\n  category: z.string(),\n  featured: z.boolean(),\n});\n`})}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"createNotpaddSchemaPick(fields)\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Creates a Notpadd schema with only selected fields.\"}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Parameters:\"})}),`\n`,(0,n.jsxs)(e.ul,{children:[`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"fields\"}),\": Array of field names to pick\"]}),`\n`]}),`\n`,(0,n.jsxs)(e.p,{children:[(0,n.jsx)(e.strong,{children:\"Returns:\"}),\" Zod schema with picked fields\"]}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Example:\"})}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:'```typescript\\nimport { createNotpaddSchemaPick } from \"notpadd-core\";\\n\\nconst schema = createNotpaddSchemaPick([\"slug\", \"title\", \"description\"]);\\n```',children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`import { createNotpaddSchemaPick } from \"notpadd-core\";\n\nconst schema = createNotpaddSchemaPick([\"slug\", \"title\", \"description\"]);\n`})}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"createNotpaddSchemaOmit(fields)\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Creates a Notpadd schema with specified fields omitted.\"}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Parameters:\"})}),`\n`,(0,n.jsxs)(e.ul,{children:[`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"fields\"}),\": Array of field names to omit\"]}),`\n`]}),`\n`,(0,n.jsxs)(e.p,{children:[(0,n.jsx)(e.strong,{children:\"Returns:\"}),\" Zod schema with omitted fields\"]}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Example:\"})}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:'```typescript\\nimport { createNotpaddSchemaOmit } from \"notpadd-core\";\\n\\nconst schema = createNotpaddSchemaOmit([\"markdown\"]);\\n```',children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`import { createNotpaddSchemaOmit } from \"notpadd-core\";\n\nconst schema = createNotpaddSchemaOmit([\"markdown\"]);\n`})}),`\n`,(0,n.jsx)(e.h2,{children:\"Notpadd API\"}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"processNotpaddData(config, baseDirectory)\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Processes Notpadd data and generates MDX files.\"}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Parameters:\"})}),`\n`,(0,n.jsxs)(e.ul,{children:[`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"config\"}),\": Notpadd configuration object\"]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"baseDirectory\"}),\": Base directory path (string)\"]}),`\n`]}),`\n`,(0,n.jsxs)(e.p,{children:[(0,n.jsx)(e.strong,{children:\"Returns:\"}),\" \",(0,n.jsx)(e.code,{children:\"Promise<void>\"})]}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Example:\"})}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { processNotpaddData } from \"notpadd-core\";\n\nawait processNotpaddData(\n  {\n    sk: \"secret-key\",\n    pk: \"public-key\",\n    orgID: \"org-id\",\n    directory: \"notpadd\",\n    query: \"all\",\n  },\n  process.cwd()\n);\n\\`\\`\\``,children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`import { processNotpaddData } from \"notpadd-core\";\n\nawait processNotpaddData(\n  {\n    sk: \"secret-key\",\n    pk: \"public-key\",\n    orgID: \"org-id\",\n    directory: \"notpadd\",\n    query: \"all\",\n  },\n  process.cwd()\n);\n`})}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"validateNotpaddConfig(config)\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Validates Notpadd configuration.\"}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Parameters:\"})}),`\n`,(0,n.jsxs)(e.ul,{children:[`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"config\"}),\": Notpadd configuration object\"]}),`\n`]}),`\n`,(0,n.jsxs)(e.p,{children:[(0,n.jsx)(e.strong,{children:\"Throws:\"}),\" \",(0,n.jsx)(e.code,{children:\"NotpaddError\"}),\" if configuration is invalid\"]}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Example:\"})}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { validateNotpaddConfig } from \"notpadd-core\";\n\ntry {\n  validateNotpaddConfig(config);\n} catch (error) {\n  console.error(\"Invalid config:\", error.message);\n}\n\\`\\`\\``,children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`import { validateNotpaddConfig } from \"notpadd-core\";\n\ntry {\n  validateNotpaddConfig(config);\n} catch (error) {\n  console.error(\"Invalid config:\", error.message);\n}\n`})}),`\n`,(0,n.jsx)(e.h2,{children:\"Imports\"}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"createDefaultImport(path)\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Creates a default import reference.\"}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Parameters:\"})}),`\n`,(0,n.jsxs)(e.ul,{children:[`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"path\"}),\": Import path (string)\"]}),`\n`]}),`\n`,(0,n.jsxs)(e.p,{children:[(0,n.jsx)(e.strong,{children:\"Returns:\"}),\" Import object\"]}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Example:\"})}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:'```typescript\\nimport { createDefaultImport } from \"notpadd-core\";\\n\\nreturn {\\n  component: createDefaultImport(\"./components/Post.tsx\"),\\n};\\n```',children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`import { createDefaultImport } from \"notpadd-core\";\n\nreturn {\n  component: createDefaultImport(\"./components/Post.tsx\"),\n};\n`})}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"createNamedImport(name, path)\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Creates a named import reference.\"}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Parameters:\"})}),`\n`,(0,n.jsxs)(e.ul,{children:[`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"name\"}),\": Export name (string)\"]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"path\"}),\": Import path (string)\"]}),`\n`]}),`\n`,(0,n.jsxs)(e.p,{children:[(0,n.jsx)(e.strong,{children:\"Returns:\"}),\" Import object\"]}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Example:\"})}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:'```typescript\\nimport { createNamedImport } from \"notpadd-core\";\\n\\nreturn {\\n  formatDate: createNamedImport(\"formatDate\", \"./utils.ts\"),\\n};\\n```',children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`import { createNamedImport } from \"notpadd-core\";\n\nreturn {\n  formatDate: createNamedImport(\"formatDate\", \"./utils.ts\"),\n};\n`})}),`\n`,(0,n.jsx)(e.h2,{children:\"Types\"}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"GetTypeByName<Config, Name>\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Gets the document type for a collection by name.\"}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Type Parameters:\"})}),`\n`,(0,n.jsxs)(e.ul,{children:[`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"Config\"}),\": Configuration type\"]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"Name\"}),\": Collection name (string literal)\"]}),`\n`]}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Example:\"})}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:'```typescript\\nimport type { GetTypeByName } from \"notpadd-core\";\\nimport config from \"./content-collections\";\\n\\ntype Post = GetTypeByName<typeof config, \"posts\">;\\n```',children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`import type { GetTypeByName } from \"notpadd-core\";\nimport config from \"./content-collections\";\n\ntype Post = GetTypeByName<typeof config, \"posts\">;\n`})}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"Document\"})}),`\n`,(0,n.jsxs)(e.p,{children:[\"Base document type with \",(0,n.jsx)(e.code,{children:\"_meta\"}),\" property.\"]}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"Meta\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Metadata type for documents:\"}),`\n`,(0,n.jsxs)(e.ul,{children:[`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"filePath\"}),\": Full file path\"]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"fileName\"}),\": File name\"]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"directory\"}),\": Directory path\"]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"path\"}),\": URL-friendly path\"]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"extension\"}),\": File extension\"]}),`\n`]}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"Modification\"})}),`\n`,(0,n.jsxs)(e.p,{children:[\"File modification type: \",(0,n.jsx)(e.code,{children:'\"create\"'}),\" | \",(0,n.jsx)(e.code,{children:'\"update\"'}),\" | \",(0,n.jsx)(e.code,{children:'\"delete\"'})]}),`\n`,(0,n.jsx)(e.h2,{children:\"Errors\"}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"NotpaddError\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Error class for Notpadd-related errors.\"}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Properties:\"})}),`\n`,(0,n.jsxs)(e.ul,{children:[`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"message\"}),\": Error message\"]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"statusCode?\"}),\": HTTP status code (if applicable)\"]}),`\n`]}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Example:\"})}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:'```typescript\\nimport { NotpaddError } from \"notpadd-core\";\\n\\nthrow new NotpaddError(\"Failed to fetch data\", 500);\\n```',children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`import { NotpaddError } from \"notpadd-core\";\n\nthrow new NotpaddError(\"Failed to fetch data\", 500);\n`})}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"ConfigurationError\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Error class for configuration errors.\"}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"CollectError\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Error class for collection errors.\"}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Properties:\"})}),`\n`,(0,n.jsxs)(e.ul,{children:[`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"type\"}),\": \",(0,n.jsx)(e.code,{children:'\"Parse\"'}),\" | \",(0,n.jsx)(e.code,{children:'\"Read\"'})]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"message\"}),\": Error message\"]}),`\n`]}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"TransformError\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Error class for transform errors.\"}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Properties:\"})}),`\n`,(0,n.jsxs)(e.ul,{children:[`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"type\"}),\": \",(0,n.jsx)(e.code,{children:'\"Validation\"'}),\" | \",(0,n.jsx)(e.code,{children:'\"Configuration\"'}),\" | \",(0,n.jsx)(e.code,{children:'\"Transform\"'}),\" | \",(0,n.jsx)(e.code,{children:'\"Result\"'})]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"message\"}),\": Error message\"]}),`\n`]}),`\n`,(0,n.jsx)(e.h2,{children:\"Utilities\"}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"suppressDeprecatedWarnings()\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Suppresses deprecation warnings.\"}),`\n`,(0,n.jsx)(e.p,{children:(0,n.jsx)(e.strong,{children:\"Example:\"})}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:'```typescript\\nimport { suppressDeprecatedWarnings } from \"notpadd-core\";\\n\\nsuppressDeprecatedWarnings();\\n```',children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`import { suppressDeprecatedWarnings } from \"notpadd-core\";\n\nsuppressDeprecatedWarnings();\n`})})]})}function s(r={}){let{wrapper:e}=r.components||{};return e?(0,n.jsx)(e,{...r,children:(0,n.jsx)(h,{...r})}):h(r)}return P(C);})();\n;return Component;"
  },
  {
    "title": "Builder",
    "description": "Programmatic API for building and watching content collections with event system",
    "content": "# Builder\n\nThe Builder API provides programmatic access to build and watch your content collections.\n\n## Creating a Builder\n\nCreate a builder instance from your configuration file:\n\n```typescript\nimport { createBuilder } from \"notpadd-core\";\n\nconst builder = await createBuilder(\"./content-collections.ts\");\n```\n\n## Building\n\nBuild all collections:\n\n```typescript\nawait builder.build();\n```\n\nThis will:\n1. Process Notpadd configuration (if provided)\n2. Collect all files from collections\n3. Parse and validate documents\n4. Transform documents\n5. Generate output files\n6. Emit build events\n\n## Watching\n\nWatch for file changes and rebuild automatically:\n\n```typescript\nconst watcher = await builder.watch();\n\n// Later, stop watching\nawait watcher.unsubscribe();\n```\n\nDuring watch mode:\n- File changes trigger automatic rebuilds\n- Configuration changes reload the builder\n- Events are emitted for all changes\n\n## Events\n\nListen to builder events:\n\n```typescript\nbuilder.on(\"builder:created\", ({ configurationPath, outputDirectory }) => {\n  console.log(`Builder created for ${configurationPath}`);\n});\n\nbuilder.on(\"build:start\", () => {\n  console.log(\"Build started\");\n});\n\nbuilder.on(\"build:end\", ({ stats }) => {\n  console.log(`Build completed: ${stats.collections} collections, ${stats.documents} documents`);\n});\n\nbuilder.on(\"watcher:file-changed\", ({ filePath, modification }) => {\n  console.log(`File ${modification}: ${filePath}`);\n});\n```\n\n### Available Events\n\n#### Builder Events\n\n- `builder:created`: Emitted when builder is created\n  - `createdAt`: Timestamp\n  - `configurationPath`: Path to config file\n  - `outputDirectory`: Output directory path\n\n#### Build Events\n\n- `build:start`: Build process started\n- `build:end`: Build process completed\n  - `stats`: Build statistics\n    - `collections`: Number of collections\n    - `documents`: Number of documents\n\n#### Watcher Events\n\n- `watcher:file-changed`: A content file changed\n  - `filePath`: Path to changed file\n  - `modification`: `\"create\"` | `\"update\"` | `\"delete\"`\n- `watcher:config-changed`: Configuration file changed\n  - `filePath`: Path to config file\n  - `modification`: `\"create\"` | `\"update\"` | `\"delete\"`\n- `watcher:config-reload-error`: Error reloading configuration\n  - `error`: Error object\n  - `configurationPath`: Path to config file\n- `watcher:subscribed`: Watcher started watching\n  - `paths`: Array of watched paths\n- `watcher:unsubscribed`: Watcher stopped watching\n  - `paths`: Array of watched paths\n\n#### Collector Events\n\n- `collector:read-error`: Error reading a file\n  - `filePath`: Path to file\n  - `error`: CollectError\n- `collector:parse-error`: Error parsing a file\n  - `filePath`: Path to file\n  - `error`: CollectError\n\n#### Transformer Events\n\n- `transformer:validation-error`: Schema validation failed\n  - `collection`: Collection object\n  - `file`: File object\n  - `error`: TransformError\n- `transformer:result-error`: Transform result validation failed\n  - `collection`: Collection object\n  - `document`: Document object\n  - `error`: TransformError\n- `transformer:error`: Error during transformation\n  - `collection`: Collection object\n  - `error`: TransformError\n- `transformer:document-skipped`: Document was skipped\n  - `collection`: Collection object\n  - `filePath`: Path to file\n  - `reason`: Optional skip reason\n\n## Manual Sync\n\nManually sync a file change:\n\n```typescript\nawait builder.sync(\"create\", \"./content/posts/new-post.mdx\");\nawait builder.sync(\"update\", \"./content/posts/existing-post.mdx\");\nawait builder.sync(\"delete\", \"./content/posts/old-post.mdx\");\n```\n\n## Options\n\n### Output Directory\n\nSpecify a custom output directory:\n\n```typescript\nconst builder = await createBuilder(\"./content-collections.ts\", {\n  outputDir: \"./.custom-output\",\n});\n```\n\nDefault: `./.content-collections/generated`\n\n### Configuration Name\n\nSpecify a custom config file name:\n\n```typescript\nconst builder = await createBuilder(\"./content-collections.ts\", {\n  configName: \"content.config.ts\",\n});\n```\n\nDefault: `content-collections.ts`\n\n## Example: CLI Tool\n\n```typescript\nimport { createBuilder } from \"notpadd-core\";\n\nasync function main() {\n  const builder = await createBuilder(\"./content-collections.ts\");\n\n  // Set up event listeners\n  builder.on(\"build:start\", () => {\n    console.log(\"Building collections...\");\n  });\n\n  builder.on(\"build:end\", ({ stats }) => {\n    console.log(`✓ Built ${stats.collections} collections with ${stats.documents} documents`);\n  });\n\n  builder.on(\"watcher:file-changed\", ({ filePath, modification }) => {\n    console.log(`File ${modification}: ${filePath}`);\n  });\n\n  // Build once\n  await builder.build();\n\n  // Watch for changes\n  if (process.argv.includes(\"--watch\")) {\n    const watcher = await builder.watch();\n    console.log(\"Watching for changes...\");\n\n    // Graceful shutdown\n    process.on(\"SIGINT\", async () => {\n      await watcher.unsubscribe();\n      process.exit(0);\n    });\n  }\n}\n\nmain().catch(console.error);\n```\n\n## Error Handling\n\nBuilder methods can throw errors:\n\n```typescript\ntry {\n  const builder = await createBuilder(\"./content-collections.ts\");\n  await builder.build();\n} catch (error) {\n  if (error instanceof ConfigurationError) {\n    console.error(\"Configuration error:\", error.message);\n  } else if (error instanceof NotpaddError) {\n    console.error(\"Notpadd error:\", error.message);\n  } else {\n    console.error(\"Unknown error:\", error);\n  }\n}\n```\n\n## Best Practices\n\n1. **Handle errors**: Wrap builder operations in try-catch\n2. **Listen to events**: Use events for logging and monitoring\n3. **Clean up watchers**: Always unsubscribe from watchers when done\n4. **Use output directory**: Specify a custom output directory if needed\n5. **Build before watch**: Build once before starting watch mode",
    "_meta": {
      "filePath": "core/core-builder.mdx",
      "fileName": "core-builder.mdx",
      "directory": "core",
      "extension": "mdx",
      "path": "core/core-builder"
    },
    "headings": [
      {
        "level": 1,
        "text": "Builder",
        "slug": "builder"
      },
      {
        "level": 2,
        "text": "Creating a Builder",
        "slug": "creating-a-builder"
      },
      {
        "level": 2,
        "text": "Building",
        "slug": "building"
      },
      {
        "level": 2,
        "text": "Watching",
        "slug": "watching"
      },
      {
        "level": 2,
        "text": "Events",
        "slug": "events"
      },
      {
        "level": 3,
        "text": "Available Events",
        "slug": "available-events"
      },
      {
        "level": 4,
        "text": "Builder Events",
        "slug": "builder-events"
      },
      {
        "level": 4,
        "text": "Build Events",
        "slug": "build-events"
      },
      {
        "level": 4,
        "text": "Watcher Events",
        "slug": "watcher-events"
      },
      {
        "level": 4,
        "text": "Collector Events",
        "slug": "collector-events"
      },
      {
        "level": 4,
        "text": "Transformer Events",
        "slug": "transformer-events"
      },
      {
        "level": 2,
        "text": "Manual Sync",
        "slug": "manual-sync"
      },
      {
        "level": 2,
        "text": "Options",
        "slug": "options"
      },
      {
        "level": 3,
        "text": "Output Directory",
        "slug": "output-directory"
      },
      {
        "level": 3,
        "text": "Configuration Name",
        "slug": "configuration-name"
      },
      {
        "level": 2,
        "text": "Example: CLI Tool",
        "slug": "example-cli-tool"
      },
      {
        "level": 2,
        "text": "Error Handling",
        "slug": "error-handling"
      },
      {
        "level": 2,
        "text": "Best Practices",
        "slug": "best-practices"
      }
    ],
    "mdx": "var Component=(()=>{var u=Object.create;var l=Object.defineProperty;var p=Object.getOwnPropertyDescriptor;var g=Object.getOwnPropertyNames;var f=Object.getPrototypeOf,m=Object.prototype.hasOwnProperty;var b=(r,n)=>()=>(n||r((n={exports:{}}).exports,n),n.exports),w=(r,n)=>{for(var i in n)l(r,i,{get:n[i],enumerable:!0})},o=(r,n,i,t)=>{if(n&&typeof n==\"object\"||typeof n==\"function\")for(let c of g(n))!m.call(r,c)&&c!==i&&l(r,c,{get:()=>n[c],enumerable:!(t=p(n,c))||t.enumerable});return r};var y=(r,n,i)=>(i=r!=null?u(f(r)):{},o(n||!r||!r.__esModule?l(i,\"default\",{value:r,enumerable:!0}):i,r)),B=r=>o(l({},\"__esModule\",{value:!0}),r);var a=b((v,d)=>{d.exports=_jsx_runtime});var P={};w(P,{default:()=>h});var e=y(a());function s(r){let n={code:\"code\",h1:\"h1\",h2:\"h2\",h3:\"h3\",h4:\"h4\",li:\"li\",ol:\"ol\",p:\"p\",pre:\"pre\",strong:\"strong\",ul:\"ul\",...r.components};return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(n.h1,{children:\"Builder\"}),`\n`,(0,e.jsx)(n.p,{children:\"The Builder API provides programmatic access to build and watch your content collections.\"}),`\n`,(0,e.jsx)(n.h2,{children:\"Creating a Builder\"}),`\n`,(0,e.jsx)(n.p,{children:\"Create a builder instance from your configuration file:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:'```typescript\\nimport { createBuilder } from \"notpadd-core\";\\n\\nconst builder = await createBuilder(\"./content-collections.ts\");\\n```',children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`import { createBuilder } from \"notpadd-core\";\n\nconst builder = await createBuilder(\"./content-collections.ts\");\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Building\"}),`\n`,(0,e.jsx)(n.p,{children:\"Build all collections:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:\"```typescript\\nawait builder.build();\\n```\",children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`await builder.build();\n`})}),`\n`,(0,e.jsx)(n.p,{children:\"This will:\"}),`\n`,(0,e.jsxs)(n.ol,{children:[`\n`,(0,e.jsx)(n.li,{children:\"Process Notpadd configuration (if provided)\"}),`\n`,(0,e.jsx)(n.li,{children:\"Collect all files from collections\"}),`\n`,(0,e.jsx)(n.li,{children:\"Parse and validate documents\"}),`\n`,(0,e.jsx)(n.li,{children:\"Transform documents\"}),`\n`,(0,e.jsx)(n.li,{children:\"Generate output files\"}),`\n`,(0,e.jsx)(n.li,{children:\"Emit build events\"}),`\n`]}),`\n`,(0,e.jsx)(n.h2,{children:\"Watching\"}),`\n`,(0,e.jsx)(n.p,{children:\"Watch for file changes and rebuild automatically:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:\"```typescript\\nconst watcher = await builder.watch();\\n\\n// Later, stop watching\\nawait watcher.unsubscribe();\\n```\",children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`const watcher = await builder.watch();\n\n// Later, stop watching\nawait watcher.unsubscribe();\n`})}),`\n`,(0,e.jsx)(n.p,{children:\"During watch mode:\"}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsx)(n.li,{children:\"File changes trigger automatic rebuilds\"}),`\n`,(0,e.jsx)(n.li,{children:\"Configuration changes reload the builder\"}),`\n`,(0,e.jsx)(n.li,{children:\"Events are emitted for all changes\"}),`\n`]}),`\n`,(0,e.jsx)(n.h2,{children:\"Events\"}),`\n`,(0,e.jsx)(n.p,{children:\"Listen to builder events:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:'```typescript\\nbuilder.on(\"builder:created\", ({ configurationPath, outputDirectory }) => {\\n  console.log(`Builder created for ${configurationPath}`);\\n});\\n\\nbuilder.on(\"build:start\", () => {\\n  console.log(\"Build started\");\\n});\\n\\nbuilder.on(\"build:end\", ({ stats }) => {\\n  console.log(`Build completed: ${stats.collections} collections, ${stats.documents} documents`);\\n});\\n\\nbuilder.on(\"watcher:file-changed\", ({ filePath, modification }) => {\\n  console.log(`File ${modification}: ${filePath}`);\\n});\\n```',children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`builder.on(\"builder:created\", ({ configurationPath, outputDirectory }) => {\n  console.log(\\`Builder created for \\${configurationPath}\\`);\n});\n\nbuilder.on(\"build:start\", () => {\n  console.log(\"Build started\");\n});\n\nbuilder.on(\"build:end\", ({ stats }) => {\n  console.log(\\`Build completed: \\${stats.collections} collections, \\${stats.documents} documents\\`);\n});\n\nbuilder.on(\"watcher:file-changed\", ({ filePath, modification }) => {\n  console.log(\\`File \\${modification}: \\${filePath}\\`);\n});\n`})}),`\n`,(0,e.jsx)(n.h3,{children:\"Available Events\"}),`\n`,(0,e.jsx)(n.h4,{children:\"Builder Events\"}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"builder:created\"}),\": Emitted when builder is created\",`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"createdAt\"}),\": Timestamp\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"configurationPath\"}),\": Path to config file\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"outputDirectory\"}),\": Output directory path\"]}),`\n`]}),`\n`]}),`\n`]}),`\n`,(0,e.jsx)(n.h4,{children:\"Build Events\"}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"build:start\"}),\": Build process started\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"build:end\"}),\": Build process completed\",`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"stats\"}),\": Build statistics\",`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"collections\"}),\": Number of collections\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"documents\"}),\": Number of documents\"]}),`\n`]}),`\n`]}),`\n`]}),`\n`]}),`\n`]}),`\n`,(0,e.jsx)(n.h4,{children:\"Watcher Events\"}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"watcher:file-changed\"}),\": A content file changed\",`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"filePath\"}),\": Path to changed file\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"modification\"}),\": \",(0,e.jsx)(n.code,{children:'\"create\"'}),\" | \",(0,e.jsx)(n.code,{children:'\"update\"'}),\" | \",(0,e.jsx)(n.code,{children:'\"delete\"'})]}),`\n`]}),`\n`]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"watcher:config-changed\"}),\": Configuration file changed\",`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"filePath\"}),\": Path to config file\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"modification\"}),\": \",(0,e.jsx)(n.code,{children:'\"create\"'}),\" | \",(0,e.jsx)(n.code,{children:'\"update\"'}),\" | \",(0,e.jsx)(n.code,{children:'\"delete\"'})]}),`\n`]}),`\n`]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"watcher:config-reload-error\"}),\": Error reloading configuration\",`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"error\"}),\": Error object\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"configurationPath\"}),\": Path to config file\"]}),`\n`]}),`\n`]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"watcher:subscribed\"}),\": Watcher started watching\",`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"paths\"}),\": Array of watched paths\"]}),`\n`]}),`\n`]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"watcher:unsubscribed\"}),\": Watcher stopped watching\",`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"paths\"}),\": Array of watched paths\"]}),`\n`]}),`\n`]}),`\n`]}),`\n`,(0,e.jsx)(n.h4,{children:\"Collector Events\"}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"collector:read-error\"}),\": Error reading a file\",`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"filePath\"}),\": Path to file\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"error\"}),\": CollectError\"]}),`\n`]}),`\n`]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"collector:parse-error\"}),\": Error parsing a file\",`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"filePath\"}),\": Path to file\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"error\"}),\": CollectError\"]}),`\n`]}),`\n`]}),`\n`]}),`\n`,(0,e.jsx)(n.h4,{children:\"Transformer Events\"}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"transformer:validation-error\"}),\": Schema validation failed\",`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"collection\"}),\": Collection object\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"file\"}),\": File object\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"error\"}),\": TransformError\"]}),`\n`]}),`\n`]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"transformer:result-error\"}),\": Transform result validation failed\",`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"collection\"}),\": Collection object\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"document\"}),\": Document object\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"error\"}),\": TransformError\"]}),`\n`]}),`\n`]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"transformer:error\"}),\": Error during transformation\",`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"collection\"}),\": Collection object\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"error\"}),\": TransformError\"]}),`\n`]}),`\n`]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"transformer:document-skipped\"}),\": Document was skipped\",`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"collection\"}),\": Collection object\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"filePath\"}),\": Path to file\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"reason\"}),\": Optional skip reason\"]}),`\n`]}),`\n`]}),`\n`]}),`\n`,(0,e.jsx)(n.h2,{children:\"Manual Sync\"}),`\n`,(0,e.jsx)(n.p,{children:\"Manually sync a file change:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:'```typescript\\nawait builder.sync(\"create\", \"./content/posts/new-post.mdx\");\\nawait builder.sync(\"update\", \"./content/posts/existing-post.mdx\");\\nawait builder.sync(\"delete\", \"./content/posts/old-post.mdx\");\\n```',children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`await builder.sync(\"create\", \"./content/posts/new-post.mdx\");\nawait builder.sync(\"update\", \"./content/posts/existing-post.mdx\");\nawait builder.sync(\"delete\", \"./content/posts/old-post.mdx\");\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Options\"}),`\n`,(0,e.jsx)(n.h3,{children:\"Output Directory\"}),`\n`,(0,e.jsx)(n.p,{children:\"Specify a custom output directory:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:'```typescript\\nconst builder = await createBuilder(\"./content-collections.ts\", {\\n  outputDir: \"./.custom-output\",\\n});\\n```',children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`const builder = await createBuilder(\"./content-collections.ts\", {\n  outputDir: \"./.custom-output\",\n});\n`})}),`\n`,(0,e.jsxs)(n.p,{children:[\"Default: \",(0,e.jsx)(n.code,{children:\"./.content-collections/generated\"})]}),`\n`,(0,e.jsx)(n.h3,{children:\"Configuration Name\"}),`\n`,(0,e.jsx)(n.p,{children:\"Specify a custom config file name:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:'```typescript\\nconst builder = await createBuilder(\"./content-collections.ts\", {\\n  configName: \"content.config.ts\",\\n});\\n```',children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`const builder = await createBuilder(\"./content-collections.ts\", {\n  configName: \"content.config.ts\",\n});\n`})}),`\n`,(0,e.jsxs)(n.p,{children:[\"Default: \",(0,e.jsx)(n.code,{children:\"content-collections.ts\"})]}),`\n`,(0,e.jsx)(n.h2,{children:\"Example: CLI Tool\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { createBuilder } from \"notpadd-core\";\n\nasync function main() {\n  const builder = await createBuilder(\"./content-collections.ts\");\n\n  // Set up event listeners\n  builder.on(\"build:start\", () => {\n    console.log(\"Building collections...\");\n  });\n\n  builder.on(\"build:end\", ({ stats }) => {\n    console.log(\\`\\u2713 Built \\${stats.collections} collections with \\${stats.documents} documents\\`);\n  });\n\n  builder.on(\"watcher:file-changed\", ({ filePath, modification }) => {\n    console.log(\\`File \\${modification}: \\${filePath}\\`);\n  });\n\n  // Build once\n  await builder.build();\n\n  // Watch for changes\n  if (process.argv.includes(\"--watch\")) {\n    const watcher = await builder.watch();\n    console.log(\"Watching for changes...\");\n\n    // Graceful shutdown\n    process.on(\"SIGINT\", async () => {\n      await watcher.unsubscribe();\n      process.exit(0);\n    });\n  }\n}\n\nmain().catch(console.error);\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`import { createBuilder } from \"notpadd-core\";\n\nasync function main() {\n  const builder = await createBuilder(\"./content-collections.ts\");\n\n  // Set up event listeners\n  builder.on(\"build:start\", () => {\n    console.log(\"Building collections...\");\n  });\n\n  builder.on(\"build:end\", ({ stats }) => {\n    console.log(\\`\\u2713 Built \\${stats.collections} collections with \\${stats.documents} documents\\`);\n  });\n\n  builder.on(\"watcher:file-changed\", ({ filePath, modification }) => {\n    console.log(\\`File \\${modification}: \\${filePath}\\`);\n  });\n\n  // Build once\n  await builder.build();\n\n  // Watch for changes\n  if (process.argv.includes(\"--watch\")) {\n    const watcher = await builder.watch();\n    console.log(\"Watching for changes...\");\n\n    // Graceful shutdown\n    process.on(\"SIGINT\", async () => {\n      await watcher.unsubscribe();\n      process.exit(0);\n    });\n  }\n}\n\nmain().catch(console.error);\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Error Handling\"}),`\n`,(0,e.jsx)(n.p,{children:\"Builder methods can throw errors:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\ntry {\n  const builder = await createBuilder(\"./content-collections.ts\");\n  await builder.build();\n} catch (error) {\n  if (error instanceof ConfigurationError) {\n    console.error(\"Configuration error:\", error.message);\n  } else if (error instanceof NotpaddError) {\n    console.error(\"Notpadd error:\", error.message);\n  } else {\n    console.error(\"Unknown error:\", error);\n  }\n}\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`try {\n  const builder = await createBuilder(\"./content-collections.ts\");\n  await builder.build();\n} catch (error) {\n  if (error instanceof ConfigurationError) {\n    console.error(\"Configuration error:\", error.message);\n  } else if (error instanceof NotpaddError) {\n    console.error(\"Notpadd error:\", error.message);\n  } else {\n    console.error(\"Unknown error:\", error);\n  }\n}\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Best Practices\"}),`\n`,(0,e.jsxs)(n.ol,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Handle errors\"}),\": Wrap builder operations in try-catch\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Listen to events\"}),\": Use events for logging and monitoring\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Clean up watchers\"}),\": Always unsubscribe from watchers when done\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Use output directory\"}),\": Specify a custom output directory if needed\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Build before watch\"}),\": Build once before starting watch mode\"]}),`\n`]})]})}function h(r={}){let{wrapper:n}=r.components||{};return n?(0,e.jsx)(n,{...r,children:(0,e.jsx)(s,{...r})}):s(r)}return B(P);})();\n;return Component;"
  },
  {
    "title": "Collections",
    "description": "Define and manage content collections with schemas, parsers, and transforms",
    "content": "# Collections\n\nCollections are groups of content files that share a common schema and configuration.\n\n## Defining Collections\n\nUse `defineCollection()` to create a collection:\n\n```typescript\nimport { defineCollection } from \"notpadd-core\";\nimport { z } from \"zod\";\n\nconst posts = defineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  schema: z.object({\n    title: z.string(),\n    description: z.string(),\n  }),\n});\n```\n\n## Collection Options\n\n### `name` (required)\n\nA unique name for the collection. This is used for:\n\n- Type generation\n- Accessing collections in transform functions\n- Generated file paths\n\n### `directory` (required)\n\nThe directory path relative to your project root where content files are located.\n\n### `schema` (required)\n\nA Zod schema that defines the structure of your content metadata. The schema validates:\n\n- Frontmatter data (for frontmatter parser)\n- File data (for JSON/YAML parsers)\n- The final document structure\n\n### `parser` (optional)\n\nThe parser to use for reading files:\n\n- `\"frontmatter\"`: Parse YAML frontmatter with content (default)\n- `\"frontmatter-only\"`: Parse only frontmatter, no content\n- `\"json\"`: Parse JSON files\n- `\"yaml\"`: Parse YAML files\n- Custom parser: Define your own\n\n```typescript\ndefineCollection({\n  name: \"data\",\n  directory: \"content/data\",\n  parser: \"json\",\n  schema: z.object({\n    // ...\n  }),\n});\n```\n\n### `include` (required)\n\nGlob patterns for files to include in the collection:\n\n```typescript\ndefineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  include: \"**/*.mdx\", // Single pattern\n  // or\n  include: [\"**/*.mdx\", \"**/*.md\"], // Multiple patterns\n  schema: z.object({\n    // ...\n  }),\n});\n```\n\n### `exclude` (optional)\n\nGlob patterns for files to exclude:\n\n```typescript\ndefineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  include: \"**/*.mdx\",\n  exclude: [\"**/drafts/**\", \"**/*.draft.mdx\"],\n  schema: z.object({\n    // ...\n  }),\n});\n```\n\n### `transform` (optional)\n\nA function to transform documents after parsing:\n\n```typescript\ndefineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  schema: z.object({\n    title: z.string(),\n    authorId: z.string(),\n  }),\n  transform: async (doc, { documents, cache }) => {\n    // Access other collections\n    const authors = documents(\"authors\");\n    const author = authors.find((a) => a.id === doc.authorId);\n\n    // Use cache for expensive operations\n    const processedContent = await cache(\n      \"process-content\",\n      doc.content,\n      async () => {\n        return expensiveProcessing(doc.content);\n      }\n    );\n\n    return {\n      ...doc,\n      author,\n      processedContent,\n    };\n  },\n});\n```\n\n### `onSuccess` (optional)\n\nA callback function called after all documents are successfully processed:\n\n```typescript\ndefineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  schema: z.object({\n    // ...\n  }),\n  onSuccess: async (documents) => {\n    console.log(`Processed ${documents.length} posts`);\n  },\n});\n```\n\n## Document Structure\n\nEach document in a collection includes:\n\n- All fields from your schema\n- `content`: The file content (if parser has `hasContent: true`)\n- `_meta`: Metadata about the file:\n  - `filePath`: Full path to the file\n  - `fileName`: Just the filename\n  - `directory`: Directory containing the file\n  - `path`: URL-friendly path (without extension)\n  - `extension`: File extension\n\n## Accessing Collections\n\nIn transform functions, you can access other collections:\n\n```typescript\ntransform: async (doc, { documents }) => {\n  // Get all documents from another collection\n  const authors = documents(\"authors\");\n\n  // Find a specific author\n  const author = authors.find((a) => a.id === doc.authorId);\n\n  return {\n    ...doc,\n    author,\n  };\n},\n```\n\n## Skipping Documents\n\nYou can conditionally skip documents in transform functions:\n\n```typescript\ntransform: async (doc, { skip }) => {\n  if (!doc.published) {\n    return skip(\"Document is not published\");\n  }\n\n  return doc;\n},\n```\n\n## Type Generation\n\nCollections automatically generate TypeScript types. Access them using `GetTypeByName`:\n\n```typescript\nimport type { GetTypeByName } from \"notpadd-core\";\nimport config from \"./content-collections\";\n\ntype Post = GetTypeByName<typeof config, \"posts\">;\n```",
    "_meta": {
      "filePath": "core/core-collections.mdx",
      "fileName": "core-collections.mdx",
      "directory": "core",
      "extension": "mdx",
      "path": "core/core-collections"
    },
    "headings": [
      {
        "level": 1,
        "text": "Collections",
        "slug": "collections"
      },
      {
        "level": 2,
        "text": "Defining Collections",
        "slug": "defining-collections"
      },
      {
        "level": 2,
        "text": "Collection Options",
        "slug": "collection-options"
      },
      {
        "level": 3,
        "text": "`name` (required)",
        "slug": "name-required"
      },
      {
        "level": 3,
        "text": "`directory` (required)",
        "slug": "directory-required"
      },
      {
        "level": 3,
        "text": "`schema` (required)",
        "slug": "schema-required"
      },
      {
        "level": 3,
        "text": "`parser` (optional)",
        "slug": "parser-optional"
      },
      {
        "level": 3,
        "text": "`include` (required)",
        "slug": "include-required"
      },
      {
        "level": 3,
        "text": "`exclude` (optional)",
        "slug": "exclude-optional"
      },
      {
        "level": 3,
        "text": "`transform` (optional)",
        "slug": "transform-optional"
      },
      {
        "level": 3,
        "text": "`onSuccess` (optional)",
        "slug": "onsuccess-optional"
      },
      {
        "level": 2,
        "text": "Document Structure",
        "slug": "document-structure"
      },
      {
        "level": 2,
        "text": "Accessing Collections",
        "slug": "accessing-collections"
      },
      {
        "level": 2,
        "text": "Skipping Documents",
        "slug": "skipping-documents"
      },
      {
        "level": 2,
        "text": "Type Generation",
        "slug": "type-generation"
      }
    ],
    "mdx": "var Component=(()=>{var p=Object.create;var r=Object.defineProperty;var u=Object.getOwnPropertyDescriptor;var m=Object.getOwnPropertyNames;var f=Object.getPrototypeOf,y=Object.prototype.hasOwnProperty;var g=(t,n)=>()=>(n||t((n={exports:{}}).exports,n),n.exports),C=(t,n)=>{for(var c in n)r(t,c,{get:n[c],enumerable:!0})},s=(t,n,c,i)=>{if(n&&typeof n==\"object\"||typeof n==\"function\")for(let o of m(n))!y.call(t,o)&&o!==c&&r(t,o,{get:()=>n[o],enumerable:!(i=u(n,o))||i.enumerable});return t};var x=(t,n,c)=>(c=t!=null?p(f(t)):{},s(n||!t||!t.__esModule?r(c,\"default\",{value:t,enumerable:!0}):c,t)),z=t=>s(r({},\"__esModule\",{value:!0}),t);var d=g((N,l)=>{l.exports=_jsx_runtime});var j={};C(j,{default:()=>h});var e=x(d());function a(t){let n={code:\"code\",h1:\"h1\",h2:\"h2\",h3:\"h3\",li:\"li\",p:\"p\",pre:\"pre\",ul:\"ul\",...t.components};return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(n.h1,{children:\"Collections\"}),`\n`,(0,e.jsx)(n.p,{children:\"Collections are groups of content files that share a common schema and configuration.\"}),`\n`,(0,e.jsx)(n.h2,{children:\"Defining Collections\"}),`\n`,(0,e.jsxs)(n.p,{children:[\"Use \",(0,e.jsx)(n.code,{children:\"defineCollection()\"}),\" to create a collection:\"]}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { defineCollection } from \"notpadd-core\";\nimport { z } from \"zod\";\n\nconst posts = defineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  schema: z.object({\n    title: z.string(),\n    description: z.string(),\n  }),\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`import { defineCollection } from \"notpadd-core\";\nimport { z } from \"zod\";\n\nconst posts = defineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  schema: z.object({\n    title: z.string(),\n    description: z.string(),\n  }),\n});\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Collection Options\"}),`\n`,(0,e.jsxs)(n.h3,{children:[(0,e.jsx)(n.code,{children:\"name\"}),\" (required)\"]}),`\n`,(0,e.jsx)(n.p,{children:\"A unique name for the collection. This is used for:\"}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsx)(n.li,{children:\"Type generation\"}),`\n`,(0,e.jsx)(n.li,{children:\"Accessing collections in transform functions\"}),`\n`,(0,e.jsx)(n.li,{children:\"Generated file paths\"}),`\n`]}),`\n`,(0,e.jsxs)(n.h3,{children:[(0,e.jsx)(n.code,{children:\"directory\"}),\" (required)\"]}),`\n`,(0,e.jsx)(n.p,{children:\"The directory path relative to your project root where content files are located.\"}),`\n`,(0,e.jsxs)(n.h3,{children:[(0,e.jsx)(n.code,{children:\"schema\"}),\" (required)\"]}),`\n`,(0,e.jsx)(n.p,{children:\"A Zod schema that defines the structure of your content metadata. The schema validates:\"}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsx)(n.li,{children:\"Frontmatter data (for frontmatter parser)\"}),`\n`,(0,e.jsx)(n.li,{children:\"File data (for JSON/YAML parsers)\"}),`\n`,(0,e.jsx)(n.li,{children:\"The final document structure\"}),`\n`]}),`\n`,(0,e.jsxs)(n.h3,{children:[(0,e.jsx)(n.code,{children:\"parser\"}),\" (optional)\"]}),`\n`,(0,e.jsx)(n.p,{children:\"The parser to use for reading files:\"}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:'\"frontmatter\"'}),\": Parse YAML frontmatter with content (default)\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:'\"frontmatter-only\"'}),\": Parse only frontmatter, no content\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:'\"json\"'}),\": Parse JSON files\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:'\"yaml\"'}),\": Parse YAML files\"]}),`\n`,(0,e.jsx)(n.li,{children:\"Custom parser: Define your own\"}),`\n`]}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\ndefineCollection({\n  name: \"data\",\n  directory: \"content/data\",\n  parser: \"json\",\n  schema: z.object({\n    // ...\n  }),\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`defineCollection({\n  name: \"data\",\n  directory: \"content/data\",\n  parser: \"json\",\n  schema: z.object({\n    // ...\n  }),\n});\n`})}),`\n`,(0,e.jsxs)(n.h3,{children:[(0,e.jsx)(n.code,{children:\"include\"}),\" (required)\"]}),`\n`,(0,e.jsx)(n.p,{children:\"Glob patterns for files to include in the collection:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\ndefineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  include: \"**/*.mdx\", // Single pattern\n  // or\n  include: [\"**/*.mdx\", \"**/*.md\"], // Multiple patterns\n  schema: z.object({\n    // ...\n  }),\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`defineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  include: \"**/*.mdx\", // Single pattern\n  // or\n  include: [\"**/*.mdx\", \"**/*.md\"], // Multiple patterns\n  schema: z.object({\n    // ...\n  }),\n});\n`})}),`\n`,(0,e.jsxs)(n.h3,{children:[(0,e.jsx)(n.code,{children:\"exclude\"}),\" (optional)\"]}),`\n`,(0,e.jsx)(n.p,{children:\"Glob patterns for files to exclude:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\ndefineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  include: \"**/*.mdx\",\n  exclude: [\"**/drafts/**\", \"**/*.draft.mdx\"],\n  schema: z.object({\n    // ...\n  }),\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`defineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  include: \"**/*.mdx\",\n  exclude: [\"**/drafts/**\", \"**/*.draft.mdx\"],\n  schema: z.object({\n    // ...\n  }),\n});\n`})}),`\n`,(0,e.jsxs)(n.h3,{children:[(0,e.jsx)(n.code,{children:\"transform\"}),\" (optional)\"]}),`\n`,(0,e.jsx)(n.p,{children:\"A function to transform documents after parsing:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\ndefineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  schema: z.object({\n    title: z.string(),\n    authorId: z.string(),\n  }),\n  transform: async (doc, { documents, cache }) => {\n    // Access other collections\n    const authors = documents(\"authors\");\n    const author = authors.find((a) => a.id === doc.authorId);\n\n    // Use cache for expensive operations\n    const processedContent = await cache(\n      \"process-content\",\n      doc.content,\n      async () => {\n        return expensiveProcessing(doc.content);\n      }\n    );\n\n    return {\n      ...doc,\n      author,\n      processedContent,\n    };\n  },\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`defineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  schema: z.object({\n    title: z.string(),\n    authorId: z.string(),\n  }),\n  transform: async (doc, { documents, cache }) => {\n    // Access other collections\n    const authors = documents(\"authors\");\n    const author = authors.find((a) => a.id === doc.authorId);\n\n    // Use cache for expensive operations\n    const processedContent = await cache(\n      \"process-content\",\n      doc.content,\n      async () => {\n        return expensiveProcessing(doc.content);\n      }\n    );\n\n    return {\n      ...doc,\n      author,\n      processedContent,\n    };\n  },\n});\n`})}),`\n`,(0,e.jsxs)(n.h3,{children:[(0,e.jsx)(n.code,{children:\"onSuccess\"}),\" (optional)\"]}),`\n`,(0,e.jsx)(n.p,{children:\"A callback function called after all documents are successfully processed:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\ndefineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  schema: z.object({\n    // ...\n  }),\n  onSuccess: async (documents) => {\n    console.log(\\`Processed \\${documents.length} posts\\`);\n  },\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`defineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  schema: z.object({\n    // ...\n  }),\n  onSuccess: async (documents) => {\n    console.log(\\`Processed \\${documents.length} posts\\`);\n  },\n});\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Document Structure\"}),`\n`,(0,e.jsx)(n.p,{children:\"Each document in a collection includes:\"}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsx)(n.li,{children:\"All fields from your schema\"}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"content\"}),\": The file content (if parser has \",(0,e.jsx)(n.code,{children:\"hasContent: true\"}),\")\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"_meta\"}),\": Metadata about the file:\",`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"filePath\"}),\": Full path to the file\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"fileName\"}),\": Just the filename\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"directory\"}),\": Directory containing the file\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"path\"}),\": URL-friendly path (without extension)\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"extension\"}),\": File extension\"]}),`\n`]}),`\n`]}),`\n`]}),`\n`,(0,e.jsx)(n.h2,{children:\"Accessing Collections\"}),`\n`,(0,e.jsx)(n.p,{children:\"In transform functions, you can access other collections:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\ntransform: async (doc, { documents }) => {\n  // Get all documents from another collection\n  const authors = documents(\"authors\");\n\n  // Find a specific author\n  const author = authors.find((a) => a.id === doc.authorId);\n\n  return {\n    ...doc,\n    author,\n  };\n},\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`transform: async (doc, { documents }) => {\n  // Get all documents from another collection\n  const authors = documents(\"authors\");\n\n  // Find a specific author\n  const author = authors.find((a) => a.id === doc.authorId);\n\n  return {\n    ...doc,\n    author,\n  };\n},\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Skipping Documents\"}),`\n`,(0,e.jsx)(n.p,{children:\"You can conditionally skip documents in transform functions:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\ntransform: async (doc, { skip }) => {\n  if (!doc.published) {\n    return skip(\"Document is not published\");\n  }\n\n  return doc;\n},\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`transform: async (doc, { skip }) => {\n  if (!doc.published) {\n    return skip(\"Document is not published\");\n  }\n\n  return doc;\n},\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Type Generation\"}),`\n`,(0,e.jsxs)(n.p,{children:[\"Collections automatically generate TypeScript types. Access them using \",(0,e.jsx)(n.code,{children:\"GetTypeByName\"}),\":\"]}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:'```typescript\\nimport type { GetTypeByName } from \"notpadd-core\";\\nimport config from \"./content-collections\";\\n\\ntype Post = GetTypeByName<typeof config, \"posts\">;\\n```',children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`import type { GetTypeByName } from \"notpadd-core\";\nimport config from \"./content-collections\";\n\ntype Post = GetTypeByName<typeof config, \"posts\">;\n`})})]})}function h(t={}){let{wrapper:n}=t.components||{};return n?(0,e.jsx)(n,{...t,children:(0,e.jsx)(a,{...t})}):a(t)}return z(j);})();\n;return Component;"
  },
  {
    "title": "Configuration",
    "description": "Learn how to configure notpadd-core with collections, caching, and Notpadd API integration",
    "content": "# Configuration\n\nThe configuration file defines your collections and global settings for Notpadd Core.\n\n## Configuration File\n\nCreate a `content-collections.ts` file in your project root:\n\n```typescript\nimport { defineConfig, defineCollection } from \"notpadd-core\";\nimport { z } from \"zod\";\n\nexport default defineConfig({\n  collections: [\n    // Your collections here\n  ],\n  cache: \"file\", // Optional: \"memory\" | \"file\" | \"none\"\n  notpadd: {\n    // Optional: Notpadd API configuration\n    sk: \"your-secret-key\",\n    pk: \"your-public-key\",\n    orgID: \"your-organization-id\",\n    directory: \"notpadd\", // Optional, defaults to \"notpadd\"\n    query: \"all\", // Optional: \"all\" | \"published\" | \"draft\"\n  },\n});\n```\n\n## Configuration Options\n\n### `collections`\n\nAn array of collection definitions. Each collection must be created using `defineCollection()`.\n\n### `cache`\n\nControls how caching is handled during builds:\n\n- `\"memory\"`: Cache in memory (fast, but lost on restart)\n- `\"file\"`: Cache to disk (persists across builds)\n- `\"none\"`: No caching (slower, but always fresh)\n\nDefault: `\"file\"`\n\n### `notpadd`\n\nOptional configuration for fetching content from the Notpadd API.\n\n#### `sk` (required)\n\nYour Notpadd secret key for API authentication.\n\n#### `pk` (required)\n\nYour Notpadd public key for API authentication.\n\n#### `orgID` (required)\n\nYour Notpadd organization ID.\n\n#### `directory` (optional)\n\nThe directory where MDX files fetched from Notpadd will be stored. Defaults to `\"notpadd\"` or the first collection's directory.\n\n#### `query` (optional)\n\nControls which articles to fetch from Notpadd:\n\n- `\"all\"`: Fetch all articles (default)\n- `\"published\"`: Fetch only published articles\n- `\"draft\"`: Fetch only draft articles\n\n## Type Safety\n\nThe `defineConfig` function provides full TypeScript type inference. Your collections will be typed based on their schemas and transforms.\n\n## Example\n\n```typescript\nimport { defineConfig, defineCollection } from \"notpadd-core\";\nimport { z } from \"zod\";\n\nexport default defineConfig({\n  collections: [\n    defineCollection({\n      name: \"blog\",\n      directory: \"content/blog\",\n      schema: z.object({\n        title: z.string(),\n        date: z.string(),\n        tags: z.array(z.string()),\n      }),\n    }),\n  ],\n  cache: \"file\",\n  notpadd: {\n    sk: process.env.NOTPADD_SK!,\n    pk: process.env.NOTPADD_PK!,\n    orgID: process.env.NOTPADD_ORG_ID!,\n    query: \"published\",\n  },\n});\n```",
    "_meta": {
      "filePath": "core/core-configuration.mdx",
      "fileName": "core-configuration.mdx",
      "directory": "core",
      "extension": "mdx",
      "path": "core/core-configuration"
    },
    "headings": [
      {
        "level": 1,
        "text": "Configuration",
        "slug": "configuration"
      },
      {
        "level": 2,
        "text": "Configuration File",
        "slug": "configuration-file"
      },
      {
        "level": 2,
        "text": "Configuration Options",
        "slug": "configuration-options"
      },
      {
        "level": 3,
        "text": "`collections`",
        "slug": "collections"
      },
      {
        "level": 3,
        "text": "`cache`",
        "slug": "cache"
      },
      {
        "level": 3,
        "text": "`notpadd`",
        "slug": "notpadd"
      },
      {
        "level": 4,
        "text": "`sk` (required)",
        "slug": "sk-required"
      },
      {
        "level": 4,
        "text": "`pk` (required)",
        "slug": "pk-required"
      },
      {
        "level": 4,
        "text": "`orgID` (required)",
        "slug": "orgid-required"
      },
      {
        "level": 4,
        "text": "`directory` (optional)",
        "slug": "directory-optional"
      },
      {
        "level": 4,
        "text": "`query` (optional)",
        "slug": "query-optional"
      },
      {
        "level": 2,
        "text": "Type Safety",
        "slug": "type-safety"
      },
      {
        "level": 2,
        "text": "Example",
        "slug": "example"
      }
    ],
    "mdx": "var Component=(()=>{var p=Object.create;var t=Object.defineProperty;var f=Object.getOwnPropertyDescriptor;var u=Object.getOwnPropertyNames;var g=Object.getPrototypeOf,y=Object.prototype.hasOwnProperty;var m=(o,n)=>()=>(n||o((n={exports:{}}).exports,n),n.exports),C=(o,n)=>{for(var i in n)t(o,i,{get:n[i],enumerable:!0})},l=(o,n,i,c)=>{if(n&&typeof n==\"object\"||typeof n==\"function\")for(let r of u(n))!y.call(o,r)&&r!==i&&t(o,r,{get:()=>n[r],enumerable:!(c=f(n,r))||c.enumerable});return o};var D=(o,n,i)=>(i=o!=null?p(g(o)):{},l(n||!o||!o.__esModule?t(i,\"default\",{value:o,enumerable:!0}):i,o)),b=o=>l(t({},\"__esModule\",{value:!0}),o);var a=m((O,d)=>{d.exports=_jsx_runtime});var z={};C(z,{default:()=>s});var e=D(a());function h(o){let n={code:\"code\",h1:\"h1\",h2:\"h2\",h3:\"h3\",h4:\"h4\",li:\"li\",p:\"p\",pre:\"pre\",ul:\"ul\",...o.components};return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(n.h1,{children:\"Configuration\"}),`\n`,(0,e.jsx)(n.p,{children:\"The configuration file defines your collections and global settings for Notpadd Core.\"}),`\n`,(0,e.jsx)(n.h2,{children:\"Configuration File\"}),`\n`,(0,e.jsxs)(n.p,{children:[\"Create a \",(0,e.jsx)(n.code,{children:\"content-collections.ts\"}),\" file in your project root:\"]}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { defineConfig, defineCollection } from \"notpadd-core\";\nimport { z } from \"zod\";\n\nexport default defineConfig({\n  collections: [\n    // Your collections here\n  ],\n  cache: \"file\", // Optional: \"memory\" | \"file\" | \"none\"\n  notpadd: {\n    // Optional: Notpadd API configuration\n    sk: \"your-secret-key\",\n    pk: \"your-public-key\",\n    orgID: \"your-organization-id\",\n    directory: \"notpadd\", // Optional, defaults to \"notpadd\"\n    query: \"all\", // Optional: \"all\" | \"published\" | \"draft\"\n  },\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`import { defineConfig, defineCollection } from \"notpadd-core\";\nimport { z } from \"zod\";\n\nexport default defineConfig({\n  collections: [\n    // Your collections here\n  ],\n  cache: \"file\", // Optional: \"memory\" | \"file\" | \"none\"\n  notpadd: {\n    // Optional: Notpadd API configuration\n    sk: \"your-secret-key\",\n    pk: \"your-public-key\",\n    orgID: \"your-organization-id\",\n    directory: \"notpadd\", // Optional, defaults to \"notpadd\"\n    query: \"all\", // Optional: \"all\" | \"published\" | \"draft\"\n  },\n});\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Configuration Options\"}),`\n`,(0,e.jsx)(n.h3,{children:(0,e.jsx)(n.code,{children:\"collections\"})}),`\n`,(0,e.jsxs)(n.p,{children:[\"An array of collection definitions. Each collection must be created using \",(0,e.jsx)(n.code,{children:\"defineCollection()\"}),\".\"]}),`\n`,(0,e.jsx)(n.h3,{children:(0,e.jsx)(n.code,{children:\"cache\"})}),`\n`,(0,e.jsx)(n.p,{children:\"Controls how caching is handled during builds:\"}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:'\"memory\"'}),\": Cache in memory (fast, but lost on restart)\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:'\"file\"'}),\": Cache to disk (persists across builds)\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:'\"none\"'}),\": No caching (slower, but always fresh)\"]}),`\n`]}),`\n`,(0,e.jsxs)(n.p,{children:[\"Default: \",(0,e.jsx)(n.code,{children:'\"file\"'})]}),`\n`,(0,e.jsx)(n.h3,{children:(0,e.jsx)(n.code,{children:\"notpadd\"})}),`\n`,(0,e.jsx)(n.p,{children:\"Optional configuration for fetching content from the Notpadd API.\"}),`\n`,(0,e.jsxs)(n.h4,{children:[(0,e.jsx)(n.code,{children:\"sk\"}),\" (required)\"]}),`\n`,(0,e.jsx)(n.p,{children:\"Your Notpadd secret key for API authentication.\"}),`\n`,(0,e.jsxs)(n.h4,{children:[(0,e.jsx)(n.code,{children:\"pk\"}),\" (required)\"]}),`\n`,(0,e.jsx)(n.p,{children:\"Your Notpadd public key for API authentication.\"}),`\n`,(0,e.jsxs)(n.h4,{children:[(0,e.jsx)(n.code,{children:\"orgID\"}),\" (required)\"]}),`\n`,(0,e.jsx)(n.p,{children:\"Your Notpadd organization ID.\"}),`\n`,(0,e.jsxs)(n.h4,{children:[(0,e.jsx)(n.code,{children:\"directory\"}),\" (optional)\"]}),`\n`,(0,e.jsxs)(n.p,{children:[\"The directory where MDX files fetched from Notpadd will be stored. Defaults to \",(0,e.jsx)(n.code,{children:'\"notpadd\"'}),\" or the first collection's directory.\"]}),`\n`,(0,e.jsxs)(n.h4,{children:[(0,e.jsx)(n.code,{children:\"query\"}),\" (optional)\"]}),`\n`,(0,e.jsx)(n.p,{children:\"Controls which articles to fetch from Notpadd:\"}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:'\"all\"'}),\": Fetch all articles (default)\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:'\"published\"'}),\": Fetch only published articles\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:'\"draft\"'}),\": Fetch only draft articles\"]}),`\n`]}),`\n`,(0,e.jsx)(n.h2,{children:\"Type Safety\"}),`\n`,(0,e.jsxs)(n.p,{children:[\"The \",(0,e.jsx)(n.code,{children:\"defineConfig\"}),\" function provides full TypeScript type inference. Your collections will be typed based on their schemas and transforms.\"]}),`\n`,(0,e.jsx)(n.h2,{children:\"Example\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { defineConfig, defineCollection } from \"notpadd-core\";\nimport { z } from \"zod\";\n\nexport default defineConfig({\n  collections: [\n    defineCollection({\n      name: \"blog\",\n      directory: \"content/blog\",\n      schema: z.object({\n        title: z.string(),\n        date: z.string(),\n        tags: z.array(z.string()),\n      }),\n    }),\n  ],\n  cache: \"file\",\n  notpadd: {\n    sk: process.env.NOTPADD_SK!,\n    pk: process.env.NOTPADD_PK!,\n    orgID: process.env.NOTPADD_ORG_ID!,\n    query: \"published\",\n  },\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`import { defineConfig, defineCollection } from \"notpadd-core\";\nimport { z } from \"zod\";\n\nexport default defineConfig({\n  collections: [\n    defineCollection({\n      name: \"blog\",\n      directory: \"content/blog\",\n      schema: z.object({\n        title: z.string(),\n        date: z.string(),\n        tags: z.array(z.string()),\n      }),\n    }),\n  ],\n  cache: \"file\",\n  notpadd: {\n    sk: process.env.NOTPADD_SK!,\n    pk: process.env.NOTPADD_PK!,\n    orgID: process.env.NOTPADD_ORG_ID!,\n    query: \"published\",\n  },\n});\n`})})]})}function s(o={}){let{wrapper:n}=o.components||{};return n?(0,e.jsx)(n,{...o,children:(0,e.jsx)(h,{...o})}):h(o)}return b(z);})();\n;return Component;"
  },
  {
    "title": "Core Package Overview",
    "description": "Introduction to notpadd-core, a powerful content collection system with full TypeScript support",
    "content": "# Core Package Overview\n\nThe `notpadd-core` package is the foundation of Notpadd, providing a powerful content collection system built on top of content-collections core. It enables you to collect, parse, transform, and manage content files with full TypeScript support.\n\n## Features\n\n- **Type Safe Collections**: Define collections with Zod schemas for full type safety\n- **Flexible Parsers**: Support for frontmatter, JSON, YAML, and custom parsers\n- **Transform Functions**: Transform documents with access to other collections and caching\n- **File Watching**: Automatic rebuilds on file changes during development\n- **Notpadd Integration**: Fetch and sync content from Notpadd API\n- **Event System**: Comprehensive event emission for build lifecycle hooks\n\n## Installation\n\n```bash\nnpm install notpadd-core\n```\n\n## Basic Usage\n\n```typescript\nimport { defineConfig, defineCollection } from \"notpadd-core\";\nimport { z } from \"zod\";\n\nconst config = defineConfig({\n  collections: [\n    defineCollection({\n      name: \"posts\",\n      directory: \"content/posts\",\n      schema: z.object({\n        title: z.string(),\n        description: z.string(),\n        published: z.boolean(),\n      }),\n    }),\n  ],\n});\n```\n\n## Core Concepts\n\n### Collections\n\nCollections are groups of content files that share a common schema and configuration. Each collection defines:\n- A name for type generation\n- A directory where content files are located\n- A schema for validation\n- Optional parser, transform, and filter options\n\n### Schemas\n\nSchemas use Zod to define the structure and validation rules for your content. The schema is used to:\n- Validate frontmatter and metadata\n- Generate TypeScript types\n- Ensure data consistency across documents\n\n### Parsers\n\nParsers extract data from content files. Supported parsers include:\n- `frontmatter`: Extracts YAML frontmatter and content\n- `frontmatter-only`: Extracts only frontmatter\n- `json`: Parses JSON files\n- `yaml`: Parses YAML files\n- Custom parsers: Define your own parsing logic\n\n### Transformers\n\nTransform functions allow you to modify documents after parsing. They have access to:\n- Other collections in your configuration\n- A caching mechanism for expensive operations\n- The ability to skip documents conditionally\n\n## Next Steps\n\n- Learn about [Configuration](/docs/core-configuration)\n- Explore [Collections](/docs/core-collections)\n- Understand [Schemas](/docs/core-schemas)\n- See [Parsers](/docs/core-parsers)\n- Discover [Transformers](/docs/core-transformers)",
    "_meta": {
      "filePath": "core/core-overview.mdx",
      "fileName": "core-overview.mdx",
      "directory": "core",
      "extension": "mdx",
      "path": "core/core-overview"
    },
    "headings": [
      {
        "level": 1,
        "text": "Core Package Overview",
        "slug": "core-package-overview"
      },
      {
        "level": 2,
        "text": "Features",
        "slug": "features"
      },
      {
        "level": 2,
        "text": "Installation",
        "slug": "installation"
      },
      {
        "level": 2,
        "text": "Basic Usage",
        "slug": "basic-usage"
      },
      {
        "level": 2,
        "text": "Core Concepts",
        "slug": "core-concepts"
      },
      {
        "level": 3,
        "text": "Collections",
        "slug": "collections"
      },
      {
        "level": 3,
        "text": "Schemas",
        "slug": "schemas"
      },
      {
        "level": 3,
        "text": "Parsers",
        "slug": "parsers"
      },
      {
        "level": 3,
        "text": "Transformers",
        "slug": "transformers"
      },
      {
        "level": 2,
        "text": "Next Steps",
        "slug": "next-steps"
      }
    ],
    "mdx": "var Component=(()=>{var f=Object.create;var t=Object.defineProperty;var p=Object.getOwnPropertyDescriptor;var m=Object.getOwnPropertyNames;var u=Object.getPrototypeOf,g=Object.prototype.hasOwnProperty;var y=(o,n)=>()=>(n||o((n={exports:{}}).exports,n),n.exports),C=(o,n)=>{for(var r in n)t(o,r,{get:n[r],enumerable:!0})},l=(o,n,r,c)=>{if(n&&typeof n==\"object\"||typeof n==\"function\")for(let i of m(n))!g.call(o,i)&&i!==r&&t(o,i,{get:()=>n[i],enumerable:!(c=p(n,i))||c.enumerable});return o};var b=(o,n,r)=>(r=o!=null?f(u(o)):{},l(n||!o||!o.__esModule?t(r,\"default\",{value:o,enumerable:!0}):r,o)),x=o=>l(t({},\"__esModule\",{value:!0}),o);var a=y((z,s)=>{s.exports=_jsx_runtime});var S={};C(S,{default:()=>h});var e=b(a());function d(o){let n={a:\"a\",code:\"code\",h1:\"h1\",h2:\"h2\",h3:\"h3\",li:\"li\",p:\"p\",pre:\"pre\",strong:\"strong\",ul:\"ul\",...o.components};return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(n.h1,{children:\"Core Package Overview\"}),`\n`,(0,e.jsxs)(n.p,{children:[\"The \",(0,e.jsx)(n.code,{children:\"notpadd-core\"}),\" package is the foundation of Notpadd, providing a powerful content collection system built on top of content-collections core. It enables you to collect, parse, transform, and manage content files with full TypeScript support.\"]}),`\n`,(0,e.jsx)(n.h2,{children:\"Features\"}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Type Safe Collections\"}),\": Define collections with Zod schemas for full type safety\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Flexible Parsers\"}),\": Support for frontmatter, JSON, YAML, and custom parsers\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Transform Functions\"}),\": Transform documents with access to other collections and caching\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"File Watching\"}),\": Automatic rebuilds on file changes during development\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Notpadd Integration\"}),\": Fetch and sync content from Notpadd API\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Event System\"}),\": Comprehensive event emission for build lifecycle hooks\"]}),`\n`]}),`\n`,(0,e.jsx)(n.h2,{children:\"Installation\"}),`\n`,(0,e.jsx)(n.pre,{language:\"bash\",meta:\"\",code:\"```bash\\nnpm install notpadd-core\\n```\",children:(0,e.jsx)(n.code,{className:\"language-bash\",children:`npm install notpadd-core\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Basic Usage\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { defineConfig, defineCollection } from \"notpadd-core\";\nimport { z } from \"zod\";\n\nconst config = defineConfig({\n  collections: [\n    defineCollection({\n      name: \"posts\",\n      directory: \"content/posts\",\n      schema: z.object({\n        title: z.string(),\n        description: z.string(),\n        published: z.boolean(),\n      }),\n    }),\n  ],\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`import { defineConfig, defineCollection } from \"notpadd-core\";\nimport { z } from \"zod\";\n\nconst config = defineConfig({\n  collections: [\n    defineCollection({\n      name: \"posts\",\n      directory: \"content/posts\",\n      schema: z.object({\n        title: z.string(),\n        description: z.string(),\n        published: z.boolean(),\n      }),\n    }),\n  ],\n});\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Core Concepts\"}),`\n`,(0,e.jsx)(n.h3,{children:\"Collections\"}),`\n`,(0,e.jsx)(n.p,{children:\"Collections are groups of content files that share a common schema and configuration. Each collection defines:\"}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsx)(n.li,{children:\"A name for type generation\"}),`\n`,(0,e.jsx)(n.li,{children:\"A directory where content files are located\"}),`\n`,(0,e.jsx)(n.li,{children:\"A schema for validation\"}),`\n`,(0,e.jsx)(n.li,{children:\"Optional parser, transform, and filter options\"}),`\n`]}),`\n`,(0,e.jsx)(n.h3,{children:\"Schemas\"}),`\n`,(0,e.jsx)(n.p,{children:\"Schemas use Zod to define the structure and validation rules for your content. The schema is used to:\"}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsx)(n.li,{children:\"Validate frontmatter and metadata\"}),`\n`,(0,e.jsx)(n.li,{children:\"Generate TypeScript types\"}),`\n`,(0,e.jsx)(n.li,{children:\"Ensure data consistency across documents\"}),`\n`]}),`\n`,(0,e.jsx)(n.h3,{children:\"Parsers\"}),`\n`,(0,e.jsx)(n.p,{children:\"Parsers extract data from content files. Supported parsers include:\"}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"frontmatter\"}),\": Extracts YAML frontmatter and content\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"frontmatter-only\"}),\": Extracts only frontmatter\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"json\"}),\": Parses JSON files\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"yaml\"}),\": Parses YAML files\"]}),`\n`,(0,e.jsx)(n.li,{children:\"Custom parsers: Define your own parsing logic\"}),`\n`]}),`\n`,(0,e.jsx)(n.h3,{children:\"Transformers\"}),`\n`,(0,e.jsx)(n.p,{children:\"Transform functions allow you to modify documents after parsing. They have access to:\"}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsx)(n.li,{children:\"Other collections in your configuration\"}),`\n`,(0,e.jsx)(n.li,{children:\"A caching mechanism for expensive operations\"}),`\n`,(0,e.jsx)(n.li,{children:\"The ability to skip documents conditionally\"}),`\n`]}),`\n`,(0,e.jsx)(n.h2,{children:\"Next Steps\"}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[\"Learn about \",(0,e.jsx)(n.a,{href:\"/docs/core-configuration\",children:\"Configuration\"})]}),`\n`,(0,e.jsxs)(n.li,{children:[\"Explore \",(0,e.jsx)(n.a,{href:\"/docs/core-collections\",children:\"Collections\"})]}),`\n`,(0,e.jsxs)(n.li,{children:[\"Understand \",(0,e.jsx)(n.a,{href:\"/docs/core-schemas\",children:\"Schemas\"})]}),`\n`,(0,e.jsxs)(n.li,{children:[\"See \",(0,e.jsx)(n.a,{href:\"/docs/core-parsers\",children:\"Parsers\"})]}),`\n`,(0,e.jsxs)(n.li,{children:[\"Discover \",(0,e.jsx)(n.a,{href:\"/docs/core-transformers\",children:\"Transformers\"})]}),`\n`]})]})}function h(o={}){let{wrapper:n}=o.components||{};return n?(0,e.jsx)(n,{...o,children:(0,e.jsx)(d,{...o})}):d(o)}return x(S);})();\n;return Component;"
  },
  {
    "title": "Parsers",
    "description": "Extract data from content files using built-in parsers or define custom parsers for your needs",
    "content": "# Parsers\n\nParsers extract data from content files. Notpadd Core supports multiple built-in parsers and allows you to define custom parsers.\n\n## Built-in Parsers\n\n### `frontmatter` (default)\n\nParses YAML frontmatter and extracts both metadata and content:\n\n```typescript\ndefineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  parser: \"frontmatter\",\n  schema: z.object({\n    title: z.string(),\n  }),\n});\n```\n\n**Input file:**\n```markdown\n---\ntitle: My Post\n---\n\nThis is the content.\n```\n\n**Result:**\n```typescript\n{\n  title: \"My Post\",\n  content: \"This is the content.\",\n  _meta: { ... }\n}\n```\n\n### `frontmatter-only`\n\nParses only the frontmatter, ignoring content:\n\n```typescript\ndefineCollection({\n  name: \"config\",\n  directory: \"content/config\",\n  parser: \"frontmatter-only\",\n  schema: z.object({\n    title: z.string(),\n  }),\n});\n```\n\n**Input file:**\n```markdown\n---\ntitle: Config\n---\n\nThis content is ignored.\n```\n\n**Result:**\n```typescript\n{\n  title: \"Config\",\n  _meta: { ... }\n}\n```\n\n### `json`\n\nParses JSON files:\n\n```typescript\ndefineCollection({\n  name: \"data\",\n  directory: \"content/data\",\n  parser: \"json\",\n  schema: z.object({\n    name: z.string(),\n    value: z.number(),\n  }),\n});\n```\n\n**Input file (`data.json`):**\n```json\n{\n  \"name\": \"Example\",\n  \"value\": 42\n}\n```\n\n**Result:**\n```typescript\n{\n  name: \"Example\",\n  value: 42,\n  _meta: { ... }\n}\n```\n\n### `yaml`\n\nParses YAML files:\n\n```typescript\ndefineCollection({\n  name: \"settings\",\n  directory: \"content/settings\",\n  parser: \"yaml\",\n  schema: z.object({\n    theme: z.string(),\n    language: z.string(),\n  }),\n});\n```\n\n**Input file (`settings.yaml`):**\n```yaml\ntheme: dark\nlanguage: en\n```\n\n**Result:**\n```typescript\n{\n  theme: \"dark\",\n  language: \"en\",\n  _meta: { ... }\n}\n```\n\n## Custom Parsers\n\nDefine your own parser using `defineParser()`:\n\n```typescript\nimport { defineParser, defineCollection } from \"notpadd-core\";\n\nconst markdownParser = defineParser({\n  hasContent: true,\n  parse: async (content: string) => {\n    // Custom parsing logic\n    const lines = content.split(\"\\n\");\n    const title = lines[0].replace(\"#\", \"\").trim();\n    const body = lines.slice(1).join(\"\\n\");\n\n    return {\n      title,\n      content: body,\n    };\n  },\n});\n\ndefineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  parser: markdownParser,\n  schema: z.object({\n    title: z.string(),\n  }),\n});\n```\n\n### Parser Function\n\nYou can also define a parser as a simple function (equivalent to `hasContent: false`):\n\n```typescript\nimport { defineParser } from \"notpadd-core\";\n\nconst csvParser = defineParser((content: string) => {\n  const lines = content.split(\"\\n\");\n  const headers = lines[0].split(\",\");\n  const data = lines.slice(1).map((line) => {\n    const values = line.split(\",\");\n    return headers.reduce((acc, header, i) => {\n      acc[header] = values[i];\n      return acc;\n    }, {} as Record<string, string>);\n  });\n\n  return { rows: data };\n});\n```\n\n## Parser Properties\n\n### `hasContent`\n\nDetermines whether the parser extracts content:\n\n- `true`: The parsed result includes a `content` property\n- `false`: Only metadata is extracted\n\n### `parse`\n\nThe parsing function that receives the file content and returns parsed data:\n\n```typescript\ntype ParseFn = (\n  content: string,\n) => Record<string, unknown> | Promise<Record<string, unknown>>;\n```\n\n## Parser Selection\n\nThe parser is selected based on:\n\n1. Explicit `parser` option in collection definition\n2. Default: `\"frontmatter\"` if not specified\n\n## Content Property\n\nWhen `hasContent: true`, the parser's result must include a `content` property that is a string. This content is:\n- Validated to be a string\n- Included in the final document\n- Available in transform functions\n\n## Examples\n\n### Markdown with Custom Frontmatter\n\n```typescript\nconst customFrontmatterParser = defineParser({\n  hasContent: true,\n  parse: (content: string) => {\n    const match = content.match(/^---\\n([\\s\\S]*?)\\n---\\n([\\s\\S]*)$/);\n    if (!match) {\n      throw new Error(\"Invalid frontmatter format\");\n    }\n\n    const frontmatter = yaml.parse(match[1]);\n    const body = match[2];\n\n    return {\n      ...frontmatter,\n      content: body,\n    };\n  },\n});\n```\n\n### TOML Parser\n\n```typescript\nimport { parse as parseToml } from \"@iarna/toml\";\n\nconst tomlParser = defineParser({\n  hasContent: false,\n  parse: (content: string) => {\n    return parseToml(content);\n  },\n});\n```\n\n## Best Practices\n\n1. **Use built-in parsers when possible**: They're optimized and well-tested\n2. **Handle errors gracefully**: Custom parsers should throw descriptive errors\n3. **Return consistent structures**: Always return objects with the same shape\n4. **Consider async parsing**: Use async functions for expensive parsing operations\n5. **Validate parsed data**: Ensure your schema matches what the parser returns",
    "_meta": {
      "filePath": "core/core-parsers.mdx",
      "fileName": "core-parsers.mdx",
      "directory": "core",
      "extension": "mdx",
      "path": "core/core-parsers"
    },
    "headings": [
      {
        "level": 1,
        "text": "Parsers",
        "slug": "parsers"
      },
      {
        "level": 2,
        "text": "Built-in Parsers",
        "slug": "built-in-parsers"
      },
      {
        "level": 3,
        "text": "`frontmatter` (default)",
        "slug": "frontmatter-default"
      },
      {
        "level": 3,
        "text": "`frontmatter-only`",
        "slug": "frontmatter-only"
      },
      {
        "level": 3,
        "text": "`json`",
        "slug": "json"
      },
      {
        "level": 3,
        "text": "`yaml`",
        "slug": "yaml"
      },
      {
        "level": 2,
        "text": "Custom Parsers",
        "slug": "custom-parsers"
      },
      {
        "level": 3,
        "text": "Parser Function",
        "slug": "parser-function"
      },
      {
        "level": 2,
        "text": "Parser Properties",
        "slug": "parser-properties"
      },
      {
        "level": 3,
        "text": "`hasContent`",
        "slug": "hascontent"
      },
      {
        "level": 3,
        "text": "`parse`",
        "slug": "parse"
      },
      {
        "level": 2,
        "text": "Parser Selection",
        "slug": "parser-selection"
      },
      {
        "level": 2,
        "text": "Content Property",
        "slug": "content-property"
      },
      {
        "level": 2,
        "text": "Examples",
        "slug": "examples"
      },
      {
        "level": 3,
        "text": "Markdown with Custom Frontmatter",
        "slug": "markdown-with-custom-frontmatter"
      },
      {
        "level": 3,
        "text": "TOML Parser",
        "slug": "toml-parser"
      },
      {
        "level": 2,
        "text": "Best Practices",
        "slug": "best-practices"
      }
    ],
    "mdx": "var Component=(()=>{var h=Object.create;var s=Object.defineProperty;var m=Object.getOwnPropertyDescriptor;var g=Object.getOwnPropertyNames;var u=Object.getPrototypeOf,f=Object.prototype.hasOwnProperty;var y=(t,n)=>()=>(n||t((n={exports:{}}).exports,n),n.exports),P=(t,n)=>{for(var r in n)s(t,r,{get:n[r],enumerable:!0})},i=(t,n,r,c)=>{if(n&&typeof n==\"object\"||typeof n==\"function\")for(let a of g(n))!f.call(t,a)&&a!==r&&s(t,a,{get:()=>n[a],enumerable:!(c=m(n,a))||c.enumerable});return t};var C=(t,n,r)=>(r=t!=null?h(u(t)):{},i(n||!t||!t.__esModule?s(r,\"default\",{value:t,enumerable:!0}):r,t)),w=t=>i(s({},\"__esModule\",{value:!0}),t);var l=y((z,o)=>{o.exports=_jsx_runtime});var b={};P(b,{default:()=>p});var e=C(l());function d(t){let n={code:\"code\",h1:\"h1\",h2:\"h2\",h3:\"h3\",li:\"li\",ol:\"ol\",p:\"p\",pre:\"pre\",strong:\"strong\",ul:\"ul\",...t.components};return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(n.h1,{children:\"Parsers\"}),`\n`,(0,e.jsx)(n.p,{children:\"Parsers extract data from content files. Notpadd Core supports multiple built-in parsers and allows you to define custom parsers.\"}),`\n`,(0,e.jsx)(n.h2,{children:\"Built-in Parsers\"}),`\n`,(0,e.jsxs)(n.h3,{children:[(0,e.jsx)(n.code,{children:\"frontmatter\"}),\" (default)\"]}),`\n`,(0,e.jsx)(n.p,{children:\"Parses YAML frontmatter and extracts both metadata and content:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\ndefineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  parser: \"frontmatter\",\n  schema: z.object({\n    title: z.string(),\n  }),\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`defineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  parser: \"frontmatter\",\n  schema: z.object({\n    title: z.string(),\n  }),\n});\n`})}),`\n`,(0,e.jsx)(n.p,{children:(0,e.jsx)(n.strong,{children:\"Input file:\"})}),`\n`,(0,e.jsx)(n.pre,{language:\"markdown\",meta:\"\",code:\"```markdown\\n---\\ntitle: My Post\\n---\\n\\nThis is the content.\\n```\",children:(0,e.jsx)(n.code,{className:\"language-markdown\",children:`---\ntitle: My Post\n---\n\nThis is the content.\n`})}),`\n`,(0,e.jsx)(n.p,{children:(0,e.jsx)(n.strong,{children:\"Result:\"})}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:'```typescript\\n{\\n  title: \"My Post\",\\n  content: \"This is the content.\",\\n  _meta: { ... }\\n}\\n```',children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`{\n  title: \"My Post\",\n  content: \"This is the content.\",\n  _meta: { ... }\n}\n`})}),`\n`,(0,e.jsx)(n.h3,{children:(0,e.jsx)(n.code,{children:\"frontmatter-only\"})}),`\n`,(0,e.jsx)(n.p,{children:\"Parses only the frontmatter, ignoring content:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\ndefineCollection({\n  name: \"config\",\n  directory: \"content/config\",\n  parser: \"frontmatter-only\",\n  schema: z.object({\n    title: z.string(),\n  }),\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`defineCollection({\n  name: \"config\",\n  directory: \"content/config\",\n  parser: \"frontmatter-only\",\n  schema: z.object({\n    title: z.string(),\n  }),\n});\n`})}),`\n`,(0,e.jsx)(n.p,{children:(0,e.jsx)(n.strong,{children:\"Input file:\"})}),`\n`,(0,e.jsx)(n.pre,{language:\"markdown\",meta:\"\",code:\"```markdown\\n---\\ntitle: Config\\n---\\n\\nThis content is ignored.\\n```\",children:(0,e.jsx)(n.code,{className:\"language-markdown\",children:`---\ntitle: Config\n---\n\nThis content is ignored.\n`})}),`\n`,(0,e.jsx)(n.p,{children:(0,e.jsx)(n.strong,{children:\"Result:\"})}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:'```typescript\\n{\\n  title: \"Config\",\\n  _meta: { ... }\\n}\\n```',children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`{\n  title: \"Config\",\n  _meta: { ... }\n}\n`})}),`\n`,(0,e.jsx)(n.h3,{children:(0,e.jsx)(n.code,{children:\"json\"})}),`\n`,(0,e.jsx)(n.p,{children:\"Parses JSON files:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\ndefineCollection({\n  name: \"data\",\n  directory: \"content/data\",\n  parser: \"json\",\n  schema: z.object({\n    name: z.string(),\n    value: z.number(),\n  }),\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`defineCollection({\n  name: \"data\",\n  directory: \"content/data\",\n  parser: \"json\",\n  schema: z.object({\n    name: z.string(),\n    value: z.number(),\n  }),\n});\n`})}),`\n`,(0,e.jsx)(n.p,{children:(0,e.jsxs)(n.strong,{children:[\"Input file (\",(0,e.jsx)(n.code,{children:\"data.json\"}),\"):\"]})}),`\n`,(0,e.jsx)(n.pre,{language:\"json\",meta:\"\",code:'```json\\n{\\n  \"name\": \"Example\",\\n  \"value\": 42\\n}\\n```',children:(0,e.jsx)(n.code,{className:\"language-json\",children:`{\n  \"name\": \"Example\",\n  \"value\": 42\n}\n`})}),`\n`,(0,e.jsx)(n.p,{children:(0,e.jsx)(n.strong,{children:\"Result:\"})}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:'```typescript\\n{\\n  name: \"Example\",\\n  value: 42,\\n  _meta: { ... }\\n}\\n```',children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`{\n  name: \"Example\",\n  value: 42,\n  _meta: { ... }\n}\n`})}),`\n`,(0,e.jsx)(n.h3,{children:(0,e.jsx)(n.code,{children:\"yaml\"})}),`\n`,(0,e.jsx)(n.p,{children:\"Parses YAML files:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\ndefineCollection({\n  name: \"settings\",\n  directory: \"content/settings\",\n  parser: \"yaml\",\n  schema: z.object({\n    theme: z.string(),\n    language: z.string(),\n  }),\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`defineCollection({\n  name: \"settings\",\n  directory: \"content/settings\",\n  parser: \"yaml\",\n  schema: z.object({\n    theme: z.string(),\n    language: z.string(),\n  }),\n});\n`})}),`\n`,(0,e.jsx)(n.p,{children:(0,e.jsxs)(n.strong,{children:[\"Input file (\",(0,e.jsx)(n.code,{children:\"settings.yaml\"}),\"):\"]})}),`\n`,(0,e.jsx)(n.pre,{language:\"yaml\",meta:\"\",code:\"```yaml\\ntheme: dark\\nlanguage: en\\n```\",children:(0,e.jsx)(n.code,{className:\"language-yaml\",children:`theme: dark\nlanguage: en\n`})}),`\n`,(0,e.jsx)(n.p,{children:(0,e.jsx)(n.strong,{children:\"Result:\"})}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:'```typescript\\n{\\n  theme: \"dark\",\\n  language: \"en\",\\n  _meta: { ... }\\n}\\n```',children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`{\n  theme: \"dark\",\n  language: \"en\",\n  _meta: { ... }\n}\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Custom Parsers\"}),`\n`,(0,e.jsxs)(n.p,{children:[\"Define your own parser using \",(0,e.jsx)(n.code,{children:\"defineParser()\"}),\":\"]}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { defineParser, defineCollection } from \"notpadd-core\";\n\nconst markdownParser = defineParser({\n  hasContent: true,\n  parse: async (content: string) => {\n    // Custom parsing logic\n    const lines = content.split(\"\\\\n\");\n    const title = lines[0].replace(\"#\", \"\").trim();\n    const body = lines.slice(1).join(\"\\\\n\");\n\n    return {\n      title,\n      content: body,\n    };\n  },\n});\n\ndefineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  parser: markdownParser,\n  schema: z.object({\n    title: z.string(),\n  }),\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`import { defineParser, defineCollection } from \"notpadd-core\";\n\nconst markdownParser = defineParser({\n  hasContent: true,\n  parse: async (content: string) => {\n    // Custom parsing logic\n    const lines = content.split(\"\\\\n\");\n    const title = lines[0].replace(\"#\", \"\").trim();\n    const body = lines.slice(1).join(\"\\\\n\");\n\n    return {\n      title,\n      content: body,\n    };\n  },\n});\n\ndefineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  parser: markdownParser,\n  schema: z.object({\n    title: z.string(),\n  }),\n});\n`})}),`\n`,(0,e.jsx)(n.h3,{children:\"Parser Function\"}),`\n`,(0,e.jsxs)(n.p,{children:[\"You can also define a parser as a simple function (equivalent to \",(0,e.jsx)(n.code,{children:\"hasContent: false\"}),\"):\"]}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { defineParser } from \"notpadd-core\";\n\nconst csvParser = defineParser((content: string) => {\n  const lines = content.split(\"\\\\n\");\n  const headers = lines[0].split(\",\");\n  const data = lines.slice(1).map((line) => {\n    const values = line.split(\",\");\n    return headers.reduce((acc, header, i) => {\n      acc[header] = values[i];\n      return acc;\n    }, {} as Record<string, string>);\n  });\n\n  return { rows: data };\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`import { defineParser } from \"notpadd-core\";\n\nconst csvParser = defineParser((content: string) => {\n  const lines = content.split(\"\\\\n\");\n  const headers = lines[0].split(\",\");\n  const data = lines.slice(1).map((line) => {\n    const values = line.split(\",\");\n    return headers.reduce((acc, header, i) => {\n      acc[header] = values[i];\n      return acc;\n    }, {} as Record<string, string>);\n  });\n\n  return { rows: data };\n});\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Parser Properties\"}),`\n`,(0,e.jsx)(n.h3,{children:(0,e.jsx)(n.code,{children:\"hasContent\"})}),`\n`,(0,e.jsx)(n.p,{children:\"Determines whether the parser extracts content:\"}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"true\"}),\": The parsed result includes a \",(0,e.jsx)(n.code,{children:\"content\"}),\" property\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:\"false\"}),\": Only metadata is extracted\"]}),`\n`]}),`\n`,(0,e.jsx)(n.h3,{children:(0,e.jsx)(n.code,{children:\"parse\"})}),`\n`,(0,e.jsx)(n.p,{children:\"The parsing function that receives the file content and returns parsed data:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:\"```typescript\\ntype ParseFn = (\\n  content: string,\\n) => Record<string, unknown> | Promise<Record<string, unknown>>;\\n```\",children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`type ParseFn = (\n  content: string,\n) => Record<string, unknown> | Promise<Record<string, unknown>>;\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Parser Selection\"}),`\n`,(0,e.jsx)(n.p,{children:\"The parser is selected based on:\"}),`\n`,(0,e.jsxs)(n.ol,{children:[`\n`,(0,e.jsxs)(n.li,{children:[\"Explicit \",(0,e.jsx)(n.code,{children:\"parser\"}),\" option in collection definition\"]}),`\n`,(0,e.jsxs)(n.li,{children:[\"Default: \",(0,e.jsx)(n.code,{children:'\"frontmatter\"'}),\" if not specified\"]}),`\n`]}),`\n`,(0,e.jsx)(n.h2,{children:\"Content Property\"}),`\n`,(0,e.jsxs)(n.p,{children:[\"When \",(0,e.jsx)(n.code,{children:\"hasContent: true\"}),\", the parser's result must include a \",(0,e.jsx)(n.code,{children:\"content\"}),\" property that is a string. This content is:\"]}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsx)(n.li,{children:\"Validated to be a string\"}),`\n`,(0,e.jsx)(n.li,{children:\"Included in the final document\"}),`\n`,(0,e.jsx)(n.li,{children:\"Available in transform functions\"}),`\n`]}),`\n`,(0,e.jsx)(n.h2,{children:\"Examples\"}),`\n`,(0,e.jsx)(n.h3,{children:\"Markdown with Custom Frontmatter\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nconst customFrontmatterParser = defineParser({\n  hasContent: true,\n  parse: (content: string) => {\n    const match = content.match(/^---\\\\n([\\\\s\\\\S]*?)\\\\n---\\\\n([\\\\s\\\\S]*)$/);\n    if (!match) {\n      throw new Error(\"Invalid frontmatter format\");\n    }\n\n    const frontmatter = yaml.parse(match[1]);\n    const body = match[2];\n\n    return {\n      ...frontmatter,\n      content: body,\n    };\n  },\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`const customFrontmatterParser = defineParser({\n  hasContent: true,\n  parse: (content: string) => {\n    const match = content.match(/^---\\\\n([\\\\s\\\\S]*?)\\\\n---\\\\n([\\\\s\\\\S]*)$/);\n    if (!match) {\n      throw new Error(\"Invalid frontmatter format\");\n    }\n\n    const frontmatter = yaml.parse(match[1]);\n    const body = match[2];\n\n    return {\n      ...frontmatter,\n      content: body,\n    };\n  },\n});\n`})}),`\n`,(0,e.jsx)(n.h3,{children:\"TOML Parser\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { parse as parseToml } from \"@iarna/toml\";\n\nconst tomlParser = defineParser({\n  hasContent: false,\n  parse: (content: string) => {\n    return parseToml(content);\n  },\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`import { parse as parseToml } from \"@iarna/toml\";\n\nconst tomlParser = defineParser({\n  hasContent: false,\n  parse: (content: string) => {\n    return parseToml(content);\n  },\n});\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Best Practices\"}),`\n`,(0,e.jsxs)(n.ol,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Use built-in parsers when possible\"}),\": They're optimized and well-tested\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Handle errors gracefully\"}),\": Custom parsers should throw descriptive errors\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Return consistent structures\"}),\": Always return objects with the same shape\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Consider async parsing\"}),\": Use async functions for expensive parsing operations\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Validate parsed data\"}),\": Ensure your schema matches what the parser returns\"]}),`\n`]})]})}function p(t={}){let{wrapper:n}=t.components||{};return n?(0,e.jsx)(n,{...t,children:(0,e.jsx)(d,{...t})}):d(t)}return w(b);})();\n;return Component;"
  },
  {
    "title": "Schemas",
    "description": "Define content structure and validation rules using Zod schemas, including pre-built Notpadd schemas",
    "content": "# Schemas\n\nSchemas define the structure and validation rules for your content using Zod.\n\n## Basic Schema\n\nUse Zod to define your schema:\n\n```typescript\nimport { defineCollection } from \"notpadd-core\";\nimport { z } from \"zod\";\n\ndefineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  schema: z.object({\n    title: z.string(),\n    description: z.string().optional(),\n    published: z.boolean(),\n    date: z.string(),\n    tags: z.array(z.string()),\n  }),\n});\n```\n\n## Schema Validation\n\nSchemas validate:\n- Frontmatter data (for frontmatter parser)\n- File data (for JSON/YAML parsers)\n- The structure matches your defined types\n\nInvalid documents are skipped and errors are emitted via the event system.\n\n## Notpadd Schemas\n\nNotpadd Core provides pre-built schemas for Notpadd content:\n\n### `notpaddSchema`\n\nFull schema with all Notpadd fields:\n\n```typescript\nimport { notpaddSchema } from \"notpadd-core\";\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchema,\n});\n```\n\nIncludes: `slug`, `title`, `description`, `published`, `markdown`, `createdAt`, `updatedAt`, `image`, `imageBlurhash`, `authors`, `tags`\n\n### `notpaddSchemaOptional`\n\nSchema with optional fields:\n\n```typescript\nimport { notpaddSchemaOptional } from \"notpadd-core\";\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchemaOptional,\n});\n```\n\n### `notpaddSchemaMinimal`\n\nMinimal schema with only required fields:\n\n```typescript\nimport { notpaddSchemaMinimal } from \"notpadd-core\";\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchemaMinimal,\n});\n```\n\nIncludes: `slug`, `title`\n\n### `notpaddSchemaExtended`\n\nExtended schema with additional fields:\n\n```typescript\nimport { notpaddSchemaExtended } from \"notpadd-core\";\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchemaExtended,\n});\n```\n\nIncludes: `slug`, `title`, `description`, `published`, `createdAt`, `updatedAt`, `image`, `tags`, `category`, `authors`\n\n### `notpaddSchemaPublished`\n\nSchema that only accepts published articles:\n\n```typescript\nimport { notpaddSchemaPublished } from \"notpadd-core\";\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchemaPublished,\n});\n```\n\n## Customizing Notpadd Schemas\n\n### `createNotpaddSchema`\n\nExtend the base Notpadd schema with additional fields:\n\n```typescript\nimport { createNotpaddSchema } from \"notpadd-core\";\nimport { z } from \"zod\";\n\nconst customSchema = createNotpaddSchema({\n  category: z.string(),\n  featured: z.boolean(),\n  readingTime: z.number(),\n});\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: customSchema,\n});\n```\n\n### `createNotpaddSchemaPick`\n\nPick specific fields from the Notpadd schema:\n\n```typescript\nimport { createNotpaddSchemaPick } from \"notpadd-core\";\n\nconst minimalSchema = createNotpaddSchemaPick([\"slug\", \"title\", \"description\"]);\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: minimalSchema,\n});\n```\n\n### `createNotpaddSchemaOmit`\n\nOmit specific fields from the Notpadd schema:\n\n```typescript\nimport { createNotpaddSchemaOmit } from \"notpadd-core\";\n\nconst schemaWithoutMarkdown = createNotpaddSchemaOmit([\"markdown\"]);\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: schemaWithoutMarkdown,\n});\n```\n\n## Author Schema\n\nThe `notpaddAuthorSchema` defines author information:\n\n```typescript\nimport { notpaddAuthorSchema } from \"notpadd-core\";\n\n// Used within notpaddSchema\nz.object({\n  authors: z.array(notpaddAuthorSchema),\n});\n```\n\nAuthor fields:\n- `name`: Author name (string)\n- `email`: Author email (string)\n- `image`: Author image URL (string | null)\n\n## Type Inference\n\nSchemas automatically generate TypeScript types:\n\n```typescript\nimport type { GetTypeByName } from \"notpadd-core\";\nimport config from \"./content-collections\";\n\ntype Post = GetTypeByName<typeof config, \"posts\">;\n// Post includes all schema fields + _meta + content (if parser has content)\n```\n\n## Best Practices\n\n1. **Use specific types**: Prefer `z.string()` over `z.any()` for better type safety\n2. **Make fields optional when appropriate**: Use `.optional()` for fields that may not exist\n3. **Validate dates**: Use `z.string().datetime()` or transform to Date objects\n4. **Use enums for fixed values**: `z.enum([\"draft\", \"published\"])` instead of `z.string()`\n5. **Leverage Notpadd schemas**: Use pre-built schemas when working with Notpadd content",
    "_meta": {
      "filePath": "core/core-schemas.mdx",
      "fileName": "core-schemas.mdx",
      "directory": "core",
      "extension": "mdx",
      "path": "core/core-schemas"
    },
    "headings": [
      {
        "level": 1,
        "text": "Schemas",
        "slug": "schemas"
      },
      {
        "level": 2,
        "text": "Basic Schema",
        "slug": "basic-schema"
      },
      {
        "level": 2,
        "text": "Schema Validation",
        "slug": "schema-validation"
      },
      {
        "level": 2,
        "text": "Notpadd Schemas",
        "slug": "notpadd-schemas"
      },
      {
        "level": 3,
        "text": "`notpaddSchema`",
        "slug": "notpaddschema"
      },
      {
        "level": 3,
        "text": "`notpaddSchemaOptional`",
        "slug": "notpaddschemaoptional"
      },
      {
        "level": 3,
        "text": "`notpaddSchemaMinimal`",
        "slug": "notpaddschemaminimal"
      },
      {
        "level": 3,
        "text": "`notpaddSchemaExtended`",
        "slug": "notpaddschemaextended"
      },
      {
        "level": 3,
        "text": "`notpaddSchemaPublished`",
        "slug": "notpaddschemapublished"
      },
      {
        "level": 2,
        "text": "Customizing Notpadd Schemas",
        "slug": "customizing-notpadd-schemas"
      },
      {
        "level": 3,
        "text": "`createNotpaddSchema`",
        "slug": "createnotpaddschema"
      },
      {
        "level": 3,
        "text": "`createNotpaddSchemaPick`",
        "slug": "createnotpaddschemapick"
      },
      {
        "level": 3,
        "text": "`createNotpaddSchemaOmit`",
        "slug": "createnotpaddschemaomit"
      },
      {
        "level": 2,
        "text": "Author Schema",
        "slug": "author-schema"
      },
      {
        "level": 2,
        "text": "Type Inference",
        "slug": "type-inference"
      },
      {
        "level": 2,
        "text": "Best Practices",
        "slug": "best-practices"
      }
    ],
    "mdx": "var Component=(()=>{var m=Object.create;var o=Object.defineProperty;var s=Object.getOwnPropertyDescriptor;var u=Object.getOwnPropertyNames;var f=Object.getPrototypeOf,g=Object.prototype.hasOwnProperty;var y=(d,e)=>()=>(e||d((e={exports:{}}).exports,e),e.exports),S=(d,e)=>{for(var t in e)o(d,t,{get:e[t],enumerable:!0})},i=(d,e,t,a)=>{if(e&&typeof e==\"object\"||typeof e==\"function\")for(let c of u(e))!g.call(d,c)&&c!==t&&o(d,c,{get:()=>e[c],enumerable:!(a=s(e,c))||a.enumerable});return d};var N=(d,e,t)=>(t=d!=null?m(f(d)):{},i(e||!d||!d.__esModule?o(t,\"default\",{value:d,enumerable:!0}):t,d)),z=d=>i(o({},\"__esModule\",{value:!0}),d);var l=y((w,r)=>{r.exports=_jsx_runtime});var b={};S(b,{default:()=>h});var n=N(l());function p(d){let e={code:\"code\",h1:\"h1\",h2:\"h2\",h3:\"h3\",li:\"li\",ol:\"ol\",p:\"p\",pre:\"pre\",strong:\"strong\",ul:\"ul\",...d.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(e.h1,{children:\"Schemas\"}),`\n`,(0,n.jsx)(e.p,{children:\"Schemas define the structure and validation rules for your content using Zod.\"}),`\n`,(0,n.jsx)(e.h2,{children:\"Basic Schema\"}),`\n`,(0,n.jsx)(e.p,{children:\"Use Zod to define your schema:\"}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { defineCollection } from \"notpadd-core\";\nimport { z } from \"zod\";\n\ndefineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  schema: z.object({\n    title: z.string(),\n    description: z.string().optional(),\n    published: z.boolean(),\n    date: z.string(),\n    tags: z.array(z.string()),\n  }),\n});\n\\`\\`\\``,children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`import { defineCollection } from \"notpadd-core\";\nimport { z } from \"zod\";\n\ndefineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  schema: z.object({\n    title: z.string(),\n    description: z.string().optional(),\n    published: z.boolean(),\n    date: z.string(),\n    tags: z.array(z.string()),\n  }),\n});\n`})}),`\n`,(0,n.jsx)(e.h2,{children:\"Schema Validation\"}),`\n`,(0,n.jsx)(e.p,{children:\"Schemas validate:\"}),`\n`,(0,n.jsxs)(e.ul,{children:[`\n`,(0,n.jsx)(e.li,{children:\"Frontmatter data (for frontmatter parser)\"}),`\n`,(0,n.jsx)(e.li,{children:\"File data (for JSON/YAML parsers)\"}),`\n`,(0,n.jsx)(e.li,{children:\"The structure matches your defined types\"}),`\n`]}),`\n`,(0,n.jsx)(e.p,{children:\"Invalid documents are skipped and errors are emitted via the event system.\"}),`\n`,(0,n.jsx)(e.h2,{children:\"Notpadd Schemas\"}),`\n`,(0,n.jsx)(e.p,{children:\"Notpadd Core provides pre-built schemas for Notpadd content:\"}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"notpaddSchema\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Full schema with all Notpadd fields:\"}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { notpaddSchema } from \"notpadd-core\";\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchema,\n});\n\\`\\`\\``,children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`import { notpaddSchema } from \"notpadd-core\";\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchema,\n});\n`})}),`\n`,(0,n.jsxs)(e.p,{children:[\"Includes: \",(0,n.jsx)(e.code,{children:\"slug\"}),\", \",(0,n.jsx)(e.code,{children:\"title\"}),\", \",(0,n.jsx)(e.code,{children:\"description\"}),\", \",(0,n.jsx)(e.code,{children:\"published\"}),\", \",(0,n.jsx)(e.code,{children:\"markdown\"}),\", \",(0,n.jsx)(e.code,{children:\"createdAt\"}),\", \",(0,n.jsx)(e.code,{children:\"updatedAt\"}),\", \",(0,n.jsx)(e.code,{children:\"image\"}),\", \",(0,n.jsx)(e.code,{children:\"imageBlurhash\"}),\", \",(0,n.jsx)(e.code,{children:\"authors\"}),\", \",(0,n.jsx)(e.code,{children:\"tags\"})]}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"notpaddSchemaOptional\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Schema with optional fields:\"}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { notpaddSchemaOptional } from \"notpadd-core\";\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchemaOptional,\n});\n\\`\\`\\``,children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`import { notpaddSchemaOptional } from \"notpadd-core\";\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchemaOptional,\n});\n`})}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"notpaddSchemaMinimal\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Minimal schema with only required fields:\"}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { notpaddSchemaMinimal } from \"notpadd-core\";\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchemaMinimal,\n});\n\\`\\`\\``,children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`import { notpaddSchemaMinimal } from \"notpadd-core\";\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchemaMinimal,\n});\n`})}),`\n`,(0,n.jsxs)(e.p,{children:[\"Includes: \",(0,n.jsx)(e.code,{children:\"slug\"}),\", \",(0,n.jsx)(e.code,{children:\"title\"})]}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"notpaddSchemaExtended\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Extended schema with additional fields:\"}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { notpaddSchemaExtended } from \"notpadd-core\";\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchemaExtended,\n});\n\\`\\`\\``,children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`import { notpaddSchemaExtended } from \"notpadd-core\";\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchemaExtended,\n});\n`})}),`\n`,(0,n.jsxs)(e.p,{children:[\"Includes: \",(0,n.jsx)(e.code,{children:\"slug\"}),\", \",(0,n.jsx)(e.code,{children:\"title\"}),\", \",(0,n.jsx)(e.code,{children:\"description\"}),\", \",(0,n.jsx)(e.code,{children:\"published\"}),\", \",(0,n.jsx)(e.code,{children:\"createdAt\"}),\", \",(0,n.jsx)(e.code,{children:\"updatedAt\"}),\", \",(0,n.jsx)(e.code,{children:\"image\"}),\", \",(0,n.jsx)(e.code,{children:\"tags\"}),\", \",(0,n.jsx)(e.code,{children:\"category\"}),\", \",(0,n.jsx)(e.code,{children:\"authors\"})]}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"notpaddSchemaPublished\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Schema that only accepts published articles:\"}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { notpaddSchemaPublished } from \"notpadd-core\";\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchemaPublished,\n});\n\\`\\`\\``,children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`import { notpaddSchemaPublished } from \"notpadd-core\";\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchemaPublished,\n});\n`})}),`\n`,(0,n.jsx)(e.h2,{children:\"Customizing Notpadd Schemas\"}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"createNotpaddSchema\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Extend the base Notpadd schema with additional fields:\"}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { createNotpaddSchema } from \"notpadd-core\";\nimport { z } from \"zod\";\n\nconst customSchema = createNotpaddSchema({\n  category: z.string(),\n  featured: z.boolean(),\n  readingTime: z.number(),\n});\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: customSchema,\n});\n\\`\\`\\``,children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`import { createNotpaddSchema } from \"notpadd-core\";\nimport { z } from \"zod\";\n\nconst customSchema = createNotpaddSchema({\n  category: z.string(),\n  featured: z.boolean(),\n  readingTime: z.number(),\n});\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: customSchema,\n});\n`})}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"createNotpaddSchemaPick\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Pick specific fields from the Notpadd schema:\"}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { createNotpaddSchemaPick } from \"notpadd-core\";\n\nconst minimalSchema = createNotpaddSchemaPick([\"slug\", \"title\", \"description\"]);\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: minimalSchema,\n});\n\\`\\`\\``,children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`import { createNotpaddSchemaPick } from \"notpadd-core\";\n\nconst minimalSchema = createNotpaddSchemaPick([\"slug\", \"title\", \"description\"]);\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: minimalSchema,\n});\n`})}),`\n`,(0,n.jsx)(e.h3,{children:(0,n.jsx)(e.code,{children:\"createNotpaddSchemaOmit\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Omit specific fields from the Notpadd schema:\"}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { createNotpaddSchemaOmit } from \"notpadd-core\";\n\nconst schemaWithoutMarkdown = createNotpaddSchemaOmit([\"markdown\"]);\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: schemaWithoutMarkdown,\n});\n\\`\\`\\``,children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`import { createNotpaddSchemaOmit } from \"notpadd-core\";\n\nconst schemaWithoutMarkdown = createNotpaddSchemaOmit([\"markdown\"]);\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: schemaWithoutMarkdown,\n});\n`})}),`\n`,(0,n.jsx)(e.h2,{children:\"Author Schema\"}),`\n`,(0,n.jsxs)(e.p,{children:[\"The \",(0,n.jsx)(e.code,{children:\"notpaddAuthorSchema\"}),\" defines author information:\"]}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { notpaddAuthorSchema } from \"notpadd-core\";\n\n// Used within notpaddSchema\nz.object({\n  authors: z.array(notpaddAuthorSchema),\n});\n\\`\\`\\``,children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`import { notpaddAuthorSchema } from \"notpadd-core\";\n\n// Used within notpaddSchema\nz.object({\n  authors: z.array(notpaddAuthorSchema),\n});\n`})}),`\n`,(0,n.jsx)(e.p,{children:\"Author fields:\"}),`\n`,(0,n.jsxs)(e.ul,{children:[`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"name\"}),\": Author name (string)\"]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"email\"}),\": Author email (string)\"]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.code,{children:\"image\"}),\": Author image URL (string | null)\"]}),`\n`]}),`\n`,(0,n.jsx)(e.h2,{children:\"Type Inference\"}),`\n`,(0,n.jsx)(e.p,{children:\"Schemas automatically generate TypeScript types:\"}),`\n`,(0,n.jsx)(e.pre,{language:\"typescript\",meta:\"\",code:'```typescript\\nimport type { GetTypeByName } from \"notpadd-core\";\\nimport config from \"./content-collections\";\\n\\ntype Post = GetTypeByName<typeof config, \"posts\">;\\n// Post includes all schema fields + _meta + content (if parser has content)\\n```',children:(0,n.jsx)(e.code,{className:\"language-typescript\",children:`import type { GetTypeByName } from \"notpadd-core\";\nimport config from \"./content-collections\";\n\ntype Post = GetTypeByName<typeof config, \"posts\">;\n// Post includes all schema fields + _meta + content (if parser has content)\n`})}),`\n`,(0,n.jsx)(e.h2,{children:\"Best Practices\"}),`\n`,(0,n.jsxs)(e.ol,{children:[`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.strong,{children:\"Use specific types\"}),\": Prefer \",(0,n.jsx)(e.code,{children:\"z.string()\"}),\" over \",(0,n.jsx)(e.code,{children:\"z.any()\"}),\" for better type safety\"]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.strong,{children:\"Make fields optional when appropriate\"}),\": Use \",(0,n.jsx)(e.code,{children:\".optional()\"}),\" for fields that may not exist\"]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.strong,{children:\"Validate dates\"}),\": Use \",(0,n.jsx)(e.code,{children:\"z.string().datetime()\"}),\" or transform to Date objects\"]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.strong,{children:\"Use enums for fixed values\"}),\": \",(0,n.jsx)(e.code,{children:'z.enum([\"draft\", \"published\"])'}),\" instead of \",(0,n.jsx)(e.code,{children:\"z.string()\"})]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.strong,{children:\"Leverage Notpadd schemas\"}),\": Use pre-built schemas when working with Notpadd content\"]}),`\n`]})]})}function h(d={}){let{wrapper:e}=d.components||{};return e?(0,n.jsx)(e,{...d,children:(0,n.jsx)(p,{...d})}):p(d)}return z(b);})();\n;return Component;"
  },
  {
    "title": "Transformers",
    "description": "Transform documents with access to other collections, caching, and conditional skipping",
    "content": "# Transformers\n\nTransform functions allow you to modify documents after parsing, with access to other collections, caching, and conditional skipping.\n\n## Basic Transform\n\nA transform function receives the document and a context object:\n\n```typescript\ndefineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  schema: z.object({\n    title: z.string(),\n    authorId: z.string(),\n  }),\n  transform: async (doc, context) => {\n    // Modify the document\n    return {\n      ...doc,\n      slug: doc.title.toLowerCase().replace(/\\s+/g, \"-\"),\n    };\n  },\n});\n```\n\n## Context Object\n\nThe context provides access to:\n\n### `documents(collectionName)`\n\nGet all documents from another collection:\n\n```typescript\ntransform: async (doc, { documents }) => {\n  const authors = documents(\"authors\");\n  const author = authors.find((a) => a.id === doc.authorId);\n\n  return {\n    ...doc,\n    author,\n  };\n},\n```\n\n### `cache(key, ...args, fn)`\n\nCache expensive operations:\n\n```typescript\ntransform: async (doc, { cache }) => {\n  const processedContent = await cache(\n    \"process-markdown\",\n    doc.content,\n    async () => {\n      // Expensive operation\n      return await markdownToHtml(doc.content);\n    }\n  );\n\n  return {\n    ...doc,\n    html: processedContent,\n  };\n},\n```\n\nThe cache function:\n- Takes a key and arguments to identify the cache entry\n- Executes the function only if not cached\n- Returns cached result if available\n- Works with `cache: \"file\"` or `cache: \"memory\"` configuration\n\n### `collection`\n\nAccess information about the current collection:\n\n```typescript\ntransform: async (doc, { collection }) => {\n  console.log(`Processing ${collection.name} in ${collection.directory}`);\n\n  // Get all documents in this collection\n  const allDocs = await collection.documents();\n\n  return doc;\n},\n```\n\n### `skip(reason?)`\n\nConditionally skip documents:\n\n```typescript\ntransform: async (doc, { skip }) => {\n  if (!doc.published) {\n    return skip(\"Document is not published\");\n  }\n\n  if (doc.draft) {\n    return skip(\"Document is a draft\");\n  }\n\n  return doc;\n},\n```\n\nSkipped documents:\n- Are not included in the final collection\n- Emit a `transformer:document-skipped` event\n- Can include an optional reason\n\n## Common Patterns\n\n### Resolving References\n\n```typescript\ntransform: async (doc, { documents }) => {\n  const categories = documents(\"categories\");\n  const authors = documents(\"authors\");\n\n  return {\n    ...doc,\n    category: categories.find((c) => c.id === doc.categoryId),\n    author: authors.find((a) => a.id === doc.authorId),\n  };\n},\n```\n\n### Computing Derived Fields\n\n```typescript\ntransform: async (doc) => {\n  const words = doc.content.split(/\\s+/).length;\n  const readingTime = Math.ceil(words / 200); // 200 words per minute\n\n  return {\n    ...doc,\n    wordCount: words,\n    readingTime,\n  };\n},\n```\n\n### Processing Content\n\n```typescript\nimport { remark } from \"remark\";\nimport remarkHtml from \"remark-html\";\n\ntransform: async (doc, { cache }) => {\n  const html = await cache(\n    \"markdown-to-html\",\n    doc.content,\n    async () => {\n      const result = await remark()\n        .use(remarkHtml)\n        .process(doc.content);\n      return result.toString();\n    }\n  );\n\n  return {\n    ...doc,\n    html,\n  };\n},\n```\n\n### Filtering Documents\n\n```typescript\ntransform: async (doc, { skip }) => {\n  // Only include published posts\n  if (!doc.published) {\n    return skip(\"Not published\");\n  }\n\n  // Exclude future-dated posts\n  if (new Date(doc.date) > new Date()) {\n    return skip(\"Scheduled for future\");\n  }\n\n  return doc;\n},\n```\n\n### Sorting and Ordering\n\n```typescript\ntransform: async (doc, { collection }) => {\n  const allDocs = await collection.documents();\n\n  // Add index based on date\n  const sorted = allDocs.sort((a, b) =>\n    new Date(b.date).getTime() - new Date(a.date).getTime()\n  );\n  const index = sorted.findIndex((d) => d._meta.path === doc._meta.path);\n\n  return {\n    ...doc,\n    index,\n    prev: index > 0 ? sorted[index - 1] : null,\n    next: index < sorted.length - 1 ? sorted[index + 1] : null,\n  };\n},\n```\n\n## Return Types\n\nTransform functions must return:\n- The transformed document (same structure as input, but can add/modify fields)\n- A `skip()` signal to exclude the document\n- A serializable object (no functions, classes, or circular references)\n\n### Serialization Rules\n\nThe return value must be serializable:\n- ✅ Primitives: `string`, `number`, `boolean`, `null`, `undefined`\n- ✅ Objects and arrays\n- ✅ Dates (serialized as ISO strings)\n- ✅ Maps and Sets (serialized as objects/arrays)\n- ✅ BigInt (serialized as strings)\n- ❌ Functions\n- ❌ Classes\n- ❌ Circular references\n\n## Imports\n\nYou can return import references that will be resolved at build time:\n\n```typescript\nimport { createDefaultImport, createNamedImport } from \"notpadd-core\";\n\ntransform: async (doc) => {\n  return {\n    ...doc,\n    // Import default export\n    component: createDefaultImport(\"./components/Post.tsx\"),\n\n    // Import named export\n    utils: createNamedImport(\"formatDate\", \"./utils.ts\"),\n  };\n},\n```\n\n## Error Handling\n\nErrors in transform functions are caught and emitted as events:\n\n```typescript\n// Errors are automatically caught and emitted\ntransform: async (doc) => {\n  // If this throws, it's caught and emitted as transformer:error\n  const result = await someAsyncOperation(doc);\n  return result;\n},\n```\n\n## Performance Considerations\n\n1. **Use caching**: Cache expensive operations like markdown processing\n2. **Avoid unnecessary work**: Skip documents early if possible\n3. **Batch operations**: Process multiple documents together when possible\n4. **Leverage parallel execution**: Transforms run in parallel per collection\n\n## Type Safety\n\nTransform functions are fully typed based on your schema:\n\n```typescript\n// doc is typed as Schema<\"frontmatter\", YourSchema> & { _meta: Meta }\ntransform: async (doc, context) => {\n  // TypeScript knows doc.title exists\n  const title = doc.title;\n\n  // Return type is inferred from what you return\n  return {\n    ...doc,\n    slug: title.toLowerCase(),\n  };\n},\n```",
    "_meta": {
      "filePath": "core/core-transformers.mdx",
      "fileName": "core-transformers.mdx",
      "directory": "core",
      "extension": "mdx",
      "path": "core/core-transformers"
    },
    "headings": [
      {
        "level": 1,
        "text": "Transformers",
        "slug": "transformers"
      },
      {
        "level": 2,
        "text": "Basic Transform",
        "slug": "basic-transform"
      },
      {
        "level": 2,
        "text": "Context Object",
        "slug": "context-object"
      },
      {
        "level": 3,
        "text": "`documents(collectionName)`",
        "slug": "documentscollectionname"
      },
      {
        "level": 3,
        "text": "`cache(key, ...args, fn)`",
        "slug": "cachekey-args-fn"
      },
      {
        "level": 3,
        "text": "`collection`",
        "slug": "collection"
      },
      {
        "level": 3,
        "text": "`skip(reason?)`",
        "slug": "skipreason"
      },
      {
        "level": 2,
        "text": "Common Patterns",
        "slug": "common-patterns"
      },
      {
        "level": 3,
        "text": "Resolving References",
        "slug": "resolving-references"
      },
      {
        "level": 3,
        "text": "Computing Derived Fields",
        "slug": "computing-derived-fields"
      },
      {
        "level": 3,
        "text": "Processing Content",
        "slug": "processing-content"
      },
      {
        "level": 3,
        "text": "Filtering Documents",
        "slug": "filtering-documents"
      },
      {
        "level": 3,
        "text": "Sorting and Ordering",
        "slug": "sorting-and-ordering"
      },
      {
        "level": 2,
        "text": "Return Types",
        "slug": "return-types"
      },
      {
        "level": 3,
        "text": "Serialization Rules",
        "slug": "serialization-rules"
      },
      {
        "level": 2,
        "text": "Imports",
        "slug": "imports"
      },
      {
        "level": 2,
        "text": "Error Handling",
        "slug": "error-handling"
      },
      {
        "level": 2,
        "text": "Performance Considerations",
        "slug": "performance-considerations"
      },
      {
        "level": 2,
        "text": "Type Safety",
        "slug": "type-safety"
      }
    ],
    "mdx": "var Component=(()=>{var h=Object.create;var o=Object.defineProperty;var m=Object.getOwnPropertyDescriptor;var p=Object.getOwnPropertyNames;var g=Object.getPrototypeOf,f=Object.prototype.hasOwnProperty;var y=(t,n)=>()=>(n||t((n={exports:{}}).exports,n),n.exports),w=(t,n)=>{for(var r in n)o(t,r,{get:n[r],enumerable:!0})},s=(t,n,r,a)=>{if(n&&typeof n==\"object\"||typeof n==\"function\")for(let c of p(n))!f.call(t,c)&&c!==r&&o(t,c,{get:()=>n[c],enumerable:!(a=m(n,c))||a.enumerable});return t};var x=(t,n,r)=>(r=t!=null?h(g(t)):{},s(n||!t||!t.__esModule?o(r,\"default\",{value:t,enumerable:!0}):r,t)),k=t=>s(o({},\"__esModule\",{value:!0}),t);var d=y((I,i)=>{i.exports=_jsx_runtime});var b={};w(b,{default:()=>u});var e=x(d());function l(t){let n={code:\"code\",h1:\"h1\",h2:\"h2\",h3:\"h3\",li:\"li\",ol:\"ol\",p:\"p\",pre:\"pre\",strong:\"strong\",ul:\"ul\",...t.components};return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(n.h1,{children:\"Transformers\"}),`\n`,(0,e.jsx)(n.p,{children:\"Transform functions allow you to modify documents after parsing, with access to other collections, caching, and conditional skipping.\"}),`\n`,(0,e.jsx)(n.h2,{children:\"Basic Transform\"}),`\n`,(0,e.jsx)(n.p,{children:\"A transform function receives the document and a context object:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\ndefineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  schema: z.object({\n    title: z.string(),\n    authorId: z.string(),\n  }),\n  transform: async (doc, context) => {\n    // Modify the document\n    return {\n      ...doc,\n      slug: doc.title.toLowerCase().replace(/\\\\s+/g, \"-\"),\n    };\n  },\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`defineCollection({\n  name: \"posts\",\n  directory: \"content/posts\",\n  schema: z.object({\n    title: z.string(),\n    authorId: z.string(),\n  }),\n  transform: async (doc, context) => {\n    // Modify the document\n    return {\n      ...doc,\n      slug: doc.title.toLowerCase().replace(/\\\\s+/g, \"-\"),\n    };\n  },\n});\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Context Object\"}),`\n`,(0,e.jsx)(n.p,{children:\"The context provides access to:\"}),`\n`,(0,e.jsx)(n.h3,{children:(0,e.jsx)(n.code,{children:\"documents(collectionName)\"})}),`\n`,(0,e.jsx)(n.p,{children:\"Get all documents from another collection:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\ntransform: async (doc, { documents }) => {\n  const authors = documents(\"authors\");\n  const author = authors.find((a) => a.id === doc.authorId);\n\n  return {\n    ...doc,\n    author,\n  };\n},\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`transform: async (doc, { documents }) => {\n  const authors = documents(\"authors\");\n  const author = authors.find((a) => a.id === doc.authorId);\n\n  return {\n    ...doc,\n    author,\n  };\n},\n`})}),`\n`,(0,e.jsx)(n.h3,{children:(0,e.jsx)(n.code,{children:\"cache(key, ...args, fn)\"})}),`\n`,(0,e.jsx)(n.p,{children:\"Cache expensive operations:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\ntransform: async (doc, { cache }) => {\n  const processedContent = await cache(\n    \"process-markdown\",\n    doc.content,\n    async () => {\n      // Expensive operation\n      return await markdownToHtml(doc.content);\n    }\n  );\n\n  return {\n    ...doc,\n    html: processedContent,\n  };\n},\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`transform: async (doc, { cache }) => {\n  const processedContent = await cache(\n    \"process-markdown\",\n    doc.content,\n    async () => {\n      // Expensive operation\n      return await markdownToHtml(doc.content);\n    }\n  );\n\n  return {\n    ...doc,\n    html: processedContent,\n  };\n},\n`})}),`\n`,(0,e.jsx)(n.p,{children:\"The cache function:\"}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsx)(n.li,{children:\"Takes a key and arguments to identify the cache entry\"}),`\n`,(0,e.jsx)(n.li,{children:\"Executes the function only if not cached\"}),`\n`,(0,e.jsx)(n.li,{children:\"Returns cached result if available\"}),`\n`,(0,e.jsxs)(n.li,{children:[\"Works with \",(0,e.jsx)(n.code,{children:'cache: \"file\"'}),\" or \",(0,e.jsx)(n.code,{children:'cache: \"memory\"'}),\" configuration\"]}),`\n`]}),`\n`,(0,e.jsx)(n.h3,{children:(0,e.jsx)(n.code,{children:\"collection\"})}),`\n`,(0,e.jsx)(n.p,{children:\"Access information about the current collection:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:\"```typescript\\ntransform: async (doc, { collection }) => {\\n  console.log(`Processing ${collection.name} in ${collection.directory}`);\\n\\n  // Get all documents in this collection\\n  const allDocs = await collection.documents();\\n\\n  return doc;\\n},\\n```\",children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`transform: async (doc, { collection }) => {\n  console.log(\\`Processing \\${collection.name} in \\${collection.directory}\\`);\n\n  // Get all documents in this collection\n  const allDocs = await collection.documents();\n\n  return doc;\n},\n`})}),`\n`,(0,e.jsx)(n.h3,{children:(0,e.jsx)(n.code,{children:\"skip(reason?)\"})}),`\n`,(0,e.jsx)(n.p,{children:\"Conditionally skip documents:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\ntransform: async (doc, { skip }) => {\n  if (!doc.published) {\n    return skip(\"Document is not published\");\n  }\n\n  if (doc.draft) {\n    return skip(\"Document is a draft\");\n  }\n\n  return doc;\n},\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`transform: async (doc, { skip }) => {\n  if (!doc.published) {\n    return skip(\"Document is not published\");\n  }\n\n  if (doc.draft) {\n    return skip(\"Document is a draft\");\n  }\n\n  return doc;\n},\n`})}),`\n`,(0,e.jsx)(n.p,{children:\"Skipped documents:\"}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsx)(n.li,{children:\"Are not included in the final collection\"}),`\n`,(0,e.jsxs)(n.li,{children:[\"Emit a \",(0,e.jsx)(n.code,{children:\"transformer:document-skipped\"}),\" event\"]}),`\n`,(0,e.jsx)(n.li,{children:\"Can include an optional reason\"}),`\n`]}),`\n`,(0,e.jsx)(n.h2,{children:\"Common Patterns\"}),`\n`,(0,e.jsx)(n.h3,{children:\"Resolving References\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\ntransform: async (doc, { documents }) => {\n  const categories = documents(\"categories\");\n  const authors = documents(\"authors\");\n\n  return {\n    ...doc,\n    category: categories.find((c) => c.id === doc.categoryId),\n    author: authors.find((a) => a.id === doc.authorId),\n  };\n},\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`transform: async (doc, { documents }) => {\n  const categories = documents(\"categories\");\n  const authors = documents(\"authors\");\n\n  return {\n    ...doc,\n    category: categories.find((c) => c.id === doc.categoryId),\n    author: authors.find((a) => a.id === doc.authorId),\n  };\n},\n`})}),`\n`,(0,e.jsx)(n.h3,{children:\"Computing Derived Fields\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\ntransform: async (doc) => {\n  const words = doc.content.split(/\\\\s+/).length;\n  const readingTime = Math.ceil(words / 200); // 200 words per minute\n\n  return {\n    ...doc,\n    wordCount: words,\n    readingTime,\n  };\n},\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`transform: async (doc) => {\n  const words = doc.content.split(/\\\\s+/).length;\n  const readingTime = Math.ceil(words / 200); // 200 words per minute\n\n  return {\n    ...doc,\n    wordCount: words,\n    readingTime,\n  };\n},\n`})}),`\n`,(0,e.jsx)(n.h3,{children:\"Processing Content\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { remark } from \"remark\";\nimport remarkHtml from \"remark-html\";\n\ntransform: async (doc, { cache }) => {\n  const html = await cache(\n    \"markdown-to-html\",\n    doc.content,\n    async () => {\n      const result = await remark()\n        .use(remarkHtml)\n        .process(doc.content);\n      return result.toString();\n    }\n  );\n\n  return {\n    ...doc,\n    html,\n  };\n},\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`import { remark } from \"remark\";\nimport remarkHtml from \"remark-html\";\n\ntransform: async (doc, { cache }) => {\n  const html = await cache(\n    \"markdown-to-html\",\n    doc.content,\n    async () => {\n      const result = await remark()\n        .use(remarkHtml)\n        .process(doc.content);\n      return result.toString();\n    }\n  );\n\n  return {\n    ...doc,\n    html,\n  };\n},\n`})}),`\n`,(0,e.jsx)(n.h3,{children:\"Filtering Documents\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\ntransform: async (doc, { skip }) => {\n  // Only include published posts\n  if (!doc.published) {\n    return skip(\"Not published\");\n  }\n\n  // Exclude future-dated posts\n  if (new Date(doc.date) > new Date()) {\n    return skip(\"Scheduled for future\");\n  }\n\n  return doc;\n},\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`transform: async (doc, { skip }) => {\n  // Only include published posts\n  if (!doc.published) {\n    return skip(\"Not published\");\n  }\n\n  // Exclude future-dated posts\n  if (new Date(doc.date) > new Date()) {\n    return skip(\"Scheduled for future\");\n  }\n\n  return doc;\n},\n`})}),`\n`,(0,e.jsx)(n.h3,{children:\"Sorting and Ordering\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\ntransform: async (doc, { collection }) => {\n  const allDocs = await collection.documents();\n\n  // Add index based on date\n  const sorted = allDocs.sort((a, b) =>\n    new Date(b.date).getTime() - new Date(a.date).getTime()\n  );\n  const index = sorted.findIndex((d) => d._meta.path === doc._meta.path);\n\n  return {\n    ...doc,\n    index,\n    prev: index > 0 ? sorted[index - 1] : null,\n    next: index < sorted.length - 1 ? sorted[index + 1] : null,\n  };\n},\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`transform: async (doc, { collection }) => {\n  const allDocs = await collection.documents();\n\n  // Add index based on date\n  const sorted = allDocs.sort((a, b) =>\n    new Date(b.date).getTime() - new Date(a.date).getTime()\n  );\n  const index = sorted.findIndex((d) => d._meta.path === doc._meta.path);\n\n  return {\n    ...doc,\n    index,\n    prev: index > 0 ? sorted[index - 1] : null,\n    next: index < sorted.length - 1 ? sorted[index + 1] : null,\n  };\n},\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Return Types\"}),`\n`,(0,e.jsx)(n.p,{children:\"Transform functions must return:\"}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsx)(n.li,{children:\"The transformed document (same structure as input, but can add/modify fields)\"}),`\n`,(0,e.jsxs)(n.li,{children:[\"A \",(0,e.jsx)(n.code,{children:\"skip()\"}),\" signal to exclude the document\"]}),`\n`,(0,e.jsx)(n.li,{children:\"A serializable object (no functions, classes, or circular references)\"}),`\n`]}),`\n`,(0,e.jsx)(n.h3,{children:\"Serialization Rules\"}),`\n`,(0,e.jsx)(n.p,{children:\"The return value must be serializable:\"}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[\"\\u2705 Primitives: \",(0,e.jsx)(n.code,{children:\"string\"}),\", \",(0,e.jsx)(n.code,{children:\"number\"}),\", \",(0,e.jsx)(n.code,{children:\"boolean\"}),\", \",(0,e.jsx)(n.code,{children:\"null\"}),\", \",(0,e.jsx)(n.code,{children:\"undefined\"})]}),`\n`,(0,e.jsx)(n.li,{children:\"\\u2705 Objects and arrays\"}),`\n`,(0,e.jsx)(n.li,{children:\"\\u2705 Dates (serialized as ISO strings)\"}),`\n`,(0,e.jsx)(n.li,{children:\"\\u2705 Maps and Sets (serialized as objects/arrays)\"}),`\n`,(0,e.jsx)(n.li,{children:\"\\u2705 BigInt (serialized as strings)\"}),`\n`,(0,e.jsx)(n.li,{children:\"\\u274C Functions\"}),`\n`,(0,e.jsx)(n.li,{children:\"\\u274C Classes\"}),`\n`,(0,e.jsx)(n.li,{children:\"\\u274C Circular references\"}),`\n`]}),`\n`,(0,e.jsx)(n.h2,{children:\"Imports\"}),`\n`,(0,e.jsx)(n.p,{children:\"You can return import references that will be resolved at build time:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { createDefaultImport, createNamedImport } from \"notpadd-core\";\n\ntransform: async (doc) => {\n  return {\n    ...doc,\n    // Import default export\n    component: createDefaultImport(\"./components/Post.tsx\"),\n\n    // Import named export\n    utils: createNamedImport(\"formatDate\", \"./utils.ts\"),\n  };\n},\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`import { createDefaultImport, createNamedImport } from \"notpadd-core\";\n\ntransform: async (doc) => {\n  return {\n    ...doc,\n    // Import default export\n    component: createDefaultImport(\"./components/Post.tsx\"),\n\n    // Import named export\n    utils: createNamedImport(\"formatDate\", \"./utils.ts\"),\n  };\n},\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Error Handling\"}),`\n`,(0,e.jsx)(n.p,{children:\"Errors in transform functions are caught and emitted as events:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\n// Errors are automatically caught and emitted\ntransform: async (doc) => {\n  // If this throws, it's caught and emitted as transformer:error\n  const result = await someAsyncOperation(doc);\n  return result;\n},\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`// Errors are automatically caught and emitted\ntransform: async (doc) => {\n  // If this throws, it's caught and emitted as transformer:error\n  const result = await someAsyncOperation(doc);\n  return result;\n},\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Performance Considerations\"}),`\n`,(0,e.jsxs)(n.ol,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Use caching\"}),\": Cache expensive operations like markdown processing\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Avoid unnecessary work\"}),\": Skip documents early if possible\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Batch operations\"}),\": Process multiple documents together when possible\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Leverage parallel execution\"}),\": Transforms run in parallel per collection\"]}),`\n`]}),`\n`,(0,e.jsx)(n.h2,{children:\"Type Safety\"}),`\n`,(0,e.jsx)(n.p,{children:\"Transform functions are fully typed based on your schema:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\n// doc is typed as Schema<\"frontmatter\", YourSchema> & { _meta: Meta }\ntransform: async (doc, context) => {\n  // TypeScript knows doc.title exists\n  const title = doc.title;\n\n  // Return type is inferred from what you return\n  return {\n    ...doc,\n    slug: title.toLowerCase(),\n  };\n},\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`// doc is typed as Schema<\"frontmatter\", YourSchema> & { _meta: Meta }\ntransform: async (doc, context) => {\n  // TypeScript knows doc.title exists\n  const title = doc.title;\n\n  // Return type is inferred from what you return\n  return {\n    ...doc,\n    slug: title.toLowerCase(),\n  };\n},\n`})})]})}function u(t={}){let{wrapper:n}=t.components||{};return n?(0,e.jsx)(n,{...t,children:(0,e.jsx)(l,{...t})}):l(t)}return k(b);})();\n;return Component;"
  },
  {
    "title": "Quick Start",
    "description": "Get started with Notpadd quickly and easily.",
    "content": "# Quick Start\n\nGet started with Notpadd quickly and easily.\n\n## Installation\n\n```bash\nnpm install notpadd\n```\n\n## Usage\n\n```typescript\nimport { withNotpadd } from \"notpadd\";\n\nexport default withNotpadd({\n  configPath: \"content-collections.ts\",\n})\n\nconst nextConfig => {\n  return {\n    ...withNotpadd({\n      configPath: \"content-collections.ts\",\n    }),\n  }\n}\n```",
    "_meta": {
      "filePath": "index.mdx",
      "fileName": "index.mdx",
      "directory": ".",
      "extension": "mdx",
      "path": "index"
    },
    "headings": [
      {
        "level": 1,
        "text": "Quick Start",
        "slug": "quick-start"
      },
      {
        "level": 2,
        "text": "Installation",
        "slug": "installation"
      },
      {
        "level": 2,
        "text": "Usage",
        "slug": "usage"
      }
    ],
    "mdx": "var Component=(()=>{var h=Object.create;var c=Object.defineProperty;var m=Object.getOwnPropertyDescriptor;var g=Object.getOwnPropertyNames;var u=Object.getPrototypeOf,f=Object.prototype.hasOwnProperty;var x=(t,n)=>()=>(n||t((n={exports:{}}).exports,n),n.exports),N=(t,n)=>{for(var o in n)c(t,o,{get:n[o],enumerable:!0})},i=(t,n,o,d)=>{if(n&&typeof n==\"object\"||typeof n==\"function\")for(let a of g(n))!f.call(t,a)&&a!==o&&c(t,a,{get:()=>n[a],enumerable:!(d=m(n,a))||d.enumerable});return t};var w=(t,n,o)=>(o=t!=null?h(u(t)):{},i(n||!t||!t.__esModule?c(o,\"default\",{value:t,enumerable:!0}):o,t)),_=t=>i(c({},\"__esModule\",{value:!0}),t);var s=x((C,r)=>{r.exports=_jsx_runtime});var y={};N(y,{default:()=>p});var e=w(s());function l(t){let n={code:\"code\",h1:\"h1\",h2:\"h2\",p:\"p\",pre:\"pre\",...t.components};return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(n.h1,{children:\"Quick Start\"}),`\n`,(0,e.jsx)(n.p,{children:\"Get started with Notpadd quickly and easily.\"}),`\n`,(0,e.jsx)(n.h2,{children:\"Installation\"}),`\n`,(0,e.jsx)(n.pre,{language:\"bash\",meta:\"\",code:\"```bash\\nnpm install notpadd\\n```\",children:(0,e.jsx)(n.code,{className:\"language-bash\",children:`npm install notpadd\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Usage\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { withNotpadd } from \"notpadd\";\n\nexport default withNotpadd({\n  configPath: \"content-collections.ts\",\n})\n\nconst nextConfig => {\n  return {\n    ...withNotpadd({\n      configPath: \"content-collections.ts\",\n    }),\n  }\n}\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`import { withNotpadd } from \"notpadd\";\n\nexport default withNotpadd({\n  configPath: \"content-collections.ts\",\n})\n\nconst nextConfig => {\n  return {\n    ...withNotpadd({\n      configPath: \"content-collections.ts\",\n    }),\n  }\n}\n`})})]})}function p(t={}){let{wrapper:n}=t.components||{};return n?(0,e.jsx)(n,{...t,children:(0,e.jsx)(l,{...t})}):l(t)}return _(y);})();\n;return Component;"
  },
  {
    "title": "Configuration",
    "description": "Configure Notpadd plugin and content collections for your Next.js application",
    "content": "# Configuration\n\nConfigure Notpadd to work with your Next.js project.\n\n## Plugin Configuration\n\nThe `withNotpadd` function accepts configuration options:\n\n```typescript\nimport { withNotpadd } from \"notpadd\";\n\nexport default withNotpadd({\n  configPath: \"content-collections.ts\", // Path to your config file\n})({\n  // Your Next.js config\n});\n```\n\n### Options\n\n#### `configPath` (optional)\n\nPath to your content collections configuration file.\n\n**Default:** `\"content-collections.ts\"`\n\n**Example:**\n```typescript\nwithNotpadd({\n  configPath: \"config/content.ts\",\n})\n```\n\n## Content Collections Configuration\n\nYour `content-collections.ts` file configures both Notpadd Core and the Notpadd API integration.\n\n### Basic Configuration\n\n```typescript\nimport { defineConfig, defineCollection } from \"notpadd-core\";\nimport { notpaddSchema } from \"notpadd-core\";\n\nexport default defineConfig({\n  collections: [\n    defineCollection({\n      name: \"notpadd\",\n      directory: \"notpadd\",\n      schema: notpaddSchema,\n    }),\n  ],\n  notpadd: {\n    sk: process.env.NOTPADD_SK!,\n    pk: process.env.NOTPADD_PK!,\n    orgID: process.env.NOTPADD_ORG_ID!,\n  },\n});\n```\n\n### Notpadd Configuration Options\n\n#### `sk` (required)\n\nYour Notpadd secret key. Keep this secure and never commit it to version control.\n\n**Example:**\n```typescript\nnotpadd: {\n  sk: process.env.NOTPADD_SK!,\n  // ...\n}\n```\n\n#### `pk` (required)\n\nYour Notpadd public key.\n\n**Example:**\n```typescript\nnotpadd: {\n  pk: process.env.NOTPADD_PK!,\n  // ...\n}\n```\n\n#### `orgID` (required)\n\nYour Notpadd organization ID.\n\n**Example:**\n```typescript\nnotpadd: {\n  orgID: process.env.NOTPADD_ORG_ID!,\n  // ...\n}\n```\n\n#### `directory` (optional)\n\nThe directory where MDX files fetched from Notpadd will be stored.\n\n**Default:** `\"notpadd\"` or the first collection's directory\n\n**Example:**\n```typescript\nnotpadd: {\n  // ...\n  directory: \"content/articles\",\n}\n```\n\n#### `query` (optional)\n\nControls which articles to fetch from Notpadd.\n\n**Options:**\n- `\"all\"`: Fetch all articles (default)\n- `\"published\"`: Fetch only published articles\n- `\"draft\"`: Fetch only draft articles\n\n**Example:**\n```typescript\nnotpadd: {\n  // ...\n  query: \"published\",\n}\n```\n\n## Environment Variables\n\nStore your Notpadd credentials in environment variables:\n\n### `.env.local`\n\n```env\nNOTPADD_SK=your-secret-key-here\nNOTPADD_PK=your-public-key-here\nNOTPADD_ORG_ID=your-organization-id-here\n```\n\n### `.env.example`\n\nCreate an example file for your team:\n\n```env\nNOTPADD_SK=\nNOTPADD_PK=\nNOTPADD_ORG_ID=\n```\n\n## Multiple Collections\n\nYou can define multiple collections:\n\n```typescript\nexport default defineConfig({\n  collections: [\n    defineCollection({\n      name: \"blog\",\n      directory: \"content/blog\",\n      schema: notpaddSchema,\n    }),\n    defineCollection({\n      name: \"docs\",\n      directory: \"content/docs\",\n      schema: notpaddSchema,\n    }),\n  ],\n  notpadd: {\n    sk: process.env.NOTPADD_SK!,\n    pk: process.env.NOTPADD_PK!,\n    orgID: process.env.NOTPADD_ORG_ID!,\n    directory: \"content\", // Base directory for all collections\n  },\n});\n```\n\n## Custom Schemas\n\nUse custom schemas to match your content structure:\n\n```typescript\nimport { createNotpaddSchema } from \"notpadd-core\";\nimport { z } from \"zod\";\n\nconst customSchema = createNotpaddSchema({\n  category: z.string(),\n  featured: z.boolean(),\n  readingTime: z.number(),\n});\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: customSchema,\n});\n```\n\n## Advanced Configuration\n\n### Custom Parser\n\n```typescript\nimport { defineParser } from \"notpadd-core\";\n\nconst customParser = defineParser({\n  hasContent: true,\n  parse: (content) => {\n    // Custom parsing logic\n    return parseContent(content);\n  },\n});\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  parser: customParser,\n  schema: notpaddSchema,\n});\n```\n\n### Transform Functions\n\n```typescript\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchema,\n  transform: async (doc, { cache }) => {\n    // Transform documents\n    const html = await cache(\n      \"markdown-to-html\",\n      doc.markdown,\n      async () => {\n        return await processMarkdown(doc.markdown);\n      }\n    );\n\n    return {\n      ...doc,\n      html,\n    };\n  },\n});\n```\n\n### Filtering Content\n\n```typescript\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchema,\n  transform: async (doc, { skip }) => {\n    // Skip certain documents\n    if (doc.tags?.includes(\"archived\")) {\n      return skip(\"Archived content\");\n    }\n\n    // Only include published content\n    if (!doc.published) {\n      return skip(\"Not published\");\n    }\n\n    return doc;\n  },\n});\n```\n\n## Configuration Validation\n\nNotpadd validates your configuration at build time. Common errors:\n\n### Missing Required Fields\n\n```\nError: Notpadd configuration requires a valid 'sk' (secret key)\n```\n\n**Solution:** Ensure all required fields (`sk`, `pk`, `orgID`) are provided.\n\n### Invalid Directory\n\n```\nError: Notpadd 'directory' must be a string if provided\n```\n\n**Solution:** Ensure `directory` is a string or omit it to use the default.\n\n### API Errors\n\n```\nError: Failed to fetch data from Notpadd API: Unauthorized\n```\n\n**Solution:** Check your credentials are correct and have the right permissions.\n\n## Best Practices\n\n1. **Use Environment Variables**: Never hardcode credentials\n2. **Match Directories**: Ensure `notpadd.directory` matches your collection directory\n3. **Use TypeScript**: Get full type safety with TypeScript\n4. **Validate Early**: Check your configuration before deploying\n5. **Use Appropriate Query**: Use `\"published\"` for production builds\n\n## Example: Complete Configuration\n\n```typescript\n// content-collections.ts\nimport { defineConfig, defineCollection } from \"notpadd-core\";\nimport { notpaddSchemaPublished } from \"notpadd-core\";\nimport { remark } from \"remark\";\nimport remarkHtml from \"remark-html\";\n\nexport default defineConfig({\n  collections: [\n    defineCollection({\n      name: \"blog\",\n      directory: \"content/blog\",\n      schema: notpaddSchemaPublished,\n      transform: async (doc, { cache, skip }) => {\n        // Skip archived posts\n        if (doc.tags?.includes(\"archived\")) {\n          return skip(\"Archived post\");\n        }\n\n        // Convert markdown to HTML\n        const html = await cache(\n          \"markdown-to-html\",\n          doc.markdown,\n          async () => {\n            const result = await remark()\n              .use(remarkHtml)\n              .process(doc.markdown);\n            return result.toString();\n          }\n        );\n\n        return {\n          ...doc,\n          html,\n          readingTime: Math.ceil(doc.markdown.split(/\\s+/).length / 200),\n        };\n      },\n    }),\n  ],\n  cache: \"file\",\n  notpadd: {\n    sk: process.env.NOTPADD_SK!,\n    pk: process.env.NOTPADD_PK!,\n    orgID: process.env.NOTPADD_ORG_ID!,\n    directory: \"content/blog\",\n    query: \"published\",\n  },\n});\n```",
    "_meta": {
      "filePath": "notpadd/notpadd-configuration.mdx",
      "fileName": "notpadd-configuration.mdx",
      "directory": "notpadd",
      "extension": "mdx",
      "path": "notpadd/notpadd-configuration"
    },
    "headings": [
      {
        "level": 1,
        "text": "Configuration",
        "slug": "configuration"
      },
      {
        "level": 2,
        "text": "Plugin Configuration",
        "slug": "plugin-configuration"
      },
      {
        "level": 3,
        "text": "Options",
        "slug": "options"
      },
      {
        "level": 4,
        "text": "`configPath` (optional)",
        "slug": "configpath-optional"
      },
      {
        "level": 2,
        "text": "Content Collections Configuration",
        "slug": "content-collections-configuration"
      },
      {
        "level": 3,
        "text": "Basic Configuration",
        "slug": "basic-configuration"
      },
      {
        "level": 3,
        "text": "Notpadd Configuration Options",
        "slug": "notpadd-configuration-options"
      },
      {
        "level": 4,
        "text": "`sk` (required)",
        "slug": "sk-required"
      },
      {
        "level": 4,
        "text": "`pk` (required)",
        "slug": "pk-required"
      },
      {
        "level": 4,
        "text": "`orgID` (required)",
        "slug": "orgid-required"
      },
      {
        "level": 4,
        "text": "`directory` (optional)",
        "slug": "directory-optional"
      },
      {
        "level": 4,
        "text": "`query` (optional)",
        "slug": "query-optional"
      },
      {
        "level": 2,
        "text": "Environment Variables",
        "slug": "environment-variables"
      },
      {
        "level": 3,
        "text": "`.env.local`",
        "slug": "envlocal"
      },
      {
        "level": 3,
        "text": "`.env.example`",
        "slug": "envexample"
      },
      {
        "level": 2,
        "text": "Multiple Collections",
        "slug": "multiple-collections"
      },
      {
        "level": 2,
        "text": "Custom Schemas",
        "slug": "custom-schemas"
      },
      {
        "level": 2,
        "text": "Advanced Configuration",
        "slug": "advanced-configuration"
      },
      {
        "level": 3,
        "text": "Custom Parser",
        "slug": "custom-parser"
      },
      {
        "level": 3,
        "text": "Transform Functions",
        "slug": "transform-functions"
      },
      {
        "level": 3,
        "text": "Filtering Content",
        "slug": "filtering-content"
      },
      {
        "level": 2,
        "text": "Configuration Validation",
        "slug": "configuration-validation"
      },
      {
        "level": 3,
        "text": "Missing Required Fields",
        "slug": "missing-required-fields"
      },
      {
        "level": 3,
        "text": "Invalid Directory",
        "slug": "invalid-directory"
      },
      {
        "level": 3,
        "text": "API Errors",
        "slug": "api-errors"
      },
      {
        "level": 2,
        "text": "Best Practices",
        "slug": "best-practices"
      },
      {
        "level": 2,
        "text": "Example: Complete Configuration",
        "slug": "example-complete-configuration"
      }
    ],
    "mdx": "var Component=(()=>{var h=Object.create;var c=Object.defineProperty;var m=Object.getOwnPropertyDescriptor;var u=Object.getOwnPropertyNames;var g=Object.getPrototypeOf,f=Object.prototype.hasOwnProperty;var y=(o,n)=>()=>(n||o((n={exports:{}}).exports,n),n.exports),D=(o,n)=>{for(var r in n)c(o,r,{get:n[r],enumerable:!0})},i=(o,n,r,d)=>{if(n&&typeof n==\"object\"||typeof n==\"function\")for(let t of u(n))!f.call(o,t)&&t!==r&&c(o,t,{get:()=>n[t],enumerable:!(d=m(n,t))||d.enumerable});return o};var N=(o,n,r)=>(r=o!=null?h(g(o)):{},i(n||!o||!o.__esModule?c(r,\"default\",{value:o,enumerable:!0}):r,o)),k=o=>i(c({},\"__esModule\",{value:!0}),o);var l=y((v,a)=>{a.exports=_jsx_runtime});var P={};D(P,{default:()=>p});var e=N(l());function s(o){let n={code:\"code\",h1:\"h1\",h2:\"h2\",h3:\"h3\",h4:\"h4\",li:\"li\",ol:\"ol\",p:\"p\",pre:\"pre\",strong:\"strong\",ul:\"ul\",...o.components};return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(n.h1,{children:\"Configuration\"}),`\n`,(0,e.jsx)(n.p,{children:\"Configure Notpadd to work with your Next.js project.\"}),`\n`,(0,e.jsx)(n.h2,{children:\"Plugin Configuration\"}),`\n`,(0,e.jsxs)(n.p,{children:[\"The \",(0,e.jsx)(n.code,{children:\"withNotpadd\"}),\" function accepts configuration options:\"]}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { withNotpadd } from \"notpadd\";\n\nexport default withNotpadd({\n  configPath: \"content-collections.ts\", // Path to your config file\n})({\n  // Your Next.js config\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`import { withNotpadd } from \"notpadd\";\n\nexport default withNotpadd({\n  configPath: \"content-collections.ts\", // Path to your config file\n})({\n  // Your Next.js config\n});\n`})}),`\n`,(0,e.jsx)(n.h3,{children:\"Options\"}),`\n`,(0,e.jsxs)(n.h4,{children:[(0,e.jsx)(n.code,{children:\"configPath\"}),\" (optional)\"]}),`\n`,(0,e.jsx)(n.p,{children:\"Path to your content collections configuration file.\"}),`\n`,(0,e.jsxs)(n.p,{children:[(0,e.jsx)(n.strong,{children:\"Default:\"}),\" \",(0,e.jsx)(n.code,{children:'\"content-collections.ts\"'})]}),`\n`,(0,e.jsx)(n.p,{children:(0,e.jsx)(n.strong,{children:\"Example:\"})}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:'```typescript\\nwithNotpadd({\\n  configPath: \"config/content.ts\",\\n})\\n```',children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`withNotpadd({\n  configPath: \"config/content.ts\",\n})\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Content Collections Configuration\"}),`\n`,(0,e.jsxs)(n.p,{children:[\"Your \",(0,e.jsx)(n.code,{children:\"content-collections.ts\"}),\" file configures both Notpadd Core and the Notpadd API integration.\"]}),`\n`,(0,e.jsx)(n.h3,{children:\"Basic Configuration\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { defineConfig, defineCollection } from \"notpadd-core\";\nimport { notpaddSchema } from \"notpadd-core\";\n\nexport default defineConfig({\n  collections: [\n    defineCollection({\n      name: \"notpadd\",\n      directory: \"notpadd\",\n      schema: notpaddSchema,\n    }),\n  ],\n  notpadd: {\n    sk: process.env.NOTPADD_SK!,\n    pk: process.env.NOTPADD_PK!,\n    orgID: process.env.NOTPADD_ORG_ID!,\n  },\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`import { defineConfig, defineCollection } from \"notpadd-core\";\nimport { notpaddSchema } from \"notpadd-core\";\n\nexport default defineConfig({\n  collections: [\n    defineCollection({\n      name: \"notpadd\",\n      directory: \"notpadd\",\n      schema: notpaddSchema,\n    }),\n  ],\n  notpadd: {\n    sk: process.env.NOTPADD_SK!,\n    pk: process.env.NOTPADD_PK!,\n    orgID: process.env.NOTPADD_ORG_ID!,\n  },\n});\n`})}),`\n`,(0,e.jsx)(n.h3,{children:\"Notpadd Configuration Options\"}),`\n`,(0,e.jsxs)(n.h4,{children:[(0,e.jsx)(n.code,{children:\"sk\"}),\" (required)\"]}),`\n`,(0,e.jsx)(n.p,{children:\"Your Notpadd secret key. Keep this secure and never commit it to version control.\"}),`\n`,(0,e.jsx)(n.p,{children:(0,e.jsx)(n.strong,{children:\"Example:\"})}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:\"```typescript\\nnotpadd: {\\n  sk: process.env.NOTPADD_SK!,\\n  // ...\\n}\\n```\",children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`notpadd: {\n  sk: process.env.NOTPADD_SK!,\n  // ...\n}\n`})}),`\n`,(0,e.jsxs)(n.h4,{children:[(0,e.jsx)(n.code,{children:\"pk\"}),\" (required)\"]}),`\n`,(0,e.jsx)(n.p,{children:\"Your Notpadd public key.\"}),`\n`,(0,e.jsx)(n.p,{children:(0,e.jsx)(n.strong,{children:\"Example:\"})}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:\"```typescript\\nnotpadd: {\\n  pk: process.env.NOTPADD_PK!,\\n  // ...\\n}\\n```\",children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`notpadd: {\n  pk: process.env.NOTPADD_PK!,\n  // ...\n}\n`})}),`\n`,(0,e.jsxs)(n.h4,{children:[(0,e.jsx)(n.code,{children:\"orgID\"}),\" (required)\"]}),`\n`,(0,e.jsx)(n.p,{children:\"Your Notpadd organization ID.\"}),`\n`,(0,e.jsx)(n.p,{children:(0,e.jsx)(n.strong,{children:\"Example:\"})}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:\"```typescript\\nnotpadd: {\\n  orgID: process.env.NOTPADD_ORG_ID!,\\n  // ...\\n}\\n```\",children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`notpadd: {\n  orgID: process.env.NOTPADD_ORG_ID!,\n  // ...\n}\n`})}),`\n`,(0,e.jsxs)(n.h4,{children:[(0,e.jsx)(n.code,{children:\"directory\"}),\" (optional)\"]}),`\n`,(0,e.jsx)(n.p,{children:\"The directory where MDX files fetched from Notpadd will be stored.\"}),`\n`,(0,e.jsxs)(n.p,{children:[(0,e.jsx)(n.strong,{children:\"Default:\"}),\" \",(0,e.jsx)(n.code,{children:'\"notpadd\"'}),\" or the first collection's directory\"]}),`\n`,(0,e.jsx)(n.p,{children:(0,e.jsx)(n.strong,{children:\"Example:\"})}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:'```typescript\\nnotpadd: {\\n  // ...\\n  directory: \"content/articles\",\\n}\\n```',children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`notpadd: {\n  // ...\n  directory: \"content/articles\",\n}\n`})}),`\n`,(0,e.jsxs)(n.h4,{children:[(0,e.jsx)(n.code,{children:\"query\"}),\" (optional)\"]}),`\n`,(0,e.jsx)(n.p,{children:\"Controls which articles to fetch from Notpadd.\"}),`\n`,(0,e.jsx)(n.p,{children:(0,e.jsx)(n.strong,{children:\"Options:\"})}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:'\"all\"'}),\": Fetch all articles (default)\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:'\"published\"'}),\": Fetch only published articles\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.code,{children:'\"draft\"'}),\": Fetch only draft articles\"]}),`\n`]}),`\n`,(0,e.jsx)(n.p,{children:(0,e.jsx)(n.strong,{children:\"Example:\"})}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:'```typescript\\nnotpadd: {\\n  // ...\\n  query: \"published\",\\n}\\n```',children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`notpadd: {\n  // ...\n  query: \"published\",\n}\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Environment Variables\"}),`\n`,(0,e.jsx)(n.p,{children:\"Store your Notpadd credentials in environment variables:\"}),`\n`,(0,e.jsx)(n.h3,{children:(0,e.jsx)(n.code,{children:\".env.local\"})}),`\n`,(0,e.jsx)(n.pre,{language:\"env\",meta:\"\",code:\"```env\\nNOTPADD_SK=your-secret-key-here\\nNOTPADD_PK=your-public-key-here\\nNOTPADD_ORG_ID=your-organization-id-here\\n```\",children:(0,e.jsx)(n.code,{className:\"language-env\",children:`NOTPADD_SK=your-secret-key-here\nNOTPADD_PK=your-public-key-here\nNOTPADD_ORG_ID=your-organization-id-here\n`})}),`\n`,(0,e.jsx)(n.h3,{children:(0,e.jsx)(n.code,{children:\".env.example\"})}),`\n`,(0,e.jsx)(n.p,{children:\"Create an example file for your team:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"env\",meta:\"\",code:\"```env\\nNOTPADD_SK=\\nNOTPADD_PK=\\nNOTPADD_ORG_ID=\\n```\",children:(0,e.jsx)(n.code,{className:\"language-env\",children:`NOTPADD_SK=\nNOTPADD_PK=\nNOTPADD_ORG_ID=\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Multiple Collections\"}),`\n`,(0,e.jsx)(n.p,{children:\"You can define multiple collections:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nexport default defineConfig({\n  collections: [\n    defineCollection({\n      name: \"blog\",\n      directory: \"content/blog\",\n      schema: notpaddSchema,\n    }),\n    defineCollection({\n      name: \"docs\",\n      directory: \"content/docs\",\n      schema: notpaddSchema,\n    }),\n  ],\n  notpadd: {\n    sk: process.env.NOTPADD_SK!,\n    pk: process.env.NOTPADD_PK!,\n    orgID: process.env.NOTPADD_ORG_ID!,\n    directory: \"content\", // Base directory for all collections\n  },\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`export default defineConfig({\n  collections: [\n    defineCollection({\n      name: \"blog\",\n      directory: \"content/blog\",\n      schema: notpaddSchema,\n    }),\n    defineCollection({\n      name: \"docs\",\n      directory: \"content/docs\",\n      schema: notpaddSchema,\n    }),\n  ],\n  notpadd: {\n    sk: process.env.NOTPADD_SK!,\n    pk: process.env.NOTPADD_PK!,\n    orgID: process.env.NOTPADD_ORG_ID!,\n    directory: \"content\", // Base directory for all collections\n  },\n});\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Custom Schemas\"}),`\n`,(0,e.jsx)(n.p,{children:\"Use custom schemas to match your content structure:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { createNotpaddSchema } from \"notpadd-core\";\nimport { z } from \"zod\";\n\nconst customSchema = createNotpaddSchema({\n  category: z.string(),\n  featured: z.boolean(),\n  readingTime: z.number(),\n});\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: customSchema,\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`import { createNotpaddSchema } from \"notpadd-core\";\nimport { z } from \"zod\";\n\nconst customSchema = createNotpaddSchema({\n  category: z.string(),\n  featured: z.boolean(),\n  readingTime: z.number(),\n});\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: customSchema,\n});\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Advanced Configuration\"}),`\n`,(0,e.jsx)(n.h3,{children:\"Custom Parser\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { defineParser } from \"notpadd-core\";\n\nconst customParser = defineParser({\n  hasContent: true,\n  parse: (content) => {\n    // Custom parsing logic\n    return parseContent(content);\n  },\n});\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  parser: customParser,\n  schema: notpaddSchema,\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`import { defineParser } from \"notpadd-core\";\n\nconst customParser = defineParser({\n  hasContent: true,\n  parse: (content) => {\n    // Custom parsing logic\n    return parseContent(content);\n  },\n});\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  parser: customParser,\n  schema: notpaddSchema,\n});\n`})}),`\n`,(0,e.jsx)(n.h3,{children:\"Transform Functions\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchema,\n  transform: async (doc, { cache }) => {\n    // Transform documents\n    const html = await cache(\n      \"markdown-to-html\",\n      doc.markdown,\n      async () => {\n        return await processMarkdown(doc.markdown);\n      }\n    );\n\n    return {\n      ...doc,\n      html,\n    };\n  },\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`defineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchema,\n  transform: async (doc, { cache }) => {\n    // Transform documents\n    const html = await cache(\n      \"markdown-to-html\",\n      doc.markdown,\n      async () => {\n        return await processMarkdown(doc.markdown);\n      }\n    );\n\n    return {\n      ...doc,\n      html,\n    };\n  },\n});\n`})}),`\n`,(0,e.jsx)(n.h3,{children:\"Filtering Content\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchema,\n  transform: async (doc, { skip }) => {\n    // Skip certain documents\n    if (doc.tags?.includes(\"archived\")) {\n      return skip(\"Archived content\");\n    }\n\n    // Only include published content\n    if (!doc.published) {\n      return skip(\"Not published\");\n    }\n\n    return doc;\n  },\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`defineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchema,\n  transform: async (doc, { skip }) => {\n    // Skip certain documents\n    if (doc.tags?.includes(\"archived\")) {\n      return skip(\"Archived content\");\n    }\n\n    // Only include published content\n    if (!doc.published) {\n      return skip(\"Not published\");\n    }\n\n    return doc;\n  },\n});\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Configuration Validation\"}),`\n`,(0,e.jsx)(n.p,{children:\"Notpadd validates your configuration at build time. Common errors:\"}),`\n`,(0,e.jsx)(n.h3,{children:\"Missing Required Fields\"}),`\n`,(0,e.jsx)(n.pre,{children:(0,e.jsx)(n.code,{children:`Error: Notpadd configuration requires a valid 'sk' (secret key)\n`})}),`\n`,(0,e.jsxs)(n.p,{children:[(0,e.jsx)(n.strong,{children:\"Solution:\"}),\" Ensure all required fields (\",(0,e.jsx)(n.code,{children:\"sk\"}),\", \",(0,e.jsx)(n.code,{children:\"pk\"}),\", \",(0,e.jsx)(n.code,{children:\"orgID\"}),\") are provided.\"]}),`\n`,(0,e.jsx)(n.h3,{children:\"Invalid Directory\"}),`\n`,(0,e.jsx)(n.pre,{children:(0,e.jsx)(n.code,{children:`Error: Notpadd 'directory' must be a string if provided\n`})}),`\n`,(0,e.jsxs)(n.p,{children:[(0,e.jsx)(n.strong,{children:\"Solution:\"}),\" Ensure \",(0,e.jsx)(n.code,{children:\"directory\"}),\" is a string or omit it to use the default.\"]}),`\n`,(0,e.jsx)(n.h3,{children:\"API Errors\"}),`\n`,(0,e.jsx)(n.pre,{children:(0,e.jsx)(n.code,{children:`Error: Failed to fetch data from Notpadd API: Unauthorized\n`})}),`\n`,(0,e.jsxs)(n.p,{children:[(0,e.jsx)(n.strong,{children:\"Solution:\"}),\" Check your credentials are correct and have the right permissions.\"]}),`\n`,(0,e.jsx)(n.h2,{children:\"Best Practices\"}),`\n`,(0,e.jsxs)(n.ol,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Use Environment Variables\"}),\": Never hardcode credentials\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Match Directories\"}),\": Ensure \",(0,e.jsx)(n.code,{children:\"notpadd.directory\"}),\" matches your collection directory\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Use TypeScript\"}),\": Get full type safety with TypeScript\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Validate Early\"}),\": Check your configuration before deploying\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Use Appropriate Query\"}),\": Use \",(0,e.jsx)(n.code,{children:'\"published\"'}),\" for production builds\"]}),`\n`]}),`\n`,(0,e.jsx)(n.h2,{children:\"Example: Complete Configuration\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\n// content-collections.ts\nimport { defineConfig, defineCollection } from \"notpadd-core\";\nimport { notpaddSchemaPublished } from \"notpadd-core\";\nimport { remark } from \"remark\";\nimport remarkHtml from \"remark-html\";\n\nexport default defineConfig({\n  collections: [\n    defineCollection({\n      name: \"blog\",\n      directory: \"content/blog\",\n      schema: notpaddSchemaPublished,\n      transform: async (doc, { cache, skip }) => {\n        // Skip archived posts\n        if (doc.tags?.includes(\"archived\")) {\n          return skip(\"Archived post\");\n        }\n\n        // Convert markdown to HTML\n        const html = await cache(\n          \"markdown-to-html\",\n          doc.markdown,\n          async () => {\n            const result = await remark()\n              .use(remarkHtml)\n              .process(doc.markdown);\n            return result.toString();\n          }\n        );\n\n        return {\n          ...doc,\n          html,\n          readingTime: Math.ceil(doc.markdown.split(/\\\\s+/).length / 200),\n        };\n      },\n    }),\n  ],\n  cache: \"file\",\n  notpadd: {\n    sk: process.env.NOTPADD_SK!,\n    pk: process.env.NOTPADD_PK!,\n    orgID: process.env.NOTPADD_ORG_ID!,\n    directory: \"content/blog\",\n    query: \"published\",\n  },\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`// content-collections.ts\nimport { defineConfig, defineCollection } from \"notpadd-core\";\nimport { notpaddSchemaPublished } from \"notpadd-core\";\nimport { remark } from \"remark\";\nimport remarkHtml from \"remark-html\";\n\nexport default defineConfig({\n  collections: [\n    defineCollection({\n      name: \"blog\",\n      directory: \"content/blog\",\n      schema: notpaddSchemaPublished,\n      transform: async (doc, { cache, skip }) => {\n        // Skip archived posts\n        if (doc.tags?.includes(\"archived\")) {\n          return skip(\"Archived post\");\n        }\n\n        // Convert markdown to HTML\n        const html = await cache(\n          \"markdown-to-html\",\n          doc.markdown,\n          async () => {\n            const result = await remark()\n              .use(remarkHtml)\n              .process(doc.markdown);\n            return result.toString();\n          }\n        );\n\n        return {\n          ...doc,\n          html,\n          readingTime: Math.ceil(doc.markdown.split(/\\\\s+/).length / 200),\n        };\n      },\n    }),\n  ],\n  cache: \"file\",\n  notpadd: {\n    sk: process.env.NOTPADD_SK!,\n    pk: process.env.NOTPADD_PK!,\n    orgID: process.env.NOTPADD_ORG_ID!,\n    directory: \"content/blog\",\n    query: \"published\",\n  },\n});\n`})})]})}function p(o={}){let{wrapper:n}=o.components||{};return n?(0,e.jsx)(n,{...o,children:(0,e.jsx)(s,{...o})}):s(o)}return k(P);})();\n;return Component;"
  },
  {
    "title": "Getting Started",
    "description": "Step-by-step guide to set up Notpadd in your Next.js project",
    "content": "# Getting Started\n\nGet started with Notpadd in your Next.js project in minutes.\n\n## Prerequisites\n\n- Next.js 12, 13, 14, or 15\n- Node.js 18 or later\n- A Notpadd account and organization\n\n## Step 1: Install Dependencies\n\n```bash\nnpm install notpadd notpadd-core\n```\n\n## Step 2: Get Your Notpadd Credentials\n\n1. Log in to your Notpadd account\n2. Navigate to your organization settings\n3. Copy your:\n   - Secret Key (`sk`)\n   - Public Key (`pk`)\n   - Organization ID (`orgID`)\n\n## Step 3: Set Environment Variables\n\nCreate a `.env.local` file:\n\n```env\nNOTPADD_SK=your-secret-key\nNOTPADD_PK=your-public-key\nNOTPADD_ORG_ID=your-organization-id\n```\n\n## Step 4: Configure Next.js\n\nUpdate your `next.config.ts`:\n\n```typescript\nimport { withNotpadd } from \"notpadd\";\nimport type { NextConfig } from \"next\";\n\nconst nextConfig: NextConfig = {\n  // Your existing Next.js config\n};\n\nexport default withNotpadd({\n  configPath: \"content-collections.ts\",\n})(nextConfig);\n```\n\n## Step 5: Create Content Collections Config\n\nCreate `content-collections.ts` in your project root:\n\n```typescript\nimport { defineConfig, defineCollection } from \"notpadd-core\";\nimport { notpaddSchema } from \"notpadd-core\";\n\nexport default defineConfig({\n  collections: [\n    defineCollection({\n      name: \"notpadd\",\n      directory: \"notpadd\",\n      schema: notpaddSchema,\n    }),\n  ],\n  notpadd: {\n    sk: process.env.NOTPADD_SK!,\n    pk: process.env.NOTPADD_PK!,\n    orgID: process.env.NOTPADD_ORG_ID!,\n    query: \"published\", // or \"all\" | \"draft\"\n  },\n});\n```\n\n## Step 6: Use Content in Your App\n\n### In a Page Component\n\n```typescript\n// app/blog/page.tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\n\nexport default function BlogPage() {\n  return (\n    <div className=\"container mx-auto py-8\">\n      <h1 className=\"text-3xl font-bold mb-8\">Blog</h1>\n      <div className=\"grid gap-6\">\n        {allNotpadd.map((post) => (\n          <article key={post.slug} className=\"border p-6 rounded-lg\">\n            <h2 className=\"text-2xl font-semibold mb-2\">{post.title}</h2>\n            <p className=\"text-gray-600 mb-4\">{post.description}</p>\n            <a\n              href={`/blog/${post.slug}`}\n              className=\"text-blue-600 hover:underline\"\n            >\n              Read more →\n            </a>\n          </article>\n        ))}\n      </div>\n    </div>\n  );\n}\n```\n\n### In a Dynamic Route\n\n```typescript\n// app/blog/[slug]/page.tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\nimport { notFound } from \"next/navigation\";\n\nexport async function generateStaticParams() {\n  return allNotpadd.map((post) => ({\n    slug: post.slug,\n  }));\n}\n\nexport default function BlogPostPage({\n  params,\n}: {\n  params: { slug: string };\n}) {\n  const post = allNotpadd.find((p) => p.slug === params.slug);\n\n  if (!post) {\n    notFound();\n  }\n\n  return (\n    <article className=\"container mx-auto py-8 max-w-3xl\">\n      <h1 className=\"text-4xl font-bold mb-4\">{post.title}</h1>\n      <p className=\"text-xl text-gray-600 mb-8\">{post.description}</p>\n      <div className=\"prose\">\n        {/* Render markdown content */}\n        {post.markdown}\n      </div>\n    </article>\n  );\n}\n```\n\n## Step 7: Run Your Development Server\n\n```bash\nnpm run dev\n```\n\nThe first time you run this, Notpadd will:\n1. Fetch content from the Notpadd API\n2. Generate MDX files in the `notpadd/` directory\n3. Process collections\n4. Generate TypeScript types\n\n## Step 8: Build for Production\n\n```bash\nnpm run build\n```\n\nThis will fetch the latest content and generate static pages.\n\n## Customizing Your Setup\n\n### Using a Custom Directory\n\n```typescript\nexport default defineConfig({\n  collections: [\n    defineCollection({\n      name: \"articles\",\n      directory: \"content/articles\", // Custom directory\n      schema: notpaddSchema,\n    }),\n  ],\n  notpadd: {\n    // ...\n    directory: \"content/articles\", // Match collection directory\n  },\n});\n```\n\n### Filtering Content\n\n```typescript\nimport { notpaddSchemaPublished } from \"notpadd-core\";\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchemaPublished, // Only published articles\n  transform: async (doc, { skip }) => {\n    // Additional filtering\n    if (doc.tags?.includes(\"archived\")) {\n      return skip(\"Archived post\");\n    }\n    return doc;\n  },\n});\n```\n\n### Transforming Content\n\n```typescript\nimport { remark } from \"remark\";\nimport remarkHtml from \"remark-html\";\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchema,\n  transform: async (doc, { cache }) => {\n    const html = await cache(\n      \"markdown-to-html\",\n      doc.markdown,\n      async () => {\n        const result = await remark()\n          .use(remarkHtml)\n          .process(doc.markdown);\n        return result.toString();\n      }\n    );\n\n    return {\n      ...doc,\n      html,\n    };\n  },\n});\n```\n\n## Troubleshooting\n\n### Content Not Appearing\n\n1. Check your environment variables are set correctly\n2. Verify your Notpadd credentials are valid\n3. Ensure you have articles in your Notpadd organization\n4. Check the `query` option matches your content status\n\n### Type Errors\n\nRun the type generation:\n\n```bash\nnpx next build\n```\n\nOr use the typegen command if available:\n\n```bash\nnpm run typegen\n```\n\n### Build Errors\n\n1. Ensure `notpadd-core` is installed\n2. Check your `content-collections.ts` syntax\n3. Verify your schema matches your content structure\n\n## Next Steps\n\n- Learn about [Configuration Options](/docs/notpadd-configuration)\n- Explore [Next.js Integration](/docs/notpadd-nextjs)\n- See [Advanced Usage](/docs/notpadd-advanced)",
    "_meta": {
      "filePath": "notpadd/notpadd-getting-started.mdx",
      "fileName": "notpadd-getting-started.mdx",
      "directory": "notpadd",
      "extension": "mdx",
      "path": "notpadd/notpadd-getting-started"
    },
    "headings": [
      {
        "level": 1,
        "text": "Getting Started",
        "slug": "getting-started"
      },
      {
        "level": 2,
        "text": "Prerequisites",
        "slug": "prerequisites"
      },
      {
        "level": 2,
        "text": "Step 1: Install Dependencies",
        "slug": "step-1-install-dependencies"
      },
      {
        "level": 2,
        "text": "Step 2: Get Your Notpadd Credentials",
        "slug": "step-2-get-your-notpadd-credentials"
      },
      {
        "level": 2,
        "text": "Step 3: Set Environment Variables",
        "slug": "step-3-set-environment-variables"
      },
      {
        "level": 2,
        "text": "Step 4: Configure Next.js",
        "slug": "step-4-configure-nextjs"
      },
      {
        "level": 2,
        "text": "Step 5: Create Content Collections Config",
        "slug": "step-5-create-content-collections-config"
      },
      {
        "level": 2,
        "text": "Step 6: Use Content in Your App",
        "slug": "step-6-use-content-in-your-app"
      },
      {
        "level": 3,
        "text": "In a Page Component",
        "slug": "in-a-page-component"
      },
      {
        "level": 3,
        "text": "In a Dynamic Route",
        "slug": "in-a-dynamic-route"
      },
      {
        "level": 2,
        "text": "Step 7: Run Your Development Server",
        "slug": "step-7-run-your-development-server"
      },
      {
        "level": 2,
        "text": "Step 8: Build for Production",
        "slug": "step-8-build-for-production"
      },
      {
        "level": 2,
        "text": "Customizing Your Setup",
        "slug": "customizing-your-setup"
      },
      {
        "level": 3,
        "text": "Using a Custom Directory",
        "slug": "using-a-custom-directory"
      },
      {
        "level": 3,
        "text": "Filtering Content",
        "slug": "filtering-content"
      },
      {
        "level": 3,
        "text": "Transforming Content",
        "slug": "transforming-content"
      },
      {
        "level": 2,
        "text": "Troubleshooting",
        "slug": "troubleshooting"
      },
      {
        "level": 3,
        "text": "Content Not Appearing",
        "slug": "content-not-appearing"
      },
      {
        "level": 3,
        "text": "Type Errors",
        "slug": "type-errors"
      },
      {
        "level": 3,
        "text": "Build Errors",
        "slug": "build-errors"
      },
      {
        "level": 2,
        "text": "Next Steps",
        "slug": "next-steps"
      }
    ],
    "mdx": "var Component=(()=>{var h=Object.create;var a=Object.defineProperty;var m=Object.getOwnPropertyDescriptor;var u=Object.getOwnPropertyNames;var g=Object.getPrototypeOf,f=Object.prototype.hasOwnProperty;var y=(t,n)=>()=>(n||t((n={exports:{}}).exports,n),n.exports),x=(t,n)=>{for(var o in n)a(t,o,{get:n[o],enumerable:!0})},i=(t,n,o,d)=>{if(n&&typeof n==\"object\"||typeof n==\"function\")for(let r of u(n))!f.call(t,r)&&r!==o&&a(t,r,{get:()=>n[r],enumerable:!(d=m(n,r))||d.enumerable});return t};var N=(t,n,o)=>(o=t!=null?h(g(t)):{},i(n||!t||!t.__esModule?a(o,\"default\",{value:t,enumerable:!0}):o,t)),b=t=>i(a({},\"__esModule\",{value:!0}),t);var l=y((k,c)=>{c.exports=_jsx_runtime});var C={};x(C,{default:()=>p});var e=N(l());function s(t){let n={a:\"a\",code:\"code\",h1:\"h1\",h2:\"h2\",h3:\"h3\",li:\"li\",ol:\"ol\",p:\"p\",pre:\"pre\",ul:\"ul\",...t.components};return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(n.h1,{children:\"Getting Started\"}),`\n`,(0,e.jsx)(n.p,{children:\"Get started with Notpadd in your Next.js project in minutes.\"}),`\n`,(0,e.jsx)(n.h2,{children:\"Prerequisites\"}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsx)(n.li,{children:\"Next.js 12, 13, 14, or 15\"}),`\n`,(0,e.jsx)(n.li,{children:\"Node.js 18 or later\"}),`\n`,(0,e.jsx)(n.li,{children:\"A Notpadd account and organization\"}),`\n`]}),`\n`,(0,e.jsx)(n.h2,{children:\"Step 1: Install Dependencies\"}),`\n`,(0,e.jsx)(n.pre,{language:\"bash\",meta:\"\",code:\"```bash\\nnpm install notpadd notpadd-core\\n```\",children:(0,e.jsx)(n.code,{className:\"language-bash\",children:`npm install notpadd notpadd-core\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Step 2: Get Your Notpadd Credentials\"}),`\n`,(0,e.jsxs)(n.ol,{children:[`\n`,(0,e.jsx)(n.li,{children:\"Log in to your Notpadd account\"}),`\n`,(0,e.jsx)(n.li,{children:\"Navigate to your organization settings\"}),`\n`,(0,e.jsxs)(n.li,{children:[\"Copy your:\",`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[\"Secret Key (\",(0,e.jsx)(n.code,{children:\"sk\"}),\")\"]}),`\n`,(0,e.jsxs)(n.li,{children:[\"Public Key (\",(0,e.jsx)(n.code,{children:\"pk\"}),\")\"]}),`\n`,(0,e.jsxs)(n.li,{children:[\"Organization ID (\",(0,e.jsx)(n.code,{children:\"orgID\"}),\")\"]}),`\n`]}),`\n`]}),`\n`]}),`\n`,(0,e.jsx)(n.h2,{children:\"Step 3: Set Environment Variables\"}),`\n`,(0,e.jsxs)(n.p,{children:[\"Create a \",(0,e.jsx)(n.code,{children:\".env.local\"}),\" file:\"]}),`\n`,(0,e.jsx)(n.pre,{language:\"env\",meta:\"\",code:\"```env\\nNOTPADD_SK=your-secret-key\\nNOTPADD_PK=your-public-key\\nNOTPADD_ORG_ID=your-organization-id\\n```\",children:(0,e.jsx)(n.code,{className:\"language-env\",children:`NOTPADD_SK=your-secret-key\nNOTPADD_PK=your-public-key\nNOTPADD_ORG_ID=your-organization-id\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Step 4: Configure Next.js\"}),`\n`,(0,e.jsxs)(n.p,{children:[\"Update your \",(0,e.jsx)(n.code,{children:\"next.config.ts\"}),\":\"]}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { withNotpadd } from \"notpadd\";\nimport type { NextConfig } from \"next\";\n\nconst nextConfig: NextConfig = {\n  // Your existing Next.js config\n};\n\nexport default withNotpadd({\n  configPath: \"content-collections.ts\",\n})(nextConfig);\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`import { withNotpadd } from \"notpadd\";\nimport type { NextConfig } from \"next\";\n\nconst nextConfig: NextConfig = {\n  // Your existing Next.js config\n};\n\nexport default withNotpadd({\n  configPath: \"content-collections.ts\",\n})(nextConfig);\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Step 5: Create Content Collections Config\"}),`\n`,(0,e.jsxs)(n.p,{children:[\"Create \",(0,e.jsx)(n.code,{children:\"content-collections.ts\"}),\" in your project root:\"]}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { defineConfig, defineCollection } from \"notpadd-core\";\nimport { notpaddSchema } from \"notpadd-core\";\n\nexport default defineConfig({\n  collections: [\n    defineCollection({\n      name: \"notpadd\",\n      directory: \"notpadd\",\n      schema: notpaddSchema,\n    }),\n  ],\n  notpadd: {\n    sk: process.env.NOTPADD_SK!,\n    pk: process.env.NOTPADD_PK!,\n    orgID: process.env.NOTPADD_ORG_ID!,\n    query: \"published\", // or \"all\" | \"draft\"\n  },\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`import { defineConfig, defineCollection } from \"notpadd-core\";\nimport { notpaddSchema } from \"notpadd-core\";\n\nexport default defineConfig({\n  collections: [\n    defineCollection({\n      name: \"notpadd\",\n      directory: \"notpadd\",\n      schema: notpaddSchema,\n    }),\n  ],\n  notpadd: {\n    sk: process.env.NOTPADD_SK!,\n    pk: process.env.NOTPADD_PK!,\n    orgID: process.env.NOTPADD_ORG_ID!,\n    query: \"published\", // or \"all\" | \"draft\"\n  },\n});\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Step 6: Use Content in Your App\"}),`\n`,(0,e.jsx)(n.h3,{children:\"In a Page Component\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\n// app/blog/page.tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\n\nexport default function BlogPage() {\n  return (\n    <div className=\"container mx-auto py-8\">\n      <h1 className=\"text-3xl font-bold mb-8\">Blog</h1>\n      <div className=\"grid gap-6\">\n        {allNotpadd.map((post) => (\n          <article key={post.slug} className=\"border p-6 rounded-lg\">\n            <h2 className=\"text-2xl font-semibold mb-2\">{post.title}</h2>\n            <p className=\"text-gray-600 mb-4\">{post.description}</p>\n            <a\n              href={\\`/blog/\\${post.slug}\\`}\n              className=\"text-blue-600 hover:underline\"\n            >\n              Read more \\u2192\n            </a>\n          </article>\n        ))}\n      </div>\n    </div>\n  );\n}\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`// app/blog/page.tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\n\nexport default function BlogPage() {\n  return (\n    <div className=\"container mx-auto py-8\">\n      <h1 className=\"text-3xl font-bold mb-8\">Blog</h1>\n      <div className=\"grid gap-6\">\n        {allNotpadd.map((post) => (\n          <article key={post.slug} className=\"border p-6 rounded-lg\">\n            <h2 className=\"text-2xl font-semibold mb-2\">{post.title}</h2>\n            <p className=\"text-gray-600 mb-4\">{post.description}</p>\n            <a\n              href={\\`/blog/\\${post.slug}\\`}\n              className=\"text-blue-600 hover:underline\"\n            >\n              Read more \\u2192\n            </a>\n          </article>\n        ))}\n      </div>\n    </div>\n  );\n}\n`})}),`\n`,(0,e.jsx)(n.h3,{children:\"In a Dynamic Route\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\n// app/blog/[slug]/page.tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\nimport { notFound } from \"next/navigation\";\n\nexport async function generateStaticParams() {\n  return allNotpadd.map((post) => ({\n    slug: post.slug,\n  }));\n}\n\nexport default function BlogPostPage({\n  params,\n}: {\n  params: { slug: string };\n}) {\n  const post = allNotpadd.find((p) => p.slug === params.slug);\n\n  if (!post) {\n    notFound();\n  }\n\n  return (\n    <article className=\"container mx-auto py-8 max-w-3xl\">\n      <h1 className=\"text-4xl font-bold mb-4\">{post.title}</h1>\n      <p className=\"text-xl text-gray-600 mb-8\">{post.description}</p>\n      <div className=\"prose\">\n        {/* Render markdown content */}\n        {post.markdown}\n      </div>\n    </article>\n  );\n}\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`// app/blog/[slug]/page.tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\nimport { notFound } from \"next/navigation\";\n\nexport async function generateStaticParams() {\n  return allNotpadd.map((post) => ({\n    slug: post.slug,\n  }));\n}\n\nexport default function BlogPostPage({\n  params,\n}: {\n  params: { slug: string };\n}) {\n  const post = allNotpadd.find((p) => p.slug === params.slug);\n\n  if (!post) {\n    notFound();\n  }\n\n  return (\n    <article className=\"container mx-auto py-8 max-w-3xl\">\n      <h1 className=\"text-4xl font-bold mb-4\">{post.title}</h1>\n      <p className=\"text-xl text-gray-600 mb-8\">{post.description}</p>\n      <div className=\"prose\">\n        {/* Render markdown content */}\n        {post.markdown}\n      </div>\n    </article>\n  );\n}\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Step 7: Run Your Development Server\"}),`\n`,(0,e.jsx)(n.pre,{language:\"bash\",meta:\"\",code:\"```bash\\nnpm run dev\\n```\",children:(0,e.jsx)(n.code,{className:\"language-bash\",children:`npm run dev\n`})}),`\n`,(0,e.jsx)(n.p,{children:\"The first time you run this, Notpadd will:\"}),`\n`,(0,e.jsxs)(n.ol,{children:[`\n`,(0,e.jsx)(n.li,{children:\"Fetch content from the Notpadd API\"}),`\n`,(0,e.jsxs)(n.li,{children:[\"Generate MDX files in the \",(0,e.jsx)(n.code,{children:\"notpadd/\"}),\" directory\"]}),`\n`,(0,e.jsx)(n.li,{children:\"Process collections\"}),`\n`,(0,e.jsx)(n.li,{children:\"Generate TypeScript types\"}),`\n`]}),`\n`,(0,e.jsx)(n.h2,{children:\"Step 8: Build for Production\"}),`\n`,(0,e.jsx)(n.pre,{language:\"bash\",meta:\"\",code:\"```bash\\nnpm run build\\n```\",children:(0,e.jsx)(n.code,{className:\"language-bash\",children:`npm run build\n`})}),`\n`,(0,e.jsx)(n.p,{children:\"This will fetch the latest content and generate static pages.\"}),`\n`,(0,e.jsx)(n.h2,{children:\"Customizing Your Setup\"}),`\n`,(0,e.jsx)(n.h3,{children:\"Using a Custom Directory\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nexport default defineConfig({\n  collections: [\n    defineCollection({\n      name: \"articles\",\n      directory: \"content/articles\", // Custom directory\n      schema: notpaddSchema,\n    }),\n  ],\n  notpadd: {\n    // ...\n    directory: \"content/articles\", // Match collection directory\n  },\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`export default defineConfig({\n  collections: [\n    defineCollection({\n      name: \"articles\",\n      directory: \"content/articles\", // Custom directory\n      schema: notpaddSchema,\n    }),\n  ],\n  notpadd: {\n    // ...\n    directory: \"content/articles\", // Match collection directory\n  },\n});\n`})}),`\n`,(0,e.jsx)(n.h3,{children:\"Filtering Content\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { notpaddSchemaPublished } from \"notpadd-core\";\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchemaPublished, // Only published articles\n  transform: async (doc, { skip }) => {\n    // Additional filtering\n    if (doc.tags?.includes(\"archived\")) {\n      return skip(\"Archived post\");\n    }\n    return doc;\n  },\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`import { notpaddSchemaPublished } from \"notpadd-core\";\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchemaPublished, // Only published articles\n  transform: async (doc, { skip }) => {\n    // Additional filtering\n    if (doc.tags?.includes(\"archived\")) {\n      return skip(\"Archived post\");\n    }\n    return doc;\n  },\n});\n`})}),`\n`,(0,e.jsx)(n.h3,{children:\"Transforming Content\"}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { remark } from \"remark\";\nimport remarkHtml from \"remark-html\";\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchema,\n  transform: async (doc, { cache }) => {\n    const html = await cache(\n      \"markdown-to-html\",\n      doc.markdown,\n      async () => {\n        const result = await remark()\n          .use(remarkHtml)\n          .process(doc.markdown);\n        return result.toString();\n      }\n    );\n\n    return {\n      ...doc,\n      html,\n    };\n  },\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`import { remark } from \"remark\";\nimport remarkHtml from \"remark-html\";\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchema,\n  transform: async (doc, { cache }) => {\n    const html = await cache(\n      \"markdown-to-html\",\n      doc.markdown,\n      async () => {\n        const result = await remark()\n          .use(remarkHtml)\n          .process(doc.markdown);\n        return result.toString();\n      }\n    );\n\n    return {\n      ...doc,\n      html,\n    };\n  },\n});\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Troubleshooting\"}),`\n`,(0,e.jsx)(n.h3,{children:\"Content Not Appearing\"}),`\n`,(0,e.jsxs)(n.ol,{children:[`\n`,(0,e.jsx)(n.li,{children:\"Check your environment variables are set correctly\"}),`\n`,(0,e.jsx)(n.li,{children:\"Verify your Notpadd credentials are valid\"}),`\n`,(0,e.jsx)(n.li,{children:\"Ensure you have articles in your Notpadd organization\"}),`\n`,(0,e.jsxs)(n.li,{children:[\"Check the \",(0,e.jsx)(n.code,{children:\"query\"}),\" option matches your content status\"]}),`\n`]}),`\n`,(0,e.jsx)(n.h3,{children:\"Type Errors\"}),`\n`,(0,e.jsx)(n.p,{children:\"Run the type generation:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"bash\",meta:\"\",code:\"```bash\\nnpx next build\\n```\",children:(0,e.jsx)(n.code,{className:\"language-bash\",children:`npx next build\n`})}),`\n`,(0,e.jsx)(n.p,{children:\"Or use the typegen command if available:\"}),`\n`,(0,e.jsx)(n.pre,{language:\"bash\",meta:\"\",code:\"```bash\\nnpm run typegen\\n```\",children:(0,e.jsx)(n.code,{className:\"language-bash\",children:`npm run typegen\n`})}),`\n`,(0,e.jsx)(n.h3,{children:\"Build Errors\"}),`\n`,(0,e.jsxs)(n.ol,{children:[`\n`,(0,e.jsxs)(n.li,{children:[\"Ensure \",(0,e.jsx)(n.code,{children:\"notpadd-core\"}),\" is installed\"]}),`\n`,(0,e.jsxs)(n.li,{children:[\"Check your \",(0,e.jsx)(n.code,{children:\"content-collections.ts\"}),\" syntax\"]}),`\n`,(0,e.jsx)(n.li,{children:\"Verify your schema matches your content structure\"}),`\n`]}),`\n`,(0,e.jsx)(n.h2,{children:\"Next Steps\"}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[\"Learn about \",(0,e.jsx)(n.a,{href:\"/docs/notpadd-configuration\",children:\"Configuration Options\"})]}),`\n`,(0,e.jsxs)(n.li,{children:[\"Explore \",(0,e.jsx)(n.a,{href:\"/docs/notpadd-nextjs\",children:\"Next.js Integration\"})]}),`\n`,(0,e.jsxs)(n.li,{children:[\"See \",(0,e.jsx)(n.a,{href:\"/docs/notpadd-advanced\",children:\"Advanced Usage\"})]}),`\n`]})]})}function p(t={}){let{wrapper:n}=t.components||{};return n?(0,e.jsx)(n,{...t,children:(0,e.jsx)(s,{...t})}):s(t)}return b(C);})();\n;return Component;"
  },
  {
    "title": "Next.js Integration",
    "description": "Learn how Notpadd integrates with Next.js App Router and Pages Router",
    "content": "# Next.js Integration\n\nLearn how Notpadd integrates with Next.js and how to use it in your application.\n\n## Plugin Setup\n\nThe `withNotpadd` plugin wraps your **Next**.js configuration:\n\n```typescript\n// next.config.ts\nimport { withNotpadd } from \"notpadd\";\nimport type { NextConfig } from \"next\";\n\nconst nextConfig: NextConfig = {\n  // Your Next.js configuration\n};\n\nexport default withNotpadd({\n  configPath: \"content-collections.ts\",\n})(nextConfig);\n```\n\n## How It Works\n\n### Build Time\n\nDuring `next build`:\n\n1. Notpadd fetches content from the API\n2. Generates MDX files in your project\n3. Processes collections using Notpadd Core\n4. Generates TypeScript types\n5. Next.js builds your application with the content\n\n### Development Mode\n\nDuring `next dev`:\n\n1. Initial build happens as above\n2. File watcher starts monitoring content files\n3. Changes trigger automatic rebuilds\n4. Next.js hot reloads with updated content\n\n### Type Generation\n\nTypes are automatically generated when you run:\n\n- `next build`\n- `next dev` (first run)\n- `npm run typegen` (if configured)\n\n## Using Content in Pages\n\n### Static Pages\n\n```typescript\n// app/blog/page.tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\n\nexport default function BlogPage() {\n  return (\n    <div>\n      <h1>Blog</h1>\n      {allNotpadd.map((post) => (\n        <article key={post.slug}>\n          <h2>{post.title}</h2>\n          <p>{post.description}</p>\n        </article>\n      ))}\n    </div>\n  );\n}\n```\n\n### Dynamic Routes\n\n```typescript\n// app/blog/[slug]/page.tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\nimport { notFound } from \"next/navigation\";\n\nexport async function generateStaticParams() {\n  return allNotpadd.map((post) => ({\n    slug: post.slug,\n  }));\n}\n\nexport default function BlogPostPage({\n  params,\n}: {\n  params: { slug: string };\n}) {\n  const post = allNotpadd.find((p) => p.slug === params.slug);\n\n  if (!post) {\n    notFound();\n  }\n\n  return (\n    <article>\n      <h1>{post.title}</h1>\n      <p>{post.description}</p>\n      <div>{post.markdown}</div>\n    </article>\n  );\n}\n```\n\n### Server Components\n\n```typescript\n// app/blog/[slug]/page.tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\n\nexport default async function BlogPostPage({\n  params,\n}: {\n  params: { slug: string };\n}) {\n  const post = allNotpadd.find((p) => p.slug === params.slug);\n\n  if (!post) {\n    return <div>Post not found</div>;\n  }\n\n  return (\n    <article>\n      <h1>{post.title}</h1>\n      <div>{post.markdown}</div>\n    </article>\n  );\n}\n```\n\n## Type Safety\n\nNotpadd generates TypeScript types for your collections:\n\n```typescript\nimport type { GetTypeByName } from \"notpadd-core\";\nimport config from \"@/content-collections\";\n\ntype BlogPost = GetTypeByName<typeof config, \"notpadd\">;\n```\n\n## Generated Files\n\nNotpadd generates files in `.content-collections/generated/`:\n\n### Collection Files\n\nEach collection gets a generated file:\n\n```typescript\n// .content-collections/generated/notpadd.ts\nexport const allNotpadd: Array<BlogPost> = [\n  // Your documents\n];\n\nexport function getNotpadd(slug: string): BlogPost | undefined {\n  return allNotpadd.find((post) => post.slug === slug);\n}\n```\n\n### Type Definitions\n\nType definitions are included in the generated files for full TypeScript support.\n\n## App Router\n\n### Using in App Router\n\n```typescript\n// app/blog/page.tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\n\nexport default function BlogPage() {\n  return (\n    <div>\n      {allNotpadd.map((post) => (\n        <article key={post.slug}>\n          <h2>{post.title}</h2>\n        </article>\n      ))}\n    </div>\n  );\n}\n```\n\n### Metadata\n\n```typescript\n// app/blog/[slug]/page.tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\nimport type { Metadata } from \"next\";\n\nexport async function generateMetadata({\n  params,\n}: {\n  params: { slug: string };\n}): Promise<Metadata> {\n  const post = allNotpadd.find((p) => p.slug === params.slug);\n\n  if (!post) {\n    return {};\n  }\n\n  return {\n    title: post.title,\n    description: post.description,\n    openGraph: {\n      images: post.image ? [post.image] : [],\n    },\n  };\n}\n```\n\n## Pages Router\n\n### Using in Pages Router\n\n```typescript\n// pages/blog/index.tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\n\nexport default function BlogPage() {\n  return (\n    <div>\n      {allNotpadd.map((post) => (\n        <article key={post.slug}>\n          <h2>{post.title}</h2>\n        </article>\n      ))}\n    </div>\n  );\n}\n```\n\n### getStaticProps\n\n```typescript\n// pages/blog/[slug].tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\nimport { GetStaticPaths, GetStaticProps } from \"next\";\n\nexport const getStaticPaths: GetStaticPaths = async () => {\n  return {\n    paths: allNotpadd.map((post) => ({\n      params: { slug: post.slug },\n    })),\n    fallback: false,\n  };\n};\n\nexport const getStaticProps: GetStaticProps = async ({ params }) => {\n  const post = allNotpadd.find((p) => p.slug === params?.slug);\n\n  if (!post) {\n    return { notFound: true };\n  }\n\n  return {\n    props: { post },\n  };\n};\n```\n\n## Markdown Rendering\n\n### Using MDX\n\nInstall MDX support:\n\n```bash\nnpm install @next/mdx @mdx-js/loader @mdx-js/react\n```\n\nConfigure Next.js:\n\n```typescript\n// next.config.ts\nimport createMDX from \"@next/mdx\";\n\nconst nextConfig = {\n  pageExtensions: [\"ts\", \"tsx\", \"mdx\"],\n};\n\nconst withMDX = createMDX({\n  options: {\n    remarkPlugins: [],\n    rehypePlugins: [],\n  },\n});\n\nexport default withNotpadd({\n  configPath: \"content-collections.ts\",\n})(withMDX(nextConfig));\n```\n\n### Using a Markdown Library\n\n```typescript\nimport { remark } from \"remark\";\nimport remarkHtml from \"remark-html\";\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchema,\n  transform: async (doc, { cache }) => {\n    const html = await cache(\"markdown-to-html\", doc.markdown, async () => {\n      const result = await remark().use(remarkHtml).process(doc.markdown);\n      return result.toString();\n    });\n\n    return {\n      ...doc,\n      html,\n    };\n  },\n});\n```\n\nThen use in your component:\n\n```typescript\n<div dangerouslySetInnerHTML={{ __html: post.html }} />\n```\n\n## Performance\n\n### Static Generation\n\nNotpadd works best with static generation:\n\n```typescript\nexport async function generateStaticParams() {\n  return allNotpadd.map((post) => ({\n    slug: post.slug,\n  }));\n}\n```\n\n### Incremental Static Regeneration\n\nFor ISR, you can combine with Next.js revalidation:\n\n```typescript\nexport const revalidate = 3600; // Revalidate every hour\n```\n\n## Troubleshooting\n\n### Types Not Found\n\nEnsure you've run a build at least once:\n\n```bash\nnpm run build\n```\n\n### Content Not Updating\n\n1. Check your Notpadd configuration\n2. Verify environment variables\n3. Ensure the build process completes\n4. Check for errors in the console\n\n### Build Errors\n\nCheck that:\n\n1. `notpadd-core` is installed\n2. Your configuration file is valid\n3. Your schema matches your content structure",
    "_meta": {
      "filePath": "notpadd/notpadd-nextjs.mdx",
      "fileName": "notpadd-nextjs.mdx",
      "directory": "notpadd",
      "extension": "mdx",
      "path": "notpadd/notpadd-nextjs"
    },
    "headings": [
      {
        "level": 1,
        "text": "Next.js Integration",
        "slug": "nextjs-integration"
      },
      {
        "level": 2,
        "text": "Plugin Setup",
        "slug": "plugin-setup"
      },
      {
        "level": 2,
        "text": "How It Works",
        "slug": "how-it-works"
      },
      {
        "level": 3,
        "text": "Build Time",
        "slug": "build-time"
      },
      {
        "level": 3,
        "text": "Development Mode",
        "slug": "development-mode"
      },
      {
        "level": 3,
        "text": "Type Generation",
        "slug": "type-generation"
      },
      {
        "level": 2,
        "text": "Using Content in Pages",
        "slug": "using-content-in-pages"
      },
      {
        "level": 3,
        "text": "Static Pages",
        "slug": "static-pages"
      },
      {
        "level": 3,
        "text": "Dynamic Routes",
        "slug": "dynamic-routes"
      },
      {
        "level": 3,
        "text": "Server Components",
        "slug": "server-components"
      },
      {
        "level": 2,
        "text": "Type Safety",
        "slug": "type-safety"
      },
      {
        "level": 2,
        "text": "Generated Files",
        "slug": "generated-files"
      },
      {
        "level": 3,
        "text": "Collection Files",
        "slug": "collection-files"
      },
      {
        "level": 3,
        "text": "Type Definitions",
        "slug": "type-definitions"
      },
      {
        "level": 2,
        "text": "App Router",
        "slug": "app-router"
      },
      {
        "level": 3,
        "text": "Using in App Router",
        "slug": "using-in-app-router"
      },
      {
        "level": 3,
        "text": "Metadata",
        "slug": "metadata"
      },
      {
        "level": 2,
        "text": "Pages Router",
        "slug": "pages-router"
      },
      {
        "level": 3,
        "text": "Using in Pages Router",
        "slug": "using-in-pages-router"
      },
      {
        "level": 3,
        "text": "getStaticProps",
        "slug": "getstaticprops"
      },
      {
        "level": 2,
        "text": "Markdown Rendering",
        "slug": "markdown-rendering"
      },
      {
        "level": 3,
        "text": "Using MDX",
        "slug": "using-mdx"
      },
      {
        "level": 3,
        "text": "Using a Markdown Library",
        "slug": "using-a-markdown-library"
      },
      {
        "level": 2,
        "text": "Performance",
        "slug": "performance"
      },
      {
        "level": 3,
        "text": "Static Generation",
        "slug": "static-generation"
      },
      {
        "level": 3,
        "text": "Incremental Static Regeneration",
        "slug": "incremental-static-regeneration"
      },
      {
        "level": 2,
        "text": "Troubleshooting",
        "slug": "troubleshooting"
      },
      {
        "level": 3,
        "text": "Types Not Found",
        "slug": "types-not-found"
      },
      {
        "level": 3,
        "text": "Content Not Updating",
        "slug": "content-not-updating"
      },
      {
        "level": 3,
        "text": "Build Errors",
        "slug": "build-errors"
      }
    ],
    "mdx": "var Component=(()=>{var g=Object.create;var r=Object.defineProperty;var h=Object.getOwnPropertyDescriptor;var u=Object.getOwnPropertyNames;var m=Object.getPrototypeOf,f=Object.prototype.hasOwnProperty;var y=(e,n)=>()=>(n||e((n={exports:{}}).exports,n),n.exports),x=(e,n)=>{for(var o in n)r(e,o,{get:n[o],enumerable:!0})},l=(e,n,o,i)=>{if(n&&typeof n==\"object\"||typeof n==\"function\")for(let a of u(n))!f.call(e,a)&&a!==o&&r(e,a,{get:()=>n[a],enumerable:!(i=h(n,a))||i.enumerable});return e};var N=(e,n,o)=>(o=e!=null?g(m(e)):{},l(n||!e||!e.__esModule?r(o,\"default\",{value:e,enumerable:!0}):o,e)),P=e=>l(r({},\"__esModule\",{value:!0}),e);var s=y((k,p)=>{p.exports=_jsx_runtime});var v={};x(v,{default:()=>d});var t=N(s());function c(e){let n={code:\"code\",h1:\"h1\",h2:\"h2\",h3:\"h3\",li:\"li\",ol:\"ol\",p:\"p\",pre:\"pre\",strong:\"strong\",ul:\"ul\",...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{children:\"Next.js Integration\"}),`\n`,(0,t.jsx)(n.p,{children:\"Learn how Notpadd integrates with Next.js and how to use it in your application.\"}),`\n`,(0,t.jsx)(n.h2,{children:\"Plugin Setup\"}),`\n`,(0,t.jsxs)(n.p,{children:[\"The \",(0,t.jsx)(n.code,{children:\"withNotpadd\"}),\" plugin wraps your \",(0,t.jsx)(n.strong,{children:\"Next\"}),\".js configuration:\"]}),`\n`,(0,t.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\n// next.config.ts\nimport { withNotpadd } from \"notpadd\";\nimport type { NextConfig } from \"next\";\n\nconst nextConfig: NextConfig = {\n  // Your Next.js configuration\n};\n\nexport default withNotpadd({\n  configPath: \"content-collections.ts\",\n})(nextConfig);\n\\`\\`\\``,children:(0,t.jsx)(n.code,{className:\"language-typescript\",children:`// next.config.ts\nimport { withNotpadd } from \"notpadd\";\nimport type { NextConfig } from \"next\";\n\nconst nextConfig: NextConfig = {\n  // Your Next.js configuration\n};\n\nexport default withNotpadd({\n  configPath: \"content-collections.ts\",\n})(nextConfig);\n`})}),`\n`,(0,t.jsx)(n.h2,{children:\"How It Works\"}),`\n`,(0,t.jsx)(n.h3,{children:\"Build Time\"}),`\n`,(0,t.jsxs)(n.p,{children:[\"During \",(0,t.jsx)(n.code,{children:\"next build\"}),\":\"]}),`\n`,(0,t.jsxs)(n.ol,{children:[`\n`,(0,t.jsx)(n.li,{children:\"Notpadd fetches content from the API\"}),`\n`,(0,t.jsx)(n.li,{children:\"Generates MDX files in your project\"}),`\n`,(0,t.jsx)(n.li,{children:\"Processes collections using Notpadd Core\"}),`\n`,(0,t.jsx)(n.li,{children:\"Generates TypeScript types\"}),`\n`,(0,t.jsx)(n.li,{children:\"Next.js builds your application with the content\"}),`\n`]}),`\n`,(0,t.jsx)(n.h3,{children:\"Development Mode\"}),`\n`,(0,t.jsxs)(n.p,{children:[\"During \",(0,t.jsx)(n.code,{children:\"next dev\"}),\":\"]}),`\n`,(0,t.jsxs)(n.ol,{children:[`\n`,(0,t.jsx)(n.li,{children:\"Initial build happens as above\"}),`\n`,(0,t.jsx)(n.li,{children:\"File watcher starts monitoring content files\"}),`\n`,(0,t.jsx)(n.li,{children:\"Changes trigger automatic rebuilds\"}),`\n`,(0,t.jsx)(n.li,{children:\"Next.js hot reloads with updated content\"}),`\n`]}),`\n`,(0,t.jsx)(n.h3,{children:\"Type Generation\"}),`\n`,(0,t.jsx)(n.p,{children:\"Types are automatically generated when you run:\"}),`\n`,(0,t.jsxs)(n.ul,{children:[`\n`,(0,t.jsx)(n.li,{children:(0,t.jsx)(n.code,{children:\"next build\"})}),`\n`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:\"next dev\"}),\" (first run)\"]}),`\n`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:\"npm run typegen\"}),\" (if configured)\"]}),`\n`]}),`\n`,(0,t.jsx)(n.h2,{children:\"Using Content in Pages\"}),`\n`,(0,t.jsx)(n.h3,{children:\"Static Pages\"}),`\n`,(0,t.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\n// app/blog/page.tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\n\nexport default function BlogPage() {\n  return (\n    <div>\n      <h1>Blog</h1>\n      {allNotpadd.map((post) => (\n        <article key={post.slug}>\n          <h2>{post.title}</h2>\n          <p>{post.description}</p>\n        </article>\n      ))}\n    </div>\n  );\n}\n\\`\\`\\``,children:(0,t.jsx)(n.code,{className:\"language-typescript\",children:`// app/blog/page.tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\n\nexport default function BlogPage() {\n  return (\n    <div>\n      <h1>Blog</h1>\n      {allNotpadd.map((post) => (\n        <article key={post.slug}>\n          <h2>{post.title}</h2>\n          <p>{post.description}</p>\n        </article>\n      ))}\n    </div>\n  );\n}\n`})}),`\n`,(0,t.jsx)(n.h3,{children:\"Dynamic Routes\"}),`\n`,(0,t.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\n// app/blog/[slug]/page.tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\nimport { notFound } from \"next/navigation\";\n\nexport async function generateStaticParams() {\n  return allNotpadd.map((post) => ({\n    slug: post.slug,\n  }));\n}\n\nexport default function BlogPostPage({\n  params,\n}: {\n  params: { slug: string };\n}) {\n  const post = allNotpadd.find((p) => p.slug === params.slug);\n\n  if (!post) {\n    notFound();\n  }\n\n  return (\n    <article>\n      <h1>{post.title}</h1>\n      <p>{post.description}</p>\n      <div>{post.markdown}</div>\n    </article>\n  );\n}\n\\`\\`\\``,children:(0,t.jsx)(n.code,{className:\"language-typescript\",children:`// app/blog/[slug]/page.tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\nimport { notFound } from \"next/navigation\";\n\nexport async function generateStaticParams() {\n  return allNotpadd.map((post) => ({\n    slug: post.slug,\n  }));\n}\n\nexport default function BlogPostPage({\n  params,\n}: {\n  params: { slug: string };\n}) {\n  const post = allNotpadd.find((p) => p.slug === params.slug);\n\n  if (!post) {\n    notFound();\n  }\n\n  return (\n    <article>\n      <h1>{post.title}</h1>\n      <p>{post.description}</p>\n      <div>{post.markdown}</div>\n    </article>\n  );\n}\n`})}),`\n`,(0,t.jsx)(n.h3,{children:\"Server Components\"}),`\n`,(0,t.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\n// app/blog/[slug]/page.tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\n\nexport default async function BlogPostPage({\n  params,\n}: {\n  params: { slug: string };\n}) {\n  const post = allNotpadd.find((p) => p.slug === params.slug);\n\n  if (!post) {\n    return <div>Post not found</div>;\n  }\n\n  return (\n    <article>\n      <h1>{post.title}</h1>\n      <div>{post.markdown}</div>\n    </article>\n  );\n}\n\\`\\`\\``,children:(0,t.jsx)(n.code,{className:\"language-typescript\",children:`// app/blog/[slug]/page.tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\n\nexport default async function BlogPostPage({\n  params,\n}: {\n  params: { slug: string };\n}) {\n  const post = allNotpadd.find((p) => p.slug === params.slug);\n\n  if (!post) {\n    return <div>Post not found</div>;\n  }\n\n  return (\n    <article>\n      <h1>{post.title}</h1>\n      <div>{post.markdown}</div>\n    </article>\n  );\n}\n`})}),`\n`,(0,t.jsx)(n.h2,{children:\"Type Safety\"}),`\n`,(0,t.jsx)(n.p,{children:\"Notpadd generates TypeScript types for your collections:\"}),`\n`,(0,t.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:'```typescript\\nimport type { GetTypeByName } from \"notpadd-core\";\\nimport config from \"@/content-collections\";\\n\\ntype BlogPost = GetTypeByName<typeof config, \"notpadd\">;\\n```',children:(0,t.jsx)(n.code,{className:\"language-typescript\",children:`import type { GetTypeByName } from \"notpadd-core\";\nimport config from \"@/content-collections\";\n\ntype BlogPost = GetTypeByName<typeof config, \"notpadd\">;\n`})}),`\n`,(0,t.jsx)(n.h2,{children:\"Generated Files\"}),`\n`,(0,t.jsxs)(n.p,{children:[\"Notpadd generates files in \",(0,t.jsx)(n.code,{children:\".content-collections/generated/\"}),\":\"]}),`\n`,(0,t.jsx)(n.h3,{children:\"Collection Files\"}),`\n`,(0,t.jsx)(n.p,{children:\"Each collection gets a generated file:\"}),`\n`,(0,t.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\n// .content-collections/generated/notpadd.ts\nexport const allNotpadd: Array<BlogPost> = [\n  // Your documents\n];\n\nexport function getNotpadd(slug: string): BlogPost | undefined {\n  return allNotpadd.find((post) => post.slug === slug);\n}\n\\`\\`\\``,children:(0,t.jsx)(n.code,{className:\"language-typescript\",children:`// .content-collections/generated/notpadd.ts\nexport const allNotpadd: Array<BlogPost> = [\n  // Your documents\n];\n\nexport function getNotpadd(slug: string): BlogPost | undefined {\n  return allNotpadd.find((post) => post.slug === slug);\n}\n`})}),`\n`,(0,t.jsx)(n.h3,{children:\"Type Definitions\"}),`\n`,(0,t.jsx)(n.p,{children:\"Type definitions are included in the generated files for full TypeScript support.\"}),`\n`,(0,t.jsx)(n.h2,{children:\"App Router\"}),`\n`,(0,t.jsx)(n.h3,{children:\"Using in App Router\"}),`\n`,(0,t.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\n// app/blog/page.tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\n\nexport default function BlogPage() {\n  return (\n    <div>\n      {allNotpadd.map((post) => (\n        <article key={post.slug}>\n          <h2>{post.title}</h2>\n        </article>\n      ))}\n    </div>\n  );\n}\n\\`\\`\\``,children:(0,t.jsx)(n.code,{className:\"language-typescript\",children:`// app/blog/page.tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\n\nexport default function BlogPage() {\n  return (\n    <div>\n      {allNotpadd.map((post) => (\n        <article key={post.slug}>\n          <h2>{post.title}</h2>\n        </article>\n      ))}\n    </div>\n  );\n}\n`})}),`\n`,(0,t.jsx)(n.h3,{children:\"Metadata\"}),`\n`,(0,t.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\n// app/blog/[slug]/page.tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\nimport type { Metadata } from \"next\";\n\nexport async function generateMetadata({\n  params,\n}: {\n  params: { slug: string };\n}): Promise<Metadata> {\n  const post = allNotpadd.find((p) => p.slug === params.slug);\n\n  if (!post) {\n    return {};\n  }\n\n  return {\n    title: post.title,\n    description: post.description,\n    openGraph: {\n      images: post.image ? [post.image] : [],\n    },\n  };\n}\n\\`\\`\\``,children:(0,t.jsx)(n.code,{className:\"language-typescript\",children:`// app/blog/[slug]/page.tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\nimport type { Metadata } from \"next\";\n\nexport async function generateMetadata({\n  params,\n}: {\n  params: { slug: string };\n}): Promise<Metadata> {\n  const post = allNotpadd.find((p) => p.slug === params.slug);\n\n  if (!post) {\n    return {};\n  }\n\n  return {\n    title: post.title,\n    description: post.description,\n    openGraph: {\n      images: post.image ? [post.image] : [],\n    },\n  };\n}\n`})}),`\n`,(0,t.jsx)(n.h2,{children:\"Pages Router\"}),`\n`,(0,t.jsx)(n.h3,{children:\"Using in Pages Router\"}),`\n`,(0,t.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\n// pages/blog/index.tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\n\nexport default function BlogPage() {\n  return (\n    <div>\n      {allNotpadd.map((post) => (\n        <article key={post.slug}>\n          <h2>{post.title}</h2>\n        </article>\n      ))}\n    </div>\n  );\n}\n\\`\\`\\``,children:(0,t.jsx)(n.code,{className:\"language-typescript\",children:`// pages/blog/index.tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\n\nexport default function BlogPage() {\n  return (\n    <div>\n      {allNotpadd.map((post) => (\n        <article key={post.slug}>\n          <h2>{post.title}</h2>\n        </article>\n      ))}\n    </div>\n  );\n}\n`})}),`\n`,(0,t.jsx)(n.h3,{children:\"getStaticProps\"}),`\n`,(0,t.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\n// pages/blog/[slug].tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\nimport { GetStaticPaths, GetStaticProps } from \"next\";\n\nexport const getStaticPaths: GetStaticPaths = async () => {\n  return {\n    paths: allNotpadd.map((post) => ({\n      params: { slug: post.slug },\n    })),\n    fallback: false,\n  };\n};\n\nexport const getStaticProps: GetStaticProps = async ({ params }) => {\n  const post = allNotpadd.find((p) => p.slug === params?.slug);\n\n  if (!post) {\n    return { notFound: true };\n  }\n\n  return {\n    props: { post },\n  };\n};\n\\`\\`\\``,children:(0,t.jsx)(n.code,{className:\"language-typescript\",children:`// pages/blog/[slug].tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\nimport { GetStaticPaths, GetStaticProps } from \"next\";\n\nexport const getStaticPaths: GetStaticPaths = async () => {\n  return {\n    paths: allNotpadd.map((post) => ({\n      params: { slug: post.slug },\n    })),\n    fallback: false,\n  };\n};\n\nexport const getStaticProps: GetStaticProps = async ({ params }) => {\n  const post = allNotpadd.find((p) => p.slug === params?.slug);\n\n  if (!post) {\n    return { notFound: true };\n  }\n\n  return {\n    props: { post },\n  };\n};\n`})}),`\n`,(0,t.jsx)(n.h2,{children:\"Markdown Rendering\"}),`\n`,(0,t.jsx)(n.h3,{children:\"Using MDX\"}),`\n`,(0,t.jsx)(n.p,{children:\"Install MDX support:\"}),`\n`,(0,t.jsx)(n.pre,{language:\"bash\",meta:\"\",code:\"```bash\\nnpm install @next/mdx @mdx-js/loader @mdx-js/react\\n```\",children:(0,t.jsx)(n.code,{className:\"language-bash\",children:`npm install @next/mdx @mdx-js/loader @mdx-js/react\n`})}),`\n`,(0,t.jsx)(n.p,{children:\"Configure Next.js:\"}),`\n`,(0,t.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\n// next.config.ts\nimport createMDX from \"@next/mdx\";\n\nconst nextConfig = {\n  pageExtensions: [\"ts\", \"tsx\", \"mdx\"],\n};\n\nconst withMDX = createMDX({\n  options: {\n    remarkPlugins: [],\n    rehypePlugins: [],\n  },\n});\n\nexport default withNotpadd({\n  configPath: \"content-collections.ts\",\n})(withMDX(nextConfig));\n\\`\\`\\``,children:(0,t.jsx)(n.code,{className:\"language-typescript\",children:`// next.config.ts\nimport createMDX from \"@next/mdx\";\n\nconst nextConfig = {\n  pageExtensions: [\"ts\", \"tsx\", \"mdx\"],\n};\n\nconst withMDX = createMDX({\n  options: {\n    remarkPlugins: [],\n    rehypePlugins: [],\n  },\n});\n\nexport default withNotpadd({\n  configPath: \"content-collections.ts\",\n})(withMDX(nextConfig));\n`})}),`\n`,(0,t.jsx)(n.h3,{children:\"Using a Markdown Library\"}),`\n`,(0,t.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\nimport { remark } from \"remark\";\nimport remarkHtml from \"remark-html\";\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchema,\n  transform: async (doc, { cache }) => {\n    const html = await cache(\"markdown-to-html\", doc.markdown, async () => {\n      const result = await remark().use(remarkHtml).process(doc.markdown);\n      return result.toString();\n    });\n\n    return {\n      ...doc,\n      html,\n    };\n  },\n});\n\\`\\`\\``,children:(0,t.jsx)(n.code,{className:\"language-typescript\",children:`import { remark } from \"remark\";\nimport remarkHtml from \"remark-html\";\n\ndefineCollection({\n  name: \"notpadd\",\n  directory: \"notpadd\",\n  schema: notpaddSchema,\n  transform: async (doc, { cache }) => {\n    const html = await cache(\"markdown-to-html\", doc.markdown, async () => {\n      const result = await remark().use(remarkHtml).process(doc.markdown);\n      return result.toString();\n    });\n\n    return {\n      ...doc,\n      html,\n    };\n  },\n});\n`})}),`\n`,(0,t.jsx)(n.p,{children:\"Then use in your component:\"}),`\n`,(0,t.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:\"```typescript\\n<div dangerouslySetInnerHTML={{ __html: post.html }} />\\n```\",children:(0,t.jsx)(n.code,{className:\"language-typescript\",children:`<div dangerouslySetInnerHTML={{ __html: post.html }} />\n`})}),`\n`,(0,t.jsx)(n.h2,{children:\"Performance\"}),`\n`,(0,t.jsx)(n.h3,{children:\"Static Generation\"}),`\n`,(0,t.jsx)(n.p,{children:\"Notpadd works best with static generation:\"}),`\n`,(0,t.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:\"```typescript\\nexport async function generateStaticParams() {\\n  return allNotpadd.map((post) => ({\\n    slug: post.slug,\\n  }));\\n}\\n```\",children:(0,t.jsx)(n.code,{className:\"language-typescript\",children:`export async function generateStaticParams() {\n  return allNotpadd.map((post) => ({\n    slug: post.slug,\n  }));\n}\n`})}),`\n`,(0,t.jsx)(n.h3,{children:\"Incremental Static Regeneration\"}),`\n`,(0,t.jsx)(n.p,{children:\"For ISR, you can combine with Next.js revalidation:\"}),`\n`,(0,t.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:\"```typescript\\nexport const revalidate = 3600; // Revalidate every hour\\n```\",children:(0,t.jsx)(n.code,{className:\"language-typescript\",children:`export const revalidate = 3600; // Revalidate every hour\n`})}),`\n`,(0,t.jsx)(n.h2,{children:\"Troubleshooting\"}),`\n`,(0,t.jsx)(n.h3,{children:\"Types Not Found\"}),`\n`,(0,t.jsx)(n.p,{children:\"Ensure you've run a build at least once:\"}),`\n`,(0,t.jsx)(n.pre,{language:\"bash\",meta:\"\",code:\"```bash\\nnpm run build\\n```\",children:(0,t.jsx)(n.code,{className:\"language-bash\",children:`npm run build\n`})}),`\n`,(0,t.jsx)(n.h3,{children:\"Content Not Updating\"}),`\n`,(0,t.jsxs)(n.ol,{children:[`\n`,(0,t.jsx)(n.li,{children:\"Check your Notpadd configuration\"}),`\n`,(0,t.jsx)(n.li,{children:\"Verify environment variables\"}),`\n`,(0,t.jsx)(n.li,{children:\"Ensure the build process completes\"}),`\n`,(0,t.jsx)(n.li,{children:\"Check for errors in the console\"}),`\n`]}),`\n`,(0,t.jsx)(n.h3,{children:\"Build Errors\"}),`\n`,(0,t.jsx)(n.p,{children:\"Check that:\"}),`\n`,(0,t.jsxs)(n.ol,{children:[`\n`,(0,t.jsxs)(n.li,{children:[(0,t.jsx)(n.code,{children:\"notpadd-core\"}),\" is installed\"]}),`\n`,(0,t.jsx)(n.li,{children:\"Your configuration file is valid\"}),`\n`,(0,t.jsx)(n.li,{children:\"Your schema matches your content structure\"}),`\n`]})]})}function d(e={}){let{wrapper:n}=e.components||{};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}return P(v);})();\n;return Component;"
  },
  {
    "title": "Notpadd Package Overview",
    "description": "Introduction to the notpadd package for seamless Next.js integration with Notpadd CMS",
    "content": "# Notpadd Package Overview\n\nThe `notpadd` package provides seamless integration between Notpadd and Next.js, enabling you to use Notpadd as your buildtime or runtime CMS with your own data.\n\n## Features\n\n- **Next.js Integration**: Simple plugin for Next.js configuration\n- **Automatic Content Sync**: Fetches content from Notpadd API during build\n- **Type Generation**: Automatic TypeScript type generation\n- **Development Mode**: File watching and hot reloading\n- **Build Time Processing**: Processes content during Next.js build\n\n## Installation\n\n```bash\nnpm install notpadd notpadd-core\n```\n\n## Quick Start\n\n1. **Configure Next.js:**\n\n```typescript\n// next.config.ts\nimport { withNotpadd } from \"notpadd\";\n\nexport default withNotpadd({\n  configPath: \"content-collections.ts\",\n})({\n  // Your Next.js config\n});\n```\n\n2. **Create content collections config:**\n\n```typescript\n// content-collections.ts\nimport { defineConfig, defineCollection } from \"notpadd-core\";\nimport { notpaddSchema } from \"notpadd-core\";\nimport { z } from \"zod\";\n\nexport default defineConfig({\n  collections: [\n    defineCollection({\n      name: \"notpadd\",\n      directory: \"notpadd\",\n      schema: notpaddSchema,\n    }),\n  ],\n  notpadd: {\n    sk: process.env.NOTPADD_SK!,\n    pk: process.env.NOTPADD_PK!,\n    orgID: process.env.NOTPADD_ORG_ID!,\n    query: \"published\",\n  },\n});\n```\n\n3. **Use in your pages:**\n\n```typescript\n// app/blog/page.tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\n\nexport default function BlogPage() {\n  return (\n    <div>\n      {allNotpadd.map((post) => (\n        <article key={post.slug}>\n          <h1>{post.title}</h1>\n          <p>{post.description}</p>\n        </article>\n      ))}\n    </div>\n  );\n}\n```\n\n## How It Works\n\n1. **Build Time**: During `next build` or `next dev`, the plugin:\n   - Fetches content from Notpadd API\n   - Generates MDX files in your project\n   - Processes collections using Notpadd Core\n   - Generates TypeScript types\n\n2. **Development Mode**: In `next dev`:\n   - Watches for file changes\n   - Automatically rebuilds collections\n   - Provides hot reloading\n\n3. **Type Generation**: Run `next build` or use the typegen command to generate types\n\n## Next Steps\n\n- Learn about [Configuration](/docs/notpadd-configuration)\n- See [Next.js Integration](/docs/notpadd-nextjs)\n- Explore [Getting Started](/docs/notpadd-getting-started)",
    "_meta": {
      "filePath": "notpadd/notpadd-overview.mdx",
      "fileName": "notpadd-overview.mdx",
      "directory": "notpadd",
      "extension": "mdx",
      "path": "notpadd/notpadd-overview"
    },
    "headings": [
      {
        "level": 1,
        "text": "Notpadd Package Overview",
        "slug": "notpadd-package-overview"
      },
      {
        "level": 2,
        "text": "Features",
        "slug": "features"
      },
      {
        "level": 2,
        "text": "Installation",
        "slug": "installation"
      },
      {
        "level": 2,
        "text": "Quick Start",
        "slug": "quick-start"
      },
      {
        "level": 2,
        "text": "How It Works",
        "slug": "how-it-works"
      },
      {
        "level": 2,
        "text": "Next Steps",
        "slug": "next-steps"
      }
    ],
    "mdx": "var Component=(()=>{var h=Object.create;var r=Object.defineProperty;var g=Object.getOwnPropertyDescriptor;var u=Object.getOwnPropertyNames;var m=Object.getPrototypeOf,f=Object.prototype.hasOwnProperty;var x=(t,n)=>()=>(n||t((n={exports:{}}).exports,n),n.exports),N=(t,n)=>{for(var o in n)r(t,o,{get:n[o],enumerable:!0})},l=(t,n,o,d)=>{if(n&&typeof n==\"object\"||typeof n==\"function\")for(let i of u(n))!f.call(t,i)&&i!==o&&r(t,i,{get:()=>n[i],enumerable:!(d=g(n,i))||d.enumerable});return t};var y=(t,n,o)=>(o=t!=null?h(m(t)):{},l(n||!t||!t.__esModule?r(o,\"default\",{value:t,enumerable:!0}):o,t)),D=t=>l(r({},\"__esModule\",{value:!0}),t);var a=x((b,c)=>{c.exports=_jsx_runtime});var P={};N(P,{default:()=>p});var e=y(a());function s(t){let n={a:\"a\",code:\"code\",h1:\"h1\",h2:\"h2\",li:\"li\",ol:\"ol\",p:\"p\",pre:\"pre\",strong:\"strong\",ul:\"ul\",...t.components};return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(n.h1,{children:\"Notpadd Package Overview\"}),`\n`,(0,e.jsxs)(n.p,{children:[\"The \",(0,e.jsx)(n.code,{children:\"notpadd\"}),\" package provides seamless integration between Notpadd and Next.js, enabling you to use Notpadd as your buildtime or runtime CMS with your own data.\"]}),`\n`,(0,e.jsx)(n.h2,{children:\"Features\"}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Next.js Integration\"}),\": Simple plugin for Next.js configuration\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Automatic Content Sync\"}),\": Fetches content from Notpadd API during build\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Type Generation\"}),\": Automatic TypeScript type generation\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Development Mode\"}),\": File watching and hot reloading\"]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Build Time Processing\"}),\": Processes content during Next.js build\"]}),`\n`]}),`\n`,(0,e.jsx)(n.h2,{children:\"Installation\"}),`\n`,(0,e.jsx)(n.pre,{language:\"bash\",meta:\"\",code:\"```bash\\nnpm install notpadd notpadd-core\\n```\",children:(0,e.jsx)(n.code,{className:\"language-bash\",children:`npm install notpadd notpadd-core\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"Quick Start\"}),`\n`,(0,e.jsxs)(n.ol,{children:[`\n`,(0,e.jsx)(n.li,{children:(0,e.jsx)(n.strong,{children:\"Configure Next.js:\"})}),`\n`]}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\n// next.config.ts\nimport { withNotpadd } from \"notpadd\";\n\nexport default withNotpadd({\n  configPath: \"content-collections.ts\",\n})({\n  // Your Next.js config\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`// next.config.ts\nimport { withNotpadd } from \"notpadd\";\n\nexport default withNotpadd({\n  configPath: \"content-collections.ts\",\n})({\n  // Your Next.js config\n});\n`})}),`\n`,(0,e.jsxs)(n.ol,{start:\"2\",children:[`\n`,(0,e.jsx)(n.li,{children:(0,e.jsx)(n.strong,{children:\"Create content collections config:\"})}),`\n`]}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\n// content-collections.ts\nimport { defineConfig, defineCollection } from \"notpadd-core\";\nimport { notpaddSchema } from \"notpadd-core\";\nimport { z } from \"zod\";\n\nexport default defineConfig({\n  collections: [\n    defineCollection({\n      name: \"notpadd\",\n      directory: \"notpadd\",\n      schema: notpaddSchema,\n    }),\n  ],\n  notpadd: {\n    sk: process.env.NOTPADD_SK!,\n    pk: process.env.NOTPADD_PK!,\n    orgID: process.env.NOTPADD_ORG_ID!,\n    query: \"published\",\n  },\n});\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`// content-collections.ts\nimport { defineConfig, defineCollection } from \"notpadd-core\";\nimport { notpaddSchema } from \"notpadd-core\";\nimport { z } from \"zod\";\n\nexport default defineConfig({\n  collections: [\n    defineCollection({\n      name: \"notpadd\",\n      directory: \"notpadd\",\n      schema: notpaddSchema,\n    }),\n  ],\n  notpadd: {\n    sk: process.env.NOTPADD_SK!,\n    pk: process.env.NOTPADD_PK!,\n    orgID: process.env.NOTPADD_ORG_ID!,\n    query: \"published\",\n  },\n});\n`})}),`\n`,(0,e.jsxs)(n.ol,{start:\"3\",children:[`\n`,(0,e.jsx)(n.li,{children:(0,e.jsx)(n.strong,{children:\"Use in your pages:\"})}),`\n`]}),`\n`,(0,e.jsx)(n.pre,{language:\"typescript\",meta:\"\",code:`\\`\\`\\`typescript\n// app/blog/page.tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\n\nexport default function BlogPage() {\n  return (\n    <div>\n      {allNotpadd.map((post) => (\n        <article key={post.slug}>\n          <h1>{post.title}</h1>\n          <p>{post.description}</p>\n        </article>\n      ))}\n    </div>\n  );\n}\n\\`\\`\\``,children:(0,e.jsx)(n.code,{className:\"language-typescript\",children:`// app/blog/page.tsx\nimport { allNotpadd } from \"@/content-collections/generated/notpadd\";\n\nexport default function BlogPage() {\n  return (\n    <div>\n      {allNotpadd.map((post) => (\n        <article key={post.slug}>\n          <h1>{post.title}</h1>\n          <p>{post.description}</p>\n        </article>\n      ))}\n    </div>\n  );\n}\n`})}),`\n`,(0,e.jsx)(n.h2,{children:\"How It Works\"}),`\n`,(0,e.jsxs)(n.ol,{children:[`\n`,(0,e.jsxs)(n.li,{children:[`\n`,(0,e.jsxs)(n.p,{children:[(0,e.jsx)(n.strong,{children:\"Build Time\"}),\": During \",(0,e.jsx)(n.code,{children:\"next build\"}),\" or \",(0,e.jsx)(n.code,{children:\"next dev\"}),\", the plugin:\"]}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsx)(n.li,{children:\"Fetches content from Notpadd API\"}),`\n`,(0,e.jsx)(n.li,{children:\"Generates MDX files in your project\"}),`\n`,(0,e.jsx)(n.li,{children:\"Processes collections using Notpadd Core\"}),`\n`,(0,e.jsx)(n.li,{children:\"Generates TypeScript types\"}),`\n`]}),`\n`]}),`\n`,(0,e.jsxs)(n.li,{children:[`\n`,(0,e.jsxs)(n.p,{children:[(0,e.jsx)(n.strong,{children:\"Development Mode\"}),\": In \",(0,e.jsx)(n.code,{children:\"next dev\"}),\":\"]}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsx)(n.li,{children:\"Watches for file changes\"}),`\n`,(0,e.jsx)(n.li,{children:\"Automatically rebuilds collections\"}),`\n`,(0,e.jsx)(n.li,{children:\"Provides hot reloading\"}),`\n`]}),`\n`]}),`\n`,(0,e.jsxs)(n.li,{children:[`\n`,(0,e.jsxs)(n.p,{children:[(0,e.jsx)(n.strong,{children:\"Type Generation\"}),\": Run \",(0,e.jsx)(n.code,{children:\"next build\"}),\" or use the typegen command to generate types\"]}),`\n`]}),`\n`]}),`\n`,(0,e.jsx)(n.h2,{children:\"Next Steps\"}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[\"Learn about \",(0,e.jsx)(n.a,{href:\"/docs/notpadd-configuration\",children:\"Configuration\"})]}),`\n`,(0,e.jsxs)(n.li,{children:[\"See \",(0,e.jsx)(n.a,{href:\"/docs/notpadd-nextjs\",children:\"Next.js Integration\"})]}),`\n`,(0,e.jsxs)(n.li,{children:[\"Explore \",(0,e.jsx)(n.a,{href:\"/docs/notpadd-getting-started\",children:\"Getting Started\"})]}),`\n`]})]})}function p(t={}){let{wrapper:n}=t.components||{};return n?(0,e.jsx)(n,{...t,children:(0,e.jsx)(s,{...t})}):s(t)}return D(P);})();\n;return Component;"
  }
]