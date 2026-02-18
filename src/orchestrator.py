from src.agents.web_fetcher import WebFetcherAgent
from src.agents.content_analyzer import ContentAnalyzerAgent

class Orchestrator:
    """
    Orchestrator to manage the interaction between agents.
    """

    def __init__(self):
        self.fetcher = WebFetcherAgent()
        self.analyzer = ContentAnalyzerAgent()

    def run(self, url):
        """
        Runs the orchestration process.

        Args:
            url (str): The URL to process.

        Returns:
            dict: The result of the analysis or an error message.
        """
        try:
            print(f"Orchestrator: Fetching content from {url}...")
            content = self.fetcher.process(url)

            print("Orchestrator: Content fetched successfully. Analyzing...")
            analysis_result = self.analyzer.process(content)

            print("Orchestrator: Analysis complete.")
            return analysis_result
        except Exception as e:
            return {"error": str(e)}
