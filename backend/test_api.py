from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Vibe Coding API"}

def test_generate_content():
    payload = {
        "topic": "AI",
        "tone": "Professional",
        "slide_count": 3
    }
    response = client.post("/api/generate-content", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "slides" in data
    assert len(data["slides"]) == 3
    assert data["slides"][0]["headline"] == "Slide 1: AI - Professional"

def test_generate_image():
    response = client.post("/api/generate-image", params={"prompt": "A robot"})
    assert response.status_code == 200
    data = response.json()
    assert "image_url" in data
    assert "placehold.co" in data["image_url"]

def test_export_pdf():
    payload = {
        "slides": [
            {
                "headline": "Test Headline",
                "body": "Test Body",
                "image_prompt": "Test Prompt",
                "image_url": "http://example.com/image.png"
            }
        ],
        "topic": "Test Topic",
        "tone": "Test Tone"
    }
    response = client.post("/api/export-pdf", json=payload)
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
