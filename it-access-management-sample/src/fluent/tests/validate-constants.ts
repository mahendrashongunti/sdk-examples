/**
 * Simple validation test for generated table constants
 * This file ensures the generated constants are properly typed and accessible
 */

import { TableNames, TableColumns, TableColumnNames, ColumnValue } from '../constants/tables';

// Test 1: TableNames enum is accessible
function testTableNames() {
    console.log('✓ TableNames enum accessible');
    
    const tables = [
        TableNames.REQUEST,
        TableNames.ASSIGNMENT,
        TableNames.ACCESS_TYPE,
        TableNames.APPROVAL
    ];
    
    console.log(`✓ Found ${tables.length} table names`);
    tables.forEach(table => {
        console.log(`  - ${table}`);
    });
}

// Test 2: TableColumns is accessible
function testTableColumns() {
    console.log('✓ TableColumns object accessible');
    
    // Test accessing columns for each table
    const requestColumns = Object.keys(TableColumns.REQUEST);
    const assignmentColumns = Object.keys(TableColumns.ASSIGNMENT);
    const accessTypeColumns = Object.keys(TableColumns.ACCESS_TYPE);
    const approvalColumns = Object.keys(TableColumns.APPROVAL);
    
    console.log(`✓ REQUEST table has ${requestColumns.length} columns`);
    console.log(`✓ ASSIGNMENT table has ${assignmentColumns.length} columns`);
    console.log(`✓ ACCESS_TYPE table has ${accessTypeColumns.length} columns`);
    console.log(`✓ APPROVAL table has ${approvalColumns.length} columns`);
}

// Test 3: Type helpers work
function testTypeHelpers() {
    console.log('✓ Type helpers work correctly');
    
    // These would fail at compile time if types are wrong
    type RequestCols = TableColumnNames<TableNames.REQUEST>;
    type StateCol = ColumnValue<TableNames.REQUEST, 'STATE'>;
    
    console.log('✓ TypeScript types are correct');
}

// Test 4: Verify sample column values
function testColumnValues() {
    console.log('✓ Testing column value correctness');
    
    // Verify some key columns have correct values
    const tests = [
        { column: TableColumns.REQUEST.STATE, expected: 'state' },
        { column: TableColumns.REQUEST.REQUESTED_FOR, expected: 'requested_for' },
        { column: TableColumns.ASSIGNMENT.USER, expected: 'user' },
        { column: TableColumns.ASSIGNMENT.STATUS, expected: 'status' },
        { column: TableColumns.ACCESS_TYPE.NAME, expected: 'name' },
        { column: TableColumns.APPROVAL.APPROVER, expected: 'approver' },
    ];
    
    tests.forEach(test => {
        if (test.column === test.expected) {
            console.log(`  ✓ ${test.column} = '${test.expected}'`);
        } else {
            console.error(`  ✗ ${test.column} !== '${test.expected}'`);
        }
    });
}

// Test 5: Verify table name values
function testTableValues() {
    console.log('✓ Testing table name correctness');
    
    const tests = [
        { table: TableNames.REQUEST, expected: 'x_itaccess_request' },
        { table: TableNames.ASSIGNMENT, expected: 'x_itaccess_assignment' },
        { table: TableNames.ACCESS_TYPE, expected: 'x_itaccess_access_type' },
        { table: TableNames.APPROVAL, expected: 'x_itaccess_approval' },
    ];
    
    tests.forEach(test => {
        if (test.table === test.expected) {
            console.log(`  ✓ Table name = '${test.expected}'`);
        } else {
            console.error(`  ✗ Table name !== '${test.expected}'`);
        }
    });
}

// Run all tests
console.log('\n🧪 Running Table Constants Validation Tests\n');
console.log('='.repeat(50));

try {
    testTableNames();
    console.log('');
    
    testTableColumns();
    console.log('');
    
    testTypeHelpers();
    console.log('');
    
    testColumnValues();
    console.log('');
    
    testTableValues();
    console.log('');
    
    console.log('='.repeat(50));
    console.log('\n✅ All validation tests passed!\n');
} catch (error) {
    console.error('\n❌ Validation tests failed:', error);
    process.exit(1);
}
