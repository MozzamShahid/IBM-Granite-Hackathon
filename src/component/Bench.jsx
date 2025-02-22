import React, { useState } from 'react'
import axios from 'axios';

const Bench = () => {
    const [useAlternative, setUseAlternative] = useState(false);
    const [backendData, setBackendData] = useState([]);
    const [numPdfs, setNumPdfs] = useState(1);
    const [urls, setUrls] = useState(['']);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Handle PDF upload
    const handleFileUpload = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 4) {
            alert('Maximum 4 files allowed');
            e.target.value = null;
            return;
        }
        if (selectedFiles.length > numPdfs) {
            alert(`Please upload only ${numPdfs} PDF(s)`);
            e.target.value = null;
            return;
        }
        setFiles(selectedFiles);
        console.log('Selected files:', selectedFiles);
    }

    // Handle URL inputs
    const handleUrlChange = (index, value) => {
        const newUrls = [...urls];
        newUrls[index] = value;
        setUrls(newUrls);
    }

    const addUrlField = () => {
        if (urls.length >= 4) {
            alert('Maximum 4 URLs allowed');
            return;
        }
        setUrls([...urls, '']);
    }

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const formData = new FormData();

            if (!useAlternative) {
                // Handle PDF submission
                files.forEach((file, index) => {
                    formData.append(`pdf_${index}`, file);
                });
                
                console.log('Submitting PDFs:', files);
                
                const response = await axios.post('http://your-backend-url/upload-pdfs', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                
                console.log('PDF upload response:', response.data);
                setBackendData(response.data);
            } else {
                // Handle URL submission
                const filteredUrls = urls.filter(url => url.trim() !== '');
                
                console.log('Submitting URLs:', filteredUrls);
                
                const response = await axios.post('http://your-backend-url/process-urls', {
                    urls: filteredUrls
                });
                
                console.log('URL processing response:', response.data);
                setBackendData(response.data);
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Error submitting data. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='h-screen flex flex-col justify-center items-center gap-5 p-10'>
            <h2 className='text-2xl md:text-2xl lg:text-4xl text-center font-bold'>AI-Powered Product Breakdown & Feature Extraction</h2>

            <div className='flex flex-col gap-2'>
                {!useAlternative && (
                    <>
                        <label>How many pdf you want to upload? <span className='text-xs'>*Max 4 Allowed</span></label>
                        <input 
                            placeholder='Enter Number Here' 
                            type="number" 
                            min={1} 
                            max={4} 
                            value={numPdfs}
                            onChange={(e) => setNumPdfs(parseInt(e.target.value))}
                        />

                        <label>Upload Your Files</label>
                        <input type="file" accept='application/pdf' multiple onChange={handleFileUpload} />
                        <button className='bg-amber-300 hover:bg-amber-400 disabled:bg-gray-300'
                            onClick={handleSubmit}
                            disabled={loading || files.length === 0}
                        >
                            {loading ? 'Processing...' : 'Submit'}
                        </button>
                    </>
                )}

                <p className='text-sm cursor-pointer underline' onClick={() => setUseAlternative(!useAlternative)}>
                    {useAlternative ? "Use PDF Upload Instead" : "Donot have a pdf, Want to use web url instead? click here"}
                </p>

                {useAlternative && (
                    <>
                        <label>Please Submit the url(s) of the website</label>
                        {urls.map((url, index) => (
                            <input key={index} type="url" value={url} onChange={(e) => handleUrlChange(index, e.target.value)} placeholder='url here www.google.com' />
                        ))}
                        <button 
                            className='bg-amber-300 hover:bg-amber-400 w-full'
                            onClick={addUrlField}
                        >
                            Add Another URL
                        </button>
                        <button 
                            className='bg-amber-300 hover:bg-amber-400 disabled:bg-gray-300'
                            onClick={handleSubmit}
                            disabled={loading || urls.every(url => url.trim() === '')}
                        >
                            {loading ? 'Processing...' : 'Submit'}
                        </button>
                    </>
                )}

                {/* Display Data from Backend For the backend team to **Edit** */}
                {backendData.length > 0 ? (
                <div className='p-5 border-1'>
                    <h2 className='text-xl md:text-2xl lg:text-4xl text-left font-normal'>Chat Response</h2>

                    <div className='max-h-64 overflow-y-auto'>
                        {backendData.map((item, index) => (
                            <div key={index}>
                                {/* Incase of Text */}
                                <p>{item.text}</p>
                                {/* Incase of Image */}
                                {item.imageUrl && <img src={item.imageUrl} alt="Response" className="mt-2 w-32 h-32 rounded" />}
                            </div>
                        ))}
                    </div>
                </div>
                ) : ( <p></p> 
                 )}

            </div>
        </div>
    )
}

export default Bench
