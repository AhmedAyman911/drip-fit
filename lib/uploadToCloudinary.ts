export const uploadImagesToCloudinary = async (images: File[]): Promise<string[]> => {
  const uploadPromises = images.map(async (image) => {
    const formData = new FormData();
    formData.append('file', image);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  });

  return Promise.all(uploadPromises);
};