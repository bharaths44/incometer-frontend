import { Insight } from "../../types/analytics";
import { Card, CardContent } from "@/components/ui/card";


interface InsightsCardsProps {
    insights: Insight[];
}

export default function InsightsCards({ insights }: InsightsCardsProps) {
    return (
        <div className="grid md:grid-cols-3 gap-6">
            {insights.map((insight, index) => (
                <Card
                    key={index}
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <CardContent className="pt-6">
                        <div className="text-muted-foreground text-sm mb-1">{insight.title}</div>
                        <div className="text-3xl font-bold mb-2">{insight.value}</div>
                        <div className="text-muted-foreground text-sm">{insight.detail}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
