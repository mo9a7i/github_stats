"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code2 } from "lucide-react"
import dynamic from 'next/dynamic'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
)

const Pie = dynamic(() => import('react-chartjs-2').then(mod => mod.Pie), {
  ssr: false,
  loading: () => <div className="h-[300px] flex items-center justify-center">Loading chart...</div>
})

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  HTML: "#e34c26",
  Vue: "#41b883",
  Astro: "#f0f0f0",
  PHP: "#4F5D95",
  Java: "#b07219",
  "C#": "#178600",
  Other: "#6e7681"
};

interface LanguagesCardProps {
  languages: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
}

export function LanguagesCard({ languages }: LanguagesCardProps) {
  const data = {
    labels: languages.map(l => l.name),
    datasets: [
      {
        data: languages.map(l => l.count),
        backgroundColor: languages.map(l => LANGUAGE_COLORS[l.name] || LANGUAGE_COLORS.Other),
        borderWidth: 0
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'rgb(156 163 175)',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = languages[context.dataIndex].percentage.toFixed(1);
            return `${label}: ${value} repos (${percentage}%)`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <Card className="bg-gray-50 dark:bg-[#040113] dark:border-[#0c0339] col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Most Used Languages</CardTitle>
        <Code2 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Pie data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
} 