import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sun, Droplets, Sprout, AlertTriangle, Lightbulb } from "lucide-react";

interface LeafCareTipsProps {
  plantType: string;
  sunlight: string;
  water: string;
  soil: string;
  problems: string[];
  tips: string[];
  className?: string;
  style?: React.CSSProperties;
}

const LeafCareTips = ({
  plantType,
  sunlight,
  water,
  soil,
  problems,
  tips,
  className,
  style
}: LeafCareTipsProps) => {
  const getPlantTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'medicinal':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'edible':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'poisonous':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'ornamental':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className={`w-full bg-white border-leaflens-green/20 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`} style={style}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-serif font-semibold text-leaflens-green-dark flex items-center gap-2">
          <Sprout className="h-5 w-5" />
          Leaf Health & Care Tips
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Plant Type */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-leaflens-green-dark">Plant Type:</span>
          <Badge variant="outline" className={getPlantTypeColor(plantType)}>
            {plantType}
          </Badge>
        </div>

        <Separator />

        {/* Growing Conditions */}
        <div>
          <h4 className="text-md font-medium text-leaflens-green-dark mb-3 flex items-center gap-2">
            <Sun className="h-4 w-4" />
            Ideal Growing Conditions
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-leaflens-green-lightest/50 rounded-lg p-3 text-center">
              <Sun className="h-5 w-5 mx-auto mb-1 text-leaflens-green-dark" />
              <div className="text-xs text-muted-foreground">Sunlight</div>
              <div className="text-sm font-medium text-leaflens-green-dark">{sunlight}</div>
            </div>
            <div className="bg-leaflens-green-lightest/50 rounded-lg p-3 text-center">
              <Droplets className="h-5 w-5 mx-auto mb-1 text-leaflens-green-dark" />
              <div className="text-xs text-muted-foreground">Water</div>
              <div className="text-sm font-medium text-leaflens-green-dark">{water}</div>
            </div>
            <div className="bg-leaflens-green-lightest/50 rounded-lg p-3 text-center">
              <Sprout className="h-5 w-5 mx-auto mb-1 text-leaflens-green-dark" />
              <div className="text-xs text-muted-foreground">Soil</div>
              <div className="text-sm font-medium text-leaflens-green-dark">{soil}</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Common Problems */}
        <div>
          <h4 className="text-md font-medium text-leaflens-green-dark mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Common Leaf Problems
          </h4>
          {problems.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {problems.map((problem, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {problem}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No common problems reported</p>
          )}
        </div>

        <Separator />

        {/* Care Tips */}
        <div>
          <h4 className="text-md font-medium text-leaflens-green-dark mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Basic Care Tips
          </h4>
          {tips.length > 0 ? (
            <ul className="space-y-2">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-leaflens-green-dark mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No specific care tips available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeafCareTips;