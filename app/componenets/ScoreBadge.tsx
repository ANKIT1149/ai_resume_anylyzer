type ScoreBadgeProps = {
  score: number;
};

const ScoreBadge = ({ score }: ScoreBadgeProps) => {
  let label = "Needs Work";
  let classes = "bg-badge-red text-red-700 border-red-300";

  if (score > 70) {
    label = "Strong";
    classes = "bg-badge-green text-green-700 border-green-300";
  } else if (score > 40) {
    label = "Good";
    classes = "bg-badge-yellow text-yellow-700 border-yellow-300";
  }

  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 border text-xs font-medium ${classes}`}>
      <p>{label}</p>
    </div>
  );
};

export default ScoreBadge;
