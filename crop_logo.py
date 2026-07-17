import sys
import os
# pyrefly: ignore [missing-import]
from PIL import Image

def crop_transparent(image_path, output_path, padding_factor=1.15):
    """
    Crops the transparent background of an image and places it on a new square canvas 
    with a specified padding factor to 'zoom out' the logo.
    """
    try:
        img = Image.open(image_path).convert("RGBA")
    except Exception as e:
        print(f"Error opening image: {e}")
        return

    # Find the bounding box of the non-transparent area
    bbox = img.getbbox()
    if not bbox:
        print("Error: Image is entirely transparent or empty.")
        return

    # Crop the image to just the logo
    img = img.crop(bbox)
    width, height = img.size
    
    # Calculate the new square canvas size
    # A padding factor > 1.0 means zooming OUT (larger canvas, more empty space around logo)
    base_size = max(width, height)
    canvas_size = int(base_size * padding_factor)
    
    # Create a new transparent square canvas
    final_img = Image.new('RGBA', (canvas_size, canvas_size), (0, 0, 0, 0))
    
    # Perfectly center the cropped logo on the new canvas
    paste_x = (canvas_size - width) // 2
    paste_y = (canvas_size - height) // 2
    
    final_img.paste(img, (paste_x, paste_y))
    
    try:
        final_img.save(output_path)
        print(f"Success! Logo cropped and padded. Canvas size: {canvas_size}x{canvas_size}")
    except Exception as e:
        print(f"Error saving image: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python crop_logo.py <input_image_path> <output_image_path>")
        print("Example: python crop_logo.py input.png output.png")
        sys.exit(1)
        
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    
    if not os.path.exists(input_path):
        print(f"Error: Input file '{input_path}' does not exist.")
        sys.exit(1)
        
    crop_transparent(input_path, output_path)
