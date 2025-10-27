import { Insight } from "../../types/analytics";


interface InsightsCardsProps {
    insights: Insight[];
}

export default function InsightsCards({ insights }: InsightsCardsProps) {
    return (
        <div className="grid md:grid-cols-3 gap-6">
            {insights.map((insight, index) => (
                <div
                    key={index}
                    className="card"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <div className="text-gray-700 text-sm mb-1">{insight.title}</div>
                    <div className="text-3xl font-bold mb-2 text-gray-900">{insight.value}</div>
                    <div className="text-gray-600 text-sm">{insight.detail}</div>
                </div>
            ))}
        </div>
    );
}
