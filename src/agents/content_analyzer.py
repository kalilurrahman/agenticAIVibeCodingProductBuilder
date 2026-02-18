from src.agent import Agent
from collections import Counter
import re

class ContentAnalyzerAgent(Agent):
    """
    Agent responsible for analyzing text content.
    """

    def process(self, text):
        """
        Analyzes the given text.

        Args:
            text (str): The text content to analyze.

        Returns:
            dict: Analysis results (e.g., word count, most common words).
        """
        if not text:
            return {"error": "No content to analyze"}

        words = re.findall(r'\b\w+\b', text.lower())
        word_count = len(words)
        common_words = Counter(words).most_common(5)

        return {
            "word_count": word_count,
            "most_common_words": common_words,
            "summary": text[:200] + "..." if len(text) > 200 else text
        }
