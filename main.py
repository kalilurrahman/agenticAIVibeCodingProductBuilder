from src.orchestrator import Orchestrator
import sys

def main():
    if len(sys.argv) > 1:
        url = sys.argv[1]
    else:
        url = "https://www.example.com"
        print(f"No URL provided. Using default: {url}")

    orchestrator = Orchestrator()
    result = orchestrator.run(url)

    print("\n--- Analysis Result ---")
    for key, value in result.items():
        print(f"{key}: {value}")
    print("-----------------------")

if __name__ == "__main__":
    main()
