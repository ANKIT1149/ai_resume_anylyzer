import ScoreGauge from "~/componenets/ScoreGauge";
import ScoreBadge from "~/componenets/ScoreBadge";

const CategoryScore = ({title, score}: {title: string; score: number}) => {
    const textColour = score >= 70 ? "text-green-700" : score > 49 ? 'text-yellow-700' : "text-red-700"
    return(
        <div className="resume-summary">
           <div className="category">
               <div className="flex flex-row gap-4 items-center justify-center">
                   <h5 className="text-2xl font-serif font-semibold">{title}</h5>
                   <ScoreBadge score={score} />
               </div>
               <p className="text-2xl">
                   <span className={textColour}>{score}</span>/100
               </p>
           </div>
        </div>
    )
}

const Summary = ({feedback}: {feedback: Feedback}) => {
    return(
         <div className="bg-white rounded-3xl shadow-md w-full">
             <div className="flex flex-row items-center gap-8 p-4">
                 <ScoreGauge score={feedback.overallScore} />

                 <div className="flex flex-col gap-2">
                     <h2 className="font-bold text-3xl font-serif">Your Resume Score</h2>
                     <p className="text-md text-gray-600">This score is calculated on the based of variable given below.</p>
                 </div>
             </div>

             <CategoryScore title="Tone & Style" score={feedback. toneAndStyle.score} />
             <CategoryScore title="Content" score={feedback. content.score} />
             <CategoryScore title="Structure" score={feedback.structure.score} />
             <CategoryScore title="Skills" score={feedback.skills.score} />
         </div>
    )
}

export default Summary;