import React from 'react';
import Chart from 'react-apexcharts';
import { Panel, Loader } from 'rsuite';

const PlatformWisePieChart = ({ data, loading }) => {
    // Handle loading state
    if (loading) {
        return (
            <Panel bordered header="Platform Wise Conversion" className="card">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                    <Loader size="md" content="Loading..." />
                </div>
            </Panel>
        );
    }

    // Handle empty/no-data state
    if (!data || data.length === 0) {
        return (
            <Panel bordered header="Platform Wise Conversion" className="card">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, color: '#888' }}>
                    No data available
                </div>
            </Panel>
        );
    }

    // Map platform codes to readable labels
    const platformLabels = {
        'mob': 'Mobile',
        'des': 'Desktop'
    };

    const labels = data.map(item => platformLabels[item.platform] || item.platform);
    const series = data.map(item => item.totalCount);

    const options = {
        chart: {
            type: 'pie',
        },
        labels: labels,
        legend: {
            position: 'bottom',
        },
        colors: ['#FEB019', '#775DD0', '#008FFB', '#00E396', '#FF4560'],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 280
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    return (
        <Panel bordered header="Platform Wise Conversion" className="card">
            <Chart
                options={options}
                series={series}
                type="pie"
                height={300}
            />
        </Panel>
    );
};

export default PlatformWisePieChart;
