import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ResultFramework from "@/models/ResultFramework";
import RFStatus from "@/models/RFStatus";

export async function GET() {
	try {
		await dbConnect();

		// Get all RF indicators
		const indicators = await ResultFramework.find({}).sort({ createdAt: -1 });

		// Get the latest status for each indicator
		const indicatorsWithStatus = await Promise.all(
			indicators.map(async (indicator) => {
				const latestStatus = await RFStatus.findOne({ rfId: indicator._id })
					.sort({ year: -1, quarter: -1 })
					.limit(1);

				return {
					id: indicator._id,
					indicator: indicator.indicator,
					baseline: indicator.baseline || "N/A",
					yearOneTarget: indicator.yearOneTarget,
					yearTwoTarget: indicator.yearTwoTarget,
					yearThreeTarget: indicator.yearThreeTarget,
					yearFourTarget: indicator.yearFourTarget,
					yearFiveTarget: indicator.yearFiveTarget || "N/A",
					latestStatus: latestStatus
						? {
								status: latestStatus.status,
								year: latestStatus.year,
								quarter: latestStatus.quarter,
								remark: latestStatus.remark || "",
						  }
						: null,
				};
			})
		);

		return NextResponse.json({
			success: true,
			data: indicatorsWithStatus,
		});
	} catch (error) {
		console.error("Error fetching PDO indicators:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch PDO indicators" },
			{ status: 500 }
		);
	}
}
