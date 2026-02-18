from abc import ABC, abstractmethod

class Agent(ABC):
    """
    Abstract base class for all agents.
    """

    @abstractmethod
    def process(self, input_data):
        """
        Process the input data and return the result.

        Args:
            input_data: The input data for the agent.

        Returns:
            The result of the processing.
        """
        pass
