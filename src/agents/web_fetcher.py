import requests
from bs4 import BeautifulSoup
from src.agent import Agent

class WebFetcherAgent(Agent):
    """
    Agent responsible for fetching content from a given URL.
    """

    def process(self, url):
        """
        Fetches the content from the given URL and returns the text.

        Args:
            url (str): The URL to fetch content from.

        Returns:
            str: The text content of the website.

        Raises:
            Exception: If fetching content fails.
        """
        try:
            response = requests.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            # Extract text and clean it up
            text = soup.get_text(separator=' ', strip=True)
            return text
        except requests.RequestException as e:
            raise Exception(f"Error fetching content: {e}")
