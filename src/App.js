import './App.css';
import React, {useState, useEffect} from 'react';
import axios from 'axios';

let fileChunks = [];

function App() {
    const [link, setLink] = useState('');
    const [downloadFinished, setDownloadFinished] = useState(0);
    const [ranges, setRanges] = useState([]);
    const download = () => {
        setRanges([]);
        if (!link.trim()) return alert("Link Can not be empty!");
        axios.get(`http://localhost:7000/?url=${link}`).then(res => {
            fileChunks = (res.data.chunks);
            setRanges(res.data.ranges);
            setDownloadFinished(new Date().getTime());
        }).then(console.log);
    };

    function joinBase64Strings(base64Str1, base64Str2) {
        const bothData = Buffer.from(base64Str1, 'base64').toString('binary')
            + Buffer.from(base64Str2, 'base64').toString('binary');
        const joinedBase64Result = Buffer.from(bothData.toString(), 'binary').toString('base64');
        return joinedBase64Result;
    }

    useEffect(() => {
        if (downloadFinished === 0) return;
        let result = fileChunks.reduce((total, a) => joinBase64Strings(total, a));
        const myLink = document.createElement('a');
        let name = link;
        if (name.includes('/')) name = name.split('/')[name.split('/').length - 1];
        myLink.href='data:application/octet-stream;base64,' + result;
        myLink.download = name;
        myLink.click();
    }, [downloadFinished]);

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
