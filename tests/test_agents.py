import unittest
from unittest.mock import patch, MagicMock
import requests
from src.agents.web_fetcher import WebFetcherAgent
from src.agents.content_analyzer import ContentAnalyzerAgent
from src.orchestrator import Orchestrator

class TestWebFetcherAgent(unittest.TestCase):
    @patch('src.agents.web_fetcher.requests.get')
    def test_process_success(self, mock_get):
        mock_response = MagicMock()
        mock_response.content = b"<html><body><p>Hello World</p></body></html>"
        mock_response.raise_for_status = MagicMock() # Ensure this doesn't raise
        mock_get.return_value = mock_response

        agent = WebFetcherAgent()
        result = agent.process("http://example.com")

        self.assertEqual(result, "Hello World")

    @patch('src.agents.web_fetcher.requests.get')
    def test_process_failure(self, mock_get):
        mock_get.side_effect = requests.RequestException("Connection error")

        agent = WebFetcherAgent()

        with self.assertRaises(Exception) as cm:
            agent.process("http://example.com")

        self.assertTrue("Error fetching content" in str(cm.exception))

class TestContentAnalyzerAgent(unittest.TestCase):
    def test_process_success(self):
        agent = ContentAnalyzerAgent()
        text = "Hello world hello"
        result = agent.process(text)

        self.assertEqual(result['word_count'], 3)
        self.assertEqual(result['most_common_words'][0], ('hello', 2))

    def test_process_empty(self):
        agent = ContentAnalyzerAgent()
        result = agent.process("")
        self.assertEqual(result, {"error": "No content to analyze"})

class TestOrchestrator(unittest.TestCase):
    @patch('src.orchestrator.WebFetcherAgent')
    @patch('src.orchestrator.ContentAnalyzerAgent')
    def test_run_success(self, MockAnalyzerClass, MockFetcherClass):
        # Create mock instances
        mock_fetcher_instance = MockFetcherClass.return_value
        mock_analyzer_instance = MockAnalyzerClass.return_value

        # Configure mock behavior
        mock_fetcher_instance.process.return_value = "Hello World"
        mock_analyzer_instance.process.return_value = {"word_count": 2}

        # Instantiate orchestrator (will use mock classes)
        orchestrator = Orchestrator()
        result = orchestrator.run("http://example.com")

        # Verify
        self.assertEqual(result, {"word_count": 2})
        mock_fetcher_instance.process.assert_called_with("http://example.com")
        mock_analyzer_instance.process.assert_called_with("Hello World")

    @patch('src.orchestrator.WebFetcherAgent')
    @patch('src.orchestrator.ContentAnalyzerAgent')
    def test_run_failure(self, MockAnalyzerClass, MockFetcherClass):
        mock_fetcher_instance = MockFetcherClass.return_value

        mock_fetcher_instance.process.side_effect = Exception("Fetch Error")

        orchestrator = Orchestrator()
        result = orchestrator.run("http://example.com")

        self.assertEqual(result, {"error": "Fetch Error"})

if __name__ == '__main__':
    unittest.main()
