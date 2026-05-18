import { PieChartUnresponsive, type DataPointPercentage } from '@automattic/charts';
// eslint-disable-next-line import/no-unresolved -- CSS subpath export; dist/index.css is gitignored and not built in the ESLint CI step
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
