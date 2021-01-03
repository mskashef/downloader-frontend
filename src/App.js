import './App.css';
import React, {useState, useEffect} from 'react';
import axios from 'axios';

function App() {
    const [link, setLink] = useState('');
    const [ranges, setRanges] = useState([]);
    const download = () => {
        setRanges([]);
        if (!link.trim()) return alert("Link Can not be empty!");

        axios.get(`http://localhost:7000/?url=${link}`).then(res => {
            setRanges(res.data.ranges);
            const myLink = document.createElement('a');
            myLink.href = res.data.base64Link;
            myLink.download = res.data.name;
            myLink.click();
        }).then(console.log);
    };

    return (
        <div className="App">
            <div>
                <input value={link} type="text" className={"link"} onChange={e => setLink(e.target.value)}/>
                <button className={"download"} onClick={download}>Download</button>
            </div>
            <div className="report">
                <table cellPadding={0} cellSpacing={0}>
                    <tr>
                        <td width={80}>Thread</td>
                        <td>Range</td>
                    </tr>
                    {ranges.map((range, index) => (
                        <tr>
                            <td>{index}</td>
                            <td>{range}</td>
                        </tr>
                    ))}
                </table>
            </div>
        </div>
    );
}

export default App;
