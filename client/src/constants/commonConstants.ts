export const COMMON_CONSTANT = Object.freeze({
    POLICIES_LIST: [
        {
            name: 50000,
            value: '50'
        },
        {
            name: 100000,
            value: '100'
        },
        {
            name: 250000,
            value: '250'
        },
        {
            name: 500000,
            value: '500'
        }
    ],
    LETTER_FORMAT: /^[a-zA-Z ,]*$/,
    SORT_LIST: [
        {name: 'Name (A-Z)', value: 'Name'},
        {name: 'Price Low to High', value: 'LowToHigh'},
        {name: 'Price High to Low', value: 'HighToLow'}
    ],
    FILTER_OBJ: {
        bestSeller: ['All', 'Yes', 'No'],
        policy_max: ['All', '100', '200', '300'],
        type: ['All', 'Comprehensive', 'Fixed'],
        section: ['All', 'Travel', 'Medical', 'International', 'J1']
    },
    URL: 'http://localhost:8080/quotes'
});