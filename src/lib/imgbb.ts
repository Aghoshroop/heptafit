const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export async function uploadImageToImgBB(file: File): Promise<string | null> {
  if (!IMGBB_API_KEY) {
    console.error("ImgBB API key is missing. Check your environment variables.");
    throw new Error("Image upload service is currently unavailable.");
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      return data.data.url; // Returns the direct image URL
    } else {
      throw new Error(data.error?.message || "Failed to upload image");
    }
  } catch (error) {
    console.error("Error uploading to ImgBB:", error);
    throw error;
  }
}
