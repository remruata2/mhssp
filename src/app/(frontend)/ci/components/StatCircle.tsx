interface StatCircleProps {
	value: string;
	label?: string;
}

export default function StatCircle({ value, label }: StatCircleProps) {
	return (
		<div className="flex flex-col items-center">
			<div className="h-28 w-28 rounded-full bg-gradient-to-b from-gray-100 to-white shadow flex items-center justify-center">
				<span className="text-2xl font-semibold text-gray-800">{value}</span>
			</div>
			{label ? (
				<span className="mt-2 text-xs tracking-wide text-gray-600">
					{label}
				</span>
			) : null}
		</div>
	);
}
