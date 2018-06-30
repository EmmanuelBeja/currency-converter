//import idb
import idb from 'idb';

//creating an object store(kind of table)
let dbPromise = idb.open('test-db', 1,
function(upgradeDb){
if (!upgradeDb.objectStoreNamescontains('tbl_store')) {
console.log('creating table');
let store = upgradeDb.createObjectStore('tbl_store');
store.createIndex('currencypair', 'currencypair',
{unique: true});
}
})

//adding data to the table
dbPromise.then(function(db) {
console.log('adding data to table');
let transaction = db.transaction('tbl_store', 'readwrite');
let store = transaction.objectStore('tbl_store');
store.add({currencypair: 'USD_KES', quantity: 1, result: 108});
return transaction.complete;
});

//read data from db
dbPromise.then(function(db){
console.log('reading data from db');
let tx = db.transaction('tbl_store', 'readonly');
let store = tx.objectStore('tbl_store');
return store.get('USD_KES')
}).then(function(val) {
  console.log('The value of "USD_KES" is:', val);
});
