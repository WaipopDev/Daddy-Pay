import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
const GraphDataByBarChart = ({ graphData, labelText }: { graphData: { labels: string[], datasets: { label: string, data: number[] }[] }, labelText: string }) => {
    const option = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
    const dataItem = {
        labels: graphData?.labels,
        datasets: graphData?.datasets
    }
    return (
        <div className="rounded-md border border-gray-300 p-2 bg-[#ECEEF5]">
            <div className="flex items-center justify-between mb-4">
                <p className="font-bold">{labelText}</p>
                <div className="rounded-full bg-[#3EB39E] p-2 w-[40px] h-[40px] flex items-center justify-center">
                    <i className="fa-solid fa-chart-bar text-white"></i>
                </div>
            </div>
            <div className="bg-white">
                <Bar options={option} data={dataItem} />
            </div>
        </div>
    )
}

export default GraphDataByBarChart