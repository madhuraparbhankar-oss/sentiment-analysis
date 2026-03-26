import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

type Sentiment = "positive" | "negative" | null;

const analyzeSentiment = (text: string): Sentiment => {
  const lower = text.toLowerCase();
  const positiveWords = ["love", "great", "awesome", "amazing", "good", "happy", "best", "excellent", "wonderful", "fantastic", "beautiful", "nice", "like", "enjoy", "thank", "glad", "brilliant", "perfect", "excited", "win"];
  const negativeWords = ["hate", "bad", "worst", "terrible", "awful", "horrible", "ugly", "stupid", "boring", "sad", "angry", "annoying", "disappointed", "fail", "sucks", "trash", "disgusting", "pathetic", "worse", "lose"];

  let score = 0;
  positiveWords.forEach((w) => { if (lower.includes(w)) score++; });
  negativeWords.forEach((w) => { if (lower.includes(w)) score--; });

  if (score > 0) return "positive";
  if (score < 0) return "negative";
  return Math.random() > 0.5 ? "positive" : "negative";
};

const Index = () => {
  const [tweet, setTweet] = useState("");
  const [sentiment, setSentiment] = useState<Sentiment>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
  if (!tweet.trim()) return;

  setLoading(true);
  setSentiment(null);

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/predict?text=${encodeURIComponent(tweet)}`
    );

    const data = await response.json();

    if (data.sentiment === "Positive") {
      setSentiment("positive");
    } else {
      setSentiment("negative");
    }
  } catch (error) {
    console.error("API error:", error);
  }

  setLoading(false);
};

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          AI-Powered Analysis
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Twitter Sentiment Analyzer
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Analyze tweet sentiment using AI
        </p>
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-xl shadow-lg shadow-primary/5 border-border/60">
        <CardContent className="space-y-5 p-6 sm:p-8">
          <Textarea
            placeholder="Paste or type a tweet here…"
            className="min-h-[130px] resize-none text-base font-body"
            value={tweet}
            onChange={(e) => setTweet(e.target.value)}
          />
          <Button
            className="w-full text-base font-semibold h-12"
            onClick={handleAnalyze}
            disabled={!tweet.trim() || loading}
          >
            {loading ? "Analyzing…" : "Analyze Sentiment"}
          </Button>

          {/* Result */}
          {sentiment && (
            <div
              className={`animate-fade-in-up rounded-lg p-5 text-center text-xl font-semibold ${
                sentiment === "positive"
                  ? "bg-positive-soft text-positive"
                  : "bg-negative-soft text-negative"
              }`}
            >
              {sentiment === "positive" ? "Positive 😊" : "Negative 😡"}
            </div>
          )}
        </CardContent>
      </Card>

      <p className="mt-6 text-xs text-muted-foreground">
        This is a demo using keyword-based analysis.
      </p>
    </div>
  );
};

export default Index;
