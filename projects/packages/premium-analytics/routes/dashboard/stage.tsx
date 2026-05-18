import { LineChartUnresponsive } from '@automattic/charts';
import '@automattic/charts/style.css';
import { __ } from '@wordpress/i18n';
import type { SeriesData } from '@automattic/charts';

const PAGE_VIEWS: SeriesData[] = [
	{
		label: 'Page Views',
		data: [
			{ dateString: '2024-01-01', value: 1200, label: 'Mon' },
			{ dateString: '2024-01-02', value: 1900, label: 'Tue' },
			{ dateString: '2024-01-03', value: 1500, label: 'Wed' },
			{ dateString: '2024-01-04', value: 2200, label: 'Thu' },
			{ dateString: '2024-01-05', value: 1800, label: 'Fri' },
			{ dateString: '2024-01-06', value: 900, label: 'Sat' },
			{ dateString: '2024-01-07', value: 700, label: 'Sun' },
		],
	},
];

export const stage = () => {
	return (
		<div className="jetpack-premium-analytics-dashboard">
			<h1>{ __( 'Analytics', 'jetpack-premium-analytics' ) }</h1>
			<h2>{ __( 'Page Views', 'jetpack-premium-analytics' ) }</h2>
			<LineChartUnresponsive data={ PAGE_VIEWS } width={ 600 } height={ 280 } />
			<p>{ __( 'Welcome to the Analytics dashboard.', 'jetpack-premium-analytics' ) }</p>
		</div>
	);
};
