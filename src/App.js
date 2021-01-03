import './App.css';
import React, {useState, useEffect} from 'react';
import axios from 'axios';

let fileChunks = [];

function App() {
    const [link, setLink] = useState('');
    const [downloadFinished, setDownloadFinished] = useState(0);
    const [completedChunks, setCompletedChunks] = useState([]);
    const [ranges, setRanges] = useState([]);
    const download = () => {
        axios.get(`http://localhost:7000/?url=${link}`).then(res => {
            fileChunks = (res.data.chunks);
            setDownloadFinished(new Date().getTime());
        }).then(err => {

        });
        // axios.head(link).then(res => {
        //     if (!res.headers['accept-ranges'] || res.headers['accept-ranges'] === 'none') return;
        //     console.log("Started Downloading");
        //     const length = Number(res.headers['content-length']);
        //     const chunkSize = Math.round(length / 8);
        //     const ranges = [0, 1, 2, 3, 4, 5, 6, 7].map(i => {
        //         return `bytes=${i === 0 ? 0 : 1 + i * chunkSize}-${i === 7 ? length - 1 : ((i + 1) * chunkSize)}`
        //     });
        //     setRanges(ranges);
        //     ranges.map((range, index) => {
        //         axios.get(link, {headers: {'range': range}, responseType: 'blob'}).then(res => {
        //             fileChunks[index] = res.data;
        //             setCompletedChunks(completedChunks => [...completedChunks, index]);
        //             console.log(completedChunks)
        //             console.log(index);
        //             setChunks(chunk => chunk + 1);
        //         }).catch(err => {
        //         });
        //     });
        // }).catch(err => {
        // })
    };

    useEffect(() => {
        const webm = fileChunks.reduce((a, b) => new Blob([a, b]));
        document.location.href = URL.createObjectURL(webm);
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
                        <td width={100}>Status</td>
                    </tr>
                    {ranges.map((range, index) => (
                        <tr>
                            <td>{index}</td>
                            <td>{range}</td>
                            <td>{completedChunks.includes(index) ? 'Done' : 'Downloading'}</td>
                        </tr>
                    ))}

                </table>
            </div>
        </div>
    );
}

export default App;
