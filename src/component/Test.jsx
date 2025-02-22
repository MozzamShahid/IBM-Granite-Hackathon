import React, { useState } from 'react'

const Test = () => {
    const [useAlternative, setUseAlternative] = useState(false);
    const [backendData, setBackendData] = useState([])
    return (
        <div className='h-screen flex flex-col justify-center items-center gap-5 p-10'>
            <h2 className='text-2xl md:text-2xl lg:text-4xl text-center font-bold'>AI-Powered Product Breakdown & Feature Extraction</h2>

            <div className='flex flex-col gap-2'>
                {!useAlternative && (
                    <>
                        {/* User Input for Number of PDF's */}
                        <label>How many pdf you want to upload? <span className='text-xs'>*Max 4 Allowed</span></label>
                        <input placeholder='Enter Number Here' type="number" min={1} max={4} />

                        {/* Input for Files */}
                        <label>Upload Your Files</label>
                        <input type="file" accept='application/pdf' multiple max={4} />

                        <button className='bg-amber-300 hover:bg-amber-400'>Submit</button>
                    </>
                )}

                {/* Use Alternative Button */}
                <p className='text-sm cursor-pointer underline' onClick={() => setUseAlternative(!useAlternative)}>
                    {useAlternative ? "Use PDF Upload Instead" : "Donot have a pdf, Want to use web url instead? click here"}
                </p>

                {useAlternative && (
                    <>
                        {/* Alternative Approach Incase User Donot have PDF's */}
                        <label>Please Submit the url of the website</label>
                        <input type="text" placeholder='Write Your Text Here' />
                        <input type="url" placeholder=' url here www.google.com' />
                        <button className='bg-amber-300 hover:bg-amber-400'>Submit</button>
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

export default Test
