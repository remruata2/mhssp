"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PageTitle from "@/components/ui/PageTitle";

interface PDOIndicator {
	id: string;
	indicator: string;
	baseline: string;
	yearOneTarget: string;
	yearTwoTarget: string;
	yearThreeTarget: string;
	yearFourTarget: string;
	yearFiveTarget: string;
	latestStatus: {
		status: string;
		year: number;
		quarter: number;
		remark: string;
	} | null;
}

export default function PDOIndicatorsPage() {
	const [indicators, setIndicators] = useState<PDOIndicator[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchIndicators = async () => {
			try {
				const response = await fetch("/api/pdo-indicators");
				const data = await response.json();

				if (data.success) {
					console.log(data.data);
					setIndicators(data.data);
				} else {
					setError(data.error);
				}
			} catch (error) {
				setError("Failed to fetch indicators");
			} finally {
				setLoading(false);
			}
		};

		fetchIndicators();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-red-500">{error}</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen py-4 bg-gray-50">
			<PageTitle
				title="Result Framework"
				subtitle="Achievements of Mizoram Health Systems Strengthening Project (MHSSP)"
			/>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mt-8 space-y-6">
					{indicators.map((indicator, index) => {
						const isPDO5 = indicator.indicator.includes("PDO 5");
						return (
							<motion.div
								key={indicator.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className="bg-white rounded-lg shadow-md overflow-hidden"
							>
								<div className="p-6">
									<h3 className="text-lg font-semibold text-gray-900 mb-4">
										{indicator.indicator}
									</h3>
									{indicator.latestStatus && (
										<div className="text-sm text-gray-500 py-2 text-right">
											Year: {indicator.latestStatus.year} Quarter:
											{indicator.latestStatus.quarter}
										</div>
									)}

									<div className="overflow-x-auto">
										{isPDO5 ? (
											<table className="min-w-full">
												<thead>
													<tr>
														<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider  bg-[#1192c3]">
															Year
														</th>
														<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#1192c3]">
															Target
														</th>
														<th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-1/3 bg-[#1192c3]">
															Latest Status
														</th>
													</tr>
												</thead>
												<tbody className="bg-white divide-y divide-gray-200">
													<tr>
														<td className="px-6 py-4 text-sm font-medium text-gray-900">
															Year 1
														</td>
														<td className="px-6 py-4 text-sm text-gray-900">
															{indicator.yearOneTarget}
														</td>
													</tr>
													<tr>
														<td className="px-6 py-4 text-sm font-medium text-gray-900">
															Year 2
														</td>
														<td className="px-6 py-4 text-sm text-gray-900">
															{indicator.yearTwoTarget}
														</td>
													</tr>
													<tr>
														<td className="px-6 py-4 text-sm font-medium text-gray-900">
															Year 3
														</td>
														<td className="px-6 py-4 text-sm text-gray-900">
															{indicator.yearThreeTarget}
														</td>
													</tr>
													<tr>
														<td className="px-6 py-4 text-sm font-medium text-gray-900">
															Year 4
														</td>
														<td className="px-6 py-4 text-sm text-gray-900">
															{indicator.yearFourTarget}
														</td>
													</tr>
													<tr>
														<td className="px-6 py-4">
															<div>
																<div className="font-medium text-gray-900">
																	{indicator.latestStatus?.status}
																</div>
																{indicator.latestStatus?.remark && (
																	<div className="mt-1 text-sm text-gray-500">
																		{indicator.latestStatus.remark}
																	</div>
																)}
															</div>
														</td>
													</tr>
												</tbody>
											</table>
										) : (
											<table className="min-w-full">
												<thead>
													<tr className="bg-[#1192c3]">
														<th className="px-4 py-3 text-left text-xs font-medium text-white bg-[#1192c3] uppercase tracking-wider">
															Baseline
														</th>
														<th className="px-4 py-3 text-left text-xs font-medium text-white bg-[#1192c3] uppercase tracking-wider">
															Year 1 Target
														</th>
														<th className="px-4 py-3 text-left text-xs font-medium text-white bg-[#1192c3] uppercase tracking-wider">
															Year 2 Target
														</th>
														<th className="px-4 py-3 text-left text-xs font-medium text-white bg-[#1192c3] uppercase tracking-wider">
															Year 3 Target
														</th>
														<th className="px-4 py-3 text-left text-xs font-medium text-white bg-[#1192c3] uppercase tracking-wider">
															Year 4 Target
														</th>
														<th className="px-4 py-3 text-left text-xs font-medium text-white bg-[#1192c3] uppercase tracking-wider">
															Year 5 Target
														</th>
														<th className="px-4 py-3 text-left text-xs font-medium text-white bg-[#1192c3] uppercase tracking-wider">
															Latest Status
														</th>
													</tr>
												</thead>
												<tbody className="divide-y divide-gray-200">
													<tr>
														<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
															{indicator.baseline}
														</td>
														<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
															{indicator.yearOneTarget}
														</td>
														<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
															{indicator.yearTwoTarget}
														</td>
														<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
															{indicator.yearThreeTarget}
														</td>
														<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
															{indicator.yearFourTarget}
														</td>
														<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
															{indicator.yearFiveTarget}
														</td>
														<td className="px-4 py-3">
															{indicator.latestStatus ? (
																<div>
																	<div className="font-medium text-gray-900">
																		{indicator.latestStatus.status}
																	</div>
																	{indicator.latestStatus.remark && (
																		<div className="mt-1 text-sm text-gray-500">
																			{indicator.latestStatus.remark}
																		</div>
																	)}
																</div>
															) : (
																<span className="text-sm text-gray-500">
																	No data available
																</span>
															)}
														</td>
													</tr>
												</tbody>
											</table>
										)}
									</div>
								</div>
							</motion.div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
