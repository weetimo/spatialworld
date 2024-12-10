export const API_BASE_URL = 'jennet-champion-tarpon.ngrok-free.app';
// export const API_BASE_URL = 'http://localhost:8000';

export const getApiUrl = (endpoint: string) => {
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${API_BASE_URL}/${cleanEndpoint}`;
};
