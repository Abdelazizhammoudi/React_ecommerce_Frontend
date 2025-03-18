import { useState, useEffect } from 'react';
import { BASE_URL } from '../config/constants';

const useFetch = (endpoint, method = 'GET', body = null) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async (signal) => {
        setLoading(true);
        setError(null);

        try {
            const options = {
                method,
                signal,
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
                }
            };

            if (body) {
                options.body = JSON.stringify(body);
            }

            console.log("Fetching:", `${BASE_URL}${endpoint}`, options); // Log the request details

            const response = await fetch(`${BASE_URL}${endpoint}`, options);

            console.log("Response status:", response.status); // Log the response status

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error response data:", errorData); // Log the error response data
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Fetched data:", result); // Log the fetched data
            setData(result);
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error("Fetch error:", err); // Log the fetch error
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        fetchData(controller.signal);
        return () => controller.abort();
    }, [endpoint, method, JSON.stringify(body)]);

    const refetch = () => {
        const controller = new AbortController();
        fetchData(controller.signal);
        return () => controller.abort();
    };

    return { data, loading, error, refetch, setData };
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export default useFetch;