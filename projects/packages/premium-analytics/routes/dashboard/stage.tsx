import { PieChartUnresponsive, type DataPointPercentage } from '@automattic/charts';
import '@automattic/charts/style.css';
import { __ } from '@wordpress/i18n';

const DEVICE_TYPES: DataPointPercentage[] = [
	{ label: 'Desktop', value: 5400 },
	{ label: 'Mobile', value: 3800 },
	{ label: 'Tablet', value: 800 },
];

export const stage = () => {
	return (
		<div className="jetpack-premium-analytics-dashboard">
			<h1>{ __( 'Analytics', 'jetpack-premium-analytics' ) }</h1>
			<p>{ __( 'Welcome to the Analytics dashboard.', 'jetpack-premium-analytics' ) }</p>
			<h2>{ __( 'Device Types', 'jetpack-premium-analytics' ) }</h2>
			<PieChartUnresponsive data={ DEVICE_TYPES } width={ 360 } height={ 360 } withTooltips />
		</div>
	);
};
