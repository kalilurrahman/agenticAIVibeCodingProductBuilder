from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random
import io
from reportlab.lib.pagesizes import letter, landscape
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import requests
from fastapi.responses import StreamingResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SlideRequest(BaseModel):
    headline: str
    body: str
    image_prompt: Optional[str] = None
    image_url: Optional[str] = None

class SlideResponse(BaseModel):
    headline: str
    body: str
    image_prompt: str
    image_url: str

class CarouselRequest(BaseModel):
    topic: str
    tone: str
    slide_count: int

class CarouselResponse(BaseModel):
    slides: List[SlideResponse]

class PDFRequest(BaseModel):
    slides: List[SlideResponse]
    topic: str
    tone: str

@app.get("/")
def read_root():
    return {"message": "Welcome to Vibe Coding API"}

@app.post("/api/generate-content", response_model=CarouselResponse)
async def generate_content(request: CarouselRequest):
    # Mock LLM generation
    slides = []
    for i in range(request.slide_count):
        slides.append(SlideResponse(
            headline=f"Slide {i+1}: {request.topic} - {request.tone}",
            body=f"This is a generated body text for slide {i+1} about {request.topic} with a {request.tone} tone. It contains relevant information.",
            image_prompt=f"A {request.tone} image representing {request.topic} slide {i+1}",
            image_url=f"https://placehold.co/600x400?text=Slide+{i+1}" # Mock image URL
        ))
    return CarouselResponse(slides=slides)

@app.post("/api/generate-image")
async def generate_image(prompt: str):
    # Mock Image Generation
    # In a real app, this would call DALL-E or Stability AI
    return {"image_url": f"https://placehold.co/600x400?text={prompt.replace(' ', '+')}"}

@app.post("/api/export-pdf")
async def export_pdf(request: PDFRequest):
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=landscape(letter))
    c.setTitle(f"Carousel: {request.topic}")
    c.setAuthor("Vibe Coding AI")
    width, height = landscape(letter)

    for slide in request.slides:
        # Draw background
        c.setFillColorRGB(1, 1, 1)
        c.rect(0, 0, width, height, fill=1)

        # Draw Headline
        c.setFillColorRGB(0, 0, 0)
        c.setFont("Helvetica-Bold", 24)
        c.drawCentredString(width / 2, height - 100, slide.headline)

        # Draw Image if available
        if slide.image_url:
            try:
                # In a real scenario, we might need to download the image first
                # For placeholder images, reportlab can sometimes handle URLs directly if configured,
                # but safer to download or use a local placeholder if URL fails.
                # For this MVP, we will try to fetch the image.
                response = requests.get(slide.image_url, stream=True)
                if response.status_code == 200:
                    img_data = io.BytesIO(response.content)
                    img = ImageReader(img_data)
                    img_width = 400
                    img_height = 300
                    x = (width - img_width) / 2
                    y = height - 150 - img_height
                    c.drawImage(img, x, y, width=img_width, height=img_height)
            except Exception as e:
                print(f"Error loading image: {e}")
                c.drawString(100, height/2, f"[Image Placeholder: {slide.image_url}]")

        # Draw Body
        c.setFont("Helvetica", 14)
        c.drawCentredString(width / 2, 50, slide.body)

        c.showPage()

    c.save()
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=carousel.pdf"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
