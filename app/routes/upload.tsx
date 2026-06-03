import react, {useState} from 'react';
import Navbar from "~/componenets/Navbar";
import React from "react";
import FileUploader from "~/componenets/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {convertPdfToImage} from "~/lib/pdf2image";
import {generateUUID} from "~/utils/formatSize";
import {prepareInstructions} from "../../constants";

const Upload = () => {
    const {auth, fs, kv, ai, isLoading} = usePuterStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState<string>('');
    const [file, setFile] = useState<File | null>(null)

    const handleAnalyze = async ({companyName, jobTitle, jobDescription, file}: {
        companyName: string,
        jobTitle: string,
        jobDescription: string,
        file: File[]
    }) => {
        setIsProcessing(true);
        setStatusText("Uploading The File.....")

        const uploadFile = await fs.upload(file);
        console.log(uploadFile)
        if (!uploadFile) return setStatusText("Error: Failed to upload the file");

        setStatusText("Converting into Image");

        const imageFile = await convertPdfToImage(file);

        console.log(imageFile);

        if (!imageFile.file) return setStatusText("Error: Failed to convert image");

        setStatusText("Uploading the image...")
        const uploadImage = await fs.upload([imageFile.file]);
        if (!uploadImage) return setStatusText("Error: Failed to upload the image");

        setStatusText("Prepairing the image...");

        const uuid = generateUUID();

        const data = {
            id: uuid,
            resumePath: uploadFile.path,
            imagePath: uploadImage.path,
            companyName,
            jobTitle,
            jobDescription,
        }

        await kv.set(`resume: ${uuid}`, JSON.stringify(data));

        const feedback = await ai.feedback(
            uploadFile.path,
            prepareInstructions(jobTitle, jobDescription)
        )

        if (!feedback) return setStatusText("Error: Failed to anylyze the form");

        const feedbackText = typeof feedback.message.content === "string" ? feedback.message.content : feedback.message.content[0].text;

        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume: ${uuid}`, JSON.stringify(data));

        setStatusText("Anylysis Complete, redirecting...");
        console.log(data)
    }


    const handleSubmit = async(e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest("form");
        if (!form) return;

        const formData = new FormData(form);

        const companyName = formData.get("company-name");
        const jobTitle = formData.get("job-title");
        const jobDescription = formData.get("job-description");

        console.log({companyName, jobTitle, jobDescription, file})

        if (!file) return;

         await handleAnalyze({companyName, jobTitle, jobDescription, file})
    }

    const handleFileSelect = (file: File | null) => {
        if (!file) {
            setFile(null);
            return;
        }
        setFile(file);
        console.log(file.name);
    }
    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar/>
            <section className="main-section">
                <div className="-page-heading py-16">
                    <h1>Smart Feedback For Your Dream Job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full"/>
                        </>
                    ) : (
                        <h2>Drop Your Resume for an ATS Score And Improvement</h2>
                    )}


                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-10">
                            <div className='form-div'>
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" id="company-name" name="company-name" placeholder="Company Name"/>
                            </div>

                            <div className='form-div'>
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" id="job-title" name="job-title" placeholder="Job Title"/>
                            </div>

                            <div className='form-div'>
                                <label htmlFor="job-description">Job Description </label>
                                <textarea rows={5} id="job-description" name="job-description"
                                          placeholder="Job Description"/>
                            </div>

                            <div className='form-div'>
                                <label htmlFor="Uploader">Uploader</label>
                                <FileUploader onFileSelect={handleFileSelect}/>
                            </div>

                            <button className="primary-button" type="submit">Anaylyze Resume</button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload;