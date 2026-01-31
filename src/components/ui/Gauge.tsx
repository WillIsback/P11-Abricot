export default function Gauge({
	todo,
	completed,
}: {
	todo: number;
	completed: number;
}) {
	const clampedProgress = Math.min(100, Math.max(0, (completed / todo) * 100));

	return (
		<div className="flex flex-col gap-2">
			<div className="w-full bg-gray-200 rounded-full h-1.75">
				<div
					className="bg-success h-1.75 rounded-full transition-all duration-300"
					style={{ width: `${clampedProgress}%` }}
				></div>
			</div>
			<p className="body-2xs text-gray-600">
				{completed}/{todo} tâches terminées
			</p>
		</div>
	);
}
