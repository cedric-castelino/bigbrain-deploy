import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function CreatePercentageChart({ results }) {
  const chartRef = useRef(null);
  let chartInstance = null;
  
  // Function to calculate correct percentages from results
  function getCorrectPercentages(results) {
    if (!results || results.length === 0) return [];
  
    const numQuestions = results[0].answers.length;
    const correctCounts = Array(numQuestions).fill(0);
  
    results.forEach(user => {
      user.answers.forEach((ans, index) => {
        if (ans.correct) correctCounts[index]++;
      });
    });
  
    return correctCounts.map((count, i) => ({
      questionIndex: i + 1,
      correctPercentage: (count / results.length) * 100
    }));
  }

  useEffect(() => {
    // Cleanup function to destroy chart when component unmounts
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  useEffect(() => {
    renderChart();
  }, [results]);

  // Render chart function
  const renderChart = () => {
    if (!results || !results.length) return;
    
    const percentages = getCorrectPercentages(results);
    
    // Cleanup existing chart if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Make sure we have a canvas element to draw on
    if (!chartRef.current) return;

    // Create new chart
    chartInstance = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: percentages.map(p => `Q${p.questionIndex}`),
        datasets: [{
          label: 'Correct Answers (%)',
          data: percentages.map(p => p.correctPercentage.toFixed(2)),
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Correct Answer Percentage by Question'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Percentage (%)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Question'
            }
          }
        }
      }
    });
  };

  return (
    <div className="flex flex-col justify-center items-center bg-white rounded-md">
      <canvas ref={chartRef} className="w-full h-64"></canvas>
    </div>
  );
}

export default CreatePercentageChart;