'use client';
import React, { useEffect, useState } from 'react';
import firebaseDB from '../../../firebase_config'; // Assuming the correct path to your configuration file
import { getDatabase, ref, onValue, update } from 'firebase/database';

// App.js

function FirebaseOps() {
  const [data, setData] = useState([]);
  const [entryCount, setEntryCount] = useState(0);

  useEffect(() => {
    // Initialize the Firebase database with the provided configuration
    const database = getDatabase(firebaseDB);

    // Reference to the specific collection in the database
    const collectionRef = ref(database, 'Users/Jack/Vocab');

    // Function to fetch data from the database
    const fetchData = () => {
      // Listen for changes in the collection
      onValue(collectionRef, (snapshot) => {
        const dataItem = snapshot.val();

        // Check if dataItem exists
        if (dataItem) {
          // Convert the object values into an array
          const displayItem = Object.values(dataItem);
          setData(displayItem);
          setEntryCount(displayItem.length);
        }
      });
    };

    // Fetch data when the component mounts
    fetchData();
  }, []);

  const updateData = () => {
    const database = getDatabase(firebaseDB);
    const collectionRef = ref(database, 'Users/Jack/Vocab');
    var newData = {};
    var index;
    if (entryCount === 0) {
      index = 0;
    } else {
      index = entryCount;
    }
    newData = {
      [index]: 'Databases'
    };
    update(collectionRef, newData);
    update(collectionRef, { isEmpty: false });
  };

  const removeLastItem = () => {
    const database = getDatabase(firebaseDB);
    const collectionRef = ref(database, 'Users/Jack/Vocab');
    const updates = {};
    if (entryCount > 2) {
      const lastItemKey = entryCount - 1; // Assuming keys are sequential numbers
      updates[lastItemKey] = null;
      update(collectionRef, updates);
    } else {
      const lastItemKey = entryCount - 1;
      updates[lastItemKey] = null;
      update(collectionRef, updates);
      update(collectionRef, { isEmpty: true });
    }
  };

  return (
    <div>
      <h1>Data from database:</h1>
      <p>Number of entries: {entryCount - 1}</p>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            {Array.isArray(item)
              ? item.join(', ')
              : JSON.stringify(item) || 'No data'}
            {/* Display 'No data' if item is falsy */}
          </li>
        ))}
      </ul>
      <button onClick={updateData}>Update Data</button>
      <br />
      <button onClick={removeLastItem}>Remove Data</button>
    </div>
  );
}

export default FirebaseOps;
