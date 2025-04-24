import { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

function CreatePercentageChart({ results }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
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

  // Render and update chart when results change
  useEffect(() => {
    if (!results || !results.length || !chartRef.current) return;
    
    const percentages = getCorrectPercentages(results);
    
    // Cleanup existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: percentages.map(p => `Q${p.questionIndex}`),
        datasets: [{
          label: '% Correct',
          data: percentages.map(p => p.correctPercentage),
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Correct Answers by Question'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: '% Correct'
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
    
    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [results]);

  return (
    <div className="flex flex-col justify-center items-center">
      <canvas ref={chartRef} width="500" height="500" className="w-full max-w-lg"></canvas>
    </div>
  );
}

export default CreatePercentageChart;