"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { Coffee } from "lucide-react";

interface CoffeeCupsCardProps {
    totalHours: number;
}



export function CoffeeCupsCard({ totalHours }: CoffeeCupsCardProps) {
    // 4 cups per 8-hour workday
    const CUPS_PER_HOUR = 4 / 8;
    const totalCups = Math.round(totalHours * CUPS_PER_HOUR);

    return (
        <Card className="bg-gray-50 dark:bg-[#040113] dark:border-[#0c0339]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Coffee Consumed</CardTitle>
                <Coffee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                    <div className="text-5xl font-bold">{formatNumber(totalCups)} cups</div>
                    
            </CardContent>
            <CardFooter>
            <p className="text-xs text-muted-foreground dark:text-gray-500">* Based on average developer consumption of 4 cups of coffee per 8-hour workday</p>
            </CardFooter>
        </Card>
    );
}
