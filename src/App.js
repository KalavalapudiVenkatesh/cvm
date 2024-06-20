import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [url, setUrl] = useState('');
  const [fields, setFields] = useState('');
  const [data, setData] = useState(null);
  const [error,setError]=useState('');
  const validate=(val)=>{
   return val!==null && val!==undefined && val!==""?true:false;
  }
  const validateFileds=()=>{
    if(!validate(url) || !validate(fields)){
      setError("");
      setData(null)
      alert("Please Fill fileds!")

      return true;
    }
    return false;
  }
  const handleFetch = async () => {
    if(validateFileds())return false;
    const fieldArray = fields.split(',').map(field => field.trim());

    try {
      const response = await axios.get(url, {
        params: {
          url,
          // fields: fields
        }
      });
      // Extract specified fields and format as an array of objects
      const output = response?.data.length > 0 ? response?.data.map(item => {
        let obj = {};
        fieldArray.forEach(field => {
          if (item.hasOwnProperty(field)) {
            obj[field] = item[field];
          }
        });
        return obj;
      }).filter(obj => Object.keys(obj).length > 0) : [];

      console.log(output);
      setData(output);
    } catch (error) {
      setError("Error While Fetching....")
      
      console.error('Error fetching data:', error);
    }
  };



  return (
    <div className="main">
      <div className='container'>
        <h1>Dynamic API/JSON Fetch</h1>
        <div className='field-items'>
          <label>URI</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL"
          />
        </div>
        <div className='field-items'>
          <label>Fields</label>
          <input
            type="text"
            value={fields}
            onChange={(e) => setFields(e.target.value)}
            placeholder="Enter fields (comma-separated)"
          />
        </div>
        <button onClick={handleFetch}>Fetch Data</button>

        {validate(error)?<div>{error}</div>: Array.isArray(data) && data.length===0?<div>Please Check Fields Doesnt Match...!</div>
         : (
          <div>
            <h2>Fetched Data</h2>
            <pre>{data && JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;