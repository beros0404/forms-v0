'use server'

export async function submitForm(formData: FormData, sheetName: string) {
  try {
    // Convert FormData to a plain object
    const data = Object.fromEntries(formData.entries());
    
    // Send data to our API endpoint
    const response = await fetch('/api/save-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formData: data,
        sheetName
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save form data');
    }

    const result = await response.json();
    return { success: true };
  } catch (error) {
    console.error('Error submitting form:', error);
    return { success: false, error: 'Failed to submit form' };
  }
}

