type TripCardProps = {
  day: number;
  title: string;
  description: string;
};

export default function TripCard({ day, title, description }: TripCardProps) {
  return (
    <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 mb-4">
      <h3 className="text-lg font-semibold text-white mb-2">
        Day {day}: {title}
      </h3>
      <p className="text-neutral-400">{description}</p>
    </div>
  );
}