import React from 'react';
import './App.css';
import axios from "axios";

const URL = 'http://localhost:3000';

function App() {
    function handleClick() {
        axios.get(URL).then(res => {
            console.log(res);
        });
    }

    return (
        <div>
            <button onClick={handleClick}>Request</button>
        </div>
    );
}

export default App;
