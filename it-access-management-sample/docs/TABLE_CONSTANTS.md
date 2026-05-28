# Automated Table Constants Generation

## Overview

This project includes an automated system for generating type-safe TypeScript constants for ServiceNow table names and column names. This eliminates manual maintenance, reduces typos, and provides excellent IDE support.

## 🎯 Benefits

- **Type-Safe**: Compile-time checks for table and column names
- **IDE Autocomplete**: Full IntelliSense support for tables and columns
- **Refactoring**: Easy to rename and track usage across codebase
- **No Typos**: Prevents runtime errors from misspelled table/column names
- **Single Source of Truth**: Table definitions drive the constants automatically
- **Zero Maintenance**: Constants regenerate on every build

## 🔧 How It Works

### 1. Automatic Generation

The `scripts/generate-table-constants.js` script:
1. Scans all `.now.ts` files in `src/fluent/tables/`
2. Parses `Table()` definitions to extract table names and column schemas
3. Generates `src/fluent/constants/tables.ts` with:
   - `TableNames` enum for all tables
   - `TableColumns` object with all columns per table
   - TypeScript type helpers

### 2. Build Integration

The generation runs automatically before every build:

```bash
# Runs generate:constants, then builds
npm run build

# Run generation manually
npm run generate:constants
```

### 3. Generated Output

**src/fluent/constants/tables.ts** (auto-generated):

```typescript
export enum TableNames {
    ASSIGNMENT = 'x_itaccess_assignment',
    REQUEST = 'x_itaccess_request',
    ACCESS_TYPE = 'x_itaccess_access_type',
    APPROVAL = 'x_itaccess_approval',
}

export const TableColumns = {
    REQUEST: {
        NUMBER: 'number',
        REQUESTED_FOR: 'requested_for',
        REQUESTED_BY: 'requested_by',
        ACCESS_TYPE: 'access_type',
        STATE: 'state',
        // ... all columns
    },
    // ... all tables
} as const;
```

## 📚 Usage Examples

### Basic Usage

```typescript
import { TableNames, TableColumns } from '../constants/tables';

// ❌ BEFORE (string literals, prone to typos)
const gr = new GlideRecord('x_itaccess_request');
gr.addQuery('state', 'pending_approval');
gr.addQuery('requested_for', userId);

// ✅ AFTER (type-safe constants)
const gr = new GlideRecord(TableNames.REQUEST);
gr.addQuery(TableColumns.REQUEST.STATE, 'pending_approval');
gr.addQuery(TableColumns.REQUEST.REQUESTED_FOR, userId);
```

### In Script Includes

```typescript
import { TableNames, TableColumns } from '../constants/tables';

ScriptInclude({
    name: 'MyUtils',
    script: () => {
        const MyUtils = Class.create();
        
        MyUtils.prototype = {
            getActiveRequests: function(userId) {
                const gr = new GlideRecord(TableNames.REQUEST);
                gr.addQuery(TableColumns.REQUEST.REQUESTED_FOR, userId);
                gr.addQuery(TableColumns.REQUEST.STATE, 'pending_approval');
                gr.query();
                return gr;
            }
        };
        
        return MyUtils;
    }
});
```

### In Business Rules

```typescript
import { TableNames, TableColumns } from '../constants/tables';

BusinessRule({
    name: 'My Business Rule',
    table: TableNames.REQUEST, // Type-safe table reference
    when: 'before',
    insert: true,
    script: () => {
        if (current[TableColumns.REQUEST.STATE].toString() === 'pending_approval') {
            // Type-safe column access
            const requestedFor = current[TableColumns.REQUEST.REQUESTED_FOR];
            // ...
        }
    }
});
```

### In REST APIs

```typescript
import { TableNames, TableColumns } from '../constants/tables';

RestApi({
    name: 'My API',
    routes: [{
        method: 'GET',
        relative_path: '/requests',
        script: script`
            (function process(request, response) {
                var gr = new GlideRecord('${TableNames.REQUEST}');
                gr.addQuery('${TableColumns.REQUEST.STATE}', 'approved');
                gr.query();
                // ...
            })(request, response)
        `
    }]
});
```

### Accessing Column Values Dynamically

```typescript
import { TableNames, TableColumns } from '../constants/tables';

// Loop through multiple columns
const columnsToCheck = [
    TableColumns.REQUEST.REQUESTED_FOR,
    TableColumns.REQUEST.REQUESTED_BY,
    TableColumns.REQUEST.ACCESS_TYPE
];

columnsToCheck.forEach(column => {
    if (gr[column].nil()) {
        gs.addErrorMessage(`${column} is required`);
    }
});
```

## 🔄 Workflow

### Adding a New Table

1. Create your table definition in `src/fluent/tables/my-new-table.now.ts`:

```typescript
export const x_itaccess_my_table = Table({
    name: 'x_itaccess_my_table',
    schema: {
        field1: StringColumn({ label: 'Field 1' }),
        field2: IntegerColumn({ label: 'Field 2' }),
        // ...
    }
});
```

2. Run build (constants auto-generate):

```bash
npm run build
```

3. Use the new constants:

```typescript
import { TableNames, TableColumns } from '../constants/tables';

const gr = new GlideRecord(TableNames.MY_TABLE);
gr.addQuery(TableColumns.MY_TABLE.FIELD1, 'value');
```

### Adding a Column to Existing Table

1. Add column to table definition:

```typescript
export const x_itaccess_request = Table({
    name: 'x_itaccess_request',
    schema: {
        // ... existing columns
        new_field: StringColumn({ label: 'New Field' }), // ← Add this
    }
});
```

2. Run build (constants auto-update):

```bash
npm run build
```

3. Use the new column:

```typescript
gr.addQuery(TableColumns.REQUEST.NEW_FIELD, 'value');
```

## 🎨 IDE Features

### Autocomplete

When you type `TableNames.`, your IDE shows all available tables:
- `TableNames.REQUEST`
- `TableNames.ASSIGNMENT`
- `TableNames.ACCESS_TYPE`
- `TableNames.APPROVAL`

When you type `TableColumns.REQUEST.`, your IDE shows all columns for that table:
- `TableColumns.REQUEST.NUMBER`
- `TableColumns.REQUEST.REQUESTED_FOR`
- `TableColumns.REQUEST.STATE`
- etc.

### Type Checking

TypeScript will catch errors at compile time:

```typescript
// ❌ TypeScript Error: Property 'INVALID_TABLE' does not exist
const gr = new GlideRecord(TableNames.INVALID_TABLE);

// ❌ TypeScript Error: Property 'INVALID_COLUMN' does not exist
gr.addQuery(TableColumns.REQUEST.INVALID_COLUMN, 'value');
```

### Find All References

Use "Find All References" in your IDE on a constant to see everywhere a table or column is used:

```typescript
// Right-click → Find All References
TableNames.REQUEST  // Shows all uses of this table
TableColumns.REQUEST.STATE  // Shows all uses of this column
```

## 📝 Best Practices

### ✅ DO

- Use constants for all table and column references
- Run `npm run build` after modifying table definitions
- Use constants in comments and documentation
- Leverage IDE autocomplete to discover available columns

### ❌ DON'T

- Don't edit `src/fluent/constants/tables.ts` manually (auto-generated)
- Don't mix string literals and constants (be consistent)
- Don't use magic strings when a constant exists

## 🔍 Troubleshooting

### Constants Not Updated

**Problem**: Added a new column but it's not in the constants.

**Solution**: 
```bash
# Regenerate constants
npm run generate:constants

# Or rebuild
npm run build
```

### IDE Autocomplete Not Working

**Problem**: IDE doesn't show autocomplete for constants.

**Solution**:
1. Ensure `src/fluent/constants/tables.ts` exists
2. Restart your IDE/TypeScript server
3. Check that imports are correct

### Parse Errors

**Problem**: Script shows parsing warnings.

**Solution**:
- Ensure table definitions follow the standard `Table()` format
- Check that schema is properly formatted
- Run with verbose output to see details

## 📦 Generated Files

```
src/fluent/constants/
└── tables.ts          # Auto-generated, DO NOT EDIT

scripts/
└── generate-table-constants.js    # Generation script
```

## 🚀 Advanced Usage

### Type Helpers

The generated file includes TypeScript type helpers:

```typescript
import { TableNames, TableColumnNames, ColumnValue } from '../constants/tables';

// Get column name type for a table
type RequestColumns = TableColumnNames<TableNames.REQUEST>;
// Result: 'NUMBER' | 'REQUESTED_FOR' | 'STATE' | ...

// Get column value (string literal)
type StateColumn = ColumnValue<TableNames.REQUEST, 'STATE'>;
// Result: 'state'
```

### Creating Typed Wrappers

```typescript
import { TableNames, TableColumns } from '../constants/tables';

class TypedGlideRecord<T extends TableNames> {
    private gr: GlideRecord;
    
    constructor(tableName: T) {
        this.gr = new GlideRecord(tableName);
    }
    
    addQuery(field: keyof typeof TableColumns[T], value: string) {
        this.gr.addQuery(field as string, value);
        return this;
    }
    
    query() {
        this.gr.query();
    }
}

// Usage with full type safety
const requests = new TypedGlideRecord(TableNames.REQUEST)
    .addQuery(TableColumns.REQUEST.STATE, 'pending_approval')
    .query();
```

## 📖 Reference Files

- **Original**: `src/fluent/script-includes/access-mgmt-utils.now.ts`
- **Refactored**: `src/fluent/script-includes/access-mgmt-utils-refactored.now.ts`

Compare these files to see the before/after transformation.

## 🎓 Learning Resources

- [ServiceNow SDK Documentation](https://docs.servicenow.com/sdk)
- [TypeScript Enums](https://www.typescriptlang.org/docs/handbook/enums.html)
- [TypeScript const assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)

---

**Generated**: This approach follows ServiceNow SDK best practices and modern TypeScript patterns for maintainable, type-safe code.
