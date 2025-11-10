/**
 * API Fetch Helpers
 * Utility functions for making API calls with consistent error handling
 */

interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Generic fetch wrapper with error handling
 */
export async function fetchAPI<T>(
  url: string,
  options?: RequestInit
): Promise<APIResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * GET request helper
 */
export async function getAPI<T>(url: string): Promise<T> {
  const response = await fetchAPI<T>(url, { method: 'GET' });
  
  if (!response.success || !response.data) {
    throw new Error(response.message || 'Failed to fetch data');
  }
  
  return response.data;
}

/**
 * POST request helper
 */
export async function postAPI<T>(url: string, body: any): Promise<T> {
  const response = await fetchAPI<T>(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  
  if (!response.success || !response.data) {
    throw new Error(response.message || 'Failed to post data');
  }
  
  return response.data;
}

/**
 * PUT request helper
 */
export async function putAPI<T>(url: string, body: any): Promise<T> {
  const response = await fetchAPI<T>(url, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
  
  if (!response.success || !response.data) {
    throw new Error(response.message || 'Failed to update data');
  }
  
  return response.data;
}

/**
 * DELETE request helper
 */
export async function deleteAPI<T>(url: string): Promise<T> {
  const response = await fetchAPI<T>(url, { method: 'DELETE' });
  
  if (!response.success) {
    throw new Error(response.message || 'Failed to delete data');
  }
  
  return response.data as T;
}
