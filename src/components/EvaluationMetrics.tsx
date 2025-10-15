import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, TrendingUp, Target, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface EvaluationMetricsProps {
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  precision: number;
  recall: number;
  f1Score: number;
  title?: string;
  description?: string;
}

export const EvaluationMetrics = ({
  truePositives,
  falsePositives,
  falseNegatives,
  precision,
  recall,
  f1Score,
  title = "Model Evaluation Metrics",
  description = "Performance analysis and accuracy metrics"
}: EvaluationMetricsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "text-green-500";
    if (score >= 0.6) return "text-yellow-500";
    return "text-orange-500";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 0.8) return "Excellent";
    if (score >= 0.6) return "Good";
    return "Needs Improvement";
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 0.8) return "default";
    if (score >= 0.6) return "secondary";
    return "destructive";
  };

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-foreground flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              {title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          <Badge variant={getScoreBadgeVariant(f1Score)} className="text-xs">
            {getScoreBadge(f1Score)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Confusion Matrix */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-primary" />
            Classification Results
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
              <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-500">{truePositives}</p>
              <p className="text-xs text-muted-foreground mt-1">True Positives</p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 text-center">
              <XCircle className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-500">{falsePositives}</p>
              <p className="text-xs text-muted-foreground mt-1">False Positives</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
              <XCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-500">{falseNegatives}</p>
              <p className="text-xs text-muted-foreground mt-1">False Negatives</p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Performance Scores
          </h3>
          <div className="space-y-4">
            {/* Precision */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Precision</span>
                <span className={`text-sm font-bold ${getScoreColor(precision)}`}>
                  {(precision * 100).toFixed(1)}%
                </span>
              </div>
              <Progress value={precision * 100} className="h-2" />
            </div>

            {/* Recall */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Recall</span>
                <span className={`text-sm font-bold ${getScoreColor(recall)}`}>
                  {(recall * 100).toFixed(1)}%
                </span>
              </div>
              <Progress value={recall * 100} className="h-2" />
            </div>

            {/* F1 Score */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  F1 Score
                </span>
                <span className={`text-lg font-bold ${getScoreColor(f1Score)}`}>
                  {(f1Score * 100).toFixed(1)}%
                </span>
              </div>
              <Progress value={f1Score * 100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Harmonic mean of precision and recall
              </p>
            </div>
          </div>
        </div>

        {/* Accuracy Summary */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Predictions</span>
            <span className="font-semibold text-foreground">
              {truePositives + falsePositives + falseNegatives}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-muted-foreground">Accuracy</span>
            <span className="font-semibold text-foreground">
              {((truePositives / (truePositives + falsePositives + falseNegatives)) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
