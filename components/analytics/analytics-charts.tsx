'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = [
	'#059669', // emerald-600 - Income/Savings (green)
	'#dc2626', // red-600 - Expenses (red)
	'#2563eb', // blue-600 - General data (blue)
	'#d97706', // amber-600 - Warnings/Alerts (orange)
	'#7c3aed', // violet-600 - Categories (purple)
	'#0891b2', // cyan-600 - Additional categories (cyan)
	'#65a30d', // lime-600 - Positive trends (lime)
	'#ea580c', // orange-600 - Secondary alerts (orange)
];

export { COLORS };

interface ChartDataPoint {
	[key: string]: any;
}

interface LineChartProps {
	data: ChartDataPoint[];
	xAxisKey: string;
	yAxisKeys: string[];
	colors?: string[];
	title: string;
	description: string;
	height?: number;
	isLoading?: boolean;
	emptyMessage?: string;
}

export function AnalyticsLineChart({
	data,
	xAxisKey,
	yAxisKeys,
	colors = COLORS,
	title,
	description,
	height = 300,
	isLoading = false,
	emptyMessage = 'No data available',
}: LineChartProps) {
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent>
					<Skeleton className={`h-[${height}px] w-full`} />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				{data.length > 0 ? (
					<ResponsiveContainer width='100%' height={height}>
						<LineChart data={data}>
							<CartesianGrid
								strokeDasharray='3 3'
								className='stroke-muted'
							/>
							<XAxis
								dataKey={xAxisKey}
								className='text-xs'
								tickLine={false}
								axisLine={false}
							/>
							<YAxis
								className='text-xs'
								tickLine={false}
								axisLine={false}
								tickFormatter={(value) => `₹${value}`}
							/>
							<Tooltip
								formatter={(value: number) =>
									`₹${value.toFixed(2)}`
								}
								contentStyle={{
									backgroundColor: '#ffffff',
									border: '1px solid #e5e7eb',
									borderRadius: '6px',
									padding: '8px 12px',
								}}
								wrapperStyle={{
									outline: 'none',
								}}
							/>
							<Legend
								wrapperStyle={{ paddingTop: '20px' }}
								iconType='line'
							/>
							{yAxisKeys.map((key, index) => (
								<Line
									key={key}
									type='monotone'
									dataKey={key}
									stroke={colors[index % colors.length]}
									strokeWidth={2}
									dot={{
										fill: colors[index % colors.length],
									}}
									activeDot={{
										r: 6,
										stroke: colors[index % colors.length],
										strokeWidth: 2,
										fill: colors[index % colors.length],
									}}
									name={
										key.charAt(0).toUpperCase() +
										key.slice(1)
									}
									connectNulls={false}
								/>
							))}
						</LineChart>
					</ResponsiveContainer>
				) : (
					<div className='flex items-center justify-center h-[300px] text-muted-foreground'>
						<p>{emptyMessage}</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

interface BarChartProps {
	data: ChartDataPoint[];
	xAxisKey: string;
	yAxisKeys: string[];
	colors?: string[];
	title: string;
	description: string;
	height?: number;
	isLoading?: boolean;
	emptyMessage?: string;
}

export function AnalyticsBarChart({
	data,
	xAxisKey,
	yAxisKeys,
	colors = COLORS,
	title,
	description,
	height = 300,
	isLoading = false,
	emptyMessage = 'No data available',
}: BarChartProps) {
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent>
					<Skeleton className={`h-[${height}px] w-full`} />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				{data.length > 0 ? (
					<ResponsiveContainer width='100%' height={height}>
						<BarChart data={data} barCategoryGap='20%'>
							<CartesianGrid
								strokeDasharray='3 3'
								className='stroke-muted'
							/>
							<XAxis
								dataKey={xAxisKey}
								className='text-xs'
								tickLine={false}
								axisLine={false}
								angle={xAxisKey.length > 10 ? -45 : 0}
								textAnchor={
									xAxisKey.length > 10 ? 'end' : 'middle'
								}
								height={xAxisKey.length > 10 ? 80 : 60}
							/>
							<YAxis
								className='text-xs'
								tickLine={false}
								axisLine={false}
								tickFormatter={(value) => `₹${value}`}
							/>
							<Tooltip
								formatter={(value: number) =>
									`₹${value.toFixed(2)}`
								}
								contentStyle={{
									backgroundColor: '#ffffff',
									border: '1px solid #e5e7eb',
									borderRadius: '6px',
									padding: '8px 12px',
								}}
								wrapperStyle={{
									outline: 'none',
								}}
							/>
							<Legend
								wrapperStyle={{ paddingTop: '20px' }}
								iconType='rect'
							/>
							{yAxisKeys.map((key, index) => (
								<Bar
									key={key}
									dataKey={key}
									fill={colors[index % colors.length]}
									name={
										key.charAt(0).toUpperCase() +
										key.slice(1)
									}
								/>
							))}
						</BarChart>
					</ResponsiveContainer>
				) : (
					<div className='flex items-center justify-center h-[300px] text-muted-foreground'>
						<p>{emptyMessage}</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

interface PieChartDataPoint {
	name: string;
	value: number;
	percentage?: number;
	[key: string]: any;
}

interface PieChartProps {
	data: PieChartDataPoint[];
	title: string;
	description: string;
	height?: number;
	isLoading?: boolean;
	emptyMessage?: string;
	showPercentageInLabel?: boolean;
}

export function AnalyticsPieChart({
	data,
	title,
	description,
	height = 300,
	isLoading = false,
	emptyMessage = 'No data available',
	showPercentageInLabel = true,
}: PieChartProps) {
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent>
					<Skeleton className={`h-[${height}px] w-full`} />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				{data.length > 0 ? (
					<div className='space-y-4'>
						<ResponsiveContainer width='100%' height={height - 80}>
							<PieChart>
								<Pie
									data={data}
									cx='50%'
									cy='50%'
									labelLine={false}
									outerRadius={70}
									fill='#8884d8'
									dataKey='value'
									stroke='hsl(var(--background))'
									strokeWidth={2}
								>
									{data.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip
									formatter={(value: number) =>
										`₹${value.toFixed(2)}`
									}
									contentStyle={{
										backgroundColor: '#ffffff',
										border: '1px solid #e5e7eb',
										borderRadius: '6px',
										padding: '8px 12px',
									}}
									wrapperStyle={{
										outline: 'none',
									}}
								/>
							</PieChart>
						</ResponsiveContainer>

						{/* Custom Legend */}
						<div className='flex flex-wrap justify-center gap-4'>
							{data.map((entry, index) => (
								<div
									key={`legend-${index}`}
									className='flex items-center gap-2'
								>
									<div
										className='w-3 h-3 rounded-full'
										style={{
											backgroundColor:
												COLORS[index % COLORS.length],
										}}
									/>
									<span className='text-sm text-muted-foreground'>
										{entry.name}
										{showPercentageInLabel &&
											entry.percentage && (
												<span className='ml-1 font-medium'>
													(
													{entry.percentage.toFixed(
														1
													)}
													%)
												</span>
											)}
									</span>
								</div>
							))}
						</div>
					</div>
				) : (
					<div className='flex items-center justify-center h-[300px] text-muted-foreground'>
						<p>{emptyMessage}</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
