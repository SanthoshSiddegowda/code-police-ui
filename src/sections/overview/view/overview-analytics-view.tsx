import { useState, useEffect } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { TrophyIcon } from 'src/components/icons/trophy-icon';
import { CheckmarkIcon } from 'src/components/icons/checkmark-icon';
import { WarningIcon } from 'src/components/icons/warning-icon';
import { ErrorIcon } from 'src/components/icons/error-icon';

import { getCurrentWeekStats, type WeeklyStats } from 'src/services/api';
import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsWidgetSummaryPerformer } from '../analytics-widget-summary-performer';

export function OverviewAnalyticsView() {
	const [stats, setStats] = useState<WeeklyStats | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const data = await getCurrentWeekStats();
				setStats(data);
			} catch (error) {
				console.error('Error:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, []);

	if (loading) return <div>Loading...</div>;
	if (!stats) return <div>No data available</div>;

	const developers = Object.values(stats.developers_rankings);
	const topPerformer = developers[0] || { name: 'N/A', average_score: 0 };

  
	return (
		<DashboardContent maxWidth="xl">
			<Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
				Hi, Mobisians 👋
			</Typography>

			<Grid container spacing={3}>
				{/* Top Performer Widget */}
				<Grid xs={12} sm={6} md={3}>
					<AnalyticsWidgetSummary
						title="Top Performer"
						total={stats.top_performers?.[0]?.name}
						percent={topPerformer.average_score ?? 0}
						icon={<TrophyIcon />}
						color="success"
						chart={{
							series: developers.map(d => d.average_score ?? 0),
							categories: developers.map(d => d.name),
						}}
					/>
				</Grid>

				{/* PR's Reviewed Widget */}
				<Grid xs={12} sm={6} md={3}>
					<AnalyticsWidgetSummary
						title="PR's Reviewed"
						total={stats.summary.total_reviews}
						percent={stats.summary.team_average_score}
						icon={<CheckmarkIcon />}
						color="info"
						chart={{
							series: developers.map(d => d.total_reviews),
							categories: developers.map(d => d.name),
						}}
					/>
				</Grid>

				{/* Quality Issues Widget */}
				<Grid xs={12} sm={6} md={3}>
					<AnalyticsWidgetSummary
						title="Quality Issues"
						total={stats.summary?.total_quality_issues || 0}
						percent={stats.summary?.team_average_score || 0}
						icon={<WarningIcon />}
						color="warning"
						chart={{
							series: stats.summary?.most_common_issues.map(i => i.percentage) || [],
							categories: stats.summary?.most_common_issues.map(i => i.issue) || [],
						}}
					/>
				</Grid>

				{/* Critical Issues Widget */}
				<Grid xs={12} sm={6} md={3}>
					<AnalyticsWidgetSummary
						title="Critical Issues"
						total={stats.summary?.total_critical_issues || 0}
						percent={stats.summary?.team_average_score || 0}
						icon={<ErrorIcon />}
						color="error"
						chart={{
							series: stats.summary?.most_common_issues.map(i => i.percentage) || [],
							categories: stats.summary?.most_common_issues.map(i => i.issue) || [],
						}}
					/>
				</Grid>

				{/* Common Issues Chart */}
				<Grid xs={12} md={6} lg={4}>
					<AnalyticsCurrentVisits
						title="Common Issues"
						chart={{
							series: stats.summary?.most_common_issues.map(i => ({
								label: i.issue,
								value: i.percentage,
							})) || [],
						}}
					/>
				</Grid>

        

				{/* PR Dashboard Chart */}
				<Grid xs={12} md={6} lg={8}>
					<AnalyticsWebsiteVisits
						title="PR Dashboard"
						subheader={`Team Average Score: ${stats.summary?.team_average_score.toFixed(2) || 'N/A'}`}
						chart={{
							categories: developers.map(d => d.name),
							series: [
								{
									name: "Reviews",
									data: developers.map((developer) => developer.total_reviews),
								},
								{
									name: "Score",
									data: developers.map((developer) => developer.average_score ?? 0),
								},
							],
						}}
					/>
				</Grid>
			</Grid>
		</DashboardContent>
	);
}