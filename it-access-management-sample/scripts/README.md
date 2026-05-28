# Table Constants Generation Script

## Overview

This script automatically generates type-safe TypeScript constants for ServiceNow table names and column names by parsing table definition files.

## What It Does

1. **Scans** all `.now.ts` files in `src/fluent/tables/`
2. **Parses** `Table()` definitions to extract:
   - Table name from `name: 'table_name'`
   - Column names from `columnName: TypeColumn()` declarations
3. **Generates** `src/fluent/constants/tables.ts` with:
   - `TableNames` enum (e.g., `REQUEST = 'x_itaccess_request'`)
   - `TableColumns` object (e.g., `REQUEST: { STATE: 'state' }`)
   - TypeScript type helpers

## Usage

### Manual Run
```bash
node scripts/generate-table-constants.js
```

### Via npm
```bash
npm run generate:constants
```

### Automatic (on build)
```bash
npm run build  # Runs generate:constants first
```

## Output Example

```typescript
export enum TableNames {
    REQUEST = 'x_itaccess_request',
    ASSIGNMENT = 'x_itaccess_assignment',
    // ...
}

export const TableColumns = {
    REQUEST: {
        NUMBER: 'number',
        STATE: 'state',
        // ...
    },
    // ...
} as const;
```

## Configuration

Edit these constants at the top of the script:

```javascript
const TABLES_DIR = path.join(__dirname, '../src/fluent/tables');
const OUTPUT_DIR = path.join(__dirname, '../src/fluent/constants');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'tables.ts');
```

## How It Works

### Parsing Algorithm

1. **Find Table Name**: Regex match `name: 'table_name'`
2. **Extract Schema**: Parse nested braces with proper escaping
3. **Find Columns**: Regex match `columnName: ColumnType(`
4. **Generate Code**: Build TypeScript enum and const object

### Naming Conventions

- **Table Enum Keys**: Remove prefix, convert to SCREAMING_SNAKE_CASE
  - `x_itaccess_request` → `REQUEST`
- **Column Keys**: Convert to SCREAMING_SNAKE_CASE
  - `requested_for` → `REQUESTED_FOR`

### Supported Column Types

- `StringColumn`
- `IntegerColumn`
- `BooleanColumn`
- `DateTimeColumn`
- `ReferenceColumn`
- `TextColumn`

## Console Output

```
🔍 Scanning table definition files...
📁 Found 4 table definition files
   Parsing: access-request.now.ts
   ✓ x_itaccess_request (17 columns)
   ...
📝 Generating constants...
✅ Generated: src/fluent/constants/tables.ts
   4 tables
   51 total columns
```

## Error Handling

- **Missing table name**: Logs warning, skips file
- **Missing schema**: Logs warning, creates empty columns array
- **Parse failures**: Exits with error code 1

## Dependencies

- **Node.js**: Built-in `fs` and `path` modules only
- **No external dependencies**: Works out of the box

## Extending

### Add New Column Type

Update the regex pattern:

```javascript
const columnRegex = /^\s*(\w+):\s*(?:String|DateTime|Reference|Integer|Boolean|Text|YourNewType)Column\s*\(/gm;
```

### Custom Naming

Modify these functions:
- `toEnumKey(str)` - Column naming
- `tableNameToEnumKey(tableName)` - Table naming

### Additional Output

Edit `generateConstants(tables)` to add:
- Additional type helpers
- Custom exports
- Documentation comments

## Testing

Run the validation test:
```bash
npx ts-node src/fluent/tests/validate-constants.ts
```

## Troubleshooting

### Constants Not Updating

**Solution**: Run `npm run generate:constants` manually

### Parse Warnings

**Cause**: Non-standard table definition format
**Solution**: Ensure tables follow the standard `Table()` format

### Missing Columns

**Cause**: Column type not recognized
**Solution**: Check that column uses a supported type or extend the regex

## Integration

The script is integrated into the build process via `package.json`:

```json
{
  "scripts": {
    "generate:constants": "node scripts/generate-table-constants.js",
    "build": "npm run generate:constants && now-sdk build"
  }
}
```

## Best Practices

1. **Never edit** `src/fluent/constants/tables.ts` manually
2. **Always run** generation after modifying table definitions
3. **Commit** both table definitions and generated constants together
4. **Review** console output to verify correct parsing

## See Also

- [Table Constants Documentation](../docs/TABLE_CONSTANTS.md)
- [Implementation Summary](../docs/IMPLEMENTATION_SUMMARY.md)
- [Refactored Example](../src/fluent/script-includes/access-mgmt-utils-refactored.now.ts)

---

**Version**: 1.0  
**Last Updated**: 2026-05-28
