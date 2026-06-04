import {Link, useNavigate, useParams} from "react-router";
import {usePuterStore} from "~/lib/puter";
import {useEffect, useState} from "react";
import Summary from "~/componenets/Summary";
import ATS from "~/componenets/ATS";
import Details from "~/componenets/Details";

export const meta = () => ([
    {title: 'Resummind | Review'},
    {name: 'description', content: "Detail Overview Of  Your Resume"}
])

const ResumeFeedback = () => {
    const {auth, isLoading, kv, fs} = usePuterStore();
    const {id} = useParams();
    const navigate = useNavigate();
    const [resumeUrl, setResumeUrl] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string>('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);

    useEffect(() => {
        const loadResume = async () => {
            console.log('Load Resume');
            const resume = await kv.get(`resume: ${id}`);
            console.log(resume);
            if(!resume) return;

            const data = JSON.parse(resume);

            const resumeBlob = await fs.read(data.resumePath);
            console.log(resumeBlob)
            if(!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            console.log(resumeUrl);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);
            if(!imageBlob) return;

            const imageUrl = URL.createObjectURL(imageBlob);
            console.log(imageUrl)
            setImageUrl(imageUrl);

            setFeedback(data.feedback);

        }

        loadResume()
    }, [id]);
    return(
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="Back"  className="w-4 h-4"/>
                    <span className="text-gray-900 font-bold font-serif text-lg">
                        Back To Homepage
                    </span>
                </Link>
            </nav>
            <div className="flex w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg-[url('/images/bg-small.svg)] bg-cover h-[150vh] sticky top-0 items-center justify-center">
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[100%] max-w-2xl:h-full">
                            <a href={resumeUrl} target="_blank" rel= "noopener noreferrer">
                                <img src={imageUrl} alt="Resume Image" className="w-full h-full object-contain rounded-3xl"/>
                            </a>
                        </div>
                    )}
                </section>
                <section className="feedback-section">
                    <h2 className="text-black font-bold text-4xl">Resume Review</h2>
                    {feedback ? (
                        <div className="flex flex-col animate-in fade-in duration-1000 gap-8">
                            <Summary feedback={feedback}/>
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips}/>
                            <Details feedback={feedback} />
                        </div>
                        ) : (
                        <img src="/images/resume-scan-2.gif" className="w-[250px] h-[250px] mx-auto" alt="resume scan"/>
                    )}
                </section>
            </div>
        </main>
    )
}

export default ResumeFeedback;